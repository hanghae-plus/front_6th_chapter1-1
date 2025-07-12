import { cartStore } from "../../features/cart/store/cartStore.js";
import { addEvent } from "../../utils/eventManager.js";
import { openCartModal } from "../../features/cart/services/cartService.js";
import { createComponent } from "../../utils/domUtils.js";

const handleCartIconClick = () => {
  openCartModal();
};

const renderHeader = ({ title = "쇼핑몰", showBackButton = false } = {}) => {
  const { itemCount } = cartStore.getState();

  return `
  <header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-md mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        ${
          showBackButton
            ? `
          <div class="flex items-center space-x-3">
            <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-lg font-bold text-gray-900">${title}</h1>
          </div>
        `
            : `
          <h1 class="text-xl font-bold text-gray-900">
            <a href="/" data-link="">${title}</a>
          </h1>
        `
        }
        <div class="flex items-center space-x-2">
          <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
            </svg>
            ${
              itemCount > 0
                ? `
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                ${itemCount}
              </span>
            `
                : ""
            }
          </button>
        </div>
      </div>
    </div>
  </header>
  `;
};

const HeaderComponent = createComponent(
  renderHeader,
  { title: "쇼핑몰", showBackButton: false },
  {
    mount: () => {
      addEvent("click", "#cart-icon-btn", handleCartIconClick);
    },
  },
);

export const Header = ({ title = "쇼핑몰", showBackButton = false } = {}) => {
  return renderHeader({ title, showBackButton });
};

Header.mount = HeaderComponent.mount;
Header.unmount = HeaderComponent.unmount;
