import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../api";
import type { Article } from "../types";
import ArticleForm from "../components/ArticleForm";
import Status from "../components/Status";

export default function EditArticlePage() {
  const { articleId } = useParams() as { articleId: string };
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getArticle(articleId).then(setArticle).catch((e: Error) => setError(e.message));
  }, [articleId]);

  if (error) return <Status kind="error">Couldn’t load article: {error}</Status>;
  if (!article) return <Status kind="loading">Loading article…</Status>;

  return (
    <section>
      <h1>Edit article</h1>
      <ArticleForm
        initial={article}
        submitLabel="Save changes"
        onCancel={() => navigate(`/articles/${articleId}`)}
        onSubmit={async (data) => {
          await api.updateArticle(articleId, data);
          navigate(`/articles/${articleId}`);
        }}
      />
    </section>
  );
}
