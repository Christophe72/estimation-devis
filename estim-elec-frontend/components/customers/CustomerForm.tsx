"use client";

import { useState } from "react";
import type { CustomerRequest } from "@/types/customer";

type Props = {
  initialValues?: Partial<CustomerRequest>;
  onSubmit: (payload: CustomerRequest) => Promise<void>;
  submitLabel?: string;
};

const inputCls =
  "rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";

export default function CustomerForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  const [nom, setNom] = useState(initialValues.nom ?? "");
  const [email, setEmail] = useState(initialValues.email ?? "");
  const [telephone, setTelephone] = useState(initialValues.telephone ?? "");
  const [adresse, setAdresse] = useState(initialValues.adresse ?? "");
  const [ville, setVille] = useState(initialValues.ville ?? "");
  const [codePostal, setCodePostal] = useState(initialValues.codePostal ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ nom, email, telephone, adresse, ville, codePostal });
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
        <label htmlFor="nom" className="text-sm font-medium">
          Nom <span className="text-red-600">*</span>
        </label>
        <input
          id="nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          maxLength={255}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="telephone" className="text-sm font-medium">
          Téléphone <span className="text-red-600">*</span>
        </label>
        <input
          id="telephone"
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
          maxLength={50}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="adresse" className="text-sm font-medium">
          Adresse <span className="text-red-600">*</span>
        </label>
        <input
          id="adresse"
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
          maxLength={255}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="ville" className="text-sm font-medium">
            Ville <span className="text-red-600">*</span>
          </label>
          <input
            id="ville"
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            required
            maxLength={100}
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="codePostal" className="text-sm font-medium">
            Code postal <span className="text-red-600">*</span>
          </label>
          <input
            id="codePostal"
            type="text"
            value={codePostal}
            onChange={(e) => setCodePostal(e.target.value)}
            required
            maxLength={10}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Enregistrement…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
