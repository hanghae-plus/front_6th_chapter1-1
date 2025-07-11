import { Component } from "../core/Component";
import { html } from "../utils/html";
import { Breadcrumb } from "./Breadcrumb";
import { Search } from "./Search";
import { LimitSelect, SortSelect } from "./Select";

export class Filters extends Component {
  search = new Search(this.props);
  breadcrumb = new Breadcrumb(this.props);
  limitSelect = new LimitSelect(this.props);
  sortSelect = new SortSelect(this.props);

  renderContainer() {
    return html` <div
      ${this.dataAttribute.attribute}
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
    >
      <!-- 검색창 -->
      ${this.search}
      <!-- 필터 옵션 -->
      <div class="space-y-3">
        <!-- 카테고리 필터 -->
        ${this.breadcrumb}
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          ${this.limitSelect}
          <!-- 정렬 -->
          ${this.sortSelect}
        </div>
      </div>
    </div>`;
  }
}
