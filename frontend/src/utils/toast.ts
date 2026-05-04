type ToastType = "success" | "error";

export const showToast = (message: string, type: ToastType) => {
  const toast = document.createElement("div");

  toast.innerText = message;

  toast.className = `
    fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
    text-white
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};