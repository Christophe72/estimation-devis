type Props = {
  statut: string;
};

const STATUT_STYLES: Record<string, string> = {
  BROUILLON: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  ENVOYEE: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ACCEPTEE: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  REFUSEE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  ANNULEE: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

export default function StatutEstimationBadge({ statut }: Props) {
  const style =
    STATUT_STYLES[statut] ?? "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300";

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {statut}
    </span>
  );
}
