export const SortFilter = (limit, sort) => {
  return /* html */ `
      <div class="flex gap-2 items-center justify-between">
        <!-- 페이지당 상품 수 -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">개수:</label>
          <select id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <option value="10" ${limit === "10" ? "selected" : ""}>10개</option>
            <option value="20" ${limit === "20" ? "selected" : ""}>20개</option>
            <option value="50" ${limit === "50" ? "selected" : ""}>50개</option>
            <option value="100" ${limit === "100" ? "selected" : ""}>100개</option>
          </select>
        </div>
        
        <!-- 정렬 -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">정렬:</label>
          <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                       focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
            <option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
            <option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
            <option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
          </select>
        </div>
      </div>
    `;
};
