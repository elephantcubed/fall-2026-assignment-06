import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as api from "../api";
import type { Article } from "../types";
import Comments from "../components/Comments";
import Status from "../components/Status";

export default function ArticleDetailPage() {
  const { articleId } = useParams() as { articleId: string };
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setArticle(null);
    api.getArticle(articleId).then(setArticle).catch((e: Error) => setError(e.message));
  }, [articleId]);

  async function handleDelete() {
    if (!window.confirm("Delete this article and its comments?")) return;
    try {
      await api.deleteArticle(articleId);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (error) return <Status kind="error">{error}</Status>;
  if (!article) return <Status kind="loading">Loading article…</Status>;

  return (
    <article>
      <h1>{article.title}</h1>
      <p className="contents">{article.contents}</p>
      <div className="row">
        <Link className="btn" to={`/articles/${articleId}/edit`}>Edit</Link>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
      <Comments articleId={articleId} />
    </article>
  );
}
