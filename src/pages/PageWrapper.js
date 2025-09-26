import { cartStore, uiStore } from "../stores";
import { CartModal, Footer, Toast } from "../components";

export const PageWrapper = ({ headerLeft, children }) => {
  const cart = cartStore.getState();
  const { cartModal, toast } = uiStore.getState();
  const cartSize = cart.items.length;

  const cartCount = `
    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      ${cartSize > 99 ? "99+" : cartSize}
    </span>
  `;

  return `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            ${headerLeft}
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"/>
                </svg>
                ${cartSize > 0 ? cartCount : ""}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main class="max-w-md mx-auto px-4 py-4">
        ${children}
      </main>
      
      ${CartModal({ ...cart, isOpen: cartModal.isOpen })}
      
      ${Toast(toast)}
      
      ${Footer()}
    </div>
  `;
};
