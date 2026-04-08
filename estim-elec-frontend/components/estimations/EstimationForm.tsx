"use client";

import { useEffect, useState } from "react";
import NumericInput from "@/components/NumericInput";
import { ApiError } from "@/lib/api";
import { getCustomers } from "@/lib/customers";
import { getOuvrages } from "@/lib/ouvrages";
import type { CustomerResponse } from "@/types/customer";
import type { EstimationLineRequest, EstimationRequest } from "@/types/estimation";
import type { OuvrageResponse } from "@/types/ouvrage";

type LineState = {
  ouvrageId: string;
  quantite: string;
  prixUnitaireHt: string;
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

function lineToState(line: EstimationLineRequest): LineState {
  return {
    ouvrageId: String(line.ouvrageId),
    quantite: String(line.quantite),
    prixUnitaireHt: String(line.prixUnitaireHt),
    ordre: String(line.ordre),
  };
}

function emptyLine(ordre: number): LineState {
  return {
    ouvrageId: "",
    quantite: "1",
    prixUnitaireHt: "",
    ordre: String(ordre),
  };
}

function parseDecimal(value: string): number {
  return parseFloat(value.replace(",", "."));
}

export default function EstimationForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
}: Props) {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [ouvrages, setOuvrages] = useState<OuvrageResponse[]>([]);
  const [designation, setDesignation] = useState(initialValues.designation ?? "");
  const [customerId, setCustomerId] = useState(
    initialValues.customerId != null ? String(initialValues.customerId) : "",
  );
  const [description, setDescription] = useState(initialValues.description ?? "");
  const [lines, setLines] = useState<LineState[]>(
    initialValues.lines?.map(lineToState) ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadOptions() {
      try {
        const [customerData, ouvrageData] = await Promise.all([
          getCustomers(),
          getOuvrages(),
        ]);

        setCustomers(customerData ?? []);
        setOuvrages(ouvrageData ?? []);
      } catch {
        // Les selects restent vides si le chargement échoue.
      }
    }

    void loadOptions();
  }, []);

  function getFieldError(field: string): string | null {
    return validationErrors[field] ?? null;
  }

  function getLineFieldError(
    index: number,
    field: "ouvrageId" | "quantite" | "prixUnitaireHt" | "ordre",
  ): string | null {
    const keys = [
      `lines[${index}].${field}`,
      `lines.${index}.${field}`,
      `lines[${index}][${field}]`,
    ];

    for (const key of keys) {
      if (validationErrors[key]) {
        return validationErrors[key];
      }
    }

    return null;
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine(prev.length + 1)]);
  }

  function removeLine(index: number) {
    setLines((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((line, i) => ({ ...line, ordre: String(i + 1) })),
    );
  }

  function updateLine(index: number, field: keyof LineState, value: string) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const trimmedDesignation = designation.trim();
    if (!trimmedDesignation) {
      setError("La désignation est obligatoire.");
      return;
    }

    const parsedCustomerId = parseInt(customerId, 10);
    if (!customerId || Number.isNaN(parsedCustomerId) || parsedCustomerId <= 0) {
      setError("Le client est requis.");
      return;
    }

    if (lines.length === 0) {
      setError("L'estimation doit contenir au moins une ligne.");
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parsedOuvrageId = parseInt(line.ouvrageId, 10);
      const parsedQuantite = parseDecimal(line.quantite);
      const parsedPrixUnitaireHt = parseDecimal(line.prixUnitaireHt);
      const parsedOrdre = parseInt(line.ordre, 10);

      if (!line.ouvrageId || Number.isNaN(parsedOuvrageId) || parsedOuvrageId <= 0) {
        setError(`Ligne ${i + 1} : l'ouvrage est requis.`);
        return;
      }

      if (!line.quantite || Number.isNaN(parsedQuantite) || parsedQuantite <= 0) {
        setError(`Ligne ${i + 1} : la quantité doit être un nombre positif.`);
        return;
      }

      if (
        !line.prixUnitaireHt ||
        Number.isNaN(parsedPrixUnitaireHt) ||
        parsedPrixUnitaireHt < 0
      ) {
        setError(`Ligne ${i + 1} : le prix unitaire HT est requis.`);
        return;
      }

      if (!line.ordre || Number.isNaN(parsedOrdre) || parsedOrdre <= 0) {
        setError(`Ligne ${i + 1} : l'ordre doit être un nombre positif.`);
        return;
      }
    }

    const payload: EstimationRequest = {
      designation: trimmedDesignation,
      customerId: parsedCustomerId,
      description: description.trim() !== "" ? description.trim() : null,
      lines: lines.map((line, index) => ({
        ouvrageId: parseInt(line.ouvrageId, 10),
        quantite: parseDecimal(line.quantite),
        prixUnitaireHt: parseDecimal(line.prixUnitaireHt),
        ordre: parseInt(line.ordre, 10) || index + 1,
      })),
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setValidationErrors(err.validationErrors ?? {});
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          <p className="mb-1 font-medium">Détails de validation :</p>
          <ul className="list-disc pl-5">
            {Object.entries(validationErrors).map(([key, message]) => (
              <li key={key}>
                {key}: {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="designation"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          >
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
          {getFieldError("designation") && (
            <p className="text-sm text-red-700 dark:text-red-400">
              {getFieldError("designation")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="customerId"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          >
            Client <span className="text-red-600">*</span>
          </label>
          <select
            id="customerId"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">-- Selectionner un client --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.nom}
              </option>
            ))}
          </select>
          {getFieldError("customerId") && (
            <p className="text-sm text-red-700 dark:text-red-400">
              {getFieldError("customerId")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
          {getFieldError("description") && (
            <p className="text-sm text-red-700 dark:text-red-400">
              {getFieldError("description")}
            </p>
          )}
        </div>
      </div>

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
                    Ouvrage <span className="text-red-500">*</span>
                  </th>
                  <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    Quantité <span className="text-red-500">*</span>
                  </th>
                  <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    Prix unitaire HT <span className="text-red-500">*</span>
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {lines.map((line, index) => (
                  <tr key={index} className="bg-white dark:bg-zinc-900">
                    <td className="px-3 py-2">
                      <NumericInput
                        min={1}
                        value={line.ordre}
                        onChange={(value) => updateLine(index, "ordre", value)}
                        size="compact"
                        wrapperClassName="justify-center"
                        buttonClassName="h-7 w-7"
                        className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      />
                      {getLineFieldError(index, "ordre") && (
                        <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                          {getLineFieldError(index, "ordre")}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        required
                        value={line.ouvrageId}
                        onChange={(e) => updateLine(index, "ouvrageId", e.target.value)}
                        className="min-w-64 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="">-- Selectionner un ouvrage --</option>
                        {ouvrages.map((ouvrage) => (
                          <option key={ouvrage.id} value={ouvrage.id}>
                            {ouvrage.code} - {ouvrage.designation}
                            {ouvrage.actif === false ? " (inactif)" : ""}
                          </option>
                        ))}
                      </select>
                      {getLineFieldError(index, "ouvrageId") && (
                        <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                          {getLineFieldError(index, "ouvrageId")}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <NumericInput
                        min={1}
                        step={1}
                        required
                        value={line.quantite}
                        onChange={(value) => updateLine(index, "quantite", value)}
                        size="compact"
                        buttonClassName="h-7 w-7"
                        className="w-24 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      />
                      {getLineFieldError(index, "quantite") && (
                        <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                          {getLineFieldError(index, "quantite")}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <NumericInput
                        min={0}
                        step={0.01}
                        required
                        value={line.prixUnitaireHt}
                        onChange={(value) => updateLine(index, "prixUnitaireHt", value)}
                        size="compact"
                        buttonClassName="h-7 w-7"
                        className="w-28 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      />
                      {getLineFieldError(index, "prixUnitaireHt") && (
                        <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                          {getLineFieldError(index, "prixUnitaireHt")}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
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