import { prisma } from '@/lib/prisma'
import DailySalesReport from '@/components/DailySalesReport'

export const dynamic = 'force-dynamic'

export default async function DailySalesPage() {
  const sales = await prisma.dailySale.findMany({
    orderBy: [{ saleDate: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <DailySalesReport
      sales={sales.map((sale) => ({
        id: sale.id,
        branch: sale.branch,
        saleDate: sale.saleDate.toISOString(),
        model: sale.model,
        customerName: sale.customerName,
        division: sale.division,
        paymentType: sale.paymentType,
        salesPerson: sale.salesPerson,
        photoUrl: sale.photoUrl,
        stockRemaining: sale.stockRemaining,
      }))}
    />
  )
}
