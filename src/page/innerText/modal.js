export default function modal(state) {
  const 장바구니_비어있음 = `
    <div class="cart-modal fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
        <!-- 헤더 -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
            </svg>
            장바구니
            ${state.cartList.length != 0 ? `<span class="text-sm font-normal text-gray-600 ml-1">(${state.cartList.length})</span>` : ""}
            
          </h2>
          
          <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- 컨텐츠 -->
        <div class="flex flex-col max-h-[calc(90vh-120px)]">
          ${
            state.cartList.length != 0
              ? `
      <!-- 전체 선택 섹션 -->
          <div class="p-4 border-b border-gray-200 bg-gray-50">
            <label class="flex items-center text-sm text-gray-700">
              <input type="checkbox" id="cart-modal-select-all-checkbox" ${state.selectCartItem.length === state.cartList.length ? "checked" : ""} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2">
              전체선택 (${state.cartList.length}개)
            </label>
          </div>
          <!-- 아이템 목록 -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-4 space-y-4">
              ${state.cartList
                .map(
                  (cart) => `
                <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="86940857379">
                <!-- 선택 체크박스 -->
                <label class="flex items-center mr-3">
                  <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded
                focus:ring-blue-500" data-product-id=${cart.productId} ${state.selectCartItem.includes(String(cart.productId)) ? "checked" : ""}>
                </label>
                <!-- 상품 이미지 -->
                <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img src=${cart.image} alt=${
                    cart.title
                  } class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="86940857379">
                </div>
                <!-- 상품 정보 -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="86940857379">
                    ${cart.title}
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    ${cart.lprice}원
                  </p>
                  <!-- 수량 조절 -->
                  <div class="flex items-center mt-2">
                    <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center
                 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id=${cart.productId}>
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <input type="number" value="1" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b
                border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled="" data-product-id=${cart.productId}>
                    <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center
                 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id=${cart.productId}>
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- 가격 및 삭제 -->
                <div class="text-right ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    ${cart.lprice}원
                  </p>
                  <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id=${cart.productId}>
                    삭제
                  </button>
                </div>
              </div>
              `,
                )
                .join("")}
              
            </div>
          </div>        
    `
              : `
            <!-- 빈 장바구니 -->
          <div class="flex-1 flex items-center justify-center p-8">
            <div class="text-center">
              <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
              <p class="text-gray-600">원하는 상품을 담아보세요!</p>
            </div>
          </div>  
          `
          }
          
        </div>
        ${
          state.cartList.length != 0
            ? `  
        <!-- 하단 액션 -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <!-- 선택된 아이템 정보 -->
          <!-- 총 금액 -->
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-bold text-gray-900">총 금액</span>
            <span class="text-xl font-bold text-blue-600">0원</span>
          </div>
          <!-- 액션 버튼들 -->
          <div class="space-y-2">
          ${
            state.selectCartItem.length != 0
              ? `
            <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md
                       hover:bg-red-700 transition-colors text-sm">
              선택한 상품 삭제 (${state.selectCartItem.length}개)
            </button>`
              : ""
          }
            
            <div class="flex gap-2">
              <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md
                       hover:bg-gray-700 transition-colors text-sm">
                전체 비우기
              </button>
              <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md
                       hover:bg-blue-700 transition-colors text-sm">
                구매하기
              </button>
            </div>
          </div>
        </div>`
            : ""
        }

      </div>
    </div>
  `;

  return 장바구니_비어있음;
}
