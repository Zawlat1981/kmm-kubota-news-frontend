import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CompanyDetailTabs from './CompanyDetailTabs'
import { ArrowLeft, Building2 } from 'lucide-react'

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
  const resolveParams = await params
  const company = await getCompany(resolveParams.slug)

  if (!company) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* --- Back Button --- */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-red-600" /> Back to Menu
          </Link>
        </div>

        {/* --- Main Card --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero Image or Fallback Header */}
          {company.companyImage ? (
            <div className="w-full h-72 sm:h-96 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={urlFor(company.companyImage).url()} 
                alt={company.companyName || 'Company Image'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {company.companyName}
                </h1>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
              <div className="flex items-center gap-3 mb-2 text-red-400">
                <Building2 className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase tracking-wider">Company Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {company.companyName}
              </h1>
            </div>
          )}

          <div className="p-6 sm:p-8">
            <CompanyDetailTabs company={company} />
          </div>
        </div>
      </div>
    </main>
  )
}