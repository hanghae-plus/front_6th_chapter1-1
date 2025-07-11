import { Component } from "../core/Component";
import { html } from "../utils/html";

export class Search extends Component {
  inputId = "search-input";

  renderContainer() {
    return html` <div ${this.dataAttribute.attribute} class="mb-4">
      <div class="relative">
        <input
          type="text"
          id="${this.inputId}"
          placeholder="상품명을 검색해보세요..."
          value="${this.props.productsStore.search}"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>`;
  }

  setEvent() {
    super.setEvent();
    this.addEvent("keydown", (e) => {
      if (e.target.closest(`#${this.inputId}`)) {
        if (e.key === "Enter") {
          this.props.productsStore.setSearch(e.target.value);
        }
      }
    });
  }
}
