import { apiFetch } from "@/lib/api";
import type { EstimationRequest, EstimationResponse } from "@/types/estimation";

export function getEstimations(): Promise<EstimationResponse[] | null> {
  return apiFetch<EstimationResponse[]>("/api/estimations");
}

export function getEstimation(id: number): Promise<EstimationResponse | null> {
  return apiFetch<EstimationResponse>(`/api/estimations/${id}`);
}

export function createEstimation(
  payload: EstimationRequest,
): Promise<EstimationResponse | null> {
  return apiFetch<EstimationResponse>("/api/estimations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEstimation(
  id: number,
  payload: EstimationRequest,
): Promise<EstimationResponse | null> {
  return apiFetch<EstimationResponse>(`/api/estimations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEstimation(id: number): Promise<null> {
  await apiFetch(`/api/estimations/${id}`, { method: "DELETE" });
  return null;
}