"use client";

import { useToast } from "@/context/ToastContext";

const TYPE_STYLES = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${TYPE_STYLES[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ml-1 opacity-70 hover:opacity-100"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
