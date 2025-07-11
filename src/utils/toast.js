import { html } from "./html";

const TOAST_CONTAINER_SELECTOR = ".toast-container";

toast.info = (message) => {
  return toast("info", message);
};

toast.success = (message) => {
  return toast("success", message);
};

toast.error = (message) => {
  return toast("error", message);
};

function getToastStyle(type) {
  return {
    info: { style: "bg-blue-600" },
    success: { style: "bg-green-600" },
    error: { style: "bg-red-600" },
  }[type];
}

export function toast(type, message, delay = 3_000) {
  clearToast();

  const { style } = getToastStyle(type);

  let toastContainer = document.querySelector(TOAST_CONTAINER_SELECTOR);
  let abortController = null;
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${TOAST_CONTAINER_SELECTOR.slice(1)}`;
    abortController = new AbortController();
    toastContainer.addEventListener(
      "click",
      (e) => {
        const { target } = e;
        const toastCloseBtn = target.closest("#toast-close-btn");
        if (toastCloseBtn) {
          const toastId = toastCloseBtn.dataset.toastId;
          removeToast(toastId, timer, abortController);
        }
      },
      abortController,
    );
  }

  const toastId = crypto.randomUUID();
  const timer = setTimeout(() => {
    removeToast(toastId, timer, abortController);
  }, delay);

  toastContainer.innerHTML += html`<div
    id=${toastId}
    class="${style} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm"
  >
    <div class="flex-shrink-0">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <p class="text-sm font-medium">${message}</p>
    <button id="toast-close-btn" data-toast-id="${toastId}" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div> `;

  insertBefore(toastContainer);

  return () => {
    if (timer) {
      removeToast(toastId, timer, abortController);
    }
  };
}

function clearToast() {
  const $toastContainer = document.querySelector(TOAST_CONTAINER_SELECTOR);
  if ($toastContainer) {
    $toastContainer.remove();
  }
}

function removeToast(toastId, timer, abortController) {
  const $toastContainer = document.querySelector(TOAST_CONTAINER_SELECTOR);
  const $toast = document.getElementById(toastId);
  $toast?.remove();

  if ($toastContainer?.childElementCount === 0) {
    $toastContainer?.remove();
    abortController?.abort();
  }

  clearTimeout?.(timer);
}

function insertBefore(newElement, targetSelector = "footer") {
  const $targetElement = document.querySelector(targetSelector);
  const $parentElement = $targetElement.parentNode;
  $parentElement.insertBefore(newElement, $targetElement);
}
