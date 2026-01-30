'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { title: 'Газар', href: '/products/real-estate/land' },
  { title: 'Хашаа', href: '/products/real-estate/fence' },
  { title: 'Орон сууц', href: '/products/real-estate/apartment' },
]

export default function RealEstateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.title}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </>
  )
}
