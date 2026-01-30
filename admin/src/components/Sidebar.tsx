'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  HomeIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  CubeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  RectangleGroupIcon,
  DevicePhoneMobileIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Хянах самбар', href: '/', icon: HomeIcon },
  { 
    name: 'Сайтын бүтэц', 
    icon: RectangleStackIcon,
    children: [
      { name: 'Header', href: '/admin/header' },
      { name: 'Hero Slider', href: '/admin/hero' },
      { name: 'CTA Slider', href: '/admin/cta' },
      { name: 'Floating Menu', href: '/admin/floating-menu' },
      { name: 'Footer', href: '/admin/footer' },
      { name: 'App Download', href: '/admin/app-download' },
    ]
  },
  { 
    name: 'Бүтээгдэхүүн', 
    icon: CubeIcon,
    children: [
      { name: 'Бизнес зээл', href: '/admin/products/business' },
      { name: 'Автомашин барьцаа', href: '/admin/products/car-collateral' },
      { name: 'Автомашин худалдан авах', href: '/admin/products/car-purchase' },
      { name: 'Газар барьцаа', href: '/admin/products/land' },
      { name: 'Хашаа барьцаа', href: '/admin/products/fence' },
      { name: 'Орон сууц барьцаа', href: '/admin/products/apartment' },
      { name: 'Дугаар барьцаа', href: '/admin/products/phone' },
    ]
  },
  { 
    name: 'Үйлчилгээ', 
    icon: BriefcaseIcon,
    children: [
      { name: 'Нээлттэй бонд', href: '/admin/services/open-bond' },
      { name: 'Хаалттай бонд', href: '/admin/services/closed-bond' },
      { name: 'ХБҮЦ', href: '/admin/services/hbuts' },
      { name: 'Итгэлцэл', href: '/admin/services/trust' },
    ]
  },
  { 
    name: 'Байгууллага', 
    icon: BuildingOfficeIcon,
    children: [
      { name: 'Бидний тухай', href: '/admin/about' },
      { name: 'Салбарууд', href: '/admin/branches' },
    ]
  },
  { 
    name: 'Контент', 
    icon: DocumentTextIcon,
    children: [
      { name: 'Мэдээ', href: '/admin/news' },
      { name: 'Хуудас удирдах', href: '/admin/pages' },
    ]
  },
  { name: 'Хүний нөөц', href: '/admin/hr', icon: UserGroupIcon },
  { 
    name: 'Санхүү', 
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Валютын ханш', href: '/admin/rates' },
      { name: 'Тооцоолуур', href: '/admin/calculator' },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  // Автоматаар dropdown нээх logic - зөвхөн дэд хуудас дээр байхад
  const getInitialExpanded = () => {
    const expanded: string[] = []
    if (pathname?.startsWith('/admin/header') || 
        pathname?.startsWith('/admin/hero') || 
        pathname?.startsWith('/admin/cta') || 
        pathname?.startsWith('/admin/floating-menu') || 
        pathname?.startsWith('/admin/footer') ||
        pathname?.startsWith('/admin/app-download')) {
      expanded.push('Сайтын бүтэц')
    }
    if (pathname?.startsWith('/admin/products/')) {
      expanded.push('Бүтээгдэхүүн')
    }
    if (pathname?.startsWith('/admin/services/')) {
      expanded.push('Үйлчилгээ')
    }
    if (pathname?.startsWith('/admin/about') || pathname?.startsWith('/admin/branches')) {
      expanded.push('Байгууллага')
    }
    if (pathname?.startsWith('/admin/news') || 
        pathname?.startsWith('/admin/pages')) {
      expanded.push('Контент')
    }
    if (pathname?.startsWith('/admin/rates') || pathname?.startsWith('/admin/calculator')) {
      expanded.push('Санхүү')
    }
    return expanded
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpanded())

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1e1e2d]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/5">
        <div>
          <span className="text-white font-semibold text-sm"></span>
          <p className="text-gray-500 text-xs"></p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navigation.map((item, index) => {
            const hasChildren = 'children' in item && item.children
            const isExpanded = expandedItems.includes(item.name)
            const isActive = item.href 
              ? (pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href)))
              : hasChildren && item.children?.some(child => pathname?.startsWith(child.href))
            
            return (
              <div key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`w-full group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border-l-2 border-indigo-500'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        {item.name}
                      </div>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="mt-1 ml-8 space-y-1">
                        {item.children.map(child => {
                          const isChildActive = pathname?.startsWith(child.href)
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                isChildActive
                                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                              }`}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border-l-2 border-indigo-500'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    {item.name}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-white"></p>
            <p className="text-xs text-gray-500"></p>
          </div>
        </div>
      </div>
    </div>
  )
}
