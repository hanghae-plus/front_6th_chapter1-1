import { router } from "../../../routes";
import { getProducts } from "../../../api/productApi";
import RelatedProductList from "./RelatedProductList";
import Toast from "../../common/Toast";

function ProductDetailContent({ product, loading = true }) {
  if (loading) {
    return /* HTML */ `
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    `;
  }

  const toast = Toast();

  const addToCart = (quantity) => {
    const cart = JSON.parse(window.localStorage.getItem("cart") || "{}");
    const newCart = {
      ...cart,
      [product.productId]: {
        ...product,
        quantity: cart[product.productId]?.quantity + quantity || quantity,
      },
    };
    window.localStorage.setItem("cart", JSON.stringify(newCart));
  };

  queueMicrotask(() => {
    const addToCartButton = document.getElementById("add-to-cart-btn");

    addToCartButton.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(Number(document.getElementById("quantity-input").value));
      toast.show("success", "장바구니에 추가되었습니다");
    });
  });

  queueMicrotask(() => {
    const goToProductListButton = document.getElementById("go-to-product-list-btn");

    goToProductListButton.addEventListener("click", (e) => {
      e.preventDefault();
      router.navigate("/", { replace: true });
    });
  });

  queueMicrotask(() => {
    const quantityIncreaseButton = document.getElementById("quantity-increase");

    quantityIncreaseButton.addEventListener("click", (e) => {
      e.preventDefault();
      const quantityInput = document.getElementById("quantity-input");
      quantityInput.value = Number(quantityInput.value) + 1;
    });
  });

  queueMicrotask(() => {
    const quantityDecreaseButton = document.getElementById("quantity-decrease");

    quantityDecreaseButton.addEventListener("click", (e) => {
      e.preventDefault();
      const quantityInput = document.getElementById("quantity-input");
      quantityInput.value = Math.max(Number(quantityInput.value) - 1, 1);
    });
  });

  const relatedProductListId = crypto.randomUUID();

  const updateRelatedProductsUI = async () => {
    const response = await getProducts({ category1: product.category1, category2: product.category2 });

    const relatedProductList = document.getElementById(relatedProductListId);
    relatedProductList.replaceWith(
      RelatedProductList({
        relatedProductList: response.products.filter(
          (relatedProduct) => relatedProduct.productId !== product.productId,
        ),
      }),
    );
  };

  updateRelatedProductsUI();

  return /* HTML */ `
    <!-- 브레드크럼 -->
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category1=${product.category1}>${product.category1}</button>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category2=${product.category2}>${product.category2}</button>
      </div>
    </nav>
    <!-- 상품 상세 정보 -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src=${product.image} alt="${product.title}" class="w-full h-full object-cover product-detail-image" />
        </div>
        <!-- 상품 정보 -->
        <div>
          <p class="text-sm text-gray-600 mb-1">${product.brand}</p>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
            </div>
            <span class="ml-2 text-sm text-gray-600"
              >${Number.parseFloat(product.rating).toFixed(1)} (${product.reviewCount}개 리뷰)</span
            >
          </div>
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${Number.parseInt(product.lprice).toLocaleString()}원</span>
          </div>
          <!-- 재고 -->
          <div class="text-sm text-gray-600 mb-4">재고 ${product.stock}개</div>
          <!-- 설명 -->
          <div class="text-sm text-gray-700 leading-relaxed mb-6">${product.description}</div>
        </div>
      </div>
      <!-- 수량 선택 및 액션 -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button
              id="quantity-decrease"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 
             rounded-l-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input
              type="number"
              id="quantity-input"
              value="1"
              min="1"
              max=${product.stock}
              class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
            focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              id="quantity-increase"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 
             rounded-r-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 액션 버튼 -->
        <button
          id="add-to-cart-btn"
          data-product-id=${product.productId}
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
           hover:bg-blue-700 transition-colors font-medium"
        >
          장바구니 담기
        </button>
      </div>
    </div>
    <!-- 상품 목록으로 이동 -->
    <div class="mb-6">
      <button
        id="go-to-product-list-btn"
        class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
      hover:bg-gray-200 transition-colors go-to-product-list"
      >
        상품 목록으로 돌아가기
      </button>
    </div>
    <!-- 관련 상품 -->
    <div id="${relatedProductListId}"></div>
  `;
}

export default ProductDetailContent;
