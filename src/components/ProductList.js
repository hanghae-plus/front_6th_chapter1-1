import { ProductCard } from "./ProductCard.js";
import { productLoadingSkeleton } from "./productLoadingSkeleton.js"; // ProductLoadingSkeleton -> productLoadingSkeleton (소문자로 시작하는 함수명으로 변경)

export const ProductList = (props) => {
  // props를 인자로 받도록 변경
  // props.mainStatus에서 필요한 값들을 구조 분해 할당
  const { products, total, loading, params } = props;
  const limit = params?.limit; // params 객체 안에 limit이 있으므로 접근 방식 변경

  // 초기 로딩 판단
  const isInitialLoading = loading && products.length === 0;

  const productCardsHtml = products.map(ProductCard).join("");

  // 스켈레톤은 '초기 로딩' 상태일 때만 표시
  const skeletonHtml = isInitialLoading ? productLoadingSkeleton(limit) : "";

  // 총 상품 개수는 '초기 로딩'이 아닐 때만 표시
  const totalCountHtml = !isInitialLoading
    ? /*html*/ `
       <div class="mb-4 text-sm text-gray-600">
         총 <span class="font-medium text-gray-900">${total}개</span>의 상품
       </div>`
    : "";

  // 로딩 스피너는 'loading' 중이면서 '초기 로딩'이 아닐 때 (즉, 추가 로딩 중일 때)만 표시
  const loadingSpinnerHtml =
    loading && !isInitialLoading
      ? /*html*/ `
       <div class="text-center py-4">
         <div class="inline-flex items-center">
           <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
             <path class="opacity-75" fill="currentColor"
                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0
 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
         </div>
       </div>`
      : ``;

  return /*html*/ `
     <div class="mb-6">
       <div>
         <!-- 상품 개수 정보 -->
         ${totalCountHtml}
         <!-- 상품 그리드 -->
         <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
           ${productCardsHtml}
           ${skeletonHtml}
         </div>
         ${loadingSpinnerHtml}
       </div>
     </div>
   `;
};
