import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  ArrowLeft,
} from 'lucide-react'
import CompanyDetailTabs from './CompanyDetailTabs'

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
    distributor,
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

  const region = [company.cityTownship, company.stateRegion]
    .filter(Boolean)
    .join(', ')

  return (
    <main className="min-h-screen bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* --- Back Button --- */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8A8578] hover:text-[#1A1A1A] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Back to menu
        </Link>

        {/* --- Main Card --- */}
        <div className="bg-white rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {/* Hero image with overlay title */}
          {company.companyImage && (
            <div className="relative w-full h-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(company.companyImage).url()}
                alt={company.companyName || 'Company Image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              {company.category && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/95 text-[11px] font-semibold text-[#C6001E] tracking-wide">
                    {company.category}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {company.companyName}
                </h1>
                {region && (
                  <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                    {region}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* If no image, show title as plain header */}
          {!company.companyImage && (
            <div className="p-5 pb-0">
              <h1 className="text-2xl font-bold text-[#1A1A1A] leading-tight">
                {company.companyName}
              </h1>
              {region && (
                <p className="text-sm text-[#8A8578] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                  {region}
                </p>
              )}
            </div>
          )}

          {/* Client component: tabs + all conditional fields */}
          <CompanyDetailTabs company={company} />
        </div>
      </div>
    </main>
  )
}