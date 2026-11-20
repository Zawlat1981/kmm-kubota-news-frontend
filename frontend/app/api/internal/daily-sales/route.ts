import { NextResponse } from 'next/server'

function respondWithStudioInstructions() {
  return NextResponse.json(
    { error: 'Daily sales are managed in Sanity Studio.' },
    { status: 410 },
  )
}

export function POST() {
  return respondWithStudioInstructions()
}

export function PATCH() {
  return respondWithStudioInstructions()
}