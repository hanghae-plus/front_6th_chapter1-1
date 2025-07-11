import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Layouy } from "../components/Layout";
import { ProductDetail } from "../components/ProductDetail";
import { Component } from "../core/Component";
import { cartStore } from "../store/cart";
import { createProductDetailStore } from "../store/product-detail";
import { html } from "../utils/html";

export function ProductDetailPage($root) {
  cartStore.init();
  const productDetailStore = createProductDetailStore();
  productDetailStore.initSearchParams();
  productDetailStore.loadProduct();

  const layout = new Layouy({
    header: new Header({ nav: new Nav() }),
    main: new ProductDetail({ productDetailStore }),
    footer: new Footer(),
  });
  document.querySelector($root).innerHTML = html`${layout}`;
  layout.setup();

  return () => {
    layout.dispose();
  };
}

class Nav extends Component {
  renderContainer() {
    return html` <div ${this.dataAttribute.attribute} class="flex items-center space-x-3">
      <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
    </div>`;
  }
}
