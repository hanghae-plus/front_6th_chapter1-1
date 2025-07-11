export default function page(state) {
  return `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                ${
                  state.cartNumber != 0
                    ? `
                  <span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${state.cartNumber}</span>`
                    : ""
                }
                
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${state.search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
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
                  state.category1
                    ? `
                    <span class="text-xs text-gray-500">&gt;</span>
                    <button data-breadcrumb="category1" data-category1="${state.category1}" class="text-xs hover:text-blue-800 hover:underline">${state.category1}</button>  
                  `
                    : ""
                }
                ${
                  state.category2
                    ? `
                    <span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${state.category2}</span>  
                  `
                    : ""
                }
                
              </div>
              <!-- 1depth 카테고리 -->
              
              <div class="flex flex-wrap gap-2">
                ${
                  !state.loading
                    ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
                    : `
                    ${
                      !state.category1
                        ? state.categories
                            .map(
                              (cat) => `
                                <button data-category1="${cat.category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                                  ${cat.category}
                                </button>
                              `,
                            )
                            .join("")
                        : (state.categories.find((cat) => cat.category === state.category1)?.list || [])
                            .map(
                              (cat1) => `
                                <button data-category1="${state.category1}" data-category2="${cat1.category}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                                  ${cat1.category}
                                </button>
                              `,
                            )
                            .join("")
                    }
                  `
                }
                
                
                
              </div>
              <!-- 2depth 카테고리 -->
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10" >
                    10개
                  </option>
                  <option value="20" >
                    20개
                  </option>
                  <option value="50">
                    50개
                  </option>
                  <option value="100" >
                    100개
                  </option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" selected="">가격 낮은순</option>
                  <option value="price_desc">가격 높은순</option>
                  <option value="name_asc">이름순</option>
                  <option value="name_desc">이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
        ${
          !state.loading
            ? `
          <div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              <!-- 로딩 스켈레톤 -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>
          </div>
          `
            : `
            
          <div>
            <!-- 상품 개수 정보 -->
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${state.total}개</span>의 상품
            </div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${state.products
                .map((product) => {
                  return `
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
                   data-product-id="${product.productId}">
                <!-- 상품 이미지 -->
                <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image" data-product-id="${product.productId}">
                  <img src="${product.image}"
                       alt="${product.title}"
                       class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                       loading="lazy">
                </div>
                <!-- 상품 정보 -->
                <div class="p-3">
                  <div class="cursor-pointer product-info mb-3">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      ${product.title}
                    </h3>
                    <p class="text-xs text-gray-500 mb-2">${product.brand}</p>
                    <p class="text-lg font-bold text-gray-900">
                      ${Number(product.lprice).toLocaleString("ko-KR")}원
                    </p>
                  </div>
                  <!-- 장바구니 버튼 -->
                  <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${product.productId}">
                    장바구니 담기
                  </button>
                </div>
              </div>
                `;
                })
                .join("")}
            </div>
${
  !state.hasNext
    ? `<div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>`
    : `<div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>`
}
            

            
          </div>
          `
        }
        </div>
      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
  `;
}
