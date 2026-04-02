"use client";

import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/format";
import type { PaiementResponse } from "@/types/paiement";

type Props = {
  paiements: PaiementResponse[];
  onDelete: (id: number) => void;
};

export default function PaiementTable({ paiements, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-zinc-200 bg-white">
        <thead>
          <tr className="bg-zinc-100 text-left">
            <th className="border-b border-zinc-200 px-3 py-2">Date</th>
            <th className="border-b border-zinc-200 px-3 py-2">Facture</th>
            <th className="border-b border-zinc-200 px-3 py-2">Montant</th>
            <th className="border-b border-zinc-200 px-3 py-2">Mode</th>
            <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map((p) => (
            <tr key={p.id} className="hover:bg-zinc-50">
              <td className="border-b border-zinc-200 px-3 py-2">
                {formatDate(p.datePaiement)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                <Link href={`/factures/${p.factureId}`} className="text-blue-600 hover:underline">
                  {p.factureNumero}
                </Link>
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                {formatCurrency(p.montant)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                {p.modePaiement}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                <div className="flex gap-3">
                  <Link href={`/paiements/${p.id}`} className="text-blue-600 hover:underline">
                    Voir
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
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
