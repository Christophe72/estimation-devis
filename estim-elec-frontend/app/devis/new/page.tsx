"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createDevis } from "@/lib/devis";
import DevisForm from "@/components/devis/DevisForm";
import type { DevisRequest } from "@/types/devis";

export default function NewDevisPage() {
  const router = useRouter();

  async function handleSubmit(payload: DevisRequest) {
    await createDevis(payload);
    router.push("/devis");
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/devis" className="text-zinc-500 hover:underline">
          ← Devis
        </Link>
        <h1 className="text-2xl font-semibold">Nouveau devis</h1>
      </div>

      <DevisForm onSubmit={handleSubmit} submitLabel="Créer" />
    </main>
  );
}
