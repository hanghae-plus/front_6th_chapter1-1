import { Component } from "../core/Component";
import { html } from "../utils/html";

export class Footer extends Component {
  renderContainer() {
    return html`<footer ${this.dataAttribute.attribute} class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto py-8 text-center text-gray-500">
        <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
      </div>
    </footer>`;
  }
}
