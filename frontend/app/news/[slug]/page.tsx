import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import NewsDetailClient from "./NewsDetailClient";

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNewsDetail(slugOrId: string) {
  if (!slugOrId) return null;

  // FIX 404: search both newsPortal AND old news type
  const query = `*[_type in ["newsPortal", "news"] && (slug.current == $slugOrId || _id == $slugOrId)][0]{
    _id,
    title,
    slug,
    category,
    publishedAt,
    mainImage,
    body
  }`;
  const data = await client.fetch(query, { slugOrId });
  return data;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) {
    notFound();
  }

  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const news = await getNewsDetail(decodedSlug);

  if (!news) {
    notFound();
  }

  // Pass to Client Component for translation
  return <NewsDetailClient news={news} />;
}

