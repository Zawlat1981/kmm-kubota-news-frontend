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
    } = body as Record<string, string | undefined>

    if (!branch || !BRANCH_CODES.has(branch) || !saleDate || !model || !customerName || !division || !paymentType || !salesPerson) {
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
      },
    })

    return NextResponse.json({ success: true, sale })
  } catch (error) {
    console.error('Add daily sale error:', error)
    return NextResponse.json({ error: 'Failed to add daily sale' }, { status: 500 })
  }
}