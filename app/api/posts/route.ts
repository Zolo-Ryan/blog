import { promises as fs } from "node:fs";
import path from "node:path";

export async function GET() {
  const blogDir = path.join(process.cwd(), "app", "blog");

  try {
    const entries = await fs.readdir(blogDir, { withFileTypes: true });
    const posts = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    return Response.json({ posts });
  } catch {
    return Response.json({ posts: [] });
  }
}
