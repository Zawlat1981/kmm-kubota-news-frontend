import Link from 'next/link'
import { client, urlFor } from '@/Lib/sanity'

async function getSingleNews(slug: string) {
  const query = `*[_type == "newsPortal" && slug.current == $slug][0] {
    title,
    brand,
    category,
    publishedAt,
    mainImage,
    sourceUrl,
    body
  }`
  return await client.fetch(query, { slug })
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // params ကို await လုပ်ပေးရပါမယ် (Next.js အသစ်များအတွက်)
  const resolvedParams = await params;
  const news = await getSingleNews(resolvedParams.slug)

  if (!news) {
    return <div className="p-10 text-center">News not found!</div>
  }

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white min-h-screen my-6 shadow-sm rounded-lg border">
      <Link href="/" className="text-sm font-semibold text-red-600 hover:underline mb-4 inline-block">
        ← Back to All News
      </Link>

      {news.category && (
        <span className="block text-xs font-bold text-red-600 uppercase mb-2">
          {news.category}
        </span>
      )}

      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
        {news.title}
      </h1>

      {news.publishedAt && (
        <p className="text-xs text-gray-500 mb-6">
          Published on: {new Date(news.publishedAt).toLocaleDateString()}
        </p>
      )}

      {news.mainImage && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img 
            src={urlFor(news.mainImage).url()} 
            alt={news.title} 
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* သတင်းအသေးစိတ် စာသား */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-line text-lg mb-8">
        {news.body}
      </div>

      {news.sourceUrl && (
        <div className="border-t pt-4 mt-6">
          <a 
            href={news.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            🔗 View Original Source / Share Link
          </a>
        </div>
      )}
    </article>
  )
}