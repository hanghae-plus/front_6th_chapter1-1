import { useCart } from "../hooks/useCart.js";

let _cart = null;

export const getCart = () => {
  if (!_cart) {
    _cart = useCart();
  }
  return _cart;
};

export const initCart = () => {
  const cart = getCart();
  cart.init();
  return cart;
};

export const resetCart = () => {
  _cart = null;
};
