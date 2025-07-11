import { getCategories, getProducts } from "../api/productApi";
import { observable } from "../core/observer";
import { router } from "../core/router";

const defaultParams = {
  limit: 20,
  search: "",
  category1: "",
  category2: "",
  sort: "price_asc",
  page: 1,
};

const defaultData = {
  isLoading: true,
  isFetching: false,
  products: [],
  currentPageProducts: [],
  page: null,
  total: null,
  hasNext: true,
};

const defaultCategories = null;

export const createProductsStore = () => {
  const productsStore = observable({
    ...defaultParams,
    data: defaultData,
    categories: defaultCategories,

    getParams() {
      return {
        limit: productsStore.limit,
        search: productsStore.search,
        category1: productsStore.category1,
        category2: productsStore.category2,
        sort: productsStore.sort,
        page: productsStore.page,
      };
    },
    initSearchParams() {
      const params = { ...defaultParams, ...router.getParams(), page: defaultParams.page };
      console.log(router.getParams());
      console.log(params);
      for (const [key, value] of Object.entries(params)) {
        productsStore[key] = value;
      }
    },
    updateParams(key, value) {
      const params = router.getParams();
      params[key] = value;
      const filteredParams = {};
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          filteredParams[key] = value;
        }
      }
      router.updateParams(filteredParams);
    },
    setParams(params) {
      for (const [key, value] of Object.entries(params)) {
        productsStore[key] = value;
      }
    },
    setLimit(limit) {
      productsStore.loadProducts({ limit });
      productsStore.updateParams("limit", limit);
    },
    setSearch(search) {
      productsStore.loadProducts({ search });
      productsStore.updateParams("search", search);
    },
    resetCategories() {
      productsStore.loadProducts({ category1: "", category2: "" });
      productsStore.updateParams("category1", "");
      productsStore.updateParams("category2", "");
    },
    setCategories({ category1, category2 }) {
      productsStore.loadProducts({ category1, category2 });
      productsStore.updateParams("category1", category1);
      productsStore.updateParams("category2", category2);
    },
    setSort(sort) {
      productsStore.loadProducts({ sort });
      productsStore.updateParams("sort", sort);
    },
    setData(data) {
      productsStore.data = {
        isLoading: false,
        isFetching: false,
        products: data.pagination.page === 1 ? data.products : [...productsStore.data.products, ...data.products],
        currentPageProducts: data.products,
        page: data.pagination.page,
        total: data.pagination.total,
        hasNext: data.pagination.hasNext,
      };
    },
    async loadProducts(params = {}) {
      const data = await productsStore.fetchProducts({ ...productsStore.getParams(), ...params, page: 1 });
      productsStore.setData(data);
      productsStore.setParams({ ...params, page: 1 });
    },
    async loadNextPage() {
      const data = await productsStore.fetchProducts({
        ...productsStore.getParams(),
        page: productsStore.data.page + 1,
      });
      productsStore.setData(data);
      productsStore.setParams({ page: productsStore.data.page + 1 });
    },
    async fetchProducts(params) {
      productsStore.isFetching = true;
      const data = await getProducts(params);

      return data;
    },
    async loadCategories() {
      productsStore.categories = await getCategories();
    },
  });

  return productsStore;
};
