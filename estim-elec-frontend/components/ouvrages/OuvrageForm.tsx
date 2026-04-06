"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
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
  const [code, setCode] = useState(initialValues.code ?? "");
  const [designation, setDesignation] = useState(initialValues.designation ?? "");
  const [categorie, setCategorie] = useState(initialValues.categorie ?? "");
  const [unite, setUnite] = useState(initialValues.unite ?? "");
  const [tempsPoseHeure, setTempsPoseHeure] = useState(
    initialValues.tempsPoseHeure?.toString() ?? "",
  );
  const [description, setDescription] = useState(initialValues.description ?? "");
  const [actif, setActif] = useState(initialValues.actif ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const normalizedTempsPoseHeure = tempsPoseHeure.replace(",", ".").trim();
    const parsedTempsPoseHeure = Number.parseFloat(normalizedTempsPoseHeure);

    if (!code.trim() || !designation.trim() || !categorie.trim() || !unite.trim()) {
      setError("Veuillez remplir les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (Number.isNaN(parsedTempsPoseHeure)) {
      setError("Le temps de pose doit être un nombre valide.");
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        code: code.trim(),
        designation: designation.trim(),
        categorie: categorie.trim(),
        unite: unite.trim(),
        tempsPoseHeure: parsedTempsPoseHeure,
        description: description.trim() === "" ? null : description.trim(),
        actif,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.validationErrors ?? {});
      } else {
        setError(err instanceof Error ? err.message : "Erreur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="code" className="text-sm font-medium">
          Code <span className="text-red-600">*</span>
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={100}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {fieldErrors.code && <p className="text-sm text-red-700">{fieldErrors.code}</p>}
      </div>

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
        {fieldErrors.designation && (
          <p className="text-sm text-red-700">{fieldErrors.designation}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categorie" className="text-sm font-medium">
          Catégorie <span className="text-red-600">*</span>
        </label>
        <input
          id="categorie"
          type="text"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
          maxLength={100}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {fieldErrors.categorie && (
          <p className="text-sm text-red-700">{fieldErrors.categorie}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unite" className="text-sm font-medium">
          Unité <span className="text-red-600">*</span>
        </label>
        <input
          id="unite"
          type="text"
          value={unite}
          onChange={(e) => setUnite(e.target.value)}
          required
          maxLength={50}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {fieldErrors.unite && <p className="text-sm text-red-700">{fieldErrors.unite}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tempsPoseHeure" className="text-sm font-medium">
          Temps pose (heure) <span className="text-red-600">*</span>
        </label>
        <input
          id="tempsPoseHeure"
          type="text"
          value={tempsPoseHeure}
          onChange={(e) => setTempsPoseHeure(e.target.value)}
          placeholder="Ex: 1,5"
          required
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {fieldErrors.tempsPoseHeure && (
          <p className="text-sm text-red-700">{fieldErrors.tempsPoseHeure}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {fieldErrors.description && (
          <p className="text-sm text-red-700">{fieldErrors.description}</p>
        )}
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={actif}
          onChange={(e) => setActif(e.target.checked)}
          className="h-4 w-4"
        />
        Actif
      </label>
      {fieldErrors.actif && <p className="text-sm text-red-700">{fieldErrors.actif}</p>}

      {fieldErrors.global && <p className="text-sm text-red-700">{fieldErrors.global}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "..." : submitLabel}
      </button>

      {Object.keys(fieldErrors).length > 0 && (
        <p className="text-xs text-zinc-500">Veuillez corriger les champs signalés.</p>
      )}
    </form>
  );
}
