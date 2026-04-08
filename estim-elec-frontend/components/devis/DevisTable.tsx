"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import StatutDevisBadge from "@/components/devis/StatutDevisBadge";
import type { DevisResponse } from "@/types/devis";

type Props = {
  devis: DevisResponse[];
  onDelete: (id: number) => void;
};

export default function DevisTable({ devis, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <thead>
          <tr className="bg-zinc-100 text-left dark:bg-zinc-800">
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">N° Devis</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Chantier</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Client</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Statut</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Montant TTC</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devis.map((d) => (
            <tr key={d.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <td className="border-b border-zinc-200 px-3 py-2 font-mono text-sm dark:border-zinc-700">{d.numero}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{d.chantierNom}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{d.customerNom}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <StatutDevisBadge statut={d.statut} />
              </td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                {formatCurrency(d.montantTotalTtc)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <div className="flex gap-3">
                  <Link href={`/devis/${d.id}`} className="text-blue-600 hover:underline">
                    Voir
                  </Link>
                  <Link href={`/devis/${d.id}/edit`} className="text-amber-600 hover:underline">
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(d.id)}
                    className="text-red-600 hover:underline"
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
