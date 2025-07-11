import { Component } from "../core/Component";
import { html } from "../utils/html";
import { CartModal } from "./CartModal";

export class Layouy extends Component {
  cartModal = new CartModal();

  renderContainer() {
    const { header, main, footer } = this.props;
    return html`
      <div ${this.dataAttribute.attribute} class="min-h-screen bg-gray-50">
        ${header} ${main} ${this.cartModal} ${footer}
      </div>
    `;
  }
}
