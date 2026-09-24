"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type TreeNode = {
  slug: string;
  title: string;
  date: string;
  children: TreeNode[];
  isGroup: boolean;
};

function matchesQuery(node: TreeNode, regex: RegExp): boolean {
  if (regex.test(node.title) || regex.test(node.slug)) {
    return true;
  }

  return node.children.some((child) => matchesQuery(child, regex));
}

function formatDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const SIDEBAR_STORAGE_KEY = "blog-sidebar-open-groups";

function getAncestorGroupsForPath(pathname: string): Record<string, boolean> {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "blog" || segments.length <= 1) {
    return {};
  }

  const ancestors: Record<string, boolean> = {};

  for (let index = 1; index < segments.length; index += 1) {
    const ancestorSlug = segments.slice(1, index + 1).join("/");
    ancestors[ancestorSlug] = true;
  }

  // Remove the current leaf so only parent groups remain expanded.
  const leaf = segments.slice(1).join("/");
  if (leaf in ancestors) {
    delete ancestors[leaf];
  }

  return ancestors;
}

function SidebarTree({
  nodes,
  query,
  openGroups,
  setOpenGroups,
  depth = 0,
}: {
  nodes: TreeNode[];
  query: string;
  openGroups: Record<string, boolean>;
  setOpenGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  depth?: number;
}) {
  const filteredNodes = useMemo(() => {
    if (!query.trim()) return nodes;

    try {
      const regex = new RegExp(query, "i");
      return nodes.filter((node) => matchesQuery(node, regex));
    } catch {
      return [];
    }
  }, [nodes, query]);

  if (!filteredNodes.length) return null;

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: "0.5rem",
      }}
    >
      {filteredNodes.map((node) => {
        const isOpen = openGroups[node.slug] ?? false;

        if (node.isGroup) {
          return (
            <li key={node.slug} style={{ margin: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  padding: "0.2rem 0.2rem 0.2rem 0",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((current) => {
                      const next = {
                        ...current,
                        [node.slug]: !isOpen,
                      };

                      return next;
                    })
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#111827",
                    padding: 0,
                    font: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span aria-hidden="true" style={{ width: "0.8rem", display: "inline-block" }}>
                    {isOpen ? "−" : "+"}
                  </span>
                  <span>{node.title}</span>
                </button>
              </div>

              {isOpen && node.children.length > 0 ? (
                <div style={{ marginTop: "0.45rem", marginLeft: `${depth + 1}rem` }}>
                  <SidebarTree
                    nodes={node.children}
                    query={query}
                    openGroups={openGroups}
                    setOpenGroups={setOpenGroups}
                    depth={depth + 1}
                  />
                </div>
              ) : null}
            </li>
          );
        }

        const formattedDate = formatDate(node.date);

        return (
          <li key={node.slug} style={{ margin: 0 }}>
            <Link
              href={`/blog/${node.slug}`}
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
              <div style={{ fontWeight: 600 }}>{node.title}</div>
              {formattedDate ? (
                <div
                  style={{
                    marginTop: "0.15rem",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                    letterSpacing: "0.04em",
                  }}
                >
                  {formattedDate}
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [posts, setPosts] = useState<TreeNode[]>([]);
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved) {
        setOpenGroups((current) => ({ ...current, ...JSON.parse(saved) }));
      }
    } catch {
      setOpenGroups({});
    }
  }, []);

  useEffect(() => {
    const ancestorGroups = getAncestorGroupsForPath(pathname);
    if (!Object.keys(ancestorGroups).length) {
      return;
    }

    setOpenGroups((current) => ({ ...current, ...ancestorGroups }));
  }, [pathname]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(openGroups));
    } catch {
      // ignore storage errors
    }
  }, [openGroups]);

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

      <div style={{ marginBottom: "0.8rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="/regex/"
          aria-label="Filter blog entries by regex"
          style={{
            width: "100%",
            border: "1px solid rgba(17, 24, 39, 0.12)",
            borderRadius: "0.45rem",
            background: "rgba(255,255,255,0.45)",
            color: "#111827",
            padding: "0.45rem 0.55rem",
            fontSize: "0.8rem",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
      </div>

      {!posts.length ? null : (
        <div>
          <SidebarTree
            nodes={posts}
            query={query}
            openGroups={openGroups}
            setOpenGroups={setOpenGroups}
          />
          {query.trim() && !posts.some((node) => matchesQuery(node, new RegExp(query, "i"))) ? (
            <div style={{ fontSize: "0.72rem", color: "#6b7280", marginBottom: "0.7rem" }}>
              no matches
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
}
