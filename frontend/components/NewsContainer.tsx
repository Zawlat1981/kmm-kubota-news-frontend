'use client'

import { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '../Lib/sanity'

interface NewsItem {
  title: string
  slug: { current: string }
  category?: string
  publishedAt?: string
  mainImage?: any
  body?: string
}

interface NewsContainerProps {
  newsList: NewsItem[]
}

function formatCategory(category?: string) {
  if (!category) return 'NEWS'
  if (category.includes('မြန်မာနိုင်ငံ') || category.includes('Myanmar')) return 'MYANMAR NEWS'
  if (category.includes('ဈေးနှုန်း') || category.includes('Crop Prices')) return 'CROP PRICES'
  if (category.includes('kubota') || category.includes('Kubota')) return 'KUBOTA NEWS'
  if (category.includes('Second') || category.includes('second') || category.includes('ဒုတိယလက်သုံး')) return 'KUBOTA SECOND NEWS'
  if (category.includes('Other Brand') || category.includes('အခြား')) return 'OTHER BRAND NEWS'
  return category.toUpperCase()
}

export default function NewsContainer({ newsList }: NewsContainerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedMonth, setSelectedMonth] = useState('ALL')
  const [selectedYear, setSelectedYear] = useState('ALL')

  // Filter လုပ်ခြင်း (Search, Category, Month & Year)
  const filteredNews = newsList.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (news.body && news.body.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'ALL' || 
      (news.category && news.category.toLowerCase().includes(selectedCategory.toLowerCase()))

    // publishedAt ထဲက Date ကို အသုံးပြုပြီး Month နဲ့ Year စစ်ဆေးခြင်း
    const newsDate = news.publishedAt ? new Date(news.publishedAt) : null

    const matchesMonth = selectedMonth === 'ALL' || (newsDate && newsDate.toLocaleString('en-US', { month: 'long' }) === selectedMonth)

    const matchesYear = selectedYear === 'ALL' || (newsDate && newsDate.getFullYear().toString() === selectedYear)

    return matchesSearch && matchesCategory && matchesMonth && matchesYear
  })

  return (
    <div>
      {/* --- DASHBOARD FILTER SECTION (4 Columns Layout) --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Search Input */}
        <div>
          <input 
            type="text"
            placeholder="Search by Title or Main text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        {/* Tractor Brands & Categories Filter Dropdown */}
        <div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">Brand Selection</option>
            <option value="Kubota">Kubota</option>
            <option value="Kubota (Second)">Kubota (Second)</option>
            <option value="Yanmar">Yanmar</option>
            <option value="YTO">YTO</option>
            <option value="New Holland">New Holland</option>
            <option value="John Deere">John Deere</option>
            <option value="Mahindra">Mahindra</option>
            <option value="Yamabisi">Yamabisi</option>
            <option value="Sonalika">Sonalika</option>
            <option value="Dongfeng">Dongfeng</option>
          </select>
        </div>

        {/* Month Filter Dropdown */}
        <div>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>

        {/* Year Filter Dropdown */}
        <div>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">All Years</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

      </div>
      
      {/* --- NEWS GRID SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.length > 0 ? (
          filteredNews.map((news, index) => (
            <Link 
              href={`/news/${news.slug?.current}`} 
              key={index}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-gray-200 flex flex-col"
            >
              {news.mainImage && (
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={urlFor(news.mainImage).url()} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              
              <div className="p-4 flex flex-col flex-grow">
                {news.category && (
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                    {formatCategory(news.category)}
                  </span>
                )}

                {news.publishedAt && (
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(news.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}

                <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-2 mb-2">
                  {news.title}
                </h2>
                
                {news.body && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {news.body}
                  </p>
                )}

                <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center">
                  Read full story →
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            No news found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  )
}