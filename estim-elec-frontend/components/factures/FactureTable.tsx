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
      <table className="min-w-full border border-zinc-200 bg-white">
        <thead>
          <tr className="bg-zinc-100 text-left">
            <th className="border-b border-zinc-200 px-3 py-2">N° Facture</th>
            <th className="border-b border-zinc-200 px-3 py-2">Chantier</th>
            <th className="border-b border-zinc-200 px-3 py-2">Client</th>
            <th className="border-b border-zinc-200 px-3 py-2">Statut</th>
            <th className="border-b border-zinc-200 px-3 py-2">Montant TTC</th>
            <th className="border-b border-zinc-200 px-3 py-2">Resté à payer</th>
            <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {factures.map((f) => (
            <tr key={f.id} className="hover:bg-zinc-50">
              <td className="border-b border-zinc-200 px-3 py-2 font-mono text-sm">{f.numero}</td>
              <td className="border-b border-zinc-200 px-3 py-2">{f.chantierNom}</td>
              <td className="border-b border-zinc-200 px-3 py-2">{f.customerNom}</td>
              <td className="border-b border-zinc-200 px-3 py-2">
                <StatutFactureBadge statut={f.statut} />
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                {formatCurrency(f.montantTotalTtc)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                {formatCurrency(f.resteAPayer)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
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
