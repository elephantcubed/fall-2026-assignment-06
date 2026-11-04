import { useState, type FormEvent } from "react";
import * as api from "../api";
import type { Comment, Id } from "../types";
import Status from "./Status";

interface Props {
  articleId: Id;
  comment: Comment;
  onChanged: (c: Comment) => void;
  onDeleted: (id: Id) => void;
}

export default function CommentItem({ articleId, comment, onChanged, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const [error, setError] = useState("");

  const fail = (err: unknown) =>
    setError(err instanceof Error ? err.message : "Something went wrong.");

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return setError("Comment can’t be empty.");
    try {
      const updated = await api.updateComment(articleId, comment.commentId, draft.trim());
      onChanged({ ...comment, ...(updated ?? {}), body: draft.trim() });
      setEditing(false);
      setError("");
    } catch (err) {
      fail(err);
    }
  }

  async function remove() {
    try {
      await api.deleteComment(articleId, comment.commentId);
      onDeleted(comment.commentId);
    } catch (err) {
      fail(err);
    }
  }

  function cancel() {
    setEditing(false);
    setDraft(comment.body);
    setError("");
  }

  if (editing) {
    return (
      <li>
        <form onSubmit={save} className="form" noValidate>
          <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Edit comment" />
          {error && <Status kind="error">{error}</Status>}
          <div className="row">
            <button className="btn btn-primary">Save</button>
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li>
      <p>{comment.body}</p>
      {error && <Status kind="error">{error}</Status>}
      <div className="row">
        <button className="btn btn-small" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn btn-small btn-danger" onClick={remove}>Delete</button>
      </div>
    </li>
  );
}
