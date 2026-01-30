import { NextRequest, NextResponse } from 'next/server'

// Reference to the same data (in production, use database)
let menuItems = [
  { id: '1', title: 'Нүүр', href: '/', order: 0, isActive: true, parentId: null },
  { id: '2', title: 'Бүтээгдэхүүн', href: '/products', order: 1, isActive: true, parentId: null },
  { id: '3', title: 'Бизнес зээл', href: '/products/business', order: 0, isActive: true, parentId: '2' },
  { id: '4', title: 'Автомашины зээл', href: '/products/car-loan', order: 1, isActive: true, parentId: '2' },
  { id: '5', title: 'Үл хөдлөх хөрөнгийн зээл', href: '/products/real-estate', order: 2, isActive: true, parentId: '2' },
  { id: '6', title: 'Дугаар барьцаалсан зээл', href: '/products/phone-number', order: 3, isActive: true, parentId: '2' },
  { id: '7', title: 'Үйлчилгээ', href: '/services', order: 2, isActive: true, parentId: null },
  { id: '8', title: 'Нээлттэй бонд', href: '/services/open-bond', order: 0, isActive: true, parentId: '7' },
  { id: '9', title: 'Хаалттай бонд', href: '/services/closed-bond', order: 1, isActive: true, parentId: '7' },
  { id: '10', title: 'ХБҮЦ', href: '/services/hbuts', order: 2, isActive: true, parentId: '7' },
  { id: '11', title: 'Итгэлцэл', href: '/services/trust', order: 3, isActive: true, parentId: '7' },
  { id: '12', title: 'Бидний тухай', href: '/about', order: 3, isActive: true, parentId: null },
  { id: '13', title: 'Мэдээлэл', href: '/news', order: 4, isActive: true, parentId: null },
  { id: '14', title: 'Салбарууд', href: '/branches', order: 5, isActive: true, parentId: null },
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = menuItems.find(i => i.id === id)
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = menuItems.findIndex(i => i.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    menuItems[index] = { ...menuItems[index], ...body }
    return NextResponse.json(menuItems[index])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    menuItems = menuItems.filter(i => i.id !== id && i.parentId !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
