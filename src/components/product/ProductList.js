import { ProductCard } from "./ProductCard.js";
import { ProductSkeletonCard } from "./ProductSkeletonCard.js";
import { ProductSpinner } from "./ProductSpinner.js";

export const ProductList = (productsData) => {
  const { products, isLoading, isLoadingMore, pagination } = productsData;

  return /* html */ `
  <div class="mb-6">
    <div>
      <!-- 상품 개수 정보 -->
      ${
        isLoading
          ? ""
          : /* html */ `
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${pagination?.total || 0}개</span>의 상품
      </div>
      `
      }

      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${products.map((product) => ProductCard(product)).join("")}
        ${
          isLoading && products.length === 0
            ? Array(4)
                .fill()
                .map(() => ProductSkeletonCard())
                .join("")
            : ""
        }
      </div>

      <!-- 하단 메시지 -->
      ${
        isLoading || isLoadingMore
          ? `${ProductSpinner()}`
          : !pagination?.hasNext
            ? `
          <div class="text-center py-4 text-sm text-gray-500">
            모든 상품을 확인했습니다
          </div>
        `
            : ""
      }
    </div>
  </div>
  `;
};
