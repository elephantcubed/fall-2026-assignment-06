import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import type { Article } from "../types";
import Status from "../components/Status";

export default function ArticleListPage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-fetch from the API whenever the search text changes (debounced).
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .listArticles(query.trim())
        .then((data) => {
          if (cancelled) return;
          setArticles(data ?? []);
          setError("");
        })
        .catch((e: Error) => !cancelled && setError(e.message))
        .finally(() => !cancelled && setLoading(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <section>
      <div className="toolbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title"
          aria-label="Search articles by title"
        />
        <Link className="btn btn-primary" to="/articles/new">New article</Link>
      </div>
      {loading && <Status kind="loading">Loading articles…</Status>}
      {error && <Status kind="error">Couldn’t load articles: {error}</Status>}
      {!loading && !error && articles.length === 0 && (
        <Status kind="empty">
          {query ? `No articles match “${query}”.` : "No articles yet. Write the first one."}
        </Status>
      )}
      <ul className="article-list">
        {articles.map((a) => (
          <li key={a.articleId}>
            <h2><Link to={`/articles/${a.articleId}`}>{a.title}</Link></h2>
            <p>{a.contents.length > 140 ? a.contents.slice(0, 140) + "…" : a.contents}</p>
            <Link className="read-link" to={`/articles/${a.articleId}`}>Read article</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
