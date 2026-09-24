import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

type ParentProps = {
  children: ReactNode;
};

export default function Parent({ children }: ParentProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
        gap: "2rem",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <aside style={{ borderRight: "1px solid #e5e7eb", paddingRight: "1rem" }}>
        <div style={{ position: "sticky", top: "1rem" }}>
          <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem" }}>My Blog</h1>
          <Sidebar />
        </div>
      </aside>

      <main style={{ minWidth: 0 }}>{children}</main>
    </div>
  );
}