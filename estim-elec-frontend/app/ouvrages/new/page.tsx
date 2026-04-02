"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOuvrage } from "@/lib/ouvrages";
import OuvrageForm from "@/components/ouvrages/OuvrageForm";
import type { OuvrageRequest } from "@/types/ouvrage";

export default function NewOuvragePage() {
  const router = useRouter();

  async function handleSubmit(payload: OuvrageRequest) {
    await createOuvrage(payload);
    router.push("/ouvrages");
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/ouvrages" className="text-zinc-500 hover:underline">
          ← Ouvrages
        </Link>
        <h1 className="text-2xl font-semibold">Nouvel ouvrage</h1>
      </div>

      <OuvrageForm onSubmit={handleSubmit} submitLabel="Créer" />
    </main>
  );
}
