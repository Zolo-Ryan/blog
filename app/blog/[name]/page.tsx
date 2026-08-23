import { mdToHtml } from "@/utils/io";

interface RouteParams {
  params: Promise<{ name: string }>;
}

export default async function ProductPage({ params }: RouteParams) {
  const { name } = await params;
  const md = await mdToHtml(name);
  
  return (
    <div dangerouslySetInnerHTML={{__html: md}}></div>
  );
}