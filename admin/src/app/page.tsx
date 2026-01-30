'use client'

import AdminLayout from '@/components/AdminLayout'
import VisitorsChart from '@/components/admin/VisitorsChart'
import {
  PhotoIcon,
  CubeIcon,
  NewspaperIcon,
  MapPinIcon,
  EyeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

/* ------------------ DATA ------------------ */

// Recently updated content
const recentUpdates = [
  {
    id: 1,
    type: 'Hero',
    title: 'Зуны урамшуулал 2024',
    href: '/admin/hero',
    updatedAt: '5 минутын өмнө',
    icon: PhotoIcon,
    iconColor: 'text-indigo-500',
  },
  {
    id: 2,
    type: 'Бүтээгдэхүүн',
    title: 'Бизнес зээл - Шинэ нөхцөл',
    href: '/admin/products/business',
    updatedAt: '12 минутын өмнө',
    icon: CubeIcon,
    iconColor: 'text-emerald-500',
  },
  {
    id: 3,
    type: 'Мэдээ',
    title: 'Компанийн тайлан 2024 оны 4-р улирал',
    href: '/admin/news',
    updatedAt: '1 цагийн өмнө',
    icon: NewspaperIcon,
    iconColor: 'text-violet-500',
  },
  {
    id: 4,
    type: 'Салбар',
    title: 'Баянзүрх дүүргийн салбар',
    href: '/admin/branches',
    updatedAt: '2 цагийн өмнө',
    icon: MapPinIcon,
    iconColor: 'text-amber-500',
  },
  {
    id: 5,
    type: 'Мэдээ',
    title: 'Шинэ үйлчилгээний танилцуулга',
    href: '/admin/news',
    updatedAt: '3 цагийн өмнө',
    icon: NewspaperIcon,
    iconColor: 'text-violet-500',
  },
  {
    id: 6,
    type: 'Бүтээгдэхүүн',
    title: 'Автомашин барьцаа зээл',
    href: '/admin/products/car-collateral',
    updatedAt: 'Өчигдөр',
    icon: CubeIcon,
    iconColor: 'text-emerald-500',
  },
]

const quickActions = [
  {
    name: 'Slide нэмэх',
    href: '/admin/slides',
    icon: PhotoIcon,
    iconColor: 'text-emerald-500',
  },
  {
    name: 'Мэдээ нэмэх',
    href: '/admin/news',
    icon: NewspaperIcon,
    iconColor: 'text-emerald-500',
  },
  {
    name: 'Ханш шинэчлэх',
    href: '/admin/rates',
    icon: CurrencyDollarIcon,
    iconColor: 'text-indigo-500',
  },
  {
    name: 'HR удирдах',
    href: '/admin/hr',
    icon: UserGroupIcon,
    iconColor: 'text-indigo-500',
  },
]

/* ------------------ PAGE ------------------ */

export default function AdminDashboard() {
  return (
    <AdminLayout title="Хянах самбар">

      {/* ================= VISITORS CHART ================= */}
      <div className="mb-8">
        <VisitorsChart />
      </div>

      {/* ================= RECENTLY UPDATED ================= */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-medium text-gray-600">
            Сүүлд шинэчилсэн
          </h2>
        </div>

        <div className="bg-white border border-gray-100 divide-y divide-gray-100">
          {recentUpdates.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <item.icon className={`h-4 w-4 flex-shrink-0 ${item.iconColor}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{item.type}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <p className="text-sm text-gray-600 truncate">
                    {item.title}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-400 flex-shrink-0">
                {item.updatedAt}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="mb-8">
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-600 mb-4">
            Үйлдэл
          </h2>

          <div className="space-y-1">
            {quickActions.map(action => (
              <Link
                key={action.name}
                href={action.href}
                className="group flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600
                  hover:bg-gray-50 transition-colors rounded-sm"
              >
                <action.icon className={`h-4 w-4 ${action.iconColor}`} />
                {action.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PREVIEW ================= */}
      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-gray-600">
              Вэбсайт урьдчилж харах
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Frontend-ийн одоогийн төлөв
            </p>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            className="group flex items-center gap-2 px-3 py-1.5 text-xs
              text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            Шинэ цонхонд
          </a>
        </div>

        <div className="aspect-video border border-gray-200 overflow-hidden">
          <iframe
            src="http://localhost:3000"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </AdminLayout>
  )
}
