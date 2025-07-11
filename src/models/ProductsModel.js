import { getProducts } from "../api/productApi.js";

export class ProductsModel {
  constructor(initialFilters = {}) {
    this.state = {
      products: [],
      loading: false,
      totalCount: 0,
      hasMore: false,
      currentPage: 1,
      filters: {
        limit: 20,
        sort: "price_asc",
        search: "",
        category1: "",
        category2: "",
        ...initialFilters,
      },
    };
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback({ ...this.state });

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  async updateFilters(newFilters) {
    const oldFilters = { ...this.state.filters };
    this.state.filters = { ...this.state.filters, ...newFilters };

    const shouldReset =
      oldFilters.search !== this.state.filters.search ||
      oldFilters.sort !== this.state.filters.sort ||
      oldFilters.category1 !== this.state.filters.category1 ||
      oldFilters.category2 !== this.state.filters.category2;

    if (shouldReset) {
      this.state.currentPage = 1;
      await this.fetchProducts(true);
    } else if (oldFilters.limit !== this.state.filters.limit) {
      // limit만 변경된 경우
      const newLimit = this.state.filters.limit;
      const currentCount = this.state.products.length;

      if (newLimit <= currentCount) {
        // 현재 데이터가 충분하면 API 호출 없이 잘라서 표시
        this.state.products = this.state.products.slice(0, newLimit);
        this.notify();
      } else {
        // 더 많은 데이터가 필요하면 추가 로드
        if (this.state.hasMore) {
          await this.loadMoreUntilLimit(newLimit);
        }
      }
    }
  }

  async loadMoreUntilLimit(targetLimit) {
    while (this.state.products.length < targetLimit && this.state.hasMore && !this.state.loading) {
      this.state.currentPage += 1;
      await this.fetchProducts(false); // 추가 로드
    }
  }

  async fetchProducts(reset = false) {
    this.state.loading = true;
    this.notify();

    const response = await getProducts({
      ...this.state.filters,
      page: this.state.currentPage,
    });

    if (reset) {
      this.state.products = response.products || [];
    } else {
      this.state.products = [...this.state.products, ...(response.products || [])];
    }

    this.state.totalCount = response.pagination?.total || 0;
    this.state.hasMore = response.pagination?.hasNext || false;
    this.state.loading = false;

    this.notify();
  }

  async loadMore() {
    if (this.state.loading || !this.state.hasMore) {
      return;
    }

    this.state.currentPage += 1;
    await this.fetchProducts(false);
  }

  async initialize() {
    await this.fetchProducts(true);
  }

  getState() {
    return { ...this.state };
  }
}
