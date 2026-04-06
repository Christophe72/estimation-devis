"use client";

import { useEffect, useState } from "react";
import NumericInput from "@/components/NumericInput";
import { getCustomers } from "@/lib/customers";
import type { CustomerResponse } from "@/types/customer";
import type { DevisRequest } from "@/types/devis";

type Props = {
  initialValues?: Partial<DevisRequest>;
  onSubmit: (payload: DevisRequest) => Promise<void>;
  submitLabel?: string;
};

const STATUTS = ["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "CONVERTI"];

function Field({ id, label, required, children }: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";

export default function DevisForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [numero, setNumero] = useState(initialValues.numero ?? "");
  const [customerId, setCustomerId] = useState(initialValues.customerId?.toString() ?? "");
  const [chantierNom, setChantierNom] = useState(initialValues.chantierNom ?? "");
  const [adresse, setAdresse] = useState(initialValues.adresse ?? "");
  const [ville, setVille] = useState(initialValues.ville ?? "");
  const [codePostal, setCodePostal] = useState(initialValues.codePostal ?? "");
  const [typeChantier, setTypeChantier] = useState(initialValues.typeChantier ?? "");
  const [statut, setStatut] = useState(initialValues.statut ?? "BROUILLON");
  const [tauxHoraire, setTauxHoraire] = useState(initialValues.tauxHoraire?.toString() ?? "");
  const [coefficientChantier, setCoefficientChantier] = useState(
    initialValues.coefficientChantier?.toString() ?? "1",
  );
  const [tauxFraisGeneraux, setTauxFraisGeneraux] = useState(
    initialValues.tauxFraisGeneraux?.toString() ?? "0",
  );
  const [tauxMarge, setTauxMarge] = useState(initialValues.tauxMarge?.toString() ?? "0");
  const [tauxTva, setTauxTva] = useState(initialValues.tauxTva?.toString() ?? "21");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data ?? []);
      } catch {
        // le select restera vide
      }
    }
    void loadCustomers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        numero,
        customerId: Number(customerId),
        chantierNom,
        adresse: adresse || undefined,
        ville: ville || undefined,
        codePostal: codePostal || undefined,
        typeChantier,
        statut,
        tauxHoraire: parseFloat(tauxHoraire),
        coefficientChantier: parseFloat(coefficientChantier),
        tauxFraisGeneraux: parseFloat(tauxFraisGeneraux),
        tauxMarge: parseFloat(tauxMarge),
        tauxTva: parseFloat(tauxTva),
        lines: initialValues.lines ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field id="numero" label="N° Devis" required>
          <input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)}
            required maxLength={50} className={inputCls} />
        </Field>

        <Field id="statut" label="Statut">
          <select id="statut" value={statut} onChange={(e) => setStatut(e.target.value)}
            className={inputCls}>
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field id="customerId" label="Client" required>
        <select id="customerId" value={customerId}
          onChange={(e) => setCustomerId(e.target.value)} required className={inputCls}>
          <option value="">— Sélectionner un client —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="chantierNom" label="Nom du chantier" required>
          <input id="chantierNom" value={chantierNom}
            onChange={(e) => setChantierNom(e.target.value)} required maxLength={255}
            className={inputCls} />
        </Field>

        <Field id="typeChantier" label="Type de chantier" required>
          <input id="typeChantier" value={typeChantier}
            onChange={(e) => setTypeChantier(e.target.value)} required maxLength={50}
            className={inputCls} />
        </Field>
      </div>

      <Field id="adresse" label="Adresse">
        <input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)}
          maxLength={255} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="ville" label="Ville">
          <input id="ville" value={ville} onChange={(e) => setVille(e.target.value)}
            maxLength={120} className={inputCls} />
        </Field>

        <Field id="codePostal" label="Code postal">
          <input id="codePostal" value={codePostal}
            onChange={(e) => setCodePostal(e.target.value)} maxLength={20} className={inputCls} />
        </Field>
      </div>

      <p className="text-sm font-semibold text-zinc-700 border-t pt-3">Taux</p>

      <div className="grid grid-cols-2 gap-4">
        <Field id="tauxHoraire" label="Taux horaire (€/h)" required>
          <NumericInput id="tauxHoraire" step={0.01} min={0.01} value={tauxHoraire}
            onChange={setTauxHoraire} required className={inputCls} />
        </Field>

        <Field id="coefficientChantier" label="Coefficient chantier">
          <NumericInput id="coefficientChantier" step={0.01} min={0.01}
            value={coefficientChantier}
            onChange={setCoefficientChantier} className={inputCls} />
        </Field>

        <Field id="tauxFraisGeneraux" label="Frais généraux (%)">
          <NumericInput id="tauxFraisGeneraux" step={0.01} min={0}
            value={tauxFraisGeneraux}
            onChange={setTauxFraisGeneraux} className={inputCls} />
        </Field>

        <Field id="tauxMarge" label="Marge (%)">
          <NumericInput id="tauxMarge" step={0.01} min={0} value={tauxMarge}
            onChange={setTauxMarge} className={inputCls} />
        </Field>

        <Field id="tauxTva" label="TVA (%)">
          <NumericInput id="tauxTva" step={0.01} min={0} value={tauxTva}
            onChange={setTauxTva} className={inputCls} />
        </Field>
      </div>

      <button type="submit" disabled={loading}
        className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50">
        {loading ? "..." : submitLabel}
      </button>
    </form>
  );
}
