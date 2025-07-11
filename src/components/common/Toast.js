export const Toast = ({ type = "info", message = "" } = {}) => {
  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>`,
  };

  const colors = {
    success: "bg-green-600",
    info: "bg-blue-600",
    error: "bg-red-600",
  };

  return `
    <div class="${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        ${icons[type]}
      </div>
      <p class="text-sm font-medium">${message}</p>
      <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
};

export const ToastContainer = () => `
  <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
  </div>
`;

// 토스트 표시 함수
export const showToast = (message, type = "info") => {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toastElement = document.createElement("div");
  toastElement.innerHTML = Toast({ type, message });
  toastElement.className = "toast-item";

  container.appendChild(toastElement);

  // 닫기 버튼 이벤트
  const closeBtn = toastElement.querySelector(".toast-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      toastElement.remove();
    });
  }

  // 3초 후 자동 제거
  setTimeout(() => {
    if (toastElement.parentNode) {
      toastElement.remove();
    }
  }, 3000);
};

// 초기화 함수
export const initToastContainer = () => {
  if (!document.getElementById("toast-container")) {
    const container = document.createElement("div");
    container.innerHTML = ToastContainer();
    document.body.appendChild(container.firstElementChild);
  }
};
