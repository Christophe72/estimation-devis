"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Les paiements ne sont pas modifiables (pas de PUT /api/paiements/{id}).
// Redirection vers la page de détail du paiement.
export default function EditPaiementPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  useEffect(() => { router.replace(`/paiements/${id}`); }, [router, id]);
  return null;
}
