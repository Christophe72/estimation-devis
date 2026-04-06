"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOuvrage, updateOuvrage } from "@/lib/ouvrages";
import OuvrageForm from "@/components/ouvrages/OuvrageForm";
import type { OuvrageRequest, OuvrageResponse } from "@/types/ouvrage";

export default function EditOuvragePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ouvrage, setOuvrage] = useState<OuvrageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOuvrage(Number(id));
        setOuvrage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  async function handleSubmit(payload: OuvrageRequest) {
    await updateOuvrage(Number(id), payload);
    router.push(`/ouvrages/${id}`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/ouvrages/${id}`} className="text-zinc-500 hover:underline">
          ← Retour
        </Link>
        <h1 className="text-2xl font-semibold">Modifier l&apos;ouvrage</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !ouvrage && <p>Ouvrage introuvable.</p>}

      {!loading && !error && ouvrage && (
        <OuvrageForm
          initialValues={{
            code: ouvrage.code,
            designation: ouvrage.designation,
            categorie: ouvrage.categorie,
            unite: ouvrage.unite,
            tempsPoseHeure: ouvrage.tempsPoseHeure,
            description: ouvrage.description,
            actif: ouvrage.actif ?? true,
          }}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
        />
      )}
    </main>
  );
}
