"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEstimation } from "@/lib/estimations";
import EstimationForm from "@/components/estimations/EstimationForm";
import type { EstimationRequest } from "@/types/estimation";

export default function NewEstimationPage() {
  const router = useRouter();

  async function handleSubmit(payload: EstimationRequest) {
    const result = await createEstimation(payload);
    router.push(result ? `/estimations/${result.id}` : "/estimations");
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/estimations"
          className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
        >
          ← Estimations
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Nouvelle estimation
        </h1>
      </div>

      <EstimationForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/estimations")}
        submitLabel="Créer"
      />
    </main>
  );
}