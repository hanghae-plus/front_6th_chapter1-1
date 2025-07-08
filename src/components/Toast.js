export const CartAddToast = () => {
  return /*html*/ `
  <div id="cart-toast" style ="display:none; position:fixed;bottom:0; z-index:9999">
    <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <p class="text-sm font-medium">장바구니에 추가되었습니다</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
  `;
};

export const CartDeleteToast = () => {
  return /*html*/ `
  <div class="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
  <div class="flex-shrink-0">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
   </svg>
  </div>
  <p class="text-sm font-medium">선택된 상품들이 삭제되었습니다</p>
  <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
</div>
  `;
};

export const ErrorToast = () => {
  return /*html*/ `
  <div class="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
  <div class="flex-shrink-0">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  </div>
  <p class="text-sm font-medium">오류가 발생했습니다.</p>
  <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
</div>
`;
};
