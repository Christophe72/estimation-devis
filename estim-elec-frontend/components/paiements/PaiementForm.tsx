"use client";

import { useEffect, useState } from "react";
import { getFactures } from "@/lib/factures";
import type { FactureResponse } from "@/types/facture";
import type { PaiementRequest } from "@/types/paiement";

type Props = {
  initialValues?: Partial<PaiementRequest>;
  onSubmit: (payload: PaiementRequest) => Promise<void>;
  submitLabel?: string;
};

const MODES_PAIEMENT = ["ESPECES", "VIREMENT", "CARTE", "CHEQUE", "AUTRE"];
const inputCls = "rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";

export default function PaiementForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  const [factureId, setFactureId] = useState(initialValues.factureId?.toString() ?? "");
  const [montant, setMontant] = useState(initialValues.montant?.toString() ?? "");
  const [datePaiement, setDatePaiement] = useState(initialValues.datePaiement ?? "");
  const [modePaiement, setModePaiement] = useState(initialValues.modePaiement ?? "VIREMENT");
  const [reference, setReference] = useState(initialValues.reference ?? "");
  const [commentaire, setCommentaire] = useState(initialValues.commentaire ?? "");
  const [factures, setFactures] = useState<FactureResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFactures() {
      try {
        const data = await getFactures();
        setFactures(data ?? []);
      } catch {
        // le select restera vide
      }
    }
    void loadFactures();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        factureId: Number(factureId),
        montant: parseFloat(montant),
        datePaiement,
        modePaiement,
        reference: reference || undefined,
        commentaire: commentaire || undefined,
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
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="factureId" className="text-sm font-medium">
          Facture <span className="text-red-600">*</span>
        </label>
        <select id="factureId" value={factureId}
          onChange={(e) => setFactureId(e.target.value)} required className={inputCls}>
          <option value="">— Sélectionner une facture —</option>
          {factures.map((f) => (
            <option key={f.id} value={f.id}>{f.numero}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="montant" className="text-sm font-medium">
          Montant <span className="text-red-600">*</span>
        </label>
        <input id="montant" type="number" step="0.01" min="0.01" value={montant}
          onChange={(e) => setMontant(e.target.value)} required className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="datePaiement" className="text-sm font-medium">
          Date de paiement <span className="text-red-600">*</span>
        </label>
        <input id="datePaiement" type="date" value={datePaiement}
          onChange={(e) => setDatePaiement(e.target.value)} required className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="modePaiement" className="text-sm font-medium">
          Mode de paiement <span className="text-red-600">*</span>
        </label>
        <select id="modePaiement" value={modePaiement}
          onChange={(e) => setModePaiement(e.target.value)} required className={inputCls}>
          {MODES_PAIEMENT.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reference" className="text-sm font-medium">Référence</label>
        <input id="reference" value={reference} onChange={(e) => setReference(e.target.value)}
          maxLength={100} className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="commentaire" className="text-sm font-medium">Commentaire</label>
        <textarea id="commentaire" value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)} maxLength={500} rows={3}
          className={inputCls} />
      </div>

      <button type="submit" disabled={loading}
        className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50">
        {loading ? "..." : submitLabel}
      </button>
    </form>
  );
}
