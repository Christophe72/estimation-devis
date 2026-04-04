"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteEstimation, getEstimations } from "@/lib/estimations";
import { formatCurrency, formatDate } from "@/lib/format";
import type { EstimationResponse } from "@/types/estimation";

export default function EstimationsPage() {
  const [estimations, setEstimations] = useState<EstimationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEstimations() {
    setLoading(true);
    setError(null);
    try {
      const data = await getEstimations();
      setEstimations(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Supprimer cette estimation ?");
    if (!confirmed) return;
    try {
      await deleteEstimation(id);
      await loadEstimations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    }
  }

  useEffect(() => {
    void loadEstimations();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Estimations
        </h1>
        <Link
          href="/estimations/new"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          Nouvelle
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Chargement...
        </p>
      )}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && estimations.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Aucune estimation trouvée.
        </p>
      )}

      {!loading && !error && estimations.length > 0 && (
        <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-left dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Désignation
                </th>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Client ID
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                  Total HT
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                  TVA
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                  Total TTC
                </th>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  Créé le
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {estimations.map((e) => (
                <tr
                  key={e.id}
                  className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {e.designation}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {e.customerId}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                    {formatCurrency(e.totalHt)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                    {formatCurrency(e.totalTva)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(e.totalTtc)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {formatDate(e.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/estimations/${e.id}`}
                        className="text-zinc-600 hover:underline dark:text-zinc-400"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/estimations/${e.id}/edit`}
                        className="text-zinc-600 hover:underline dark:text-zinc-400"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => void handleDelete(e.id)}
                        className="text-red-600 hover:underline dark:text-red-400"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
