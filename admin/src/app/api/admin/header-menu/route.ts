import { NextRequest, NextResponse } from 'next/server'

// Demo data - Frontend Header-тэй яг адилхан бүтэц
let menuItems = [
  // Бүтээгдэхүүн (dropdown)
  { id: '1', title: 'Бүтээгдэхүүн', href: '#', order: 0, isActive: true, parentId: null },
    { id: '2', title: 'Автомашины зээл', href: '#', order: 0, isActive: true, parentId: '1' },
      { id: '3', title: 'Автомашин барьцаалсан зээл', href: '/products/car-loan/collateral', order: 0, isActive: true, parentId: '2' },
      { id: '4', title: 'Автомашин авах зээл', href: '/products/car-loan/purchase', order: 1, isActive: true, parentId: '2' },
    { id: '5', title: 'Үл хөдлөх хөрөнгийн зээл', href: '#', order: 1, isActive: true, parentId: '1' },
      { id: '6', title: 'Газар барьцаалсан зээл', href: '/products/real-estate/land', order: 0, isActive: true, parentId: '5' },
      { id: '7', title: 'Хашаа барьцаалсан зээл', href: '/products/real-estate/fence', order: 1, isActive: true, parentId: '5' },
      { id: '8', title: 'Орон сууц барьцаалсан зээл', href: '/products/real-estate/apartment', order: 2, isActive: true, parentId: '5' },
    { id: '9', title: 'Дугаар барьцаалсан зээл', href: '/products/phone-number', order: 2, isActive: true, parentId: '1' },
    { id: '10', title: 'Бизнес зээл', href: '/products/business', order: 3, isActive: true, parentId: '1' },
  
  // Үйлчилгээ (dropdown)
  { id: '11', title: 'Үйлчилгээ', href: '#', order: 1, isActive: true, parentId: null },
    { id: '12', title: 'Бонд', href: '#', order: 0, isActive: true, parentId: '11' },
      { id: '13', title: 'Нээлттэй бонд', href: '/services/open-bond', order: 0, isActive: true, parentId: '12' },
      { id: '14', title: 'Хаалттай бонд', href: '/services/closed-bond', order: 1, isActive: true, parentId: '12' },
    { id: '15', title: 'ХБҮЦ', href: '/services/hbuts', order: 1, isActive: true, parentId: '11' },
    { id: '16', title: 'Итгэлцэл', href: '/services/trust', order: 2, isActive: true, parentId: '11' },
  
  // Бидний тухай (dropdown)
  { id: '17', title: 'Бидний тухай', href: '#', order: 2, isActive: true, parentId: null },
    { id: '18', title: 'Танилцуулга', href: '/about', order: 0, isActive: true, parentId: '17' },
    { id: '19', title: 'Хүний нөөц', href: '/about/hr', order: 1, isActive: true, parentId: '17' },
  
  // Мэдээлэл (шууд линк)
  { id: '20', title: 'Мэдээлэл', href: '/news', order: 3, isActive: true, parentId: null },
]

export async function GET() {
  return NextResponse.json(menuItems)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newItem = {
      id: Date.now().toString(),
      ...body,
    }
    menuItems.push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}
