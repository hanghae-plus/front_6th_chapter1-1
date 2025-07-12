import { loadProductsAndUpdateUI } from "../main.js";
import { addCart, updateHeaderCartCount } from "../utils/cart.js";
import { showToast } from "../template/toast.js";

export function setupCommonEventListeners(mainStatus, appRouter) {
  /** change */
  document.body.addEventListener("change", (e) => {
    const target = e.target;
    const newUrl = new URL(window.location.href); // 현재 URL을 기반으로 새로운 URL 객체 생성

    if (target.id === "limit-select") {
      mainStatus.params.limit = parseInt(target.value, 10);
      newUrl.searchParams.set("limit", mainStatus.params.limit);
    } else if (target.id === "sort-select") {
      mainStatus.params.sort = target.value;
      newUrl.searchParams.set("sort", mainStatus.params.sort);
      newUrl.searchParams.set("limit", mainStatus.params.limit);
    } else {
      return;
    }

    mainStatus.params.page = 1; // 필터 변경 시 첫 페이지로 초기화
    newUrl.searchParams.set("page", mainStatus.params.page);

    window.history.replaceState({}, "", newUrl.toString());
    loadProductsAndUpdateUI(mainStatus, appRouter); // mainStatus와 appRouter 전달
  });

  document.body.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "search-input") {
      const newUrl = new URL(window.location.href); // 현재 URL을 기반으로 새로운 URL 객체 생성
      mainStatus.params.search = e.target.value;
      mainStatus.params.page = 1; // 필터 변경 시 첫 페이지로 초기화

      newUrl.searchParams.set("search", mainStatus.params.search);
      newUrl.searchParams.set("page", mainStatus.params.page);

      window.history.replaceState({}, "", newUrl.toString());
      loadProductsAndUpdateUI(mainStatus, appRouter); // mainStatus와 appRouter 전달
    } else {
      return;
    }
  });
  // 상품 카드 클릭 이벤트 (이벤트 위임)
  document.body.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card"); // 상품 카드
    const addToCartBtn = e.target.closest("#add-to-cart-btn"); // 장바구니 담기
    const increaseQuantyBtn = e.target.closest("#quantity-increase"); // 상품 수량 증가
    const decreaseQuantyBtn = e.target.closest("#quantity-decrease"); // 상품 수량 감소
    const breadcrumb = e.target.closest(".breadcrumb-link"); // 브레드크럼 (카테고리)

    // 상품 카드가 클릭되었고, 장바구니 버튼이 아닌 경우에만 상세 페이지로 이동
    if (productCard && !addToCartBtn) {
      const productId = productCard.dataset.productId; // data-product-id 속성에서 productId를

      if (productId) {
        appRouter.navigate(`/product/${productId}`); // 라우터로 페이지 이동
      }
      return; // 다른 버튼들과의 중복 실행 방지
    }

    // --- 상세 페이지 버튼 처리 ---
    let quantityInput;
    let quantity;
    if (window.location.pathname.includes("/product")) {
      quantityInput = document.body.querySelector("#quantity-input");
      quantity = parseInt(quantityInput.value, 10);
    }

    // 수량 증가
    if (increaseQuantyBtn && quantityInput) {
      quantityInput.value = parseInt(quantityInput.value, 10) + 1;
      return;
    }

    // 수량 감소
    if (decreaseQuantyBtn && quantityInput) {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
      return;
    }

    // 장바구니 담기
    if (addToCartBtn) {
      const productId = addToCartBtn.dataset.productId;
      let productToAdd = null;

      if (window.location.pathname.startsWith("/product/")) {
        // 상품 상세 페이지인 경우, 라우터의 현재 상태에서 상품 정보를 가져옵니다.
        const currentState = appRouter.getCurrentState();
        if (currentState.product && currentState.product.productId === productId) {
          productToAdd = currentState.product;
        }
      } else {
        // 상품 목록 페이지인 경우, mainStatus.products에서 상품을 찾습니다.
        productToAdd = mainStatus.products.find((p) => p.productId === productId);
      }

      if (productToAdd) {
        addCart(productToAdd, quantity); // 수량을 함께 전달
        showToast("장바구니에 추가되었습니다");
        updateHeaderCartCount();
      }
      return;
    }
  });
  // TODO: 그 외 다른 이벤트 설정.....
}
