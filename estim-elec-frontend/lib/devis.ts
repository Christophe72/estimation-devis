import { apiFetch } from "@/lib/api";
import type { DevisRequest, DevisResponse } from "@/types/devis";

export function getDevis(params?: {
  customerId?: number;
  statut?: string;
}): Promise<DevisResponse[] | null> {
  const query = new URLSearchParams();
  if (params?.customerId != null) query.set("customerId", String(params.customerId));
  if (params?.statut) query.set("statut", params.statut);
  const qs = query.toString();
  return apiFetch<DevisResponse[]>(qs ? `/api/devis?${qs}` : "/api/devis");
}

export function getDevisById(id: number): Promise<DevisResponse | null> {
  return apiFetch<DevisResponse>(`/api/devis/${id}`);
}

export function createDevis(
  payload: DevisRequest,
): Promise<DevisResponse | null> {
  return apiFetch<DevisResponse>("/api/devis", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDevis(
  id: number,
  payload: DevisRequest,
): Promise<DevisResponse | null> {
  return apiFetch<DevisResponse>(`/api/devis/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDevis(id: number): Promise<null> {
  await apiFetch(`/api/devis/${id}`, { method: "DELETE" });
  return null;
}
