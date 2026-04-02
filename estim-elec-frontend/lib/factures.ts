import { apiFetch } from "@/lib/api";
import type { FactureResponse } from "@/types/facture";

// Les factures sont en lecture seule depuis le front.
// Elles sont générées via convertFromDevis (POST /api/factures/from-devis/{devisId}).

export function getFactures(): Promise<FactureResponse[] | null> {
  return apiFetch<FactureResponse[]>("/api/factures");
}

export function getFacture(id: number): Promise<FactureResponse | null> {
  return apiFetch<FactureResponse>(`/api/factures/${id}`);
}

export function convertFromDevis(devisId: number): Promise<FactureResponse | null> {
  return apiFetch<FactureResponse>(`/api/factures/from-devis/${devisId}`, {
    method: "POST",
  });
}
