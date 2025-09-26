import { addEvent, isNearBottom } from "./utils";
import { router } from "./router";
import {
  addToCart,
  clearCart,
  deselectAllCart,
  loadMoreProducts,
  loadProducts,
  removeFromCart,
  removeSelectedFromCart,
  searchProducts,
  selectAllCart,
  setCategory,
  setLimit,
  setSort,
  toggleCartSelect,
  updateCartQuantity,
} from "./services";
import { productStore, uiStore, UI_ACTIONS } from "./stores";

/**
 * 상품 관련 이벤트 등록
 */
export function registerProductEvents() {
  // 검색 입력 (Enter 키)
  addEvent("keydown", "#search-input", async (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      try {
        await searchProducts(query);
      } catch (error) {
        console.error("검색 실패:", error);
      }
    }
  });

  // 페이지당 상품 수 변경
  addEvent("change", "#limit-select", async (e) => {
    const limit = parseInt(e.target.value);
    try {
      await setLimit(limit);
    } catch (error) {
      console.error("상품 수 변경 실패:", error);
    }
  });

  // 정렬 변경
  addEvent("change", "#sort-select", async (e) => {
    const sort = e.target.value;

    try {
      await setSort(sort);
    } catch (error) {
      console.error("정렬 변경 실패:", error);
    }
  });

  // 검색 조건 초기화
  addEvent("click", "#clear-search", async () => {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = "";
    }

    try {
      await searchProducts("");
    } catch (error) {
      console.error("검색 초기화 실패:", error);
    }
  });

  // 브레드크럼 카테고리 네비게이션
  addEvent("click", "[data-breadcrumb]", async (e) => {
    const breadcrumbType = e.target.getAttribute("data-breadcrumb");

    try {
      if (breadcrumbType === "reset") {
        // "전체" 클릭 -> 카테고리 초기화
        await setCategory({
          category1: "",
          category2: "",
        });
      } else if (breadcrumbType === "category1") {
        // 1depth 클릭 -> 2depth 제거하고 1depth만 유지
        const category1 = e.target.getAttribute("data-category1");
        await setCategory({
          category1,
          category2: "",
        });
      }
    } catch (error) {
      console.error("브레드크럼 네비게이션 실패:", error);
    }
  });

  // 1depth 카테고리 선택
  addEvent("click", ".category1-filter-btn", async (e) => {
    const category1 = e.target.getAttribute("data-category1");
    if (!category1) return;

    try {
      await setCategory({
        category1,
        category2: "",
      });
    } catch (error) {
      console.error("1depth 카테고리 선택 실패:", error);
    }
  });

  // 2depth 카테고리 선택
  addEvent("click", ".category2-filter-btn", async (e) => {
    const category1 = e.target.getAttribute("data-category1");
    const category2 = e.target.getAttribute("data-category2");
    if (!category1 || !category2) return;

    try {
      await setCategory({
        category1,
        category2,
      });
    } catch (error) {
      console.error("2depth 카테고리 선택 실패:", error);
    }
  });

  // 재시도 버튼
  addEvent("click", "#retry-btn", async () => {
    try {
      await loadProducts(true);
    } catch (error) {
      console.error("재시도 실패:", error);
    }
  });
}

/**
 * 상품 상세 페이지 관련 이벤트 등록
 */
