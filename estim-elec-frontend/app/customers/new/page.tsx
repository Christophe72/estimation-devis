"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCustomer } from "@/lib/customers";
import CustomerForm from "@/components/customers/CustomerForm";
import type { CustomerRequest } from "@/types/customer";

export default function NewCustomerPage() {
  const router = useRouter();

  async function handleSubmit(payload: CustomerRequest) {
    await createCustomer(payload);
    router.push("/customers");
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/customers" className="text-zinc-500 hover:underline">
          ← Customers
        </Link>
        <h1 className="text-2xl font-semibold">Nouveau client</h1>
      </div>

      <CustomerForm onSubmit={handleSubmit} submitLabel="Créer" />
    </main>
  );
}
