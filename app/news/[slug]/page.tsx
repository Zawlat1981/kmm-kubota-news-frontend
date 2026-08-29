import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNewsDetail(slugOrId: string) {
  if (!slugOrId) return null;

  const query = `*[_type == "newsPortal" && (slug.current == $slugOrId || _id == $slugOrId)][0]{
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

  // slug မပါလာရင် သို့မဟုတ် ပျောက်နေရင် 404 ပြရန်
  if (!resolvedParams?.slug) {
    notFound();
  }

  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const news = await getNewsDetail(decodedSlug);

  if (!news) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <Link
        href="/"
        className="text-sm font-semibold text-red-600 hover:underline mb-6 inline-block"
      >
        ← Home သို့ ပြန်သွားရန်
      </Link>

      {news.category && (
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
          {news.category}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {news.title}
      </h1>

      {news.publishedAt && (
        <p className="text-sm text-gray-400 mb-6">
          {new Date(news.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {news.mainImage && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-md max-h-[450px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(news.mainImage).url()}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {news.body && (
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {news.body}
        </div>
      )}
    </main>
  );
}
