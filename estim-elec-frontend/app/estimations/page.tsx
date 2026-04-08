"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteEstimation, getEstimations } from "@/lib/estimations";
import EstimationTable from "@/components/estimations/EstimationTable";
import ConfirmModal from "@/components/ConfirmModal";
import type { EstimationResponse } from "@/types/estimation";

export default function EstimationsPage() {
  const [estimations, setEstimations] = useState<EstimationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function loadEstimations() {
    setLoading(true);
    setError(null);
    try {
      const data = await getEstimations();
      setEstimations(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteEstimation(id);
      await loadEstimations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    }
  }

  useEffect(() => {
    void loadEstimations();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Estimations
        </h1>
        <Link
          href="/estimations/new"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          Nouvelle
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Chargement...</p>
      )}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && estimations.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Aucune estimation trouvée.
        </p>
      )}

      {!loading && !error && estimations.length > 0 && (
        <EstimationTable estimations={estimations} onDeleteRequest={setConfirmId} />
      )}

      <ConfirmModal
        isOpen={confirmId !== null}
        title="Supprimer l'estimation"
        message="Cette action est irréversible. Supprimer cette estimation ?"
        onConfirm={() => {
          if (confirmId !== null) void handleDelete(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </main>
  );
}
