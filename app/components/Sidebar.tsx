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
    <nav aria-label="Blog sidebar">
      <h2 style={{ margin: "0 0 1rem", fontSize: "1.1rem" }}>Posts</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
        {posts.map((slug) => (
          <li key={slug}>
            <Link href={`/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}