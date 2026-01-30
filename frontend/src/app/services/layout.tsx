'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Бонд хуудсуудын tabs
const bondTabs = [
  { href: '/services/open-bond', label: 'Нээлттэй бонд' },
  { href: '/services/closed-bond', label: 'Хаалттай бонд' },
]

export default function ServicesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Бонд хуудас эсэхийг шалгах
  const isBondPage = pathname === '/services/open-bond' || pathname === '/services/closed-bond'

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation tabs - зөвхөн бонд хуудсанд харуулах */}
      {isBondPage && (
        <div className="border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <nav className="flex gap-8 pt-8">
              {bondTabs.map((tab) => {
                const isActive = pathname === tab.href
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`relative pb-4 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-gray-900 after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-gray-900'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

