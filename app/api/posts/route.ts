import { returnPagesContents } from "@/utils/io";

export async function GET() {
  const posts = returnPagesContents()
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.(mdx|md)$/i, ""))
    .sort();

  return Response.json({ posts });
}
