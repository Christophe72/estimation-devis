import { apiFetch } from "@/lib/api";
import type { PaiementRequest, PaiementResponse } from "@/types/paiement";

export function getPaiements(factureId?: number): Promise<PaiementResponse[] | null> {
  const qs = factureId != null ? `?factureId=${factureId}` : "";
  return apiFetch<PaiementResponse[]>(`/api/paiements${qs}`);
}

export function getPaiement(id: number): Promise<PaiementResponse | null> {
  return apiFetch<PaiementResponse>(`/api/paiements/${id}`);
}

export function createPaiement(
  payload: PaiementRequest,
): Promise<PaiementResponse | null> {
  return apiFetch<PaiementResponse>("/api/paiements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Pas de PUT /api/paiements/{id} côté backend — les paiements ne sont pas modifiables.

export async function deletePaiement(id: number): Promise<null> {
  await apiFetch(`/api/paiements/${id}`, { method: "DELETE" });
  return null;
}
