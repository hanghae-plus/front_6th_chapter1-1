import urlSearchParamsStore from "../core/store/urlSearchParamsStore";
import { getProductParams } from "../legacy/_Main";
import Component from "../core/component";
import Category from "./Category";

class Filter extends Component {
  async setup() {
    this.children = {
      category: {
        component: Category,
      },
    };

    urlSearchParamsStore.subscribe(() => this.render());
  }

  template() {
    const { limit = "20", sort = "price_asc", search = "" } = getProductParams();

    return `
			<!-- 검색 및 필터 -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
				<!-- 검색창 --> 
				<div class="mb-4">
					<div class="relative">
						<input
							type="text"
							id="search-input"
							placeholder="상품명을 검색해보세요..."
							class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value=${search}
						>
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
				</div>
				<!-- 필터 옵션 --> 
				<div class="space-y-3">
					<!-- 카테고리 필터 --> 
					${this.createBoxlessContainer("category")}
					<!-- 기존 필터들 --> 
					<div class="flex gap-2 items-center justify-between">
						<!-- 페이지당 상품 수 --> 
						<div class="flex items-center gap-2">
							<label class="text-sm text-gray-600">개수:</label>
							<select
								id="limit-select"
								class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="10" ${limit === "10" ? "selected" : ""}>10개</option>
								<option value="20" ${limit === "20" ? "selected" : ""}>20개</option>
								<option value="50" ${limit === "50" ? "selected" : ""}>50개</option>
								<option value="100" ${limit === "100" ? "selected" : ""}>100개</option>
							</select>
						</div>
						<!-- 정렬 --> 
						<div class="flex items-center gap-2">
							<label class="text-sm text-gray-600">정렬:</label>
							<select
								id="sort-select"
								class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
								<option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
								<option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
								<option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
							</select>
						</div>
					</div>
				</div>
			</div>
  `;
  }

  setEvent() {
    document.querySelector("#limit-select").addEventListener("change", (e) => {
      const value = e.target.value;

      urlSearchParamsStore.setParams({
        limit: value,
      });
    });

    document.querySelector("#sort-select").addEventListener("change", (e) => {
      const value = e.target.value;

      urlSearchParamsStore.setParams({
        sort: value,
      });
    });

    document.querySelector("#search-input").addEventListener("change", (e) => {
      const value = e.target.value;

      urlSearchParamsStore.setParams({
        search: value,
      });
    });
  }
}

export default Filter;
