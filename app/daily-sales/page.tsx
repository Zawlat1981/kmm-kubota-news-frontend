import DailySalesReport from '@/components/DailySalesReport'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

const DAILY_SALES_QUERY = `*[_type == "dailySale"] | order(saleDate desc, _createdAt desc) {
  "id": _id,
  branch,
  saleDate,
  model,
  customerName,
  division,
  paymentType,
  salesPerson,
  photoUrl,
  stockRemaining
}`

interface SanityDailySale {
  id: string
  branch: string
  saleDate: string
  model: string
  customerName: string
  division: string
  paymentType: string
  salesPerson: string
  photoUrl: string | null
  stockRemaining: number | null
}

export default async function DailySalesPage() {
  const sales = await client.fetch<SanityDailySale[]>(DAILY_SALES_QUERY)

  return (
    <DailySalesReport sales={sales} />
  )
}
