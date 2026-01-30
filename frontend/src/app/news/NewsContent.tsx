'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Container from "@/components/Container"
import { demoNews, NewsItem } from "@/data/demoNews"

// Мэдээний төрлүүд (Demo categories)
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "announcement", label: "Мэдээлэл" },
  { id: "maintenance", label: "Үйлчилгээ" },
  { id: "advice", label: "Зөвлөгөө" },
  { id: "video", label: "Видео бичлэг" },
  { id: "community", label: "Нийгэмд" },
]

export default function NewsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [limit, setLimit] = useState(6)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [stickyBarShadow, setStickyBarShadow] = useState(false)

  // Scroll position memory
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("newsScrollPosition")
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition))
      sessionStorage.removeItem("newsScrollPosition")
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
      setStickyBarShadow(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = (e.target as HTMLElement)?.closest('[data-dropdown]')
      if (!dropdown) {
        setSortDropdownOpen(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // Read category from URL
  useEffect(() => {
    const category = searchParams.get("category") || "all"
    setActiveCategory(category)
  }, [searchParams])

  // Filter and sort news
  const filteredNews = activeCategory === "all" 
    ? demoNews 
    : demoNews.filter(item => item.category === activeCategory)

  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime()
    const dateB = new Date(b.publishedAt).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  const displayedNews = sortedNews.slice(0, limit)
  const hasMore = limit < sortedNews.length

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    router.push(`/news?category=${categoryId}`)
    setScrollPosition(0)
  }

  const handleNewsClick = (id: string) => {
    sessionStorage.setItem("newsScrollPosition", scrollPosition.toString())
  }

  return (
    <Container>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="py-8 md:py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Мэдээ мэдээлэл
          </h1>
          <p className="text-gray-600 text-lg">
            Бичил Глобус-ын сүүлийн үйл явдал, мэдээ мэдээллүүдийг энд ижил цаг үзнэ үү
          </p>
        </div>

        {/* Category Filter Bar */}
        <div
          className={`sticky top-0 z-40 bg-white py-4 -mx-4 px-4 transition-shadow duration-200 ${
            stickyBarShadow ? "shadow-md" : ""
          }`}
          style={{
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            paddingLeft: "calc(50vw - 50% + 1rem)",
            paddingRight: "calc(50vw - 50% + 1rem)",
          }}
        >
          <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center my-8">
          <p className="text-gray-700">
            {filteredNews.length} мэдээ байна
          </p>
          <div className="relative" data-dropdown>
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {sortOrder === "newest" ? "Сүүлсүүлээс" : "Өмнө дээр"}
              <svg
                className={`w-4 h-4 transition-transform ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            {sortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setSortOrder("newest")
                    setSortDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sortOrder === "newest" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Сүүлсүүлээс
                </button>
                <button
                  onClick={() => {
                    setSortOrder("oldest")
                    setSortDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sortOrder === "oldest" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Эхнээс
                </button>
              </div>
            )}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedNews.length > 0 ? (
            displayedNews.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                onClick={() => handleNewsClick(news.id)}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={news.bannerImage || "/images/news1.jpg"}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find((c) => c.id === news.category)?.label || "Бүгд"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-gray-500 text-sm mb-2">
                      {new Date(news.publishedAt).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                      {news.excerpt}
                    </p>
                    <div className="mt-4 text-blue-600 font-medium text-sm flex items-center gap-1">
                      Дэлгэрэнгүй унших
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 text-lg">Энэ ангилалд мэдээ байхгүй байна</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mb-16">
            <button
              onClick={() => setLimit(limit + 6)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Дараачийг үзүүлэх
            </button>
          </div>
        )}
      </div>
    </Container>
  )
}
