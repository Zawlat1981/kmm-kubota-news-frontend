import Link from 'next/link'
import { client, urlFor } from '../../../lib/sanity'

interface NewsDetailItem {
  title: string
  slug: { current: string }
  brand?: string
  category?: string
  publishedAt?: string
  mainImage?: any
  sourceUrl?: string
  body?: string
}

async function getSingleNews(slug: string): Promise<NewsDetailItem | null> {
  const query = `*[_type == "newsPortal" && slug.current == $slug][0] {
    title,
    slug,
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
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const news = await getSingleNews(slug)

  if (!news) {
    return (
      <main className="p-6 max-w-4xl mx-auto bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">News not found!</h1>
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-4xl mx-auto bg-white min-h-screen text-gray-800">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-semibold">
        ← Back to Home
      </Link>
      
      {news.category && (
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
          {news.category}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
        {news.title}
      </h1>

      {news.publishedAt && (
        <p className="text-sm text-gray-500 mb-6">
          Published on: {new Date(news.publishedAt).toLocaleDateString()}
        </p>
      )}

      {news.mainImage && (
        <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 max-h-[500px]">
          <img 
            src={urlFor(news.mainImage).url()} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {news.body && (
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {news.body}
        </div>
      )}

      {news.sourceUrl && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <a 
            href={news.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-semibold"
          >
            Original Source →
          </a>
        </div>
      )}
    </main>
  )
}