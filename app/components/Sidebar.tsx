"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [posts, setPosts] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <nav aria-label="Blog sidebar" style={{ fontSize: "0.9rem" }}>
      <div
        style={{
          color: "#4b5563",
          fontSize: "0.72rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: "0.8rem",
        }}
      >
        entries
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: "0.5rem",
        }}
      >
        {posts.map((slug) => (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              style={{
                textDecoration: "none",
                color: "#111827",
                display: "block",
                padding: "0.35rem 0.5rem",
                borderRadius: "0.4rem",
                border: "1px solid transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid rgba(17, 24, 39, 0.12)";
                e.currentTarget.style.background = "rgba(17, 24, 39, 0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid transparent";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}