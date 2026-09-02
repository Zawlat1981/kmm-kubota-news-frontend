'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { Company } from './page'

const builder = imageUrlBuilder(client)
function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0])
}

export default function CompaniesClient({
  companies,
  kubotaCount,
  otherCount,
}: {
  companies: Company[]
  kubotaCount?: number
  otherCount?: number
}) {
  const [selectedGroup, setSelectedGroup] = useState('kubota')

  const filteredCompanies = companies.filter(
    (company) => company.companyGroup === selectedGroup
  )

  return (
    <div>
      {/* Tab ခလုတ်များ */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setSelectedGroup('kubota')}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${
            selectedGroup === 'kubota'
              ? 'bg-green-600 text-white shadow-md scale-105'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Kubota Companies{typeof kubotaCount === 'number' ? ` (${kubotaCount})` : ''}
        </button>
        <button
          onClick={() => setSelectedGroup('other')}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${
            selectedGroup === 'other'
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Other Brand Companies{typeof otherCount === 'number' ? ` (${otherCount})` : ''}
        </button>
      </div>

      {/* ကုမ္ပဏီစာရင်း Card များ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => {
            const detailId = company.slug?.current || company._id
            return (
              <div key={company._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  {company.companyImage && (
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={urlFor(company.companyImage).url()}
                        alt={company.companyName || 'Company Image'}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {company.companyName && (
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{company.companyName}</h3>
                  )}

                  <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                    {company.category && <p><strong>Category:</strong> {company.category}</p>}
                    {company.brand && <p><strong>Brand:</strong> {company.brand}</p>}

                    {(company.stateRegion || company.cityTownship) && (
                      <p>
                        <strong>Location:</strong> {[company.cityTownship, company.stateRegion].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* ရုံးခွဲများ (Branches) */}
                  {company.branches && company.branches.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {company.branches.map((branch, index) => {
                        const hasContent = branch.address || branch.phone || branch.googleMapUrl
                        if (!hasContent) return null

                        return (
                          <div key={index} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                            {branch.address && <p>📍 {branch.address}</p>}
                            {branch.phone && <p>📞 {branch.phone}</p>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* View Detail button -> links to the full detail page (Details + Contact tabs) */}
                <Link
                  href={`/companies/${detailId}`}
                  className="mt-auto inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2.5 transition"
                >
                  View Detail &amp; Contact →
                </Link>
              </div>
            )
          })
        ) : (
          <p className="text-center col-span-full text-gray-500 py-12 bg-white rounded-2xl border border-gray-200">
            No company information available for this group yet.
          </p>
        )}
      </div>
    </div>
  )
}