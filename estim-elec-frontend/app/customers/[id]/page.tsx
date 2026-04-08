"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCustomer } from "@/lib/customers";
import type { CustomerResponse } from "@/types/customer";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-36 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomer(Number(id));
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/customers" className="text-zinc-500 hover:underline">
          ← Customers
        </Link>
        <h1 className="text-2xl font-semibold">Client</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && !customer && <p>Client introuvable.</p>}

      {!loading && !error && customer && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <Row label="Nom" value={customer.nom} />
            <Row label="Email" value={customer.email} />
            <Row label="Téléphone" value={customer.telephone} />
            <Row label="Adresse" value={customer.adresse} />
            <Row label="Ville" value={customer.ville} />
            <Row label="Code postal" value={customer.codePostal} />
          </div>

          <div className="flex gap-3">
            <Link
              href={`/customers/${customer.id}/edit`}
              className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              Modifier
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Liens associés</p>
            <div className="flex gap-4">
              <Link
                href={`/devis?customerId=${customer.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Voir les devis
              </Link>
              <Link
                href={`/factures?customerId=${customer.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Voir les factures
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
