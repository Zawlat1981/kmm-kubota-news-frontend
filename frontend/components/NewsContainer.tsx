'use client'

import { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/sanity'

interface NewsItem {
  title: string
  slug: { current: string }
  category?: string
  publishedAt?: string
  mainImage?: Record<string, unknown>
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
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBrandPriceFilter, setSelectedBrandPriceFilter] = useState('ALL')

  // Filter လုပ်ခြင်း (Search, Category, Date Picker, Brand Price Filter)
  const filteredNews = newsList.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (news.body && news.body.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'ALL' || 
      (news.category && news.category.toLowerCase().includes(selectedCategory.toLowerCase()))

    // Calendar Date Filter စစ်ဆေးခြင်း
    let matchesDate = true
    if (selectedDate !== '' && news.publishedAt) {
      const newsDateOnly = news.publishedAt.split('T')[0]
      matchesDate = newsDateOnly === selectedDate
    }

    // Brand & Price Filter စစ်ဆေးခြင်း
    let matchesBrandPrice = true
    if (selectedBrandPriceFilter !== 'ALL') {
      const brandQuery = selectedBrandPriceFilter.toLowerCase()
      const titleMatch = news.title.toLowerCase().includes(brandQuery)
      const bodyMatch = news.body ? news.body.toLowerCase().includes(brandQuery) : false
      const categoryMatch = news.category ? news.category.toLowerCase().includes(brandQuery) : false
      matchesBrandPrice = titleMatch || bodyMatch || categoryMatch
    }

    return matchesSearch && matchesCategory && matchesDate && matchesBrandPrice
  })

  return (
    <div>
      {/* --- DASHBOARD FILTER SECTION (4 Columns Layout) --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* 1. Search Input */}
        <div>
          <input 
            type="text"
            placeholder="Search by Title or Main text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        {/* 2. Tractor Brands & Categories Filter Dropdown */}
        <div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">Brand Selection</option>
            <option value="kubota-news">Kubota News</option>
            <option value="yammar-news">Yanmar News</option>
            <option value="john-deere-news">John Deere News</option>
            <option value="new-holland-news">New Holland News</option>
            <option value="yto-news">YTO News</option>
            <option value="sonalika-news">Sonalika News</option>
            <option value="yamabisi-news">Yamabisi News</option>
            <option value="mahindra-news">Mahindra News</option>
            <option value="dongfeng-news">Dongfeng News</option>
            <option value="crop-prices">Crop Prices</option>
            <option value="fuel-prices">Fuel Prices</option>
            <option value="myanmar-news">Myanmar News</option>
          </select>
        </div>

        {/* 3. Calendar Date Picker */}
        <div>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          />
        </div>

        {/* 4. Brand Price & Details Filter Dropdown */}
        <div>
          <select 
            value={selectedBrandPriceFilter}
            onChange={(e) => setSelectedBrandPriceFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">All Brand Prices</option>
            <option value="Kubota">Kubota</option>
            <option value="Win Shwe Wah">Win Shwe Wah (Second Kubota)</option>
            <option value="Yanmar">Yanmar</option>
            <option value="Sonalika">Sonalika</option>
            <option value="Yamabisi">Yamabisi</option>
            <option value="John Deere">John Deere</option>
            <option value="New Holland">New Holland</option>
            <option value="Mahindra">Mahindra</option>
            <option value="YTO">YTO</option>
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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