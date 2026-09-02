'use client'

import { useState } from 'react'

interface Branch {
  address?: string
  phone?: string
  googleMapUrl?: string
}

interface Company {
  _id: string
  companyGroup?: string
  companyName?: string
  category?: string
  brand?: string
  stateRegion?: string
  cityTownship?: string
  branches?: Branch[]
  website?: string
  email?: string
  companyImage?: unknown
  facebookLink?: string
  tiktokLink?: string
  viber?: string
  telegram?: string
  salesPersonName?: string
  salesPhone?: string
  salesFbLink?: string
  salesTtLink?: string
}

export default function CompanyDetailTabs({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<'details' | 'contact'>('details')

  const hasContactInfo = 
    company.email || 
    company.website || 
    company.facebookLink || 
    company.tiktokLink || 
    company.viber || 
    company.telegram || 
    company.salesPersonName || 
    company.salesPhone || 
    company.salesFbLink || 
    company.salesTtLink ||
    (company.branches && company.branches.some(b => b.phone))

  return (
    <div>
      {/* Tab Switcher Buttons */}
      {hasContactInfo && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition ${
              activeTab === 'details'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            အသေးစိတ် အချက်အလက် (Details)
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition ${
              activeTab === 'contact'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ဆက်သွယ်ရန် (Contact)
          </button>
        </div>
      )}

      {/* Details Tab Content */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          {company.brand && (
            <div className="flex items-start gap-3 text-gray-700">
              <span className="text-xl">🚜</span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Brand</span>
                <span className="text-base font-medium text-gray-800">{company.brand}</span>
              </div>
            </div>
          )}

          {company.companyGroup && (
            <div className="flex items-start gap-3 text-gray-700">
              <span className="text-xl">🏡</span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Company Group</span>
                <span className="text-base font-medium text-gray-800 capitalize">{company.companyGroup}</span>
              </div>
            </div>
          )}

          {company.category && (
            <div className="flex items-start gap-3 text-gray-700">
              <span className="text-xl">🏷️</span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Category</span>
                <span className="text-base font-medium text-gray-800">{company.category}</span>
              </div>
            </div>
          )}

          {(company.cityTownship || company.stateRegion) && (
            <div className="flex items-start gap-3 text-gray-700">
              <span className="text-xl">🗺️</span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Region</span>
                <span className="text-base font-medium text-gray-800">
                  {[company.cityTownship, company.stateRegion].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Branches */}
          {company.branches && company.branches.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Branch Offices</span>
              {company.branches.map((branch, index: number) => {
                const hasContent = branch.address || branch.phone || branch.googleMapUrl
                if (!hasContent) return null

                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                    {branch.address && (
                      <div className="flex items-start gap-3 text-gray-700">
                        <span className="text-lg">📍</span>
                        <span className="text-sm font-medium text-gray-800">{branch.address}</span>
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-start gap-3 text-gray-700">
                        <span className="text-lg">📞</span>
                        <a href={`tel:${branch.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                          {branch.phone}
                        </a>
                      </div>
                    )}
                    {branch.googleMapUrl && (
                      <a
                        href={branch.googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition text-xs gap-1"
                      >
                        🗺️ View on Google Map
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Contact Tab Content */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {company.email && (
            <div className="flex items-start gap-3 text-gray-700">
              <span className="text-xl">✉️</span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Email Address</span>
                <a href={`mailto:${company.email}`} className="text-base font-medium text-blue-600 hover:underline">
                  {company.email}
                </a>
              </div>
            </div>
          )}

          {company.website && (
            <div className="flex items-start gap-3 text-gray-700">
              <span className="text-xl">🌐</span>
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Website</span>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-blue-600 hover:underline">
                  {company.website}
                </a>
              </div>
            </div>
          )}

          {/* Social Links */}
          {(company.facebookLink || company.tiktokLink || company.viber || company.telegram) && (
            <div>
              <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400 mb-3">Social Media</span>
              <div className="flex flex-wrap gap-2">
                {company.facebookLink && (
                  <a
                    href={company.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition"
                  >
                    Facebook
                  </a>
                )}
                {company.tiktokLink && (
                  <a
                    href={company.tiktokLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-50 text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium transition"
                  >
                    TikTok
                  </a>
                )}
                {company.viber && (
                  <span className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg font-medium">
                    Viber: {company.viber}
                  </span>
                )}
                {company.telegram && (
                  <a
                    href={company.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg hover:bg-sky-100 font-medium transition"
                  >
                    Telegram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Sales Contact */}
          {(company.salesPersonName || company.salesPhone || company.salesFbLink || company.salesTtLink) && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Sales Contact</span>

              {company.salesPersonName && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">👤</span>
                  <span className="text-base font-medium text-gray-800">{company.salesPersonName}</span>
                </div>
              )}

              {company.salesPhone && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">📱</span>
                  <a href={`tel:${company.salesPhone}`} className="text-base font-medium text-blue-600 hover:underline">
                    {company.salesPhone}
                  </a>
                </div>
              )}

              {(company.salesFbLink || company.salesTtLink) && (
                <div className="flex gap-3 pl-9">
                  {company.salesFbLink && (
                    <a
                      href={company.salesFbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      FB
                    </a>
                  )}
                  {company.salesTtLink && (
                    <a
                      href={company.salesTtLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-800 hover:underline font-medium"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}