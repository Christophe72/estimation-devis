"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPaiement } from "@/lib/paiements";
import PaiementForm from "@/components/paiements/PaiementForm";
import type { PaiementRequest } from "@/types/paiement";

export default function NewPaiementPage() {
  const router = useRouter();

  async function handleSubmit(payload: PaiementRequest) {
    await createPaiement(payload);
    router.push("/paiements");
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/paiements" className="text-zinc-500 hover:underline">
          ← Paiements
        </Link>
        <h1 className="text-2xl font-semibold">Nouveau paiement</h1>
      </div>

      <PaiementForm onSubmit={handleSubmit} submitLabel="Créer" />
    </main>
  );
}
