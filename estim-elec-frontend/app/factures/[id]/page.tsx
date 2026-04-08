"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getFacture } from "@/lib/factures";
import { formatCurrency } from "@/lib/format";
import StatutFactureBadge from "@/components/factures/StatutFactureBadge";
import type { FactureResponse } from "@/types/facture";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function FactureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [facture, setFacture] = useState<FactureResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFacture(Number(id));
        setFacture(data);
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
        <Link href="/factures" className="text-zinc-500 hover:underline">← Factures</Link>
        <h1 className="text-2xl font-semibold">Facture</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">{error}</div>
      )}

      {!loading && !error && !facture && <p>Facture introuvable.</p>}

      {!loading && !error && facture && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <Row label="N° Facture" value={<span className="font-mono">{facture.numero}</span>} />
            <Row label="Statut" value={<StatutFactureBadge statut={facture.statut} />} />
            <Row label="Client" value={
              <Link href={`/customers/${facture.customerId}`} className="text-blue-600 hover:underline">
                {facture.customerNom}
              </Link>
            } />
            <Row label="Chantier" value={facture.chantierNom} />
            {facture.adresse && <Row label="Adresse" value={facture.adresse} />}
            {facture.ville && <Row label="Ville" value={`${facture.ville}${facture.codePostal ? ` (${facture.codePostal})` : ""}`} />}
            <Row label="Devis source" value={
              <Link href={`/devis/${facture.devisId}`} className="text-blue-600 hover:underline">
                Devis #{facture.devisId}
              </Link>
            } />
          </div>

          <div className="flex flex-col gap-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">Montants</p>
            <Row label="Total HT" value={formatCurrency(facture.montantTotalHt)} />
            <Row label="TVA" value={formatCurrency(facture.montantTva)} />
            <Row label="Total TTC" value={<span className="font-semibold">{formatCurrency(facture.montantTotalTtc)}</span>} />
            <Row label="Déjà payé" value={<span className="text-green-700 dark:text-green-400">{formatCurrency(facture.totalPaye)}</span>} />
            <Row label="Reste à payer" value={<span className="font-semibold text-amber-700">{formatCurrency(facture.resteAPayer)}</span>} />
          </div>

          <div className="flex gap-3">
            <Link href={`/paiements?factureId=${facture.id}`}
              className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800">
              Voir les paiements
            </Link>
            <Link href={`/paiements/new`}
              className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100">
              Enregistrer un paiement
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
