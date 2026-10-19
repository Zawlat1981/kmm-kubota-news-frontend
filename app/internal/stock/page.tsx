import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import StockBranchView from './StockBranchView'

export const dynamic = 'force-dynamic'

export default async function InternalStockPage() {
  const [items, branches] = await Promise.all([
    prisma.stockItem.findMany({
      include: { branch: true },
      orderBy: [{ modelNumber: 'asc' }],
    }),
    prisma.branch.findMany({ orderBy: { code: 'asc' } }),
  ])

  // Serialize dates for the client component
  const serializedItems = items.map((item) => ({
    id: item.id,
    branchCode: item.branch.code,
    brand: item.brand,
    modelNumber: item.modelNumber,
    serialNumber: item.serialNumber,
    addedAt: item.addedAt.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KMM Stock List</h1>
            <p className="text-sm text-gray-500 mt-1">Internal use only — do not share outside KMM</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/internal/stock/add"
              className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition"
            >
              + Add Stock Item
            </Link>
            <LogoutButton />
          </div>
        </div>

        <StockBranchView
          items={serializedItems}
          branchCodes={branches.map((b) => b.code)}
        />
      </div>
    </main>
  )
}