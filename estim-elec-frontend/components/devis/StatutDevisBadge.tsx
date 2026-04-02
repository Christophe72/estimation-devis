type Props = {
  statut: string;
};

const STATUT_STYLES: Record<string, string> = {
  BROUILLON: "bg-zinc-100 text-zinc-700",
  ENVOYE: "bg-blue-100 text-blue-700",
  ACCEPTE: "bg-green-100 text-green-700",
  REFUSE: "bg-red-100 text-red-700",
  CONVERTI: "bg-purple-100 text-purple-700",
};

export default function StatutDevisBadge({ statut }: Props) {
  const style = STATUT_STYLES[statut] ?? "bg-zinc-100 text-zinc-600";

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {statut}
    </span>
  );
}
