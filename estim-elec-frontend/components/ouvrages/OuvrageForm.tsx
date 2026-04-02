"use client";

import { useState } from "react";
import type { OuvrageRequest } from "@/types/ouvrage";

type Props = {
  initialValues?: Partial<OuvrageRequest>;
  onSubmit: (payload: OuvrageRequest) => Promise<void>;
  submitLabel?: string;
};

export default function OuvrageForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  const [designation, setDesignation] = useState(initialValues.designation ?? "");
  const [prixUnitaire, setPrixUnitaire] = useState(
    initialValues.prixUnitaire?.toString() ?? "",
  );
  const [unite, setUnite] = useState(initialValues.unite ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        designation,
        prixUnitaire: parseFloat(prixUnitaire),
        unite,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="designation" className="text-sm font-medium">
          Désignation <span className="text-red-600">*</span>
        </label>
        <input
          id="designation"
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
          maxLength={255}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="prixUnitaire" className="text-sm font-medium">
          Prix unitaire
        </label>
        <input
          id="prixUnitaire"
          type="number"
          step="0.01"
          min="0"
          value={prixUnitaire}
          onChange={(e) => setPrixUnitaire(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unite" className="text-sm font-medium">
          Unité
        </label>
        <input
          id="unite"
          type="text"
          value={unite}
          onChange={(e) => setUnite(e.target.value)}
          maxLength={50}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "..." : submitLabel}
      </button>
    </form>
  );
}
