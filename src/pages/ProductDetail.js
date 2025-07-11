import Component from "../core/Component.js";
import { useProduct } from "../hooks/useProduct.js";
import { Layout } from "../components/layout/Layout.js";
import { BreadCrumb } from "../components/filter/BreadCrumb.js";
import { RelatedProducts } from "../components/product/RelatedProducts.js";
import { showToast } from "../components/common/Toast.js";
import { getRouter } from "../core/router.js";
import { getCart } from "../core/cart.js";

export default class ProductDetail extends Component {
  setup() {
    // 싱글톤 인스턴스 가져오기
    this.router = getRouter();
    this.cart = getCart();

    this.productHook = useProduct();

    this.unsubscribe = this.productHook.subscribe(() => {
      this.render();
    });

    const productId = this.params?.id;

    if (productId) {
      this.productHook.loadInitialData(productId);
    }

    this.setupEvents();
  }

  template() {
    const { product, isLoading, quantity, relatedProducts } = this.productHook.getState();

    if (isLoading || !product) {
      return Layout(
        `
        <div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p> 
          </div>
        </div>
        `,
        {
          title: "상품 상세",
          showBackButton: true,
        },
      );
    }

    return Layout(
      /* html */ `
      <div>
        <div class="mb-4">
        ${BreadCrumb(product.category1, product.category2)} 
        </div>
        <!-- 상품 정보 -->
        <div class="bg-white rounded-lg shadow-sm">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
            </div>
            
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1">${product.brand || ""}</p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
              
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${Number(product.price ?? 0).toLocaleString()}원</span>
              </div>
        
            </div>
          </div>
          
          <!-- 수량 선택 및 액션 -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-900">수량</span>
              <div class="flex items-center">
                <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <input type="number" id="quantity-input" value="${quantity}" min="1" max="10" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 액션 버튼 -->
            <button id="add-to-cart-btn" data-product-id="${product.productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
              장바구니 담기
            </button>
          </div>
        </div>
        ${relatedProducts && relatedProducts.length > 0 ? RelatedProducts({ relatedProducts }) : ""}
      </div>
    `,
      {
        title: "상품 상세",
        showBackButton: true,
      },
    );
  }

  setEvent() {}

  setupEvents() {
    if (this.eventsSetup) {
      return;
    }

    this.addEvent("click", "#quantity-decrease", () => {
      this.productHook.decreaseQuantity();
    });

    this.addEvent("click", "#quantity-increase", () => {
      this.productHook.increaseQuantity();
    });

    // 수량 입력 변경
    this.addEvent("change", "#quantity-input", (e) => {
      const value = parseInt(e.target.value);
      if (value >= 1 && value <= 10) {
        this.productHook.updateQuantity(value);
      }
    });

    this.addEvent("click", "#add-to-cart-btn", () => {
      const { product, quantity } = this.productHook.getState();

      if (product) {
        this.cart.addToCart(product, quantity);
        showToast("장바구니에 추가되었습니다", "success");
      }
    });

    // 관련 상품 클릭 이벤트
    this.addEvent("click", ".related-product-card", (e) => {
      const productCard = e.target.closest(".related-product-card");
      const productId = productCard?.getAttribute("data-product-id");

      if (productId) {
        // 라우터를 통해 상품 상세 페이지로 이동
        this.router.navigate(`/product/${productId}`);
      }
    });

    this.eventsSetup = true;
  }

  unmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
