"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import StatutFactureBadge from "@/components/factures/StatutFactureBadge";
import type { FactureResponse } from "@/types/facture";

type Props = {
  factures: FactureResponse[];
};

export default function FactureTable({ factures }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <thead>
          <tr className="bg-zinc-100 text-left dark:bg-zinc-800">
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">N° Facture</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Chantier</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Client</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Statut</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Montant TTC</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Resté à payer</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {factures.map((f) => (
            <tr key={f.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <td className="border-b border-zinc-200 px-3 py-2 font-mono text-sm dark:border-zinc-700">{f.numero}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{f.chantierNom}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{f.customerNom}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <StatutFactureBadge statut={f.statut} />
              </td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                {formatCurrency(f.montantTotalTtc)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                {formatCurrency(f.resteAPayer)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <Link href={`/factures/${f.id}`} className="text-blue-600 hover:underline">
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
