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
        gridTemplateColumns: "240px minmax(0, 1fr)",
        gap: "2rem",
        padding: "2rem 1.5rem 4rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid rgba(17, 24, 39, 0.12)",
          paddingRight: "1rem",
          minWidth: 0,
        }}
      >
        <div style={{ position: "sticky", top: "1rem" }}>
          <div
            style={{
              marginBottom: "1.25rem",
              borderBottom: "1px solid rgba(17, 24, 39, 0.12)",
              paddingBottom: "0.75rem",
            }}
          >
            <div
              style={{
                color: "#374151",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
              }}
            >
              ~/blog
            </div>
            <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>zolo</h1>
          </div>
          <Sidebar />
        </div>
      </aside>

      <main
        style={{
          minWidth: 0,
          padding: "0.25rem 0.5rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}