import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const COOKIE_NAME = 'kmm_stock_session'

function isAuthed(req: NextRequest) {
  const session = req.cookies.get(COOKIE_NAME)
  return session?.value === 'granted'
}

// GET /api/internal/stock?branch=KMM01  -> list stock items for a branch (or all branches if omitted)
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const branchCode = req.nextUrl.searchParams.get('branch')

  const items = await prisma.stockItem.findMany({
    where: branchCode ? { branch: { code: branchCode } } : undefined,
    include: { branch: true },
    orderBy: [{ modelNumber: 'asc' }],
  })

  return NextResponse.json({ items })
}

// POST /api/internal/stock -> add a new stock item entry
// Body: { branchCode: string, brand?: string, modelNumber: string, serialNumber?: string }
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { branchCode, brand, modelNumber, serialNumber } = body as {
      branchCode?: string
      brand?: string
      modelNumber?: string
      serialNumber?: string
    }

    if (!branchCode || !modelNumber) {
      return NextResponse.json(
        { error: 'branchCode and modelNumber are required' },
        { status: 400 }
      )
    }

    // Create the branch automatically the first time its code is used,
    // so staff don't need a separate "create branch" step.
    const branch = await prisma.branch.upsert({
      where: { code: branchCode },
      update: {},
      create: { code: branchCode },
    })

    const item = await prisma.stockItem.create({
      data: {
        branchId: branch.id,
        brand: brand || undefined,
        modelNumber,
        serialNumber: serialNumber || undefined,
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Add stock item error:', error)
    return NextResponse.json({ error: 'Failed to add stock item' }, { status: 500 })
  }
}

// DELETE /api/internal/stock?id=xxxx -> remove a stock item (e.g. sold / no longer in stock)
export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  await prisma.stockItem.delete({ where: { id } })
  return NextResponse.json({ success: true })
}