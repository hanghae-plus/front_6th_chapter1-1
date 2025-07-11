import { getProducts } from "../api/productApi.js";
import SearchFilter from "../components/list/SearchFilter.js";
import { cartStore } from "../store/store.js";
import { navigate } from "../router/router.js";
import toast from "../components/Toast.js";

const initialState = {
  products: [],
  pagination: {},
  loading: true,
  loadingMore: false,
  filters: {
    page: 1,
    limit: 20,
    sort: "price_asc",
    search: "",
  },
};

class Home {
  constructor() {
    this.el = null;
    this.state = { ...initialState };
    this.searchFilter = new SearchFilter(this.handleFilterChange.bind(this));
    this.fetchProductsDebounced = this.debounce(this.fetchProducts.bind(this));

    window.addEventListener("popstate", (e) => {
      this.setState({ filters: e.state || initialState.filters, loading: true });
      this.fetchProducts();
    });

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleFilterChange(newFilters) {
    const updatedFilters = { ...this.state.filters, ...newFilters, page: 1 };
    const params = new URLSearchParams();
    for (const key in updatedFilters) {
      if (updatedFilters[key] !== undefined && updatedFilters[key] !== "" && updatedFilters[key] !== null) {
        params.set(key, updatedFilters[key]);
      }
    }
    history.pushState(updatedFilters, "", `?${params.toString()}`);
    this.setState({ filters: updatedFilters, loading: true });
    this.fetchProducts();
  }

  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  handleScroll() {
    if (this.state.loadingMore || this.state.loading) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 페이지 하단에 도달했는지 확인 (100px 여유)
    if (scrollTop + windowHeight >= documentHeight - 100) {
      this.loadMoreProducts();
    }
  }

  async loadMoreProducts() {
    if (this.state.loadingMore) return;

    const nextPage = this.state.filters.page + 1;
    const totalPages = Math.ceil((this.state.pagination.total || 0) / this.state.filters.limit);

    // 마지막 페이지인지 확인
    if (nextPage > totalPages) return;

    this.setState({ loadingMore: true });

    try {
      const nextFilters = { ...this.state.filters, page: nextPage };
      const data = await getProducts(nextFilters);

      // 기존 상품에 새 상품 추가
      const newProducts = [...this.state.products, ...data.products];

      this.setState({
        products: newProducts,
        pagination: data.pagination,
        filters: nextFilters,
        loadingMore: false,
      });
    } catch (error) {
      console.error("추가 상품 로딩 실패:", error);
      this.setState({ loadingMore: false });
    }
  }

  async fetchProducts() {
    try {
      const data = await getProducts(this.state.filters);
      this.setState({ products: data.products, loading: false, pagination: data.pagination });
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
      this.setState({ loading: false });
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.el) {
      const oldEl = this.el;
      const newEl = this.render();
      if (oldEl.parentNode) {
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
      this.el = newEl;
    }
  }

  template() {
    return `
      <div class="home-page">
        <div id="search-filter-container"></div>
        <div id="product-list-container">
          ${this.templateProducts()}
        </div>
      </div>
    `;
  }

  templateProducts() {
    const totalCount = (this.state.pagination || {}).total || 0;
    const currentPage = this.state.filters.page;
    const totalPages = Math.ceil(totalCount / this.state.filters.limit);
    const hasMorePages = currentPage < totalPages;

    if (this.state.loading) {
      return `<!-- 로딩 스켈레톤 --> <div class="grid grid-cols-2 gap-4 mb-6"> ${Array(4)
        .fill(0)
        .map(
          () =>
            `<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"><div class="aspect-square bg-gray-200"></div><div class="p-3"><div class="h-4 bg-gray-200 rounded mb-2"></div><div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div><div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div><div class="h-8 bg-gray-200 rounded"></div></div></div>`,
        )
        .join("")}</div>`;
    }

    if (!this.state.products || !this.state.products.length) {
      return `<div class="text-center py-4"><p class="text-gray-600">불러올 상품이 없습니다.</p></div>`;
    }

    return `
      <div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품</div>
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${this.state.products
          .map(
            (item) => `
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${item.productId}">
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy">
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${item.title}</h3>
              <p class="text-xs text-gray-500 mb-2">${item.brand}</p>
              <p class="text-lg font-bold text-gray-900">${parseInt(item.lprice).toLocaleString()}원</p>
              <button class="w-full mt-2 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${item.productId}">장바구니 담기</button>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      ${
        this.state.loadingMore
          ? `
        <div class="text-center py-4">
          <div class="inline-flex items-center">
            <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
          </div>
        </div>
      `
          : !hasMorePages && this.state.products.length > 0
            ? `
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      `
            : ""
      }
    `;
  }

  render() {
    let newEl = this.el;
    if (!newEl) {
      newEl = document.createElement("main");
      newEl.className = "max-w-md mx-auto px-4 py-4";
    }
    newEl.innerHTML = this.template();

    const searchFilterContainer = newEl.querySelector("#search-filter-container");
    const searchFilterEl = this.searchFilter.render(this.state.filters);
    searchFilterContainer.appendChild(searchFilterEl);

    this.el = newEl;
    this.addEventListeners();
    return this.el;
  }

  addEventListeners() {
    this.el.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.currentTarget.dataset.productId;
        const product = this.state.products.find((p) => p.productId === productId);
        if (product) {
          cartStore.addItem(product);
          toast.showSuccess("장바구니에 추가되었습니다");
        }
      });
    });

    this.el.querySelectorAll(".product-image").forEach((img) => {
      img.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.currentTarget.closest(".product-card").dataset.productId;
        navigate(`/product/${productId}`);
      });
    });
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {
      page: parseInt(urlParams.get("page")) || 1,
      limit: parseInt(urlParams.get("limit")) || 20,
      sort: urlParams.get("sort") || "price_asc",
      search: urlParams.get("search") || "",
      category1: urlParams.get("category1") || undefined,
      category2: urlParams.get("category2") || undefined,
    };
    this.setState({ filters: { ...initialState.filters, ...initialFilters } });

    this.fetchProducts();
    this.searchFilter.fetchCategories();

    window.addEventListener("scroll", this.handleScroll);

    return this.el;
  }

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
}

export default Home;
