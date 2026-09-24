import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export async function GET() {
  const blogDir = path.join(process.cwd(), "app", "blog");

  try {
    const entries = await fs.readdir(blogDir, { withFileTypes: true });

    const posts = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const filePath = path.join(blogDir, entry.name, "page.mdx");

          try {
            const source = await fs.readFile(filePath, "utf8");
            const { data } = matter(source);

            const slug = entry.name;
            const title = typeof data.title === "string" ? data.title : slug;
            const date = typeof data.date === "string" ? data.date : "";

            return { slug, title, date };
          } catch {
            return { slug: entry.name, title: entry.name, date: "" };
          }
        })
    );

    const sortedPosts = posts.sort((a, b) => {
      const timeA = a.date ? Date.parse(a.date) : 0;
      const timeB = b.date ? Date.parse(b.date) : 0;
      return timeB - timeA;
    });

    return Response.json({ posts: sortedPosts });
  } catch {
    return Response.json({ posts: [] });
  }
}
