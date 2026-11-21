import { client } from '@/lib/sanity'
import NewsDetailClient from './NewsDetailClient'

type NewsItem = { _id: string; slug: string; title: string }
type CompanyItem = { _id: string; slug: string; companyName: string }

const NEWS_FIELDS = `_id,title,category,publishedAt,mainImage,gallery,body,sourceUrl,"slug":slug.current`

export default async function NewsPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params
  const slug = resolvedParams.slug
  const decoded = decodeURIComponent(slug)

  console.log('[NEWS] Looking for slug:', slug, 'decoded:', decoded)

  const freshClient = client.withConfig({ useCdn: false, perspective: 'published' })

  // 1. Exact
  let news = await freshClient.fetch(
    `*[_type in ["news", "newsPortal", "post", "article"] && slug.current == $slug][0]{${NEWS_FIELDS}}`,
    { slug }
  )

  // 2. Decoded
  if (!news) {
    news = await freshClient.fetch(
      `*[_type in ["news", "newsPortal", "post", "article"] && slug.current == $decoded][0]{${NEWS_FIELDS}}`,
      { decoded }
    )
  }

  // 3. ID match
  if (!news) {
    news = await freshClient.fetch(
      `*[_type in ["news", "newsPortal", "post", "article"] && _id == $slug][0]{${NEWS_FIELDS}}`,
      { slug }
    )
  }

  // 4. Any type with slug (fallback)
  if (!news) {
    const anyDoc = await freshClient.fetch(
      `*[slug.current == $slug || slug.current == $decoded][0]{_id,_type,"slug":slug.current}`,
      { slug, decoded }
    )
    console.log('[NEWS] Any doc with slug:', anyDoc)
    if (anyDoc) {
      news = await freshClient.fetch(
        `*[_id == $id][0]{${NEWS_FIELDS}}`,
        { id: anyDoc._id }
      )
    }
  }

  if (!news) {
    const allNews = await freshClient.fetch(`*[_type == "news"][0...30]{_id,"slug":slug.current,title}`)
    const allCompanies = await freshClient.fetch(`*[_type == "company"][0...30]{_id,"slug":slug.current,companyName}`)
    
    return (
      <main style={{ padding: 20, fontFamily: 'monospace', background: 'white', color: 'black', minHeight: '100vh' }}>
        <h1>DEBUG: News not found</h1>
        <p>Requested slug: <b>{slug}</b></p>
        <p>Decoded: <b>{decoded}</b></p>
        
        <h3 style={{ marginTop: 20 }}>All news slugs (30):</h3>
        <ul>
          {allNews.map((n: NewsItem) => <li key={n._id}>{n.slug} - {n.title?.substring(0, 40)}</li>)}
        </ul>

        <h3 style={{ marginTop: 20 }}>All company slugs (30):</h3>
        <ul>
          {allCompanies.map((c: CompanyItem) => <li key={c._id}>{c.slug} - {c.companyName}</li>)}
        </ul>
      </main>
    )
  }

  return <NewsDetailClient news={news} />
}

