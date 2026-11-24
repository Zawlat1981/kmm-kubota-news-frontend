import { client } from '@/lib/sanity'
import Link from 'next/link'
import CompanyCards from '@/components/CompanyCards'
import { UiText } from '@/components/LocalizedText'
import { normalizeCompany, type CompanyRecord } from '@/lib/company'

export interface BranchOffice {
  address?: string
  phone?: string
  googleMapUrl?: string
}

export interface SanityImage {
  _type: string
  asset: {
    _ref: string
    _type: string
  }
}

export interface Company {
  _id: string
  name?: string
  companyName?: string
  brand?: string
  companyGroup?: string
  category?: string
  state?: string
  township?: string
  location?: string
  address?: string
  email?: string
  mainImage?: SanityImage
  companyImage?: SanityImage
  googleMapUrl?: string
  branchOffices?: BranchOffice[]
  slug?: string
}

const query = `*[_type == "company"] | order(companyName asc) {
  _id,
  slug,
  companyGroup,
  companyName,
  category,
  brand,
  stateRegion,
  cityTownship,
  companyImage,
}`

export default async function Page() {
  const companies = await client.fetch<CompanyRecord[]>(query, {}, { cache: 'no-store' })
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition">
          ← <UiText textKey="backToMenu" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 my-6"><UiText textKey="companyBannerTitle" /></h1>
        <CompanyCards companies={companies.map(normalizeCompany)} />
      </div>
    </main>
  )
}