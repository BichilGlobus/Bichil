'use client'

import Image from 'next/image'
import Link from 'next/link'
import Container from './Container'
import { demoNews } from '@/data/demoNews'

export default function NewsSection() {
  const categoryLabels: Record<string, string> = {
    announcement: 'Мэдээлэл',
    maintenance: 'Үйлчилгээ',
    advice: 'Зөвлөгөө',
    video: 'Видео бичлэг',
    community: 'Нийгэмд',
  }

  const sortedNews = [...demoNews].sort((a, b) => {
    if (a.isPinnedHome === b.isPinnedHome) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    return a.isPinnedHome ? -1 : 1
  })

  const pinnedNews = sortedNews.filter((item) => item.isPinnedHome)
  const displayNews = pinnedNews.slice(0, 3)

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-5 sm:px-20 flex flex-col">
      <div className="flex flex-col">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-block">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-2">Онцолсон мэдээ</p>
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Мэдээ</h2>
            <div className="w-16 h-1 bg-teal-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Highlighted news (pinned or fallback) */}
        {displayNews.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-10 mb-10 lg:mb-20 lg:max-w-[1280px] lg:mx-auto">
              {/* Featured article - large */}
              <Link
                href={`/news/${displayNews[0].id}`}
                className="bg-white cursor-pointer rounded-2xl sm:rounded-[20px] lg:rounded-l-[28px] flex flex-col h-[467px] sm:col-span-2 sm:h-[592px] lg:h-[480px] lg:flex-row group shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative rounded-t-2xl sm:rounded-t-[20px] lg:rounded-l-[28px] lg:rounded-r-none overflow-hidden h-[45%] sm:h-4/5 lg:h-auto lg:w-2/3 bg-gray-200">
                  <Image
                    src={displayNews[0].bannerImage}
                    alt={displayNews[0].title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-between h-[55%] p-5 lg:p-8 lg:h-auto lg:w-1/3">
                  <div className="flex flex-col gap-2 sm:gap-4">
                    <p className="text-sm font-medium text-teal-600">
                      {categoryLabels[displayNews[0].category] || 'Мэдээ'}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold leading-8 max-h-[128px] overflow-y-hidden text-ellipsis lg:text-2xl lg:leading-10 sm:text-[28px] lg:max-h-[250px]">
                      {displayNews[0].title}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-500">{new Date(displayNews[0].publishedAt).toLocaleDateString()} • {displayNews[0].readTime} минут унших</p>
                </div>
              </Link>

              {/* Small articles - vertical stack */}
              {displayNews.slice(1, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="bg-white cursor-pointer rounded-2xl sm:rounded-[20px] lg:rounded-l-[28px] flex flex-col h-[467px] lg:h-[658px] group shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative rounded-t-2xl sm:rounded-t-[20px] lg:rounded-t-[28px] overflow-hidden h-[45%] lg:h-1/2 bg-gray-200">
                    <Image
                      src={item.bannerImage}
                      alt={item.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between h-[55%] p-5 lg:p-8 lg:h-1/2 lg:pt-5">
                    <div className="flex flex-col gap-2 sm:gap-4">
                      <p className="text-sm font-medium text-teal-600">
                        {categoryLabels[item.category] || 'Мэдээ'}
                      </p>
                      <p className="text-gray-900 text-xl font-semibold leading-8 max-h-[128px] overflow-y-hidden text-ellipsis lg:text-2xl lg:leading-10">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-500">{new Date(item.publishedAt).toLocaleDateString()} • {item.readTime} минут унших</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Дэлгэрэнгүй
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

