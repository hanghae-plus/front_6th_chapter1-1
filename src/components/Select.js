import { Component } from "../core/Component";
import { html } from "../utils/html";

class SelectFilter extends Component {
  renderContainer() {
    return html`<div ${this.dataAttribute.attribute} class="flex items-center gap-2">
      <label class="text-sm text-gray-600">${this.props.label}:</label>
      ${this.select({ initValue: this.props.initValue(), options: this.props.options })}
    </div>`;
  }

  render() {
    this.$el.querySelector(`#${this.props.id}`).value = this.props.initValue();
  }

  select({ initValue, options }) {
    return html`<select
      id="${this.props.id}"
      class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      ${options.map(({ value, name }) => this.option({ value, name, selected: value === initValue })).join("")}
    </select>`;
  }

  option({ value, name, selected }) {
    return html`<option value="${value}" ${selected ? "selected" : ""}>${name}</option>`;
  }

  setEvent() {
    super.setEvent();
    this.addEvent("change", (e) => {
      if (e.target.closest("select")) {
        const newValue = e.target.value;
        e.target.value = this.props.initValue();
        this.props.setValue(newValue);
      }
    });
  }
}

export class LimitSelect extends SelectFilter {
  constructor(props) {
    super({
      ...props,
      id: "limit-select",
      label: "개수",
      options: [10, 20, 50, 100].map((value) => ({
        value,
        name: `${value}개`,
      })),
      initValue: () => this.props.productsStore.limit,
      setValue: (value) => this.props.productsStore.setLimit(value),
    });
  }
}

export class SortSelect extends SelectFilter {
  constructor(props) {
    super({
      ...props,
      id: "sort-select",
      label: "정렬",
      options: [
        { value: "price_asc", name: "가격 낮은순" },
        { value: "price_desc", name: "가격 높은순" },
        { value: "name_asc", name: "이름순" },
        { value: "name_desc", name: "이름 역순" },
      ],
      initValue: () => this.props.productsStore.sort,
      setValue: (value) => this.props.productsStore.setSort(value),
    });
  }
}
