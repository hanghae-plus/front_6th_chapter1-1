export default function Loading(message = "상품 정보를 불러오는 중...") {
  return /* HTML */ `
  <div class="max-w-md mx-auto px-4 py-4>
    <div class="py-20 bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">${message}</p>
      </div>
    </div>
  </div>`;
}
