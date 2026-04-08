import { apiFetch } from "@/lib/api";
import type { ArticleRequest, ArticleResponse } from "@/types/article";

export function getArticles(): Promise<ArticleResponse[] | null> {
  return apiFetch<ArticleResponse[]>("/api/articles");
}

export function getArticle(id: number): Promise<ArticleResponse | null> {
  return apiFetch<ArticleResponse>(`/api/articles/${id}`);
}

export function createArticle(
  payload: ArticleRequest,
): Promise<ArticleResponse | null> {
  return apiFetch<ArticleResponse>("/api/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateArticle(
  id: number,
  payload: ArticleRequest,
): Promise<ArticleResponse | null> {
  return apiFetch<ArticleResponse>(`/api/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(id: number): Promise<null> {
  await apiFetch(`/api/articles/${id}`, { method: "DELETE" });
  return null;
}
