import { client } from '../../lib/sanity'
import Link from 'next/link'
import { ExtraText, LocalizedDate, UiText } from '@/components/LocalizedText'
import NewsTitle from '@/components/NewsTitle'

interface NewsItem {
  title: string
  slug: { current: string }
  category?: string
  publishedAt?: string
  body?: string
}

async function getAllNews(): Promise<NewsItem[]> {
  const query = `*[_type == "newsPortal"] | order(publishedAt desc) {
    title,
    slug,
    category,
    publishedAt,
    body
  }`
  return await client.fetch(query)
}

export default async function ArchivePage() {
  const newsList = await getAllNews()

  // သတင်းများကို လ/နှစ် (Month & Year) အလိုက် အုပ်စုဖွဲ့ခြင်း
  const groupedByMonth: { [key: string]: NewsItem[] } = {}

  newsList.forEach((news) => {
    if (news.publishedAt) {
      const date = new Date(news.publishedAt)
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = []
      }
      groupedByMonth[monthYear].push(news)
    }
  })

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900"><ExtraText textKey="archive" /></h1>
            <p className="text-sm text-gray-500 mt-1"><ExtraText textKey="archiveDesc" /></p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <UiText textKey="backToHome" />
          </Link>
        </div>

        {/* Archive List by Month */}
        {Object.keys(groupedByMonth).length > 0 ? (
          Object.entries(groupedByMonth).map(([monthYear, items]) => {
            
            // ထိုလအတွင်းရှိ သတင်းများကို ရက်အလိုက် (Day) ထပ်မံအုပ်စုဖွဲ့ခြင်း
            const groupedByDay: { [key: string]: NewsItem[] } = {}
            items.forEach((news) => {
              const dayDate = new Date(news.publishedAt!).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
              if (!groupedByDay[dayDate]) {
                groupedByDay[dayDate] = []
              }
              groupedByDay[dayDate].push(news)
            })

            return (
              <div key={monthYear} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-red-600 border-b border-gray-100 pb-3 mb-4 flex items-center">
                  📅 <LocalizedDate value={items[0].publishedAt!} monthOnly /> <span className="ml-2 text-xs font-normal text-gray-500">({items.length} <ExtraText textKey="newsCount" />)</span>
                </h2>

                {/* Day-by-Day breakdown inside the month */}
                <div className="space-y-6">
                  {Object.entries(groupedByDay).map(([dayStr, dayNewsList]) => (
                    <div key={dayStr} className="border-l-2 border-red-500 pl-4 ml-2">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2"><LocalizedDate value={dayNewsList[0].publishedAt!} /></h3>
                      <ul className="space-y-2">
                        {dayNewsList.map((news, idx) => (
                          <li key={idx}>
                            <Link 
                              href={`/news/${news.slug?.current}`}
                              className="text-gray-900 hover:text-red-600 font-medium text-sm transition flex items-center justify-between group"
                            >
                              <span className="min-w-0 group-hover:underline">• <NewsTitle title={news.title} textClassName="line-clamp-1" /></span>
                              <span className="text-xs text-blue-600 ml-4 whitespace-nowrap"><ExtraText textKey="read" /> →</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
            <ExtraText textKey="noArchived" />
          </div>
        )}

      </div>
    </main>
  )
}