export function registerProductDetailEvents() {
  // 상품 클릭 시 상품 상세 페이지로 이동 (이미지 또는 제목)
  addEvent("click", ".product-image, .product-info", async (e) => {
    const productCard = e.target.closest(".product-card");
    if (!productCard) return;

    const productId = productCard.getAttribute("data-product-id");
    if (!productId) return;

    // 상품 상세 페이지로 이동
    router.push(`/product/${productId}`);
  });

  // 상품 상세 페이지에서 관련 상품 클릭
  addEvent("click", ".related-product-card", async (e) => {
    const productId = e.target.closest("[data-product-id]").dataset.productId;
    if (!productId) return;

    // 상품 상세 페이지로 이동
    router.push(`/product/${productId}`);
  });

  // 상품 상세 페이지에서 브레드크럼 카테고리 클릭
  addEvent("click", ".breadcrumb-link", async (e) => {
    e.preventDefault();

    try {
      // 카테고리 설정
      const categories = {};
      const elements = [...e.target.parentNode.querySelectorAll(".breadcrumb-link")].slice(0, 2);
      for (const [index, element] of Object.entries(elements)) {
        const key = `category${parseInt(index) + 1}`;
        categories[key] = element.dataset[key];
        if (element === e.target) {
          break;
        }
      }
      const queryString = new URLSearchParams(categories).toString();
      router.push(`/?${queryString}`);
    } catch (error) {
      console.error("브레드크럼 카테고리 필터 실패:", error);
    }
  });

  addEvent("click", ".go-to-product-list", async () => {
    const product = productStore.getState().currentProduct;
    const query = {
      category1: product?.category1,
      category2: product?.category2,
      currentPage: 1,
    };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/?${queryString}`);
  });

  // 상품 상세 페이지에서 수량 증가/감소
  addEvent("click", "#quantity-increase", () => {
    const input = document.getElementById("quantity-input");
    if (input) {
      const max = parseInt(input.getAttribute("max")) || 100;
      input.value = Math.min(max, parseInt(input.value) + 1);
    }
  });

  addEvent("click", "#quantity-decrease", () => {
    const input = document.getElementById("quantity-input");
    if (input) {
      input.value = Math.max(1, parseInt(input.value) - 1);
    }
  });

  // 상품 상세 페이지에서 장바구니 추가
  addEvent("click", "#add-to-cart-btn", (e) => {
    const productId = e.target.getAttribute("data-product-id");
    const quantityInput = document.getElementById("quantity-input");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    if (!productId) return;

    const productState = productStore.getState();
    const product = productState.currentProduct;

    if (product) {
      console.log("🛒 상품 상세 페이지에서 장바구니 추가:", product);
      addToCart(product, quantity);
    }
  });
}

/**
 * 장바구니 관련 이벤트 등록
 */
export function registerCartEvents() {
  // 장바구니에 상품 추가 (상품 목록에서)
  addEvent("click", ".add-to-cart-btn", async (e) => {
    console.log("🛒 장바구니 추가 버튼 클릭됨", e.target);
    const productId = e.target.getAttribute("data-product-id");
    console.log("🛒 상품 ID:", productId);
    if (!productId) return;

    // 상품 정보 찾기
    const productState = productStore.getState();
    const product = productState.products.find((p) => p.productId === productId);

    console.log("🛒 찾은 상품:", product);
    if (product) {
      addToCart(product, 1);
      console.log("🛒 장바구니 추가 완료");
    }
  });

  // 장바구니 수량 증가
  addEvent("click", ".quantity-increase-btn", (e) => {
    const target = e.target.closest("[data-product-id]");
    const productId = target.getAttribute("data-product-id");
    const quantityInput = target.previousElementSibling;

    if (productId && quantityInput) {
      const newQuantity = parseInt(quantityInput.value) + 1;
      quantityInput.value = newQuantity;
      updateCartQuantity(productId, newQuantity);
    }
  });

  // 장바구니 수량 감소
  addEvent("click", ".quantity-decrease-btn", (e) => {
    const target = e.target.closest("[data-product-id]");
    const productId = target.getAttribute("data-product-id");
    const quantityInput = target.nextElementSibling;

    if (productId && quantityInput) {
      const newQuantity = Math.max(1, parseInt(quantityInput.value) - 1);
      quantityInput.value = newQuantity;
      updateCartQuantity(productId, newQuantity);
    }
  });

  // 장바구니 수량 직접 입력
  addEvent("change", ".quantity-input", (e) => {
    const productId = e.target.closest("[data-product-id]");
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);

    if (productId) {
      updateCartQuantity(productId, newQuantity);
    }
  });

  // 장바구니 개별 선택
  addEvent("change", ".cart-item-checkbox", (e) => {
    const productId = e.target.getAttribute("data-product-id");
    if (productId) {
      toggleCartSelect(productId);
    }
  });

  // 장바구니 전체 선택/해제
  addEvent("change", "#select-all-checkbox", (e) => {
    if (e.target.checked) {
      selectAllCart();
    } else {
      deselectAllCart();
    }
  });

  // 장바구니 개별 삭제
  addEvent("click", ".cart-item-remove-btn", (e) => {
    const productId = e.target.getAttribute("data-product-id");
    if (productId) {
      removeFromCart(productId);
    }
  });

  // 선택된 상품 삭제
  addEvent("click", "#remove-selected-btn", removeSelectedFromCart);

  // 장바구니 전체 비우기
  addEvent("click", "#clear-cart-btn", clearCart);
}

/**
 * 장바구니 모달 관련 이벤트 등록
 */
export function registerCartModalEvents() {
  // 장바구니 아이콘 클릭 시 모달 열기
  addEvent("click", "#cart-icon-btn", () => {
    uiStore.dispatch({ type: UI_ACTIONS.OPEN_CART_MODAL });
  });

  // 장바구니 모달 닫기 (X 버튼, 배경 클릭)
  addEvent("click", "#cart-modal-close-btn, .cart-modal-overlay", () => {
    uiStore.dispatch({ type: UI_ACTIONS.CLOSE_CART_MODAL });
  });

  // ESC 키로 장바구니 모달 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const cartModalState = uiStore.getState().cartModal;
      if (cartModalState.isOpen) {
        uiStore.dispatch({ type: UI_ACTIONS.CLOSE_CART_MODAL });
      }
    }
  });

  // 장바구니 모달 전체 선택/해제
  addEvent("change", "#cart-modal-select-all-checkbox", (e) => {
    if (e.target.checked) {
      selectAllCart();
    } else {
      deselectAllCart();
    }
  });

  // 장바구니 모달 선택된 상품 삭제
  addEvent("click", "#cart-modal-remove-selected-btn", () => {
    removeSelectedFromCart();
  });

  // 장바구니 모달 전체 비우기
  addEvent("click", "#cart-modal-clear-cart-btn", clearCart);

  // 장바구니 모달 구매하기
  addEvent("click", "#cart-modal-checkout-btn", () => {
    // 구매하기 로직 추가 (추후 구현)
    uiStore.dispatch({
      type: UI_ACTIONS.SHOW_TOAST,
      payload: {
        message: "구매 기능은 추후 구현 예정입니다.",
        type: "info",
      },
    });
  });
}

/**
 * 무한 스크롤 이벤트 등록
 */
export function registerScrollEvents() {
  // 무한 스크롤 (직접 등록) - 홈 페이지에서만 동작
  window.addEventListener("scroll", async () => {
    // 현재 라우트가 홈이 아니면 무한 스크롤 비활성화
    if (router.route.path !== "/") {
      return;
    }

    if (isNearBottom(200)) {
      const productState = productStore.getState();
      const hasMore = productState.products.length < productState.totalCount;

      // 로딩 중이거나 더 이상 로드할 데이터가 없으면 return
      if (productState.loading || !hasMore) {
        return;
      }

      try {
        await loadMoreProducts();
      } catch (error) {
        console.error("무한 스크롤 로드 실패:", error);
      }
    }
  });
}

/**
 * 토스트 관련 이벤트 등록
 */
export function registerToastEvents() {
  // 토스트 닫기
  addEvent("click", "#toast-close-btn", () => {
    uiStore.dispatch({ type: UI_ACTIONS.HIDE_TOAST });
  });
}

export function registerLinkEvents() {
  // 링크 클릭 시 라우터 네비게이션
  addEvent("click", "[data-link]", (e) => {
    e.preventDefault();
    const url = e.target.getAttribute("href");
    if (url) {
      router.push(url);
    }
  });
}

/**
 * 모든 이벤트 등록
 */
export function registerAllEvents() {
  registerProductEvents();
  registerProductDetailEvents();
  registerCartEvents();
  registerCartModalEvents();
  registerScrollEvents();
  registerToastEvents();
  registerLinkEvents();
}
