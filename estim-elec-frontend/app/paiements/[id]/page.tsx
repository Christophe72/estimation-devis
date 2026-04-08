"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPaiement } from "@/lib/paiements";
import { formatDate, formatCurrency } from "@/lib/format";
import type { PaiementResponse } from "@/types/paiement";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function PaiementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [paiement, setPaiement] = useState<PaiementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPaiement(Number(id));
        setPaiement(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/paiements" className="text-zinc-500 hover:underline">← Paiements</Link>
        <h1 className="text-2xl font-semibold">Paiement</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">{error}</div>
      )}

      {!loading && !error && !paiement && <p>Paiement introuvable.</p>}

      {!loading && !error && paiement && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <Row label="Date de paiement" value={formatDate(paiement.datePaiement)} />
            <Row label="Montant" value={formatCurrency(paiement.montant)} />
            <Row label="Mode de paiement" value={paiement.modePaiement} />
            {paiement.reference && <Row label="Référence" value={paiement.reference} />}
            {paiement.commentaire && <Row label="Commentaire" value={paiement.commentaire} />}
            <Row label="Facture" value={
              <Link href={`/factures/${paiement.factureId}`} className="text-blue-600 hover:underline">
                {paiement.factureNumero}
              </Link>
            } />
          </div>

          <div className="flex flex-col gap-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">Suivi facture</p>
            <Row label="Total payé" value={<span className="text-green-700 dark:text-green-400">{formatCurrency(paiement.totalPayeFacture)}</span>} />
            <Row label="Reste à payer" value={<span className="font-medium text-amber-700">{formatCurrency(paiement.resteAPayerFacture)}</span>} />
            <Row label="Statut facture" value={paiement.statutFacture} />
          </div>
        </div>
      )}
    </main>
  );
}
