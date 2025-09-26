/**
 * 상품 관련 액션 타입들
 */
export const PRODUCT_ACTIONS = {
  // 상품 목록
  SET_PRODUCTS: "products/setProducts",
  ADD_PRODUCTS: "products/addProducts", // 무한스크롤용
  SET_LOADING: "products/setLoading",
  SET_ERROR: "products/setError",

  // 카테고리
  SET_CATEGORIES: "products/setCategories",

  // 상품 상세
  SET_CURRENT_PRODUCT: "products/setCurrentProduct",
  SET_RELATED_PRODUCTS: "products/setRelatedProducts",

  // 리셋
  RESET_FILTERS: "products/resetFilters",
  SETUP: "products/setup",

  // status 관리
  SET_STATUS: "products/setStatus",
};

/**
 * 장바구니 관련 액션 타입들
 */
export const CART_ACTIONS = {
  // 기본 CRUD
  ADD_ITEM: "cart/addItem",
  REMOVE_ITEM: "cart/removeItem",
  UPDATE_QUANTITY: "cart/updateQuantity",
  CLEAR_CART: "cart/clearCart",

  // 선택 관리
  TOGGLE_SELECT: "cart/toggleSelect",
  SELECT_ALL: "cart/selectAll",
  DESELECT_ALL: "cart/deselectAll",
  REMOVE_SELECTED: "cart/removeSelected",

  // 상태 동기화
  LOAD_FROM_STORAGE: "cart/loadFromStorage",
  SYNC_TO_STORAGE: "cart/syncToStorage",
};

/**
 * UI 관련 액션 타입들
 */
export const UI_ACTIONS = {
  // 장바구니 모달
  OPEN_CART_MODAL: "ui/openCartModal",
  CLOSE_CART_MODAL: "ui/closeCartModal",

  // 로딩 상태
  SET_GLOBAL_LOADING: "ui/setGlobalLoading",

  // 알림
  SHOW_TOAST: "ui/showToast",
  HIDE_TOAST: "ui/hideToast",
};
