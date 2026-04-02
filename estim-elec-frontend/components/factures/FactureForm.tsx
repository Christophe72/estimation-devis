// Les factures ne sont pas créées manuellement.
// Elles sont générées depuis un devis via POST /api/factures/from-devis/{devisId}.
// Ce composant n'est plus utilisé.

export default function FactureForm() {
  return (
    <p className="text-zinc-500">
      Les factures sont générées automatiquement depuis les devis.
    </p>
  );
}
