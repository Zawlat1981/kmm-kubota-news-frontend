import { client } from '@/lib/sanity'
import CompaniesDetailClient from './CompaniesClient'

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

const query = `*[_type == "company" && slug.current == $slug][0]{
  _id,
  "name": coalesce(companyName, name),
  brand,
  companyGroup,
  category,
  "state": stateRegion,
  "township": cityTownship,
  location,
  address,
  email,
  mainImage,
  companyImage,
  googleMapUrl,
  "slug": slug.current,
  branchOffices[]{
    address,
    phone,
    googleMapUrl
  }
}`

export default async function Page({ params }: { params: { slug: string } }) {
  const company: Company | null = await client.fetch(query, { slug: params.slug }, { cache: 'no-store' })

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Company not found: {params.slug}</p>
      </div>
    )
  }

  return <CompaniesDetailClient company={company} />
}