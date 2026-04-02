"use client";

import { useEffect, useState } from "react";
import { getFactures } from "@/lib/factures";
import FactureTable from "@/components/factures/FactureTable";
import type { FactureResponse } from "@/types/facture";

export default function FacturesPage() {
  const [factures, setFactures] = useState<FactureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFactures() {
      setLoading(true);
      setError(null);
      try {
        const data = await getFactures();
        setFactures(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void loadFactures();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Factures</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Les factures sont générées depuis les devis (statut ACCEPTÉ → Convertir en facture).
        </p>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {!loading && !error && factures.length === 0 && <p>Aucune facture trouvée.</p>}

      {!loading && !error && factures.length > 0 && (
        <FactureTable factures={factures} />
      )}
    </main>
  );
}
