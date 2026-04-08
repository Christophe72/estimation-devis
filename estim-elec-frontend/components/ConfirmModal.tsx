"use client";

type Props = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title = "Confirmer",
  message,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
