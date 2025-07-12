import { Toast } from "../shared/components/Toast.js";

let toastIdCounter = 0;

const createToast = (message, type, duration) => {
  const toastId = `toast-${++toastIdCounter}`;
  const toastElement = Toast.create({ message, type });

  toastElement.id = toastId;

  if (duration > 0) {
    setTimeout(() => toastElement.remove(), duration);
  }

  return toastElement;
};

const showToast = (message, type = "info", duration = 3000) => {
  const container = Toast.getContainer();

  const existingToasts = container.querySelectorAll('[id^="toast-"]');
  existingToasts.forEach((toast) => {
    const messageElement = toast.querySelector("p");
    if (messageElement && messageElement.textContent === message) {
      toast.remove();
    }
  });

  const toast = createToast(message, type, duration);
  container.appendChild(toast);
};

export const showSuccessToast = (message, duration = 3000) => showToast(message, "success", duration);

export const showErrorToast = (message, duration = 3000) => showToast(message, "error", duration);

export const showInfoToast = (message, duration = 3000) => showToast(message, "info", duration);
