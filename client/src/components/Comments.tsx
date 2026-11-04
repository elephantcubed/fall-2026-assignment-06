import { useEffect, useState, type FormEvent } from "react";
import * as api from "../api";
import type { Comment, Id } from "../types";
import CommentItem from "./CommentItem";
import Status from "./Status";

export default function Comments({ articleId }: { articleId: Id }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .listComments(articleId)
      .then((data) => setComments(data ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [articleId]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return setFormError("Comment can’t be empty.");
    try {
      const created = await api.createComment(articleId, body.trim());
      setComments((prev) => [...prev, created]);
      setBody("");
      setFormError("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="comments">
      <h2>Comments</h2>
      {loading && <Status kind="loading">Loading comments…</Status>}
      {error && <Status kind="error">Couldn’t load comments: {error}</Status>}
      {!loading && !error && comments.length === 0 && (
        <Status kind="empty">No comments yet.</Status>
      )}
      <ul className="comment-list">
        {comments.map((c) => (
          <CommentItem
            key={c.commentId}
            articleId={articleId}
            comment={c}
            onChanged={(u) => setComments((prev) => prev.map((x) => (x.commentId === u.commentId ? u : x)))}
            onDeleted={(id) => setComments((prev) => prev.filter((x) => x.commentId !== id))}
          />
        ))}
      </ul>
      <form onSubmit={add} className="form" noValidate>
        <label>
          Add a comment
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        {formError && <Status kind="error">{formError}</Status>}
        <div className="row"><button className="btn btn-primary">Post comment</button></div>
      </form>
    </section>
  );
}
