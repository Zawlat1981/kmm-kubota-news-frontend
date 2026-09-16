import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const COOKIE_NAME = 'kmm_stock_session'
const BRANCH_CODES = new Set(['KMM01', 'KMM02', 'KMM03'])

function isAuthed(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value === 'granted'
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      branch,
      saleDate,
      model,
      customerName,
      division,
      paymentType,
      salesPerson,
      photoUrl,
      stockRemaining,
    } = body as Record<string, string | undefined>

    const parsedStockRemaining = stockRemaining === undefined || stockRemaining === '' ? null : Number(stockRemaining)

    if (!branch || !BRANCH_CODES.has(branch) || !saleDate || !model || !customerName || !division || !paymentType || !salesPerson || (parsedStockRemaining !== null && (!Number.isInteger(parsedStockRemaining) || parsedStockRemaining < 0))) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 })
    }

    const sale = await prisma.dailySale.create({
      data: {
        branch,
        saleDate: new Date(`${saleDate}T00:00:00.000Z`),
        model,
        customerName,
        division,
        paymentType,
        salesPerson,
        photoUrl: photoUrl || undefined,
        stockRemaining: parsedStockRemaining,
      },
    })

    return NextResponse.json({ success: true, sale })
  } catch (error) {
    console.error('Add daily sale error:', error)
    return NextResponse.json({ error: 'Failed to add daily sale' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json() as Record<string, string | number | undefined>
    const parsedStockRemaining = Number(body.stockRemaining)

    if (!body.id || !body.branch || !BRANCH_CODES.has(String(body.branch)) || !body.saleDate || !body.model || !body.customerName || !body.division || !body.paymentType || !body.salesPerson || !Number.isInteger(parsedStockRemaining) || parsedStockRemaining < 0) {
      return NextResponse.json({ error: 'All sale fields and a valid stock remaining value are required' }, { status: 400 })
    }

    const sale = await prisma.dailySale.update({
      where: { id: String(body.id) },
      data: {
        branch: String(body.branch),
        saleDate: new Date(`${String(body.saleDate)}T00:00:00.000Z`),
        model: String(body.model),
        customerName: String(body.customerName),
        division: String(body.division),
        paymentType: String(body.paymentType),
        salesPerson: String(body.salesPerson),
        photoUrl: body.photoUrl ? String(body.photoUrl) : null,
        stockRemaining: parsedStockRemaining,
      },
    })

    return NextResponse.json({ success: true, sale })
  } catch (error) {
    console.error('Update daily sale error:', error)
    return NextResponse.json({ error: 'Failed to update daily sale' }, { status: 500 })
  }
}