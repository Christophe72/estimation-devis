"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteOuvrage, getOuvrages } from "@/lib/ouvrages";
import OuvrageTable from "@/components/ouvrages/OuvrageTable";
import type { OuvrageResponse } from "@/types/ouvrage";

export default function OuvragesPage() {
  const [ouvrages, setOuvrages] = useState<OuvrageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadOuvrages() {
    setLoading(true);
    setError(null);

    try {
      const data = await getOuvrages();
      setOuvrages(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Supprimer cet ouvrage ?");
    if (!confirmed) return;

    try {
      await deleteOuvrage(id);
      await loadOuvrages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    }
  }

  useEffect(() => {
    void loadOuvrages();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ouvrages</h1>
        <Link
          href="/ouvrages/new"
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

      {!loading && !error && ouvrages.length === 0 && (
        <p>Aucun ouvrage trouvé.</p>
      )}

      {!loading && !error && ouvrages.length > 0 && (
        <OuvrageTable ouvrages={ouvrages} onDelete={handleDelete} />
      )}
    </main>
  );
}
