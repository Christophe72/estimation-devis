"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDevisById } from "@/lib/devis";
import { convertFromDevis } from "@/lib/factures";
import { formatCurrency } from "@/lib/format";
import StatutDevisBadge from "@/components/devis/StatutDevisBadge";
import type { DevisResponse } from "@/types/devis";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function DevisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [devis, setDevis] = useState<DevisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDevisById(Number(id));
        setDevis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  async function handleConvertir() {
    if (!window.confirm("Convertir ce devis en facture ?")) return;
    setConverting(true);
    try {
      const facture = await convertFromDevis(Number(id));
      if (facture) router.push(`/factures/${facture.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la conversion.");
    } finally {
      setConverting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/devis" className="text-zinc-500 hover:underline">← Devis</Link>
        <h1 className="text-2xl font-semibold">Devis</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">{error}</div>
      )}

      {!loading && !error && !devis && <p>Devis introuvable.</p>}

      {!loading && !error && devis && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <Row label="N° Devis" value={<span className="font-mono">{devis.numero}</span>} />
            <Row label="Statut" value={<StatutDevisBadge statut={devis.statut} />} />
            <Row label="Client" value={
              <Link href={`/customers/${devis.customerId}`} className="text-blue-600 hover:underline">
                {devis.customerNom}
              </Link>
            } />
            <Row label="Chantier" value={devis.chantierNom} />
            <Row label="Type de chantier" value={devis.typeChantier} />
            {devis.adresse && <Row label="Adresse" value={devis.adresse} />}
            {devis.ville && <Row label="Ville" value={`${devis.ville}${devis.codePostal ? ` (${devis.codePostal})` : ""}`} />}
          </div>

          <div className="flex flex-col gap-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">Montants</p>
            <Row label="Matériel HT" value={formatCurrency(devis.montantMaterielHt)} />
            <Row label="Main d'œuvre HT" value={formatCurrency(devis.montantMainOeuvreHt)} />
            <Row label="Frais généraux HT" value={formatCurrency(devis.montantFraisGenerauxHt)} />
            <Row label="Marge HT" value={formatCurrency(devis.montantMargeHt)} />
            <Row label="Total HT" value={<span className="font-medium">{formatCurrency(devis.montantTotalHt)}</span>} />
            <Row label="TVA ({devis.tauxTva} %)" value={formatCurrency(devis.montantTva)} />
            <Row label="Total TTC" value={<span className="font-semibold text-base">{formatCurrency(devis.montantTotalTtc)}</span>} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href={`/devis/${devis.id}/edit`}
              className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100">
              Modifier
            </Link>
            {devis.statut === "ACCEPTE" && (
              <button type="button" onClick={handleConvertir} disabled={converting}
                className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50">
                {converting ? "Conversion..." : "Convertir en facture"}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
