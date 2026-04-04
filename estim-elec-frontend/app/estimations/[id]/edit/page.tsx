"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getEstimation, updateEstimation } from "@/lib/estimations";
import EstimationForm from "@/components/estimations/EstimationForm";
import type { EstimationRequest, EstimationResponse } from "@/types/estimation";

export default function EditEstimationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [estimation, setEstimation] = useState<EstimationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEstimation(Number(id));
        setEstimation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  async function handleSubmit(payload: EstimationRequest) {
    await updateEstimation(Number(id), payload);
    router.push(`/estimations/${id}`);
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={`/estimations/${id}`}
          className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
        >
          ← Retour
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Modifier l&apos;estimation
        </h1>
      </div>

      {loading && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Chargement...
        </p>
      )}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && !estimation && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Estimation introuvable.
        </p>
      )}

      {!loading && !error && estimation && (
        <EstimationForm
          initialValues={{
            designation: estimation.designation,
            customerId: estimation.customerId,
            description: estimation.description,
            lines: estimation.lines.map((l) => ({
              ouvrageId: l.ouvrageId,
              quantite: l.quantite,
              ordre: l.ordre,
            })),
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/estimations/${id}`)}
          submitLabel="Enregistrer"
        />
      )}
    </main>
  );
}
