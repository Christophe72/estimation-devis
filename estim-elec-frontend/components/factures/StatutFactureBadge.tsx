type Props = {
  statut: string;
};

const STATUT_STYLES: Record<string, string> = {
  BROUILLON: "bg-zinc-100 text-zinc-700",
  EMISE: "bg-blue-100 text-blue-700",
  PARTIELLEMENT_PAYEE: "bg-amber-100 text-amber-700",
  PAYEE: "bg-green-100 text-green-700",
  ANNULEE: "bg-red-100 text-red-700",
};

export default function StatutFactureBadge({ statut }: Props) {
  const style = STATUT_STYLES[statut] ?? "bg-zinc-100 text-zinc-600";

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {statut}
    </span>
  );
}
