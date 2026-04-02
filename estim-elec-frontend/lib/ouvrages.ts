import { apiFetch } from "@/lib/api";
import type { OuvrageRequest, OuvrageResponse } from "@/types/ouvrage";

export function getOuvrages(): Promise<OuvrageResponse[] | null> {
  return apiFetch<OuvrageResponse[]>("/api/ouvrages");
}

export function getOuvrage(id: number): Promise<OuvrageResponse | null> {
  return apiFetch<OuvrageResponse>(`/api/ouvrages/${id}`);
}

export function createOuvrage(
  payload: OuvrageRequest,
): Promise<OuvrageResponse | null> {
  return apiFetch<OuvrageResponse>("/api/ouvrages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateOuvrage(
  id: number,
  payload: OuvrageRequest,
): Promise<OuvrageResponse | null> {
  return apiFetch<OuvrageResponse>(`/api/ouvrages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteOuvrage(id: number): Promise<null> {
  await apiFetch(`/api/ouvrages/${id}`, { method: "DELETE" });
  return null;
}
