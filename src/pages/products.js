import { Filters } from "../components/Filters";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Layouy } from "../components/Layout";
import { Products } from "../components/Products";
import { Component } from "../core/Component";
import { cartStore } from "../store/cart";
import { createProductsStore } from "../store/products";
import { html } from "../utils/html";

export function ProductsPage($root) {
  cartStore.init();
  const productsStore = createProductsStore();
  productsStore.initSearchParams();
  productsStore.loadCategories().then(() => {
    productsStore.loadProducts();
  });

  const layout = new Layouy({
    header: new Header({ nav: new Nav() }),
    main: new Main({
      filters: new Filters({ productsStore }),
      products: new Products({ productsStore }),
    }),
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
    return html`<h1 ${this.dataAttribute.attribute} class="text-xl font-bold text-gray-900">
      <a href="/" data-link="">쇼핑몰</a>
    </h1>`;
  }
}

class Main extends Component {
  renderContainer() {
    return html`<main ${this.dataAttribute.attribute} class="max-w-md mx-auto px-4 py-4">
      ${this.props.filters} ${this.props.products}
    </main>`;
  }
}
