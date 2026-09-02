import { client } from '@/lib/sanity'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CompaniesClient from './CompaniesClient'

export interface Branch {
  address?: string
  phone?: string
  googleMapUrl?: string
}

export interface Company {
  _id: string
  slug?: { current: string }
  companyGroup?: string
  companyName?: string
  category?: string
  brand?: string
  stateRegion?: string
  cityTownship?: string
  branches?: Branch[]
  website?: string
  email?: string
  companyImage?: {
    _ref: string
    _type: string
  }
  facebookLink?: string
  tiktokLink?: string
  viber?: string
  telegram?: string
  salesPersonName?: string
  salesPhone?: string
  salesFbLink?: string
  salesTtLink?: string
}

async function getCompanies(): Promise<Company[]> {
  const query = `*[_type == "company"]{
    _id,
    slug,
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
  return await client.fetch(query)
}

export default async function Page() {
  const companies = await getCompanies()

  const kubotaCount = companies.filter((c) => c.companyGroup === 'kubota').length
  const otherCount = companies.filter((c) => c.companyGroup === 'other').length
  const regionCount = new Set(
    companies.map((c) => c.stateRegion).filter(Boolean)
  ).size

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* --- Back Button --- */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to Menu
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Company Directory
        </h1>

        {/* --- Market Coverage Stats --- */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">
                {companies.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total Companies</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-green-600">
                {kubotaCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Kubota</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-blue-600">
                {otherCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Other Brands</p>
            </div>
          </div>
          {regionCount > 0 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Covering {regionCount} regions across Myanmar
            </p>
          )}
        </div>

        <CompaniesClient
          companies={companies}
          kubotaCount={kubotaCount}
          otherCount={otherCount}
        />
      </div>
    </main>
  )
}