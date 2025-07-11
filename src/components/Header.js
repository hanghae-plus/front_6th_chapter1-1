import { Component } from "../core/Component";
import { cartStore } from "../store/cart";
import { html } from "../utils/html";

export class Header extends Component {
  renderContainer() {
    return html` <header ${this.dataAttribute.attribute} class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          ${this.props.nav}
          <div class="flex items-center space-x-2">
            <!-- 장바구니 아이콘 -->
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
              </svg>
              ${cartStore.count > 0
                ? html`<span
                    data-id="cart-count"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >${cartStore.count}</span
                  >`
                : ""}
            </button>
          </div>
        </div>
      </div>
    </header>`;
  }

  render() {
    const { count } = cartStore;
    const $cartCount = this.$el.querySelector("#cart-icon-btn > span");

    if (count <= 0) {
      this.$el.querySelector("#cart-icon-btn > span")?.remove();
      return;
    }

    if ($cartCount) {
      $cartCount.textContent = count;
      return;
    }

    this.$el.querySelector("#cart-icon-btn").appendChild(this.#createCartCountSpan({ count }));
  }

  #createCartCountSpan({ count }) {
    const $span = document.createElement("span");
    $span.className =
      "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
    $span.textContent = count;
    return $span;
  }

  setEvent() {
    super.setEvent();
    this.addEvent("click", (e) => {
      const { target } = e;
      if (target.closest("#cart-icon-btn")) {
        cartStore.openModal();
      }
    });
  }
}
