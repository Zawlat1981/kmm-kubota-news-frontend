import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CompanyDetailProps {
  params: {
    slug: string
  }
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
    phone,
    address,
    website,
    email,
    googleMapUrl,
    companyImage,
    salesPersonName,
    salesPhone
  }`
  const company = await client.fetch(query, { slug })
  return company
}

export default async function CompanyDetailPage({ params }: CompanyDetailProps) {
  const company = await getCompany(params.slug)

  if (!company) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* --- Back Button --- */}
        <div className="mb-6">
          <Link 
            href="/companies" 
            className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition"
          >
            ← Back to Companies
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

              {(company.cityTownship || company.stateRegion || company.address) && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">📍</span>
                  <div>
                    <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Location & Address</span>
                    <span className="text-base font-medium text-gray-800">
                      {[company.address, company.cityTownship, company.stateRegion].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {company.phone && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">📞</span>
                  <div>
                    <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Phone Number</span>
                    <a href={`tel:${company.phone}`} className="text-base font-medium text-blue-600 hover:underline">
                      {company.phone}
                    </a>
                  </div>
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

              {company.salesPersonName && (
                <div className="flex items-start gap-3 text-gray-700 pt-4 border-t border-gray-100">
                  <span className="text-xl">👤</span>
                  <div>
                    <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Sales Person</span>
                    <span className="text-base font-medium text-gray-800">{company.salesPersonName}</span>
                  </div>
                </div>
              )}

              {company.salesPhone && (
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl">📱</span>
                  <div>
                    <span className="font-semibold block text-xs uppercase tracking-wider text-gray-400">Sales Phone</span>
                    <a href={`tel:${company.salesPhone}`} className="text-base font-medium text-blue-600 hover:underline">
                      {company.salesPhone}
                    </a>
                  </div>
                </div>
              )}

              {company.googleMapUrl && (
                <div className="pt-4">
                  <a 
                    href={company.googleMapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition text-sm gap-2"
                  >
                    🗺️ View on Google Map
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}