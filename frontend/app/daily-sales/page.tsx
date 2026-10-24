import DailySalesReport from '@/components/DailySalesDashboard'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

const DAILY_SALES_QUERY = `*[_type in ["dailySale", "dailySales", "sale", "sales"]] | order(saleDate desc, _createdAt desc) {
  "id": _id,
  "_id": _id,
  branch,
  saleDate,
  model,
  customerName,
  "regionDivision": coalesce(regionDivision, division, region),
  "division": coalesce(regionDivision, division, region),
  paymentType,
  salesPerson,
  "photo": photo{asset->{url}},
  "photoUrl": coalesce(photo.asset->url, photoUrl),
  stockRemaining
}`

interface SanityDailySale {
  id: string
  _id: string
  branch: string
  saleDate: string
  model: string
  customerName: string
  regionDivision: string
  division: string
  paymentType: string
  salesPerson: string
  photo: { asset: { url: string } } | null
  photoUrl: string | null
  stockRemaining: number | null
}

export default async function DailySalesPage() {
  const sales = await client.fetch<SanityDailySale[]>(DAILY_SALES_QUERY, {}, { perspective: 'published' }).catch(() => [])

  return (
    <DailySalesReport sales={sales} />
  )
}

