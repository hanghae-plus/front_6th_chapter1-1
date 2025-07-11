import { useState } from "./useState.js";
import { getProducts, getCategories } from "../api/productApi.js";

export function useProducts() {
  const productsState = useState({
    products: [],
    categories: {},
    isLoading: false,
    isLoadingMore: false,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  });

  const loadProducts = async (params = {}) => {
    productsState.setState((prevState) => ({
      ...prevState,
      products: [],
      isLoading: true,
    }));

    const response = await getProducts(params);

    productsState.setState((prevState) => ({
      ...prevState,
      products: response.products || [],
      isLoading: false,
      pagination: response.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    }));
  };

  const loadMoreProducts = async (params = {}) => {
    const current = productsState.getState();

    if (current.isLoadingMore || !current.pagination.hasNext) {
      return;
    }

    productsState.setState((prevState) => ({
      ...prevState,
      isLoadingMore: true,
    }));

    const response = await getProducts({
      ...params,
      page: current.pagination.page + 1,
    });

    productsState.setState((prevState) => ({
      ...prevState,
      products: [...prevState.products, ...(response.products || [])],
      pagination: response.pagination || prevState.pagination,
      isLoadingMore: false,
    }));
  };

  const loadInitialData = async (params = {}) => {
    productsState.setState({
      isLoading: true,
    });

    const [products, categories] = await Promise.all([getProducts(params), getCategories()]);

    productsState.setState((prevState) => ({
      ...prevState,
      products: products.products || [],
      categories: categories || {},
      isLoading: false,
      pagination: products.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    }));
  };

  return {
    getState: productsState.getState,
    subscribe: productsState.subscribe,
    loadInitialData,
    loadProducts,
    loadMoreProducts,
  };
}
