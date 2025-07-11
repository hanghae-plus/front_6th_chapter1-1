import { getProduct, getProducts } from "../api/productApi";
import { observable } from "../core/observer";
import { router } from "../core/router";

const defaultProduct = {
  title: "",
  image: "",
  lprice: "",
  hprice: "",
  productId: "",
  category1: "",
  category2: "",
  description: "",
  rating: 0,
  reviewCount: 0,
  stock: 0,
  isLoading: true,
};

const defaultData = {
  productId: "",
  product: defaultProduct,
  relatedProducts: [],
};

export const createProductDetailStore = () => {
  const productDetailStore = observable({
    ...defaultData,

    initSearchParams() {
      productDetailStore.clear();
      const { productId } = router.getParams();
      productDetailStore.productId = productId;
    },
    clear() {
      for (const [key, value] of Object.entries(defaultData)) {
        productDetailStore[key] = value;
      }
    },
    async loadProduct() {
      const data = await getProduct(productDetailStore.productId);
      productDetailStore.product = { ...data, isLoading: false };
      productDetailStore.loadRelatedProducts({
        category1: data.category1,
        category2: data.category2,
      });
    },
    async loadRelatedProducts({ category1, category2 }) {
      const defaultParams = {
        page: 1,
        limit: 20,
        search: "",
        sort: "price_asc",
      };
      const data = await getProducts({
        ...defaultParams,
        category1,
        category2,
      });
      productDetailStore.relatedProducts = data.products;
    },
  });

  return productDetailStore;
};
