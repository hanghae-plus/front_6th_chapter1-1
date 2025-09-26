import { CART_ACTIONS, cartStore, UI_ACTIONS, uiStore } from "../stores";
import { cartStorage } from "../storage";

/**
 * 로컬스토리지에서 장바구니 데이터 로드
 */
export const loadCartFromStorage = () => {
  try {
    const savedCart = cartStorage.get();
    if (savedCart) {
      cartStore.dispatch({
        type: CART_ACTIONS.LOAD_FROM_STORAGE,
        payload: savedCart,
      });
    }
  } catch (error) {
    console.error("장바구니 로드 실패:", error);
  }
};

/**
 * 장바구니 데이터를 로컬스토리지에 저장
 */
export const saveCartToStorage = () => {
  try {
    const state = cartStore.getState();
    cartStorage.set(state);
  } catch (error) {
    console.error("장바구니 저장 실패:", error);
  }
};

/**
 * 상품을 장바구니에 추가
 */
export const addToCart = (product, quantity = 1) => {
  cartStore.dispatch({
    type: CART_ACTIONS.ADD_ITEM,
    payload: { product, quantity },
  });

  // 로컬스토리지에 저장
  saveCartToStorage();

  // 성공 토스트 표시
  uiStore.dispatch({
    type: UI_ACTIONS.SHOW_TOAST,
    payload: {
      message: "장바구니에 추가되었습니다",
      type: "success",
    },
  });

  // 3초 후 토스트 숨김
  setTimeout(() => {
    uiStore.dispatch({ type: UI_ACTIONS.HIDE_TOAST });
  }, 3000);
};

/**
 * 장바구니에서 상품 제거
 */
export const removeFromCart = (productId) => {
  cartStore.dispatch({
    type: CART_ACTIONS.REMOVE_ITEM,
    payload: productId,
  });
  saveCartToStorage();
};
/**
 * 장바구니 수량 변경
 */
export const updateCartQuantity = (productId, quantity) => {
  cartStore.dispatch({
    type: CART_ACTIONS.UPDATE_QUANTITY,
    payload: { productId, quantity },
  });
  saveCartToStorage();
};

/**
 * 장바구니 선택 토글
 */
export const toggleCartSelect = (productId) => {
  cartStore.dispatch({
    type: CART_ACTIONS.TOGGLE_SELECT,
    payload: productId,
  });
  saveCartToStorage();
};

/**
 * 장바구니 전체 선택
 */
export const selectAllCart = () => {
  cartStore.dispatch({ type: CART_ACTIONS.SELECT_ALL });
  saveCartToStorage();
};

/**
 * 장바구니 전체 해제
 */
export const deselectAllCart = () => {
  cartStore.dispatch({ type: CART_ACTIONS.DESELECT_ALL });
  saveCartToStorage();
};

/**
 * 선택된 상품들 삭제
 */
export const removeSelectedFromCart = () => {
  cartStore.dispatch({ type: CART_ACTIONS.REMOVE_SELECTED });
  saveCartToStorage();

  uiStore.dispatch({
    type: UI_ACTIONS.SHOW_TOAST,
    payload: {
      message: "선택된 상품들이 삭제되었습니다",
      type: "info",
    },
  });

  setTimeout(() => {
    uiStore.dispatch({ type: UI_ACTIONS.HIDE_TOAST });
  }, 3000);
};

/**
 * 장바구니 전체 비우기
 */
export const clearCart = () => {
  cartStore.dispatch({ type: CART_ACTIONS.CLEAR_CART });
  saveCartToStorage();

  uiStore.dispatch({
    type: UI_ACTIONS.SHOW_TOAST,
    payload: {
      message: "장바구니가 비워졌습니다",
      type: "info",
    },
  });

  setTimeout(() => {
    uiStore.dispatch({ type: UI_ACTIONS.HIDE_TOAST });
  }, 3000);
};
