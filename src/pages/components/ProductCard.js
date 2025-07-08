export function ProductCard(product) {
  // 상품 카드 HTML 리턴
  return `
    <!-- 상품 그리드 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
                   data-product-id=${product.id}>
                <!-- 상품 이미지 -->
                <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
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
                      ${product.lprice}원
                    </p>
                  </div>
                </div>
              </div>
  `;
}
