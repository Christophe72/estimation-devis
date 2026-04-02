"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Les factures ne sont pas modifiables manuellement.
// Redirection vers la page de détail de la facture.
export default function EditFacturePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  useEffect(() => { router.replace(`/factures/${id}`); }, [router, id]);
  return null;
}
