import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CompanyDetailProps {
  params: Promise<{
    slug: string
  }>
}

async function getCompany(slug: string) {
  const query = `*[_type == "company" && (slug.current == $slug || _id == $slug)][0]{
    _id,
    companyGroup,
    companyName,
    category,
    brand,
    stateRegion,
    cityTownship,
    branches,
    website,
    email,
    companyImage,
    facebookLink,
    tiktokLink,
    viber,
    telegram,
    salesPersonName,
    salesPhone,
    salesFbLink,
    salesTtLink
  }`
  const company = await client.fetch(query, { slug })
  return company
}

export default async function CompanyDetailPage({ params }: CompanyDetailProps) {
  const resolveParams=await params
  const company = await getCompany(resolveParams.slug)

  if (!company) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* --- Back Button --- */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition"
          >
            ← Back to Menu
          </Link>
        </div>

        {/* --- Main Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Company Image */}
          {company.companyImage && (
            <div className="w-full h-64 sm:h-80 bg-gray-100 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={urlFor(company.companyImage).url()} 
                alt={company.companyName || 'Company Image'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Company Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {company.companyName}
            </h1>

            {/* --- Conditional Fields (Only shown if filled) --- */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              
              {company.brand && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">🏷️</span>
                  <div>
                    <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Brand</span>
                    <span className="text-base font-medium text-gray-800">{company.brand}</span>
                  </div>
                </div>
              )}

              {company.companyGroup && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">📂</span>
                  <div>
                    <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Company Group</span>
                    <span className="text-base font-medium text-gray-800 capitalize">{company.companyGroup}</span>
                  </div>
                </div>
              )}

              {company.category && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">📑</span>
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

              {/* --- ရုံးခွဲများ (Branches) --- */}
              {company.branches && company.branches.length > 0 && (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Branch Offices</span>
                  {company.branches.map((branch: { address?: string; phone?: string; googleMapUrl?: string }, index: number) => {
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

              {/* --- Social Links --- */}
              {(company.facebookLink || company.tiktokLink || company.viber || company.telegram) && (
                <div className="flex flex-wrap gap-2 pt-2">
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
              )}

              {/* --- Sales Contact --- */}
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
          </div>
        </div>
      </div>
    </main>
  )
}
