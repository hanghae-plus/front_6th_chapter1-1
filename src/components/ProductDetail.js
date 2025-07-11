import { Component } from "../core/Component";
import { router } from "../core/router";
import { cartStore } from "../store/cart";
import { priceFormat } from "../utils/format";
import { html } from "../utils/html";

export class ProductDetail extends Component {
  renderContainer() {
    return html`<main ${this.dataAttribute.attribute} class="max-w-md mx-auto px-4 py-4">
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    </main>`;
  }

  render() {
    const {
      relatedProducts,
      product: {
        category1,
        category2,
        image,
        title,
        description,
        rating,
        reviewCount,
        lprice,
        stock,
        productId,
        isLoading,
      },
    } = this.props.productDetailStore;

    if (isLoading) {
      this.$el.innerHTML = this.renderContainer();
      return;
    }

    this.$el.innerHTML = html`${this.#Breadcrumb({ category1, category2 })}
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <!-- 수량 선택 및 액션 -->
        <div class="border-t border-gray-200 p-4">
          ${this.#ProductInfo({ image, title, description, rating, reviewCount, lprice, stock })}
          ${this.#QuantityInput({ stock })}
          <!-- 액션 버튼 -->
          ${this.#AddToCartButton({ productId })}
        </div>
      </div>
      <div class="mb-6">
        <button
          class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list"
        >
          상품 목록으로 돌아가기
        </button>
      </div>
      ${relatedProducts.length > 0
        ? html` <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
              <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 gap-3 responsive-grid">
                ${relatedProducts
                  .filter((item) => item.productId !== productId)
                  .map(this.#ProductCard)
                  .join("")}
              </div>
            </div>
          </div>`
        : ""}`;
  }

  setEvent() {
    super.setEvent();
    this.addEvent("click", (e) => {
      const { target } = e;
      const goToProductsBtn = target.closest(".go-to-product-list");
      if (goToProductsBtn) {
        router.push({ pathname: "/" });
        return;
      }

      const $relatedProductCard = target.closest(".related-product-card");
      if ($relatedProductCard) {
        router.push({ pathname: `/product/${$relatedProductCard.dataset.productId}` });
        return;
      }

      const $category1 = target.closest("[data-category1]");
      if ($category1) {
        const { category1, category2 } = this.props.productDetailStore.product;
        router.push({
          pathname: "/",
          params: { category1, category2 },
        });
        return;
      }

      const $category2 = target.closest("[data-category2]");
      if ($category2) {
        const { category1, category2 } = this.props.productDetailStore.product;
        router.push({
          pathname: "/",
          params: { category1, category2 },
        });
        return;
      }

      const $quantityDecrease = target.closest("#quantity-decrease");
      const $quantityIncrease = target.closest("#quantity-increase");
      const $addToCartBtn = target.closest("#add-to-cart-btn");
      const $quantityInput = this.$el.querySelector("#quantity-input");
      const quantity = $quantityInput.valueAsNumber;

      if ($quantityDecrease) {
        $quantityInput.value = this.#clamp(quantity - 1, $quantityInput.max);
      } else if ($quantityIncrease) {
        $quantityInput.value = this.#clamp(quantity + 1, $quantityInput.max);
      } else if ($addToCartBtn) {
        const { image, title, lprice, productId } = this.props.productDetailStore.product;

        cartStore.addItem({
          productId,
          lprice,
          image,
          title,
          quantity,
          selected: true,
        });
      }
    });

    this.addEvent("change", (e) => {
      const $quantityInput = e.target.closest("#quantity-input");
      if ($quantityInput) {
        const quantity = $quantityInput.valueAsNumber;
        $quantityInput.value = this.#clamp(quantity, $quantityInput.max);
      }
    });
  }

  #clamp(value, max) {
    const MIN = 1;
    return Math.max(MIN, Math.min(value, max));
  }

  #ProductCard({ productId, image, title, lprice }) {
    return html`
      <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${productId}">
        <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
          <img src="${image}" alt="${title}" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${title}</h3>
        <p class="text-sm font-bold text-blue-600">${priceFormat(lprice)}원</p>
      </div>
    `;
  }

  #Breadcrumb({ category1, category2 }) {
    return html`<nav ${this.dataAttribute.attribute} class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category1="${category1}">${category1}</button>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category2="${category2}">${category2}</button>
      </div>
    </nav>`;
  }

  #AddToCartButton({ productId }) {
    return html`<button
      id="add-to-cart-btn"
      data-product-id="${productId}"
      class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium"
    >
      장바구니 담기
    </button>`;
  }

  #QuantityInput({ stock }) {
    return html`<div class="flex items-center justify-between mb-4">
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
          max="${stock}"
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
    </div>`;
  }

  #ProductInfo({ image, title, description, rating, reviewCount, lprice, stock }) {
    return html`<div class="p-4">
      ${this.#ProductImage({ image, title })}
      <!-- 상품 정보 -->
      <div>
        <p class="text-sm text-gray-600 mb-1"></p>
        ${this.#ProductTitle({ title })}
        <!-- 평점 및 리뷰 -->
        ${this.#ProductReview({ rating, reviewCount })}
        <!-- 가격 -->
        <div class="mb-4">
          <span class="text-2xl font-bold text-blue-600">${priceFormat(lprice)}원</span>
        </div>
        <!-- 재고 -->
        <div class="text-sm text-gray-600 mb-4">재고 ${(+stock).toLocaleString()}개</div>
        <!-- 설명 -->
        ${this.#ProductDescription({ description })}
      </div>
    </div>`;
  }

  #ProductImage({ image, title }) {
    return html`<div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
      <img src="${image}" alt="${title}" class="w-full h-full object-cover product-detail-image" />
    </div>`;
  }

  #ProductDescription({ description }) {
    return html`<div class="text-sm text-gray-700 leading-relaxed mb-6">${description}</div>`;
  }

  #ProductTitle({ title }) {
    return html` <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>`;
  }

  #ProductReview({ rating, reviewCount }) {
    return html`<div class="flex items-center mb-3">
      <div class="flex items-center">${this.#RatingStars({ rating })}</div>
      <span class="ml-2 text-sm text-gray-600"
        >${this.#ratingFormat(rating)} (${(+reviewCount).toLocaleString()}개 리뷰)</span
      >
    </div>`;
  }

  #ratingFormat(rating) {
    return Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(rating);
  }

  #RatingStars({ rating }) {
    const MAX_RATING = 5;

    return Array.from({ length: MAX_RATING }, (_, i) => {
      const fill = i + 1 <= rating ? "text-yellow-400" : "text-gray-300";
      return html`<svg class="w-4 h-4 ${fill}" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path>
      </svg>`;
    }).join("");
  }
}
