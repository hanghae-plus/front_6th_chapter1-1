import { Component } from "../core/Component";
import { router } from "../core/router";
import { cartStore } from "../store/cart";
import { priceFormat } from "../utils/format";
import { html } from "../utils/html";

export class Products extends Component {
  #productsGridId = "products-grid";
  #moreStatusId = "more-status";
  #intersectionObserver = null;
  #producrCardSkeletonRepeatCount = 4;
  #firstRenderData = {
    total: null,
    products: [],
    limit: null,
    page: null,
  };

  renderContainer() {
    const { isLoading, hasNext } = this.props.productsStore;
    return html`<div ${this.dataAttribute.attribute} class="mb-6">
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
      ${this.#moreStatus({ isLoading, hasNext })}
    </div>`;
  }

  render() {
    const { limit, data } = this.props.productsStore;
    const { page, total, products, currentPageProducts, isLoading, hasNext, isFetching } = data;
    if (isLoading) {
      this.$el.innerHTML = html`<!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
        ${this.#moreStatus({ isLoading, hasNext })}`;
    } else if (page === 1) {
      if (
        this.#firstRenderData.total === total &&
        this.#firstRenderData.limit === limit &&
        this.#firstRenderData.page === page &&
        JSON.stringify(this.#firstRenderData.products) === JSON.stringify(products)
      ) {
        return;
      }
      this.#firstRenderData = { total, limit, page, products };
      const filledProducts = this.#ensureProductsCount({ total, limit, page, products });

      this.#renderFirstPage({ total, currentPageProducts: filledProducts, isLoading, hasNext });
    } else {
      this.#appendProducts({ currentPageProducts });
      this.#updateHasMoreStatus({ hasNext });
    }

    this.#setIntersectionObserver({ isLoading, hasNext, isFetching });
  }

  setEvent() {
    super.setEvent();
    this.addEvent("click", ({ target }) => {
      const $addCartBtn = target.closest("button[data-product-id]");
      if ($addCartBtn) {
        const { productId } = $addCartBtn.dataset;
        const item = this.props.productsStore.data.products.find((p) => p.productId === productId);

        if (!item) {
          throw new Error(`${productId} is not in products`);
        }
        cartStore.addItem(item);
        return;
      }

      const $productCard = target.closest("div[data-product-id]");
      if ($productCard) {
        const { productId } = $productCard.dataset;
        router.push({
          pathname: `/product/${productId}`,
        });
      }
    });
  }

  #ensureProductsCount({ total, limit, page, products }) {
    const currentTotal = Math.min(+limit * +page, total);

    if (products.length > currentTotal) {
      return products.slice(0, currentTotal);
    }
    const emptyArr = Array.from({ length: currentTotal - products.length }, () => null);
    return [...products, ...emptyArr];
  }

  #total({ total }) {
    if (total == null) {
      return "";
    }

    return html`<div class="mb-4 text-sm text-gray-600">
      총 <span class="font-medium text-gray-900">${total}개</span>의 상품
    </div>`;
  }

  #renderFirstPage({ total, currentPageProducts, isLoading, hasNext }) {
    this.$el.innerHTML = html`<div ${this.dataAttribute.attribute} class="mb-6">
      <div ${this.dataAttribute.attribute}>
        <!-- 상품 개수 정보 -->
        ${this.#total({ total })}
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="${this.#productsGridId}">
          ${currentPageProducts
            .map((product) => (product ? this.#productCard(product) : this.#producrCardSkeleton()))
            .join("")}
        </div>
        ${this.#moreStatus({ isLoading, hasNext })}
      </div>
    </div>`;
  }

  #appendProducts({ currentPageProducts }) {
    this.$el.querySelector(`#${this.#productsGridId}`).innerHTML += currentPageProducts
      .map((product) => this.#productCard(product))
      .join("");
  }

  #setIntersectionObserver({ isLoading, hasNext, isFetching }) {
    if (this.#intersectionObserver) {
      this.#intersectionObserver.disconnect();
    }

    this.#intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading && hasNext && !isFetching) {
          this.props.productsStore.loadNextPage();
        }
      });
    });

    const $moreStatus = this.$el.querySelector(`#${this.#moreStatusId}`);
    if ($moreStatus) {
      this.#intersectionObserver.observe($moreStatus);
    }
  }

  #updateHasMoreStatus({ hasNext }) {
    if (!hasNext) {
      this.$el.querySelector(`#${this.#moreStatusId}`).innerHTML = this.#noMoreStatus();
    }
  }

  #noMoreStatus() {
    return html`<div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>`;
  }

  #hasMoreStatus() {
    return html`<div id="${this.#moreStatusId}">
      <div class="grid grid-cols-2 gap-4 mb-6">
        ${this.#producrCardSkeleton().repeat(this.#producrCardSkeletonRepeatCount)}
      </div>
      <div class="text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
      </div>
    </div> `;
  }

  #moreStatus({ isLoading, hasNext }) {
    if (isLoading) {
      return this.#hasMoreStatus();
    }

    return hasNext ? this.#hasMoreStatus() : this.#noMoreStatus();
  }

  #productCard({ productId, image, lprice, title, brand }) {
    return html`<div
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
      data-product-id="${productId}"
    >
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img
          src="${image}"
          alt="${title}"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${title}</h3>
          <p class="text-xs text-gray-500 mb-2">${brand}</p>
          <p class="text-lg font-bold text-gray-900">${priceFormat(lprice)}원</p>
        </div>
        <!-- 장바구니 버튼 -->
        <button
          class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn"
          data-product-id="${productId}"
        >
          장바구니 담기
        </button>
      </div>
    </div>`;
  }

  #producrCardSkeleton() {
    return html`<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-3">
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>`;
  }
}
