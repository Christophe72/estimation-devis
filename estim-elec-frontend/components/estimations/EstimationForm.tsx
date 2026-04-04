"use client";

import { useState } from "react";
import type { EstimationLineRequest, EstimationRequest } from "@/types/estimation";

// Line state keeps all values as strings for controlled inputs,
// then parses them to numbers on submit.
type LineState = {
  ouvrageId: string;
  quantite: string;
  ordre: string;
};

type Props = {
  initialValues?: {
    designation?: string;
    customerId?: number;
    description?: string | null;
    lines?: EstimationLineRequest[];
  };
  onSubmit: (payload: EstimationRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

function lineToState(l: EstimationLineRequest): LineState {
  return {
    ouvrageId: l.ouvrageId.toString(),
    quantite: l.quantite.toString(),
    ordre: l.ordre.toString(),
  };
}

function emptyLine(ordre: number): LineState {
  return { ouvrageId: "", quantite: "1", ordre: ordre.toString() };
}

export default function EstimationForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
}: Props) {
  const [designation, setDesignation] = useState(
    initialValues.designation ?? "",
  );
  const [customerId, setCustomerId] = useState(
    initialValues.customerId?.toString() ?? "",
  );
  const [description, setDescription] = useState(
    initialValues.description ?? "",
  );
  const [lines, setLines] = useState<LineState[]>(
    initialValues.lines?.map(lineToState) ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Line helpers ──────────────────────────────────────────────────────────

  function addLine() {
    setLines((prev) => [...prev, emptyLine(prev.length + 1)]);
  }

  function removeLine(index: number) {
    setLines((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((l, i) => ({ ...l, ordre: (i + 1).toString() })),
    );
  }

  function updateLine(
    index: number,
    field: keyof LineState,
    value: string,
  ) {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    );
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedCustomerId = parseInt(customerId, 10);
    if (!customerId || isNaN(parsedCustomerId)) {
      setError("L'identifiant client est requis et doit être un nombre.");
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (!l.ouvrageId || isNaN(parseInt(l.ouvrageId, 10))) {
        setError(`Ligne ${i + 1} : l'identifiant ouvrage est requis.`);
        return;
      }
      if (!l.quantite || isNaN(parseFloat(l.quantite)) || parseFloat(l.quantite) <= 0) {
        setError(`Ligne ${i + 1} : la quantité doit être un nombre positif.`);
        return;
      }
    }

    const payload: EstimationRequest = {
      designation,
      customerId: parsedCustomerId,
      description: description.trim() !== "" ? description.trim() : null,
      lines: lines.map((l, i) => ({
        ouvrageId: parseInt(l.ouvrageId, 10),
        quantite: parseFloat(l.quantite),
        ordre: parseInt(l.ordre, 10) || i + 1,
      })),
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-6">
      {/* Error */}
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Main fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="designation" className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Désignation <span className="text-red-600">*</span>
          </label>
          <input
            id="designation"
            type="text"
            required
            maxLength={255}
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="customerId" className="text-sm font-medium text-gray-800 dark:text-gray-200">
            ID Client <span className="text-red-600">*</span>
          </label>
          <input
            id="customerId"
            type="number"
            required
            min={1}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={1000}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      {/* Lines */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900 dark:text-white">
            Lignes ({lines.length})
          </h2>
          <button
            type="button"
            onClick={addLine}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            + Ajouter une ligne
          </button>
        </div>

        {lines.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Aucune ligne. Cliquez sur « Ajouter une ligne » pour commencer.
          </p>
        )}

        {lines.length > 0 && (
          <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50 text-left dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    Ordre
                  </th>
                  <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    ID Ouvrage <span className="text-red-500">*</span>
                  </th>
                  <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    Quantité <span className="text-red-500">*</span>
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {lines.map((line, i) => (
                  <tr key={i} className="bg-white dark:bg-zinc-900">
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        value={line.ordre}
                        onChange={(e) => updateLine(i, "ordre", e.target.value)}
                        className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        required
                        value={line.ouvrageId}
                        onChange={(e) =>
                          updateLine(i, "ouvrageId", e.target.value)
                        }
                        className="w-24 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        required
                        value={line.quantite}
                        onChange={(e) =>
                          updateLine(i, "quantite", e.target.value)
                        }
                        className="w-24 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          {loading ? "..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-800"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
