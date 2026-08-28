'use client'

import { useState } from 'react'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { Company } from './page'

const builder = imageUrlBuilder(client)
function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0])
}

export default function CompaniesClient({ companies }: { companies: Company[] }) {
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
          Kubota Companies
        </button>
        <button
          onClick={() => setSelectedGroup('other')}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${
            selectedGroup === 'other'
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Other Brand Companies
        </button>
      </div>

      {/* ကုမ္ပဏီစာရင်း Card များ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
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

                  {company.phone && <p><strong>Phone:</strong> {company.phone}</p>}
                  {company.address && <p><strong>Address:</strong> {company.address}</p>}
                </div>

                {(company.salesPersonName || company.salesPhone) && (
                  <div className="bg-gray-50 p-3.5 rounded-xl mb-4 text-xs text-gray-700 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-1">Sales Contact:</p>
                    {company.salesPersonName && <p>Name: {company.salesPersonName}</p>}
                    {company.salesPhone && <p>Phone: {company.salesPhone}</p>}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 mt-auto">
                {company.googleMapUrl && (
                  <a
                    href={company.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium transition"
                  >
                    View on Map
                  </a>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium transition"
                  >
                    Website
                  </a>
                )}
                {company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 py-12 bg-white rounded-2xl border border-gray-200">
            ဤအုပ်စုအတွက် ကုမ္ပဏီအချက်အလက် မရှိသေးပါ။
          </p>
        )}
      </div>
    </div>
  )
}