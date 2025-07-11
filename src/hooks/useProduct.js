import { useState } from "./useState.js";
import { getProduct, getProducts } from "../api/productApi.js";

export function useProduct() {
  const productState = useState({
    product: null,
    isLoading: false,
    quantity: 1,
    relatedProducts: [],
    isLoadingRelated: false,
  });

  const loadProduct = async (productId) => {
    productState.setState({
      product: null,
      isLoading: true,
    });

    const product = await getProduct(productId);

    productState.setState({
      product: { ...product, price: product.lprice },
      isLoading: false,
    });
  };

  const loadInitialData = async (productId) => {
    productState.setState({
      product: null,
      isLoading: true,
      relatedProducts: [],
      isLoadingRelated: true,
    });

    const product = await getProduct(productId);

    const relatedProductsResponse = await getProducts({
      category1: product.category1,
      category2: product.category2,
      limit: 20,
      page: 1,
    });
    const relatedProducts = relatedProductsResponse.products.filter((p) => p.productId !== product.productId);

    productState.setState({
      product: { ...product, price: product.lprice },
      isLoading: false,
      relatedProducts,
      isLoadingRelated: false,
    });
  };

  const updateQuantity = (quantity) => {
    productState.setState({ quantity });
  };

  const increaseQuantity = () => {
    const currentState = productState.getState();
    const newQuantity = Math.min(currentState.quantity + 1, 10);
    productState.setState({ quantity: newQuantity });
  };

  const decreaseQuantity = () => {
    const currentState = productState.getState();
    const newQuantity = Math.max(currentState.quantity - 1, 1);
    productState.setState({ quantity: newQuantity });
  };

  return {
    getState: productState.getState,
    subscribe: productState.subscribe,
    loadProduct,
    loadInitialData,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
  };
}
