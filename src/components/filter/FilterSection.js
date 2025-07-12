import { DEFAULT_PAGE } from "../../constants";
import { useQueryParam } from "../../hook/useRouter";
import Component from "../../lib/Component";
import { Router } from "../../lib/Router";
import { homeStore } from "../../store/homeStore";
import { findBreadcrumb, findChildren } from "../../utils/findBreadcrumb";
import { getCurrentCategory } from "../../utils/getCurrentCatetory";
import getFilter from "../../utils/getFilter";
import Breadcrumb from "./Breadcrumb";
import CategoryItem from "./CategoryItem";

export default class Filter extends Component {
  setup() {
    this.child = new Map();

    this.selectLimit = this.selectLimit.bind(this);
    this.selectSort = this.selectSort.bind(this);
    this.search = this.search.bind(this);
    this.selectCategory = this.selectCategory.bind(this);

    this.unsubscribe = homeStore.subscribe(() => {
      const router = Router.getInstance();
      const currentPath = router?.getCurrentPath();

      if (currentPath === "/") {
        this.render();
        // this.setEvent();
        // this.mounted();
      }
    });

    this.setState({
      categoryChildren: [],
    });
  }

  loadingTemplate() {
    return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
  }

  selectLimit(e) {
    const setQueryParam = useQueryParam();
    const limit = parseInt(e.target.value);

    this.resetPage();
    setQueryParam("limit", limit);
  }

  selectSort(e) {
    const setQueryParam = useQueryParam();
    const sort = e.target.value;

    this.resetPage();
    setQueryParam("sort", sort);
  }

  search(e) {
    const setQueryParam = useQueryParam();

    const $searchInput = document.getElementById("search-input");
    if (!$searchInput) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const search = e.target.value;

      setQueryParam("search", search);
    }
  }

  selectCategory(e) {
    const setQueryParam = useQueryParam();
    const { categoryList } = homeStore.getState().categories;

    const selectedCategory = e.target.dataset.category;

    const breadcrumb = findBreadcrumb(categoryList, selectedCategory);
    const newCategory1 = breadcrumb[0] || "";
    const newCategory2 = breadcrumb[1] || "";

    setQueryParam("category1", newCategory1);
    setQueryParam("category2", newCategory2);

    this.resetPage();
  }

  resetPage() {
    homeStore.setState({
      products: {
        pagination: {
          page: DEFAULT_PAGE,
        },
      },
    });
  }

  setEvent() {
    const $limitSelect = document.getElementById("limit-select");
    const $sortSelect = document.getElementById("sort-select");
    const $searchInput = document.getElementById("search-input");
    const $categoryFilterBtns = document.querySelectorAll(".category-filter-btn");

    $limitSelect.addEventListener("change", this.selectLimit);
    $sortSelect.addEventListener("change", this.selectSort);
    $searchInput.addEventListener("keydown", this.search);

    $categoryFilterBtns.forEach((btn) => {
      btn.addEventListener("click", this.selectCategory);
    });
  }

  cleanup() {
    const $limitSelect = document.getElementById("limit-select");
    const $sortSelect = document.getElementById("sort-select");
    const $searchInput = document.getElementById("search-input");
    const $categoryFilterBtns = document.querySelectorAll(".category-filter-btn");

    $limitSelect.removeEventListener("change", this.selectLimit);
    $sortSelect.removeEventListener("change", this.selectSort);
    $searchInput.removeEventListener("keydown", this.search);
    $categoryFilterBtns.forEach((btn) => {
      btn.removeEventListener("click", this.selectCategory);
    });
  }

  mounted() {
    const $categoryBreadcrumbContainer = document.getElementById("category-breadcrumb-container");

    if (!this.child.get("categoryBreadcrumb")) {
      const categoryBreadcrumbInstance = new Breadcrumb($categoryBreadcrumbContainer);
      this.addChild(categoryBreadcrumbInstance, "categoryBreadcrumb");
    } else {
      const categoryBreadcrumbInstance = this.child.get("categoryBreadcrumb");
      categoryBreadcrumbInstance.$target = $categoryBreadcrumbContainer;
      categoryBreadcrumbInstance.render();
    }
  }

  template() {
    const {
      categories: { isCategoryLoading, categoryList },
    } = homeStore.getState();

    const { limit, sort, search } = getFilter();
    const currentCategory = getCurrentCategory();

    const categoryChildren = findChildren(categoryList, currentCategory);

    return /* HTML */ ` <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            id="search-input"
            placeholder="상품명을 검색해보세요..."
            value="${search}"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">카테고리:</label>
            <div id="category-breadcrumb-container"></div>
          </div>
          <!-- 1depth 카테고리 -->
          <div class="flex flex-wrap gap-2">
            ${isCategoryLoading
              ? this.loadingTemplate()
              : categoryChildren.map((category) => CategoryItem({ category })).join("") || ""}
          </div>
          <!-- 2depth 카테고리 -->
        </div>
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select
              id="limit-select"
              class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10" ${limit == 10 ? "selected" : ""}>10개</option>
              <option value="20" ${limit == 20 ? "selected" : ""}>20개</option>
              <option value="50" ${limit == 50 ? "selected" : ""}>50개</option>
              <option value="100" ${limit == 100 ? "selected" : ""}>100개</option>
            </select>
          </div>
          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select
              id="sort-select"
              class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>
                가격 낮은순
              </option>
              <option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>
                가격 높은순
              </option>
              <option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
              <option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
            </select>
          </div>
        </div>
      </div>
    </div>`;
  }
}
