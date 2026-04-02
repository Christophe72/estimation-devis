"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { OuvrageResponse } from "@/types/ouvrage";

type Props = {
  ouvrages: OuvrageResponse[];
  onDelete: (id: number) => void;
};

export default function OuvrageTable({ ouvrages, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-zinc-200 bg-white">
        <thead>
          <tr className="bg-zinc-100 text-left">
            <th className="border-b border-zinc-200 px-3 py-2">Désignation</th>
            <th className="border-b border-zinc-200 px-3 py-2">Unité</th>
            <th className="border-b border-zinc-200 px-3 py-2">Prix unitaire</th>
            <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ouvrages.map((ouvrage) => (
            <tr key={ouvrage.id} className="hover:bg-zinc-50">
              <td className="border-b border-zinc-200 px-3 py-2">{ouvrage.designation}</td>
              <td className="border-b border-zinc-200 px-3 py-2">{ouvrage.unite}</td>
              <td className="border-b border-zinc-200 px-3 py-2">
                {formatCurrency(ouvrage.prixUnitaire)}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2">
                <div className="flex gap-3">
                  <Link
                    href={`/ouvrages/${ouvrage.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/ouvrages/${ouvrage.id}/edit`}
                    className="text-amber-600 hover:underline"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(ouvrage.id)}
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
