"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDevisById, updateDevis } from "@/lib/devis";
import DevisForm from "@/components/devis/DevisForm";
import type { DevisRequest, DevisResponse } from "@/types/devis";

export default function EditDevisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [devis, setDevis] = useState<DevisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDevisById(Number(id));
        setDevis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  async function handleSubmit(payload: DevisRequest) {
    await updateDevis(Number(id), payload);
    router.push(`/devis/${id}`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/devis/${id}`} className="text-zinc-500 hover:underline">
          ← Retour
        </Link>
        <h1 className="text-2xl font-semibold">Modifier le devis</h1>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !devis && <p>Devis introuvable.</p>}

      {!loading && !error && devis && (
        <DevisForm
          initialValues={{
            numero: devis.numero,
            customerId: devis.customerId,
            chantierNom: devis.chantierNom,
            adresse: devis.adresse,
            ville: devis.ville,
            codePostal: devis.codePostal,
            typeChantier: devis.typeChantier,
            statut: devis.statut,
            tauxHoraire: devis.tauxHoraire,
            coefficientChantier: devis.coefficientChantier,
            tauxFraisGeneraux: devis.tauxFraisGeneraux,
            tauxMarge: devis.tauxMarge,
            tauxTva: devis.tauxTva,
            lines: devis.lines.map((l) => ({
              typeLigne: l.typeLigne,
              ouvrageId: l.ouvrageId,
              designation: l.designation,
              quantite: l.quantite,
              unite: l.unite,
              tempsUnitaireHeures: l.tempsUnitaireHeures,
              coutMaterielUnitaireHt: l.coutMaterielUnitaireHt,
              coutMainOeuvreUnitaireHt: l.coutMainOeuvreUnitaireHt,
              ordreAffichage: l.ordreAffichage,
            })),
          }}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
        />
      )}
    </main>
  );
}
