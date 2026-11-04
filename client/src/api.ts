import type { Article, ArticleInput, Comment, Id } from "./types";

const BASE = "http://localhost:8080";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

const send = (method: string, body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const listArticles = (titleContains = "") =>
  request<Article[]>(
    titleContains
      ? `/articles?title_contains=${encodeURIComponent(titleContains)}`
      : "/articles"
  );
export const getArticle = (id: Id) => request<Article>(`/articles/${id}`);
export const createArticle = (data: ArticleInput) =>
  request<Article>("/articles", send("POST", data));
export const updateArticle = (id: Id, data: Partial<ArticleInput>) =>
  request<Article>(`/articles/${id}`, send("PUT", data));
export const deleteArticle = (id: Id) =>
  request<null>(`/articles/${id}`, { method: "DELETE" });

export const listComments = (aid: Id) =>
  request<Comment[]>(`/articles/${aid}/comments`);
export const createComment = (aid: Id, body: string) =>
  request<Comment>(`/articles/${aid}/comments`, send("POST", { body }));
export const updateComment = (aid: Id, cid: Id, body: string) =>
  request<Comment>(`/articles/${aid}/comments/${cid}`, send("PUT", { body }));
export const deleteComment = (aid: Id, cid: Id) =>
  request<null>(`/articles/${aid}/comments/${cid}`, { method: "DELETE" });
