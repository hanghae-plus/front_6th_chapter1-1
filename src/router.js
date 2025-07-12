import { home } from "./pages/home.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { NotFound } from "./pages/NotFound.js";
import { addScrollListener, removeScrollListener } from "./main.js";
import { getProduct, getProducts } from "./api/productApi.js";

const routes = [
  { path: "/", component: home, isDetail: false },
  { path: "/product/:id", component: ProductDetail, isDetail: true },
];
class Router {
  constructor(initialMainStatus) {
    this.routes = routes;
    this.mainStatus = structuredClone(initialMainStatus);
    this.appRoot = document.querySelector("#root");
    this.BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "/";
    this.initEventListeners();
  }

  getAppPath(fullPath = window.location.pathname) {
    return fullPath.startsWith(this.BASE_PATH) ? fullPath.slice(this.BASE_PATH.length) || "/" : fullPath;
  }

  getFullPath(appPath) {
    return this.BASE_PATH + appPath;
  }

  initEventListeners() {
    window.addEventListener("popstate", () => this.render());
    document.addEventListener("DOMContentLoaded", () => {
      document.body.addEventListener("click", (e) => this.handleLinkClick(e));
      this.render();
    });
  }

  handleLinkClick(event) {
    const target = event.target.closest("[data-link]");
    if (target) {
      event.preventDefault();
      this.navigate(target.getAttribute("href"));
    }
  }

  _matchRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    let foundComponent = NotFound; // 기본값은 NotFound
    let extractedParams = {};
    let isDetailPage = false;

    // Extract path parameters (e.g., :id)
    for (const route of this.routes) {
      const regex = new RegExp(`^${this.BASE_PATH}${route.path.replace(/:\w+/g, "([^/]+)")}$`);
      const match = path.match(regex);

      if (match) {
        foundComponent = route.component;
        isDetailPage = route.isDetail || false;

        const paramNames = (route.path.match(/:\w+/g) || []).map((name) => name.substring(1));
        paramNames.forEach((name, index) => {
          extractedParams[name] = match[index + 1];
        });
        break; // 일치하는 라우트를 찾았으므로 반복 중단
      }
    }

    // Extract query parameters
    for (const [key, value] of searchParams.entries()) {
      extractedParams[key] = value;
    }

    return {
      component: foundComponent,
      params: extractedParams,
      isDetail: isDetailPage,
    };
  }

  async render() {
    const { component, params, isDetail } = this._matchRoute();
    let renderedHtml = "";

    if (isDetail) {
      // ProductDetail 페이지인 경우, 데이터를 미리 가져옵니다.
      // 로딩 UI를 먼저 설정합니다.
      this.appRoot.innerHTML = `
        <header class="bg-white shadow-sm sticky top-0 z-40">
          <div class="max-w-md mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
              </div>
              <div class="flex items-center space-x-2">
                <!-- 장바구니 아이콘 -->
                <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main class="max-w-md mx-auto px-4 py-4">
          <div class="py-20 bg-gray-50 flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">상품 정보를 불러오는 중...</p>
            </div>
          </div>
        </main>
        <footer></footer>
      `;

      try {
        const product = await getProduct(params.id);
        const relatedProductsData = await getProducts({
          category1: product.category1,
          category2: product.category2,
        });
        const relatedProducts = relatedProductsData.products.filter((item) => item.productId !== product.productId);
        renderedHtml = component({
          ...this.mainStatus,
          urlParams: params,
          isDetail: isDetail,
          product: product,
          relatedProducts: relatedProducts,
          router: this,
        });
      } catch (error) {
        console.error("Error fetching product details or related products:", error);
        renderedHtml = NotFound();
      }
    } else {
      renderedHtml = component({ ...this.mainStatus, urlParams: params, isDetail: isDetail, router: this });
    }

    this.appRoot.innerHTML = renderedHtml;
    this.setCurrentState({ ...this.mainStatus, urlParams: params, isDetail: isDetail });

    if (window.location.pathname === "/") {
      addScrollListener();
    } else {
      removeScrollListener();
    }
  }

  navigate(path) {
    const currentPath = window.location.pathname + window.location.search;
    const newUrl = new URL(this.getFullPath(path), window.location.origin);

    // 홈 페이지로 이동하거나, 현재 경로가 홈 페이지인 경우에만 쿼리 파라미터를 추가합니다.
    if (
      newUrl.pathname === this.BASE_PATH ||
      newUrl.pathname === this.BASE_PATH + "/" ||
      currentPath.startsWith(this.BASE_PATH + "?")
    ) {
      const currentParams = this.getCurrentState().params;
      for (const key in currentParams) {
        if (currentParams[key]) {
          newUrl.searchParams.set(key, currentParams[key]);
        } else {
          newUrl.searchParams.delete(key);
        }
      }
    }
    if (currentPath !== newUrl.pathname + newUrl.search) {
      window.history.pushState({}, "", newUrl.toString());
    }
    this.render();
  }

  updateStateAndRender(newMainStatus) {
    this.mainStatus = structuredClone(newMainStatus);
    this.render();
  }

  getCurrentState() {
    return this.mainStatus;
  }

  setCurrentState(newMainStatus) {
    this.mainStatus = structuredClone(newMainStatus);
  }
}

export const createRouter = (initialMainStatus) => {
  return new Router(initialMainStatus);
};
