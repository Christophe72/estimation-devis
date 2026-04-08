"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOuvrage } from "@/lib/ouvrages";
import type { OuvrageResponse } from "@/types/ouvrage";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-36 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function OuvragePage() {
  const { id } = useParams<{ id: string }>();
  const [ouvrage, setOuvrage] = useState<OuvrageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOuvrage(Number(id));
        setOuvrage(data);
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
        <Link href="/ouvrages" className="text-zinc-500 hover:underline">
          ← Ouvrages
        </Link>
        <h1 className="text-2xl font-semibold">Ouvrage</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && !ouvrage && <p>Ouvrage introuvable.</p>}

      {!loading && !error && ouvrage && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <Row label="Code" value={ouvrage.code} />
            <Row label="Désignation" value={ouvrage.designation} />
            <Row label="Catégorie" value={ouvrage.categorie} />
            <Row label="Unité" value={ouvrage.unite} />
            <Row label="Temps pose (heure)" value={ouvrage.tempsPoseHeure.toString()} />
            <Row label="Actif" value={ouvrage.actif ? "Oui" : "Non"} />
            {ouvrage.description && (
              <Row label="Description" value={ouvrage.description} />
            )}
          </div>
          <div>
            <Link
              href={`/ouvrages/${ouvrage.id}/edit`}
              className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              Modifier
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
