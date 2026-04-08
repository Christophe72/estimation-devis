"use client";

import Link from "next/link";
import type { OuvrageResponse } from "@/types/ouvrage";

type Props = {
  ouvrages: OuvrageResponse[];
  onDelete: (id: number) => void;
};

export default function OuvrageTable({ ouvrages, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <thead>
          <tr className="bg-zinc-100 text-left dark:bg-zinc-800">
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Code</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Désignation</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Catégorie</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Unité</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Temps pose (h)</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Actif</th>
            <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ouvrages.map((ouvrage) => (
            <tr key={ouvrage.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <td className="border-b border-zinc-200 px-3 py-2 font-mono text-xs dark:border-zinc-700">{ouvrage.code}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{ouvrage.designation}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{ouvrage.categorie}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{ouvrage.unite}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                {ouvrage.tempsPoseHeure}
              </td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">{ouvrage.actif ? "Oui" : "Non"}</td>
              <td className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
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
