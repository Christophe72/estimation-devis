"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteDevis, getDevis } from "@/lib/devis";
import DevisTable from "@/components/devis/DevisTable";
import type { DevisResponse } from "@/types/devis";

export default function DevisPage() {
  const [devis, setDevis] = useState<DevisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDevis() {
    setLoading(true);
    setError(null);

    try {
      const data = await getDevis();
      setDevis(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Supprimer ce devis ?");
    if (!confirmed) return;

    try {
      await deleteDevis(id);
      await loadDevis();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    }
  }

  useEffect(() => {
    void loadDevis();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Devis</h1>
        <Link
          href="/devis/new"
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

      {!loading && !error && devis.length === 0 && <p>Aucun devis trouvé.</p>}

      {!loading && !error && devis.length > 0 && (
        <DevisTable devis={devis} onDelete={handleDelete} />
      )}
    </main>
  );
}
