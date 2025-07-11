import { Component } from "../core/Component";
import { html } from "../utils/html";

export class Breadcrumb extends Component {
  renderContainer() {
    const { categories, category1, category2 } = this.props.productsStore;
    if (!category1 && !category2) {
      return html`<div ${this.dataAttribute.attribute} class="space-y-2">
        ${this.#renderAllCategories({ isLoading: !categories })}
      </div>`;
    }

    return html`<div ${this.dataAttribute.attribute} class="space-y-2">
      ${this.renderBreadcrumb({ category1, category2 })} ${this.renderCategories({ categories, category1, category2 })}
    </div>`;
  }

  render() {
    this.$el.innerHTML = this.renderContainer();
  }

  setEvent() {
    super.setEvent();
    this.addEvent("click", ({ target: { dataset } }) => {
      if ("category2" in dataset) {
        this.props.productsStore.setCategories({
          category1: this.props.productsStore.category1,
          category2: dataset.category2,
        });
      } else if ("category1" in dataset) {
        this.props.productsStore.setCategories({ category1: dataset.category1, category2: "" });
      } else if ("breadcrumb" in dataset) {
        this.props.productsStore.resetCategories();
      }
    });
  }

  #renderAllCategories({ isLoading }) {
    if (isLoading) {
      return html`
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">카테고리:</label>
          <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        </div>

        <!-- 1depth 카테고리 -->

        <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>

        <!-- 2depth 카테고리 -->
      `;
    }

    return html`
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      </div>

      <!-- 1depth 카테고리 -->

      <div class="flex flex-wrap gap-2">
        <button
          data-category1="생활/건강"
          class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          생활/건강
        </button>

        <button
          data-category1="디지털/가전"
          class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          디지털/가전
        </button>
      </div>

      <!-- 2depth 카테고리 -->
    `;
  }

  renderBreadcrumb({ category1, category2 }) {
    return html`
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        ${category1
          ? html`<span class="text-xs text-gray-500">&gt;</span>
              <button
                data-breadcrumb="category1"
                data-category1="${category1}"
                class="text-xs hover:text-blue-800 hover:underline"
              >
                ${category1}
              </button>`
          : ""}
        ${category2
          ? html`<span class="text-xs text-gray-500">&gt;</span>
              <span class="text-xs text-gray-600 cursor-default">${category2}</span>`
          : ""}
      </div>
    `;
  }

  renderCategories({ categories, category1, category2 }) {
    if (!categories) {
      return html`<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
    }
    const keys = Object.keys(categories[category1] ?? categories);
    const dataAttribute = category1 ? "data-category2" : "data-category1";

    return html`<div class="space-y-2">
      <div class="flex flex-wrap gap-2">
        ${keys
          .map((key) => {
            const style =
              key === (category2 ?? category1)
                ? "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-blue-100 border-blue-300 text-blue-800"
                : "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

            return html`<button ${dataAttribute}="${key}" class="${style}">${key}</button>`;
          })
          .join("")}
      </div>
    </div>`;
  }
}
