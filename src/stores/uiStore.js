import { createStore } from "../lib";
import { UI_ACTIONS } from "./actionTypes";

/**
 * UI 스토어 초기 상태
 */
const initialState = {
  // 장바구니 모달 상태
  cartModal: {
    isOpen: false,
  },

  // 로딩 상태
  globalLoading: false,

  // 토스트 알림
  toast: {
    isVisible: false,
    message: "",
    type: "info", // info, success, error, warning
  },
};

/**
 * UI 스토어 리듀서
 */
const uiReducer = (state, action) => {
  switch (action.type) {
    case UI_ACTIONS.OPEN_CART_MODAL:
      return {
        ...state,
        cartModal: { isOpen: true },
      };

    case UI_ACTIONS.CLOSE_CART_MODAL:
      return {
        ...state,
        cartModal: { isOpen: false },
      };

    case UI_ACTIONS.HIDE_TOAST:
      return {
        ...state,
        toast: { ...state.toast, isVisible: false },
      };

    case UI_ACTIONS.SHOW_TOAST:
      return {
        ...state,
        toast: {
          isVisible: true,
          message: action.payload.message,
          type: action.payload.type || "info",
        },
      };

    default:
      return state;
  }
};

/**
 * UI 스토어 생성
 */
export const uiStore = createStore(uiReducer, initialState);
