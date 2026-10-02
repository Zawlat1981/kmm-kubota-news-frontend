import DailySalesReport from '@/components/DailySalesReport'
import { client } from '@/lib/sanity'
import { prisma } from '@/lib/prisma'

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
  "photoUrl": coalesce(photo.asset->url, photoUrl),
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
  const [sanityResult, prismaResult] = await Promise.allSettled([
    client.fetch<SanityDailySale[]>(DAILY_SALES_QUERY),
    prisma.dailySale.findMany({ orderBy: [{ saleDate: 'desc' }, { createdAt: 'desc' }] }),
  ])

  if (sanityResult.status === 'rejected' && prismaResult.status === 'rejected') {
    throw new Error('Unable to load daily sales from Sanity or the database.')
  }

  if (sanityResult.status === 'rejected') console.warn('Failed to load daily sales from Sanity:', sanityResult.reason)
  if (prismaResult.status === 'rejected') console.warn('Failed to load daily sales from the database:', prismaResult.reason)

  const salesById = new Map<string, SanityDailySale>()

  if (sanityResult.status === 'fulfilled') {
    for (const sale of sanityResult.value) {
      const id = sale.id.startsWith('daily-sale-') ? sale.id.slice('daily-sale-'.length) : sale.id
      salesById.set(id, sale)
    }
  }

  if (prismaResult.status === 'fulfilled') {
    for (const sale of prismaResult.value) {
      if (!salesById.has(sale.id)) {
        salesById.set(sale.id, {
          ...sale,
          saleDate: sale.saleDate.toISOString(),
        })
      }
    }
  }

  const sales = Array.from(salesById.values()).sort((a, b) => b.saleDate.localeCompare(a.saleDate))

  return (
    <DailySalesReport sales={sales} />
  )
}
