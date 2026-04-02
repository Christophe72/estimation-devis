"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCustomer, updateCustomer } from "@/lib/customers";
import CustomerForm from "@/components/customers/CustomerForm";
import type { CustomerRequest, CustomerResponse } from "@/types/customer";

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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

  async function handleSubmit(payload: CustomerRequest) {
    await updateCustomer(Number(id), payload);
    router.push(`/customers/${id}`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/customers/${id}`} className="text-zinc-500 hover:underline">
          ← Retour
        </Link>
        <h1 className="text-2xl font-semibold">Modifier le client</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !customer && <p>Client introuvable.</p>}

      {!loading && !error && customer && (
        <CustomerForm
          initialValues={{
            nom: customer.nom,
            email: customer.email,
            telephone: customer.telephone,
            adresse: customer.adresse,
            ville: customer.ville,
            codePostal: customer.codePostal,
          }}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
        />
      )}
    </main>
  );
}
