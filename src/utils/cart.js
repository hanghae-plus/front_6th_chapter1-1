const CART_KEY = "HANGHAE_PART1_CART";

export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("장바구니 데이터 FAIL", error);
    return [];
  }
};

// 장바구니 현황 로컬 스토리지 저장.
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === product.productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // 새 상품 추가
    const newCartItem = { ...product, quantity };
    cart.push(newCartItem);
  }
  saveCart(cart);
};

/**
 * 헤더의 장바구니 아이콘 카운트 업데이트
 * 페이지를 리렌더링하지 않고, 카운트 뱃지를 직접 생성, 수정, 또는 제거
 */
export const updateHeaderCartCount = () => {
  const cart = getCart();
  const cartItemCount = cart.length; // 상품 종류의 수

  const cartButton = document.querySelector("#cart-icon-btn");
  if (!cartButton) {
    return;
  }

  let countBadge = cartButton.querySelector("span");

  if (cartItemCount > 0) {
    if (!countBadge) {
      countBadge = document.createElement("span");
      countBadge.className =
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
      cartButton.appendChild(countBadge);
    }
    countBadge.textContent = cartItemCount;
  } else {
    if (countBadge) {
      countBadge.remove();
    }
  }
};

// (추가) 다른 장바구니 유틸리티 함수들
// export const removeFromCart = (productId) => {
//   let cart = getCart();
//   cart = cart.filter((item) => item.productId !== productId);
//   saveCart(cart);
// };

// export const updateCartItemQuantity = (productId, quantity) => {
//   const cart = getCart();
//   const item = cart.find((item) => item.productId === productId);
//   if (item) {
//     item.quantity = quantity;
//     if (item.quantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       saveCart(cart);
//     }
//   }
// };

// export const clearCart = () => {
//   saveCart([]);
// };
