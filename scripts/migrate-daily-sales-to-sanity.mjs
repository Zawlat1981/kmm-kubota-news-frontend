import { createClient } from '@sanity/client'
import { PrismaClient } from '@prisma/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN before running this migration.')
}

const prisma = new PrismaClient()
const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-01',
  useCdn: false,
  token,
})

try {
  const sales = await prisma.dailySale.findMany({
    orderBy: [{ saleDate: 'asc' }, { createdAt: 'asc' }],
  })

  for (const sale of sales) {
    await sanity.createOrReplace({
      _id: `daily-sale-${sale.id}`,
      _type: 'dailySale',
      branch: sale.branch,
      saleDate: sale.saleDate.toISOString().slice(0, 10),
      model: sale.model,
      customerName: sale.customerName,
      division: sale.division,
      paymentType: sale.paymentType,
      salesPerson: sale.salesPerson,
      ...(sale.photoUrl ? { photoUrl: sale.photoUrl } : {}),
      ...(sale.stockRemaining === null ? {} : { stockRemaining: sale.stockRemaining }),
    })
  }

  console.log(`Migrated ${sales.length} daily sales records to Sanity.`)
} finally {
  await prisma.$disconnect()
}