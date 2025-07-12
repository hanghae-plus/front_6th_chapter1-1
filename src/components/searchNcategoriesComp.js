// 고정 값 상수 정의
const COUNT_FILTER_OPTIONS = [{ count: 10 }, { count: 20 }, { count: 50 }, { count: 100 }];
const SORT_FILTER_OPTIONS = [
  { name: "가격 낮은순", value: "price_asc" },
  { name: "가격 높은순", value: "price_desc" },
  { name: "이름순", value: "name_asc" },
  { name: "이름 역순", value: "name_desc" },
];

export const searchNcategoriesComp = (props) => {
  const isLoading = props.loading || false;
  const params = props.params || {};
  const categories = props.categories || {};
  const urlParams = props.urlParams || {};
  const depth2 = categories[urlParams.category1] || [];
  // 최초 진입 시 표시
  let array = Object.keys(categories).map((c) => c);
  const category1List = array.length ? array : [];
  // 최초 진입 시 사용
  const categoryListHtml = !isLoading
    ? category1List // categories.list에서 가져온 category1List 사용
        .map(
          (name) => /*html*/ `
        <button class="category-btn text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full" data-category1="${name}">
          ${name}
        </button>
      `,
        )
        .join("")
    : /* html*/ `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
  let breadcrumbHtml = /*html*/ ``;
  if (params.category1) {
    breadcrumbHtml += /* html */ `<span class="text-xs text-gray-500">&gt;</span>
          <button data-breadcrumb="category1" data-category1="${decodeURI(params.category1)}" class="text-xs hover:text-blue-800 hover:underline">${params.category1}</button>`;
  }

  if (params.category2) {
    breadcrumbHtml += /* html */ `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${params.category2}</span>`;
  }

  // 브레드크럼 진입 시 2depth 카테고리 HTML 생성
  const category2Html =
    Object.keys(depth2).length > 0
      ? Object.keys(depth2)
          .map(
            (subCategory) => /*html*/ `
            <button data-category1="${urlParams.category1}" data-category2="${urlParams.category2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors 
              ${urlParams.category2 === subCategory ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                ${subCategory}
            </button>
        `,
          )
          .join("")
      : "";
  // map() 이용하여 부모에서 받은 params(상태) 기반 selected 속성 동적 바인딩
  const countOptionsHtml = COUNT_FILTER_OPTIONS.map(
    (item) => /*html*/ `
    <option value="${item.count}" ${params.limit === item.count ? "selected" : ""}>
      ${item.count}개
    </option>`,
  ).join("");

  const sortOptionsHtml = SORT_FILTER_OPTIONS.map(
    (item) => /*html*/ `
    <option value="${item.value}" ${params.sort === item.value ? "selected" : ""}>
      ${item.name}
    </option>`,
  ).join("");

  return /*html*/ `
  <!-- 검색창 -->
  <div id="filterComp" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
    <div class="mb-4">
      <div class="relative">
        <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${
          params.search ? decodeURIComponent(params.search) : ""
        }" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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
          <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
          ${
            urlParams["category1"]
              ? /*html*/ `
            ${breadcrumbHtml}
            `
              : ``
          }
        </div>
        ${
          urlParams["category1"]
            ? /* html */ `<div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            ${category2Html}
          </div>
        </div>`
            : /* html */ `<div class="flex flex-wrap gap-2">
            ${categoryListHtml}
        </div>`
        }
      </div>
      <!-- 기존 필터들 -->
      <div class="flex gap-2 items-center justify-between">
        <!-- 페이지당 상품 수 -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">개수:</label>
          <select id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            ${countOptionsHtml}
          </select>
        </div>
        <!-- 정렬 -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">정렬:</label>
          <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                        focus:ring-1 focus="ring-blue-500 focus:border-blue-500">
            ${sortOptionsHtml}
          </select>
        </div>
      </div>
    </div>
  </div>
  `;
};
