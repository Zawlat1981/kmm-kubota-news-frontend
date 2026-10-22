'use client'
import Link from 'next/link'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { Company, SanityImage } from './page'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImage) {
  return builder.image(source)
}

export default function CompaniesDetailClient({ company }: { company: Company }) {
  const branches = company.branchOffices?.filter(b => b.address && b.address !== 'No address') || []
  const imageSource = company.mainImage || company.companyImage

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w- mx-auto p-4">
        <Link href="/companies" className="inline-flex items-center gap-1 text- text-red-600 bg-white px-4 py-2 rounded-full border shadow-sm mb-4 hover:bg-gray-50">
          ← Back to Menu
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
          {imageSource ? (
            <div className="relative w-full h-">
              <Image
                src={urlFor(imageSource).url()}
                alt={company.name || 'Company'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h- bg-gray-100" />
          )}

          <div className="p-6">
            <h1 className="font-serif text- font-bold text-gray-900">{company.name}</h1>
            <div className="h-px bg-gray-100 my-4" />

            <div className="space-y-5">
              {company.brand && (
                <div className="flex gap-3">
                  <span>🏷️</span>
                  <div>
                    <p className="text- text-gray-400 font-bold uppercase tracking-wider">BRAND</p>
                    <p className="text- text-gray-800">{company.brand}</p>
                  </div>
                </div>
              )}

              {company.companyGroup && (
                <div className="flex gap-3">
                  <span>📁</span>
                  <div>
                    <p className="text- text-gray-400 font-bold uppercase tracking-wider">COMPANY GROUP</p>
                    <p className="text- text-gray-800">{company.companyGroup}</p>
                  </div>
                </div>
              )}

              {company.category && (
                <div className="flex gap-3">
                  <span>📄</span>
                  <div>
                    <p className="text- text-gray-400 font-bold uppercase tracking-wider">CATEGORY</p>
                    <p className="text- text-gray-800">{company.category}</p>
                  </div>
                </div>
              )}

              {branches.length > 0 ? (
                branches.map((branch, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="mt-0.5">📍</span>
                    <div className="flex-1 min-w-0">
                      <p className="text- text-gray-400 font-bold uppercase tracking-wider">
                        LOCATION & ADDRESS {branches.length > 1 ? `#${idx+1}` : ''}
                      </p>
                      <p className="text- text-gray-800 mt-1 leading-snug break-words">
                        {branch.address}
                      </p>
                      {branch.googleMapUrl && (
                        <a
                          href={branch.googleMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text- text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          🔗 {branch.googleMapUrl}
                        </a>
                      )}
                      {branch.phone && (
                        <p className="text- text-gray-500 mt-2">📞 {branch.phone}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-3">
                  <span className="mt-0.5">📍</span>
                  <div className="flex-1">
                    <p className="text- text-gray-400 font-bold uppercase">LOCATION & ADDRESS</p>
                    <p className="text- text-gray-800 mt-1">
                      {[company.township, company.state].filter(Boolean).join(', ') || company.location || company.address}
                    </p>
                    {company.googleMapUrl && (
                      <a href={company.googleMapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text- text-blue-600 hover:underline break-all">
                        🔗 {company.googleMapUrl}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {company.email && (
                <div className="flex gap-3">
                  <span>✉️</span>
                  <div>
                    <p className="text- text-gray-400 font-bold uppercase">EMAIL ADDRESS</p>
                    <a href={`mailto:${company.email}`} className="text- text-blue-600 hover:underline break-all">
                      {company.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}