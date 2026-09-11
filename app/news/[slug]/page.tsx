import { client, urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";
import NewsDetailContent from "./NewsDetailContent";
import BackToHomeLink from "./BackToHomeLink";

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
    sourceUrl,
    mainImage,
    gallery,
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

  const dateLabel = news.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  const imageUrl = news.mainImage ? urlFor(news.mainImage).url() : undefined;
  const galleryUrls: string[] = Array.isArray(news.gallery)
    ? news.gallery.map((img: unknown) => urlFor(img).url())
    : [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <BackToHomeLink />

      {/* Category, title, date, image, and body — rendered in original order.
          Category/title/body are translated client-side based on the
          selected site language (Original / မြန်မာ / ไทย). Date and image(s)
          don't need translation, so they're passed through as-is. */}
      <NewsDetailContent
        title={news.title}
        category={news.category}
        dateLabel={dateLabel}
        sourceUrl={news.sourceUrl}
        imageUrl={imageUrl}
        galleryUrls={galleryUrls}
        body={news.body}
      />
    </main>
  );
}