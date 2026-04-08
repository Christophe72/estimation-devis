"use client";

import Link from "next/link";
import type { CustomerResponse } from "@/types/customer";

type Props = {
  customers: CustomerResponse[];
  onDeleteRequest: (id: number) => void;
};

export default function CustomerTable({ customers, onDeleteRequest }: Props) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-left dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Nom</th>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Email</th>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Téléphone</th>
            <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Ville</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {customer.nom}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {customer.email ?? "—"}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {customer.telephone ?? "—"}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {customer.ville ?? "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/customers/${customer.id}/edit`}
                    className="text-amber-600 hover:underline dark:text-amber-400"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteRequest(customer.id)}
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
