/**
 * 검색 및 필터 컴포넌트
 */
const OPTION_LIMITS = [10, 20, 50, 100];

export function SearchBar({ searchQuery = "", limit = 20, sort = "price_asc", category = {}, categories = {} }) {
  const categoryList = Object.keys(categories).length > 0 ? Object.keys(categories) : [];
  const options = OPTION_LIMITS.map(
    (value) => `
        <option value="${value}" ${Number(limit) === value ? "selected" : ""}>
          ${value}개
        </option>
      `,
  ).join("");

  const categoryButtons = categoryList
    .map(
      (categoryKey) => `
        <button 
          data-category1="${categoryKey}"
          class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ${categoryKey}
        </button>
      `,
    )
    .join("");

  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input type="text" 
                 id="search-input"
                 placeholder="상품명을 검색해보세요..." 
                 value="${searchQuery}"
                 class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
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
            ${["전체", category.category1, category.category2]
              .filter((cat, index) => index === 0 || Boolean(cat))
              .map((cat, index) => {
                if (cat === "전체") {
                  return `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>`;
                } else if (index === 1) {
                  return `<button data-breadcrumb="category1" data-category1="${cat}" class="text-xs hover:text-blue-800 hover:underline">${cat}</button>`;
                } else if (index === 2) {
                  return `<span class="text-xs text-gray-600 cursor-default">${cat}</span>`;
                }
              })
              .join('<span class="text-xs text-gray-500">></span>')}
          </div>
          
          <!-- 1depth 카테고리 -->
          ${
            !category.category1
              ? `
            <div class="flex flex-wrap gap-2">
              ${
                categoryList.length > 0
                  ? categoryButtons
                  : `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
              }
            </div>
          `
              : ""
          }
          
          <!-- 2depth 카테고리 -->
          ${
            category.category1 && categories[category.category1]
              ? `
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                ${Object.keys(categories[category.category1])
                  .map((category2Key) => {
                    const isSelected = category.category2 === category2Key;
                    return `
                      <button 
                        data-category1="${category.category1}"
                        data-category2="${category2Key}"
                        class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                               ${
                                 isSelected
                                   ? "bg-blue-100 border-blue-300 text-blue-800"
                                   : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                               }"
                      >
                        ${category2Key}
                      </button>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
        
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
               ${options}
            </select>
          </div>
          
          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select id="sort-select" 
                    class="text-sm border border-gray-300 rounded px-2 py-1 
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
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
