"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCustomer, getCustomers } from "@/lib/customers";
import type { CustomerResponse } from "@/types/customer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCustomers() {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomers();
      setCustomers(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de chargement.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Supprimer ce client ?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(id);
      await loadCustomers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de suppression.";
      setError(message);
    }
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link
          href="/customers/new"
          className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Nouveau
        </Link>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <p>Aucun customer trouvé.</p>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-zinc-200 bg-white">
            <thead>
              <tr className="bg-zinc-100 text-left">
                <th className="border-b border-zinc-200 px-3 py-2">Nom</th>
                <th className="border-b border-zinc-200 px-3 py-2">Email</th>
                <th className="border-b border-zinc-200 px-3 py-2">Téléphone</th>
                <th className="border-b border-zinc-200 px-3 py-2">Ville</th>
                <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50">
                  <td className="border-b border-zinc-200 px-3 py-2">{customer.nom}</td>
                  <td className="border-b border-zinc-200 px-3 py-2">{customer.email}</td>
                  <td className="border-b border-zinc-200 px-3 py-2">{customer.telephone}</td>
                  <td className="border-b border-zinc-200 px-3 py-2">{customer.ville}</td>
                  <td className="border-b border-zinc-200 px-3 py-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/customers/${customer.id}/edit`}
                        className="text-amber-600 hover:underline"
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(customer.id)}
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
      )}
    </main>
  );
}