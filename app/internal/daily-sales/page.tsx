import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LogoutButton from '../stock/LogoutButton'
import DailySalesEditor from './DailySalesEditor'

export const dynamic = 'force-dynamic'

export default async function InternalDailySalesPage() {
  const sales = await prisma.dailySale.findMany({
    orderBy: [{ saleDate: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-700">KMM Internal</p>
            <h1 className="text-2xl font-bold text-gray-900">Daily Sales စာရင်းပြင်ရန်</h1>
            <p className="mt-1 text-sm text-gray-500">စာကြောင်းတစ်ကြောင်းလုံးကို ပြင်ပြီး သိမ်းနိုင်ပါသည်။</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/daily-sales" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
              Public Report ကြည့်ရန်
            </Link>
            <LogoutButton />
          </div>
        </div>
        <DailySalesEditor
          sales={sales.map((sale) => ({
            id: sale.id,
            branch: sale.branch,
            saleDate: sale.saleDate.toISOString().slice(0, 10),
            model: sale.model,
            customerName: sale.customerName,
            division: sale.division,
            paymentType: sale.paymentType,
            salesPerson: sale.salesPerson,
            photoUrl: sale.photoUrl || '',
            stockRemaining: sale.stockRemaining ?? 0,
          }))}
        />
      </div>
    </main>
  )
}