import { useState, type FormEvent } from "react";
import type { ArticleInput } from "../types";
import Status from "./Status";

interface Props {
  initial?: ArticleInput;
  submitLabel: string;
  onSubmit: (data: ArticleInput) => Promise<void>;
  onCancel: () => void;
}

export default function ArticleForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [contents, setContents] = useState(initial?.contents ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !contents.trim()) {
      setError("Title and contents are both required.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), contents: contents.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Contents
        <textarea rows={12} value={contents} onChange={(e) => setContents(e.target.value)} />
      </label>
      {error && <Status kind="error">{error}</Status>}
      <div className="row">
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
