import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mode, ...data } = body

    // TODO: Save to database
    // Example: await db.products.upsert({ where: { id: data.id }, data })
    
    console.log(`[${mode === 'auto' ? 'AUTO-SAVE' : 'MANUAL SAVE'}]`, {
      name_mn: data.name_mn,
      name_en: data.name_en,
      status: data.status,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ 
      success: true, 
      message: mode === 'auto' ? 'Auto-saved' : 'Saved successfully',
      data 
    })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // TODO: Fetch from database
    // Example: const product = await db.products.findUnique({ where: { id } })
    
    return NextResponse.json({ 
      success: true,
      data: null // Replace with actual data
    })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}
