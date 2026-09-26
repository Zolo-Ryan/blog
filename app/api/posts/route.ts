import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type BlogNode = {
  slug: string;
  title: string;
  date: string;
  children: BlogNode[];
  isGroup: boolean;
};

function sortBlogNodes(nodes: BlogNode[]): BlogNode[] {
  return [...nodes]
    .sort((a, b) => {
      const timeA = a.date ? Date.parse(a.date) : 0;
      const timeB = b.date ? Date.parse(b.date) : 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return a.title.localeCompare(b.title);
    })
    .map((node) => ({
      ...node,
      children: sortBlogNodes(node.children),
    }));
}

async function readPageNode(filePath: string, slug: string): Promise<BlogNode | null> {
  try {
    const source = await fs.readFile(filePath, "utf8");
    const { data } = matter(source);

    const title = typeof data.title === "string" ? data.title : slug.split("/").pop() ?? "Untitled";
    const date = typeof data.date === "string" ? data.date : "";

    return {
      slug,
      title,
      date,
      children: [],
      isGroup: false,
    };
  } catch {
    return null;
  }
}

async function collectNodes(dir: string, relativePath: string[] = []): Promise<BlogNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: BlogNode[] = [];

  const pageFile = entries.find((entry) => entry.isFile() && (entry.name === "page.mdx" || entry.name === "page.md"));
  const childDirs = entries.filter((entry) => entry.isDirectory());

  if (pageFile) {
    const pagePath = path.join(dir, pageFile.name);
    const pageNode = await readPageNode(pagePath, relativePath.join("/"));
    if (pageNode) {
      return [pageNode];
    }
  }

  for (const childDir of childDirs) {
    const nextPath = [...relativePath, childDir.name];
    const childNodes = await collectNodes(path.join(dir, childDir.name), nextPath);

    if (childNodes.length > 0) {
      const isSinglePageFolder =
        childNodes.length === 1 &&
        !childNodes[0].isGroup &&
        childNodes[0].slug === nextPath.join("/");

      if (isSinglePageFolder) {
        results.push(childNodes[0]);
        continue;
      }

      const newestDate = childNodes.reduce((latest, node) => {
        const nodeTime = node.date ? Date.parse(node.date) : 0;
        return nodeTime > latest ? nodeTime : latest;
      }, 0);

      results.push({
        slug: nextPath.join("/"),
        title: childDir.name,
        date: newestDate ? new Date(newestDate).toISOString() : "",
        children: childNodes,
        isGroup: true,
      });
    }
  }

  return sortBlogNodes(results);
}

export async function GET() {
  const blogDir = path.join(process.cwd(), "app", "blog");

  try {
    const posts = await collectNodes(blogDir);
    return Response.json({ posts });
  } catch {
    return Response.json({ posts: [] });
  }
}
