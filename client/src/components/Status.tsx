import type { ReactNode } from "react";

interface Props {
  kind: "loading" | "empty" | "error";
  children: ReactNode;
}

export default function Status({ kind, children }: Props) {
  return (
    <p className={`status status-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
