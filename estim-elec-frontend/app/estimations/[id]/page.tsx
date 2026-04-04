"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getEstimation } from "@/lib/estimations";
import { formatCurrency, formatDate } from "@/lib/format";
import type { EstimationResponse } from "@/types/estimation";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-40 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export default function EstimationPage() {
  const { id } = useParams<{ id: string }>();
  const [estimation, setEstimation] = useState<EstimationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEstimation(Number(id));
        setEstimation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/estimations"
          className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
        >
          ← Estimations
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Détail estimation
        </h1>
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

      {!loading && !error && !estimation && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Estimation introuvable.
        </p>
      )}

      {!loading && !error && estimation && (
        <div className="flex flex-col gap-6">
          {/* Info générales */}
          <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <Row label="Désignation" value={estimation.designation} />
            <Row label="Client ID" value={estimation.customerId.toString()} />
            {estimation.description && (
              <Row label="Description" value={estimation.description} />
            )}
            <Row label="Total HT" value={formatCurrency(estimation.totalHt)} />
            <Row label="TVA" value={formatCurrency(estimation.totalTva)} />
            <Row label="Total TTC" value={formatCurrency(estimation.totalTtc)} />
            <Row label="Créé le" value={formatDate(estimation.createdAt)} />
            <Row label="Modifié le" value={formatDate(estimation.updatedAt)} />
          </div>

          {/* Lignes */}
          <div>
            <h2 className="mb-3 text-base font-medium text-gray-900 dark:text-white">
              Lignes ({estimation.lines.length})
            </h2>

            {estimation.lines.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Aucune ligne.
              </p>
            ) : (
              <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
                <table className="min-w-full text-sm">
                  <thead className="bg-zinc-50 text-left dark:bg-zinc-800">
                    <tr>
                      <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Ord.
                      </th>
                      <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Code
                      </th>
                      <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                        Désignation
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">
                        Qté
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">
                        PU HT
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">
                        Total HT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {estimation.lines.map((line) => (
                      <tr
                        key={line.id}
                        className="bg-white dark:bg-zinc-900"
                      >
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {line.ordre}
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                          {line.ouvrageCode}
                        </td>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {line.ouvrageDesignation}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                          {line.quantite}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                          {formatCurrency(line.prixUnitaireHt)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                          {formatCurrency(line.totalHt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/estimations/${estimation.id}/edit`}
              className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              Modifier
            </Link>
            <Link
              href="/estimations"
              className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
              Retour
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
