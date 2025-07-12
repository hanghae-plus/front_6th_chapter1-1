let toastTimer;
const toastTemplates = {
  success: /*html*/ `
    <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <p class="text-sm font-medium">장바구니에 추가되었습니다</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `,
  info: /*html*/ `
    <div class="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
       </svg>
      </div>
      <p class="text-sm font-medium">선택된 상품들이 삭제되었습니다</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `,
  error: /*html*/ `
    <div class="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <p class="text-sm font-medium">오류가 발생했습니다.</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `,
};

export const showToast = (msg, type = "success") => {
  const existingToast = document.querySelector("#toast-container");
  if (existingToast) {
    existingToast.remove();
    clearTimeout(toastTimer);
  }

  const toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.className = "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slide-up";

  toastContainer.innerHTML = toastTemplates[type] || toastTemplates.success;

  // message 파라미터가 제공되면 템플릿의 메시지 덮어씌우기
  if (msg) {
    const messageElement = toastContainer.querySelector("p");
    if (messageElement) {
      messageElement.textContent = msg;
    }
  }

  document.body.appendChild(toastContainer);

  const closeToast = () => {
    if (toastContainer.parentElement) {
      toastContainer.remove();
    }
    clearTimeout(toastTimer);
  };
  // 닫기 버튼에 이벤트 리스너 추가
  const closeButton = toastContainer.querySelector("#toast-close-btn");
  if (closeButton) {
    closeButton.addEventListener("click", closeToast);
  }
  // 3초 후 자동으로 사라지도록 타이머 설정
  toastTimer = setTimeout(closeToast, 3000);
};
