import { NextRequest, NextResponse } from 'next/server'

let headerStyle = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  hoverColor: '#0d9488',
  logoPosition: 'left',
  height: '80px',
  isSticky: true,
}

export async function GET() {
  return NextResponse.json(headerStyle)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    headerStyle = { ...headerStyle, ...body }
    return NextResponse.json(headerStyle)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
