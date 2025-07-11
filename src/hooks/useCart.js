import { getFromLocalStorage, setToLocalStorage } from "../utils/localStorage.js";
import { useState } from "./useState.js";
import { CartModal } from "../components/cart/CartModal.js";

const SHOPPING_CART_KEY = "shopping_cart";

export function useCart() {
  const initialCartState = getFromLocalStorage(SHOPPING_CART_KEY, {
    items: [],
    selectedItems: [],
    itemCount: 0,
    isModalOpen: false,
  });
  const cartState = useState(initialCartState);

  let modalContainer = null;

  const saveToLocalStorage = (state) => {
    setToLocalStorage(SHOPPING_CART_KEY, state);
  };

  const addToCart = (product, quantity = 1) => {
    const currentState = cartState.getState();
    const existingItemIndex = currentState.items.findIndex((item) => item.productId === product.productId);

    let newItems;
    if (existingItemIndex >= 0) {
      newItems = [...currentState.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      newItems = [
        ...currentState.items,
        {
          ...product,
          quantity,
          id: product.productId,
        },
      ];
    }

    const newItemCount = newItems.length;

    const newState = {
      ...currentState,
      items: newItems,
      itemCount: newItemCount,
    };

    cartState.setState(newState);
    saveToLocalStorage(newState);
  };

  const removeFromCart = (productId) => {
    const currentState = cartState.getState();
    const newItems = currentState.items.filter((item) => item.id !== productId);
    const newItemCount = newItems.length;

    const newState = {
      ...currentState,
      items: newItems,
      itemCount: newItemCount,
    };

    cartState.setState(newState);
    saveToLocalStorage(newState);
  };

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const currentState = cartState.getState();
    const newItems = currentState.items.map((item) => (item.id === productId ? { ...item, quantity } : item));
    const newItemCount = newItems.length;

    const newState = {
      ...currentState,
      items: newItems,
      itemCount: newItemCount,
    };

    cartState.setState(newState);
    saveToLocalStorage(newState);
  };

  const clearCart = () => {
    const newState = {
      items: [],
      selectedItems: [],
      itemCount: 0,
      isModalOpen: false,
    };

    cartState.setState(newState);
    saveToLocalStorage(newState);
  };

  const createModalContainer = () => {
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "cart-modal-container";
      modalContainer.className = "fixed inset-0 z-50 hidden";
      document.body.appendChild(modalContainer);
    }
  };

  const renderModal = () => {
    const state = cartState.getState();
    const { items, selectedItems, isModalOpen } = state;

    if (!modalContainer) return;

    if (isModalOpen) {
      modalContainer.innerHTML = `
        <div class="cart-modal-overlay fixed inset-0 bg-black bg-opacity-50 transition-opacity">
          ${CartModal({ items, selectedItems })}
        </div>
      `;
      modalContainer.classList.remove("hidden");
    } else {
      modalContainer.classList.add("hidden");
      modalContainer.innerHTML = "";
    }
  };

  const openModal = () => {
    const currentState = cartState.getState();
    cartState.setState({ ...currentState, isModalOpen: true });
    document.body.style.overflow = "hidden";
    renderModal();
  };

  const closeModal = () => {
    const currentState = cartState.getState();
    cartState.setState({ ...currentState, isModalOpen: false });
    document.body.style.overflow = "";
    renderModal();
  };

  const updateCartBadge = () => {
    const cartIconBtn = document.querySelector("#cart-icon-btn");
    if (!cartIconBtn) return;

    const state = cartState.getState();
    const cartItemCount = state.itemCount;

    const existingBadge = cartIconBtn.querySelector(".cart-badge");
    if (existingBadge) {
      existingBadge.remove();
    }

    if (cartItemCount > 0) {
      const badge = document.createElement("span");
      badge.className =
        "cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";
      badge.textContent = cartItemCount > 99 ? "99+" : cartItemCount;
      cartIconBtn.appendChild(badge);
    }
  };

  // DOM 변경 감지해서 cart-icon-btn이 추가될 때마다 뱃지 업데이트
  const observeCartIcon = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.id === "cart-icon-btn" || node.querySelector?.("#cart-icon-btn")) {
                setTimeout(updateCartBadge, 10);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return observer;
  };

  const setupEventListeners = () => {
    document.addEventListener("click", (e) => {
      if (e.target.closest("#cart-icon-btn")) {
        openModal();
      }

      if (e.target.closest("#cart-modal-close-btn")) {
        closeModal();
      }
      if (e.target.id === "cart-modal-container") {
        closeModal();
      }

      if (e.target.classList.contains("quantity-increase-btn") || e.target.closest(".quantity-increase-btn")) {
        const button = e.target.classList.contains("quantity-increase-btn")
          ? e.target
          : e.target.closest(".quantity-increase-btn");
        const productId = button.getAttribute("data-product-id");
        const currentState = cartState.getState();
        const item = currentState.items.find((item) => item.id === productId);
        if (item) {
          updateCartItemQuantity(productId, item.quantity + 1);
          renderModal();
        }
      }

      if (e.target.classList.contains("quantity-decrease-btn") || e.target.closest(".quantity-decrease-btn")) {
        const button = e.target.classList.contains("quantity-decrease-btn")
          ? e.target
          : e.target.closest(".quantity-decrease-btn");
        const productId = button.getAttribute("data-product-id");
        const currentState = cartState.getState();
        const item = currentState.items.find((item) => item.id === productId);
        if (item && item.quantity > 1) {
          updateCartItemQuantity(productId, item.quantity - 1);
          renderModal();
        }
      }

      if (e.target.classList.contains("cart-item-remove-btn")) {
        const productId = e.target.getAttribute("data-product-id");
        removeFromCart(productId);
        renderModal();
      }

      if (e.target.id === "cart-modal-clear-cart-btn") {
        clearCart();
        renderModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cartState.getState().isModalOpen) {
        closeModal();
      }
    });
  };

  const init = () => {
    createModalContainer();
    setupEventListeners();

    observeCartIcon();

    cartState.subscribe(updateCartBadge);
    setTimeout(updateCartBadge, 50);
  };

  return {
    getState: cartState.getState,
    subscribe: cartState.subscribe,
    openModal,
    closeModal,
    updateCartBadge,
    init,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };
}
