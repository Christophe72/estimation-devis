"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Les factures ne se créent pas manuellement.
// Elles sont générées depuis un devis (POST /api/factures/from-devis/{devisId}).
export default function NewFacturePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/factures"); }, [router]);
  return null;
}
