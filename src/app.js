import { createRouter, setupRouter as registerRouter } from "./core/router";
import HomePage from "./page/HomePage";
import ProductDetailPage from "./page/ProductDetailPage";
import NotFoundPage from "./page/NotFoundPage";
import { getProduct } from "./api/productApi";
import { openCartModal, addToCartById, addToCart, updateCartBadge } from "./core/cart";

/** 유틸함수
 * 1. 어디서 관리해야할지 고민하기
 * 2. 또 다른 전역 유틸함수는 없는지 찾아보기
 * 3. 최대한 순수함수로 작성해보기.
 */

// 상품 목록 장바구니 버튼에서 버튼과 상품 ID 추출
const getAddBtnAndPid = (e) => {
  const addBtn = e.target.closest(".add-to-cart-btn");
  const pid = addBtn ? addBtn.getAttribute("data-product-id") : null;
  return { addBtn, pid };
};

// 상품 카드에서 상품 데이터 추출.
const getProductData = (productCard) => {
  if (!productCard) return null;
  const title = productCard.querySelector("h3")?.textContent.trim() || "";
  const priceText = productCard.querySelector("p.text-lg")?.textContent.trim() || "0";
  const lprice = priceText.replace(/[^0-9]/g, "");
  const image = productCard.querySelector("img")?.getAttribute("src") || "";
  return {
    productId: productCard.querySelector(".add-to-cart-btn")?.getAttribute("data-product-id") || "",
    title,
    lprice,
    image,
    mallName: "",
    brand: "",
  };
};

// 상세 페이지 장바구니 버튼과 상품 ID 추출
const getDetailBtnAndPid = (e) => {
  const detailBtn = e.target.closest("#add-to-cart-btn");
  const pid = detailBtn ? detailBtn.getAttribute("data-product-id") : null;
  return { detailBtn, pid };
};

// 수량 입력값 추출.
const getQuantity = () => {
  const qtyInput = document.querySelector("#quantity-input");
  return qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
};

/**
 *
 * 핸들러 함수
 * 1. 마찬가지로 핸들러 함수도 어디서 관리하면 좋을지 고민하기
 * 2. 전역 핸들러 함수는 없을지 찾아보기
 */

// 상품 목록에서 장바구니 담기
const handleAddToCart = (e) => {
  e.preventDefault();
  const { addBtn, pid } = getAddBtnAndPid(e);
  if (!addBtn || !pid) return;

  const productCard = addBtn.closest(".product-card");
  const productData = getProductData(productCard);

  productCard ? addToCart(productData, 1) : addToCartById(pid, 1);
  updateCartBadge();
};

// 상세 페이지에서 장바구니 담기
const handleDetailAddToCart = (e) => {
  const { detailBtn, pid } = getDetailBtnAndPid(e);
  if (!detailBtn) return;

  e.preventDefault();
  if (!pid) return;

  const qty = getQuantity();
  addToCartById(pid, qty);
  updateCartBadge();
};

// 전역 클릭 핸들러
const globalClickHandler = (e) => {
  // 장바구니 아이콘 클릭
  const cartBtn = e.target.closest("#cart-icon-btn");
  if (cartBtn) {
    e.preventDefault();
    openCartModal();
    return;
  }

  // 상품 목록 장바구니 버튼 클릭
  if (e.target.closest(".add-to-cart-btn")) {
    handleAddToCart(e);
    return;
  }

  // 상세 페이지 장바구니 버튼 클릭
  if (e.target.closest("#add-to-cart-btn")) {
    handleDetailAddToCart(e);
    return;
  }

  // SPA 내비게이션 링크 클릭
  const link = e.target.closest("a");
  if (link) {
    const href = link.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      window.navigateTo(href);
    }
  }
};

/**
 * 라우트 렌더러 함수
 * @returns
 */
function createRouteRenderer() {
  let componentCleanup = null;

  async function render(routeData) {
    if (componentCleanup) {
      componentCleanup();
      componentCleanup = null;
    }

    if (!routeData || !routeData.route || !routeData.route.component) return;
    const { route, params, data } = routeData;

    try {
      const component = route.component({ ...params, ...data });
      const $root = document.getElementById("root");
      if (!$root) return;

      if (component && typeof component === "object" && component.html) {
        $root.innerHTML = component.html;
        updateCartBadge();
        componentCleanup = component.cleanup;
      }
    } catch (err) {
      console.error("Component render error:", err);
    }
  }

  function destroy() {
    if (componentCleanup) {
      componentCleanup();
      componentCleanup = null;
    }
  }

  return { render, destroy };
}

/**
 * 엔트리포인트 어플리케이션 생성
 * @returns
 */
function createApplication() {
  let router = null;
  let renderer = null;
  let routerUnsubscribe = null;

  function setupGlobalEventListeners() {
    document.addEventListener("click", globalClickHandler);
  }
  function removeGlobalEventListeners() {
    document.removeEventListener("click", globalClickHandler);
  }

  function configureRouter() {
    const routes = [
      { path: "/", component: () => HomePage({ cartCount: 0 }) },
      {
        path: "/product/:id",
        component: ({ product }) => ProductDetailPage({ product, cartCount: 0 }),
        loader: async ({ id }) => {
          try {
            const product = await getProduct(id);
            return { product };
          } catch (err) {
            console.error("Failed to load product detail:", err);
            throw err;
          }
        },
      },
      { path: "/404", component: NotFoundPage },
    ];

    router = createRouter();
    router.addRoutes(routes);
    registerRouter(router);

    routerUnsubscribe = router.subscribe(async (routeData) => {
      await renderer.render(routeData);
    });
  }

  async function init() {
    try {
      renderer = createRouteRenderer();
      setupGlobalEventListeners();
      configureRouter();
      await router.init();

      console.log("App initialized successfully");
    } catch (err) {
      console.error("App initialization failed:", err);
    }
  }

  function destroy() {
    removeGlobalEventListeners();
    if (routerUnsubscribe) {
      routerUnsubscribe();
      routerUnsubscribe = null;
    }
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
    router = null;
  }

  return { init, destroy };
}

// 싱글톤 인스턴스
let appInstance = null;

export default function App() {
  if (!appInstance) {
    appInstance = createApplication();
    appInstance.init();
  }
  return appInstance;
}

export function destroyApp() {
  if (appInstance) {
    appInstance.destroy();
    appInstance = null;
  }
}
