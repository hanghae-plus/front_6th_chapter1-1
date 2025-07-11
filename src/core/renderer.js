import { HomePage } from "../pages/HomePage.js";
import { ProductDetailPage } from "../pages/ProductDetailPage.js";
import mainStore from "../store/main.js";
import { getURLParams } from "../utils/url.js";
import { syncFormWithURL } from "./formSync.js";
import {
  addCartDialogEventListeners,
  addMainEventListeners,
  addProductItemEventListeners,
  removeCartDialogEventListeners,
  removeMainEventListeners,
  removeProductItemEventListeners,
} from "./eventManager.js";
import { setupInfiniteScroll } from "./infiniteScroll.js";
import { goBackToHome } from "../services/productDetailService.js";
import { setupProductDetailEventListeners } from "../handlers/productDetailHandlers.js";

export const render = () => {
  // 기존 이벤트 리스너 제거
  removeMainEventListeners();
  removeProductItemEventListeners();
  removeCartDialogEventListeners();

  const mainState = mainStore.getState();
  const currentPath = window.location.pathname;

  let pageHTML = "";

  // 현재 경로에 따라 페이지 결정
  if (currentPath.startsWith("/product/")) {
    // 상품 상세 페이지
    pageHTML = ProductDetailPage({
      product: mainState.currentProduct,
      relatedProducts: mainState.relatedProducts,
    });
  } else {
    // 홈 페이지
    pageHTML = HomePage({
      ...mainState,
      params: mainState.params || getURLParams(),
    });
  }

  document.body.querySelector("#root").innerHTML = pageHTML;

  // 페이지별 초기화
  if (currentPath.startsWith("/product/")) {
    // 상품 상세 페이지 이벤트 설정
    setupProductDetailEvents();
    setupProductDetailEventListeners();
  } else {
    // 홈 페이지 이벤트 설정
    syncFormWithURL();
    setupInfiniteScroll();
  }

  // 공통 이벤트 리스너 추가
  addMainEventListeners();
  addProductItemEventListeners();
  addCartDialogEventListeners();
};

// 상품 상세 페이지 전용 이벤트 설정
const setupProductDetailEvents = () => {
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", goBackToHome);
  }
};
