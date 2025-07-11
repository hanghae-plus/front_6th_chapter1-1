export class SearchFilter {
  constructor(container) {
    this.container = container;
    this.searchQuery = "";
    this.onFilterChange = null;
  }

  async init(searchQuery = "", onFilterChange = null) {
    this.searchQuery = searchQuery;
    this.onFilterChange = onFilterChange;

    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="mb-4">
        <div class="relative">
          <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${this.searchQuery}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const searchInput = this.container.querySelector("#search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const searchValue = e.target.value.trim();
          this.searchQuery = searchValue;
          this.onFilterChange?.({ search: searchValue });
        }
      });
    }
  }

  updateValues(searchQuery) {
    this.searchQuery = searchQuery;
    this.render();
    this.setupEventListeners();
  }

  destroy() {}
}
