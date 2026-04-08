"use client";

import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import StatutEstimationBadge from "@/components/estimations/StatutEstimationBadge";
import type { EstimationResponse } from "@/types/estimation";

type Props = {
  estimations: EstimationResponse[];
  onDeleteRequest: (id: number) => void;
};

export default function EstimationTable({ estimations, onDeleteRequest }: Props) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-left dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
              Désignation
            </th>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
              Client
            </th>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
              Statut
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
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {e.customerNom}
              </td>
              <td className="px-4 py-3">
                <StatutEstimationBadge statut={e.statut} />
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(e.totalTtc)}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {formatDate(e.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/estimations/${e.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/estimations/${e.id}/edit`}
                    className="text-amber-600 hover:underline dark:text-amber-400"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteRequest(e.id)}
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
  );
}
