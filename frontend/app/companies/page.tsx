import { client } from '@/lib/sanity'
import CompaniesClient from './CompaniesClient'

export interface Company {
  _id: string
  companyGroup?: string
  companyName?: string
  category?: string
  brand?: string
  stateRegion?: string
  cityTownship?: string
  phone?: string
  address?: string
  website?: string
  email?: string
  googleMapUrl?: string
  companyImage?: { 
    _ref: string
    _type: string
  }
  salesPersonName?: string
  salesPhone?: string
}

async function getCompanies(): Promise<Company[]> {
  const query = `*[_type == "company"]{
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
  return await client.fetch(query)
}

export default async function Page() {
  const companies = await getCompanies()

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Company Directory
        </h1>
        <CompaniesClient companies={companies} />
      </div>
    </main>
  )
}