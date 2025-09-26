import { ProductCard, ProductCardSkeleton } from "./ProductCard";

const loadingSkeleton = Array(6).fill(0).map(ProductCardSkeleton).join("");

/**
 * 상품 목록 컴포넌트
 */
export function ProductList({ products = [], loading = false, error = null, totalCount = 0, hasMore = true }) {
  // 에러 상태
  if (error) {
    return `
      <div class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
        <p class="text-gray-600 mb-4">${error}</p>
        <button id="retry-btn" 
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          다시 시도
        </button>
      </div>
    `;
  }

  // 빈 상태 (검색 결과 없음)
  if (!loading && products.length === 0) {
    return `
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">상품을 찾을 수 없습니다</h3>
        <p class="text-gray-600">다른 검색어를 시도해보세요.</p>
      </div>
    `;
  }

  return `
    <div>
      <!-- 상품 개수 정보 -->
      ${
        totalCount > 0
          ? `
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${totalCount.toLocaleString()}개</span>의 상품
        </div>
      `
          : ""
      }
      
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${products.map((product) => ProductCard(product)).join("")}
        
        <!-- 로딩 스켈레톤 -->
        ${loading ? loadingSkeleton : ""}
      </div>
      
      <!-- 무한 스크롤 로딩 -->
      ${
        loading && products.length > 0
          ? `
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
      `
          : ""
      }
      
      <!-- 더 이상 로드할 상품이 없음 -->
      ${
        !hasMore && products.length > 0 && !loading
          ? `
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      `
          : ""
      }
      
      <!-- 무한 스크롤 트리거 -->
      <div id="scroll-trigger" class="h-4"></div>
    </div>
  `;
}
