'use client'

import { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/sanity'

interface NewsItem {
  _id?: string
  title: string
  slug?: { current: string }
  category?: string
  publishedAt?: string
  mainImage?: Record<string, unknown>
  body?: string
}

interface CompanyItem {
  _id: string
  slug?: { current: string }
  companyGroup?: string
  companyName?: string
  category?: string
  brand?: string
  stateRegion?: string
  cityTownship?: string
  companyImage?: { 
    asset?: Record<string, unknown>
    [key: string]: unknown
  }
  address?: string
  phone?: string
  email?: string
}

interface NewsContainerProps {
  newsList: NewsItem[]
  companiesList?: CompanyItem[]
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

export default function NewsContainer({ newsList, companiesList }: NewsContainerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBrandPriceFilter, setSelectedBrandPriceFilter] = useState('ALL')
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState('ALL')
  
  const [visibleCount, setVisibleCount] = useState(9)

  const filteredNews = newsList.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (news.body && news.body.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'ALL' || 
      (news.category && news.category.toLowerCase().includes(selectedCategory.toLowerCase()))

    let matchesDate = true
    if (selectedDate !== '' && news.publishedAt) {
      const newsDateOnly = news.publishedAt.split('T')[0]
      matchesDate = newsDateOnly === selectedDate
    }

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

  const filteredCompanies = companiesList?.filter((company) => {
    if (selectedCompanyGroup === 'ALL') return true
    return company.companyGroup === selectedCompanyGroup
  }) || []

  const displayedNews = filteredNews.slice(0, visibleCount)

  const handleLoadMore = (): void => {
    setVisibleCount((prev) => prev + 9)
  }

  return (
    <div>
      {/* --- DASHBOARD FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div>
          <input 
            type="text"
            placeholder="Search by Title or Main text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

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

        <div>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          />
        </div>

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

        <div>
          <select 
            value={selectedCompanyGroup}
            onChange={(e) => setSelectedCompanyGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white font-medium text-red-600"
          >
            <option value="ALL">All Companies</option>
            <option value="kubota">Kubota Companies</option>
            <option value="other">Other Brand Companies</option>
          </select>
        </div>
      </div>
      
      {/* --- COMPANIES DIRECTORY PREVIEW --- */}
      {selectedCompanyGroup !== 'ALL' && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {selectedCompanyGroup === 'kubota' ? 'Kubota Companies' : 'Other Brand Companies'} Directory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => {
                const detailId = company.slug?.current || company._id
                return (
                  <Link 
                    href={`/companies/${detailId}`}
                    key={company._id} 
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group"
                  >
                    {company.companyImage ? (
                      <div className="h-40 overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={urlFor(company.companyImage).url()} 
                          alt={company.companyName || 'Company'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-red-50 flex items-center justify-center text-red-500 font-bold text-xl">
                        🏢 {company.companyName?.charAt(0) || 'C'}
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-red-600 transition">
                        {company.companyName}
                      </h4>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {company.brand && (
                          <div className="flex items-center gap-2">
                            <span>🏷️</span>
                            <span className="font-medium text-gray-700">Brand:</span> {company.brand}
                          </div>
                        )}
                        {(company.cityTownship || company.stateRegion) && (
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span className="font-medium text-gray-700">Location:</span> {[company.cityTownship, company.stateRegion].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>

                      <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center gap-1">
                        View Detail →
                      </span>
                    </div>
                  </Link>
                )
              })
            ) : (
              <p className="col-span-full text-sm text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">
                ဤအုပ်စုအတွက် ကုမ္ပဏီအချက်အလက် မရှိသေးပါ။
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- NEWS GRID SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {displayedNews.length > 0 ? (
          displayedNews.map((news, index) => {
            const newsDetailId = news.slug?.current || news._id
            return (
              <Link 
                href={`/news/${newsDetailId}`} 
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
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            No news found matching your search criteria.
          </div>
        )}
      </div>

      {/* --- LOAD MORE BUTTON --- */}
      {visibleCount < filteredNews.length && (
        <div className="text-center mb-12">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200 text-sm"
          >
            Load More News ↓
          </button>
        </div>
      )}

      {/* --- MONTHLY ARCHIVE SECTION LINK --- */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-md">
        <h3 className="text-xl font-bold mb-2">သတင်းဟောင်းများ ရှာဖွေရန်</h3>
        <p className="text-gray-300 text-sm mb-6">
          คุณสามารถอ่านข่าวสารย้อนหลังทั้งหมดที่จัดระเบียบตามเดือนและวันที่ได้ใน Monthly Archive
        </p>
        <Link 
          href="/archive" 
          className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-lg shadow hover:bg-gray-100 transition duration-200 text-sm"
        >
          View Monthly Archive →
        </Link>
      </div>
    </div> 
  )
}