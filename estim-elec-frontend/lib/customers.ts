import { apiFetch } from "@/lib/api";
import type { CustomerRequest, CustomerResponse } from "@/types/customer";

export function getCustomers(): Promise<CustomerResponse[] | null> {
  return apiFetch<CustomerResponse[]>("/api/customers");
}

export function getCustomer(id: number): Promise<CustomerResponse | null> {
  return apiFetch<CustomerResponse>(`/api/customers/${id}`);
}

export function createCustomer(
  payload: CustomerRequest,
): Promise<CustomerResponse | null> {
  return apiFetch<CustomerResponse>("/api/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(
  id: number,
  payload: CustomerRequest,
): Promise<CustomerResponse | null> {
  return apiFetch<CustomerResponse>(`/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCustomer(id: number): Promise<null> {
  await apiFetch(`/api/customers/${id}`, {
    method: "DELETE",
  });

  return null;
}
