"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deletePaiement, getPaiements } from "@/lib/paiements";
import PaiementTable from "@/components/paiements/PaiementTable";
import type { PaiementResponse } from "@/types/paiement";

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState<PaiementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPaiements() {
    setLoading(true);
    setError(null);

    try {
      const data = await getPaiements();
      setPaiements(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Supprimer ce paiement ?");
    if (!confirmed) return;

    try {
      await deletePaiement(id);
      await loadPaiements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    }
  }

  useEffect(() => {
    void loadPaiements();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Paiements</h1>
        <Link
          href="/paiements/new"
          className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Nouveau
        </Link>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && paiements.length === 0 && <p>Aucun paiement trouvé.</p>}

      {!loading && !error && paiements.length > 0 && (
        <PaiementTable paiements={paiements} onDelete={handleDelete} />
      )}
    </main>
  );
}
