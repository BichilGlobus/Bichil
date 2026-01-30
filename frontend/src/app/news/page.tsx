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

export default function NewsPage() {
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
      const sortDiv = document.getElementById("sort-dropdown-container")
      if (sortDiv && !sortDiv.contains(e.target as Node)) {
        setSortDropdownOpen(false)
      }
    }

    // Close dropdown on Esc
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSortDropdownOpen(false)
      }
    }

    if (sortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [sortDropdownOpen])

  // URL-аас category авах
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all"
    setActiveCategory(categoryParam)
  }, [searchParams])

  // Category солихдээ URL-г шинэчлэх
  const handleCategoryChange = (categoryId: string) => {
    // Clear scroll memory when changing category (new content context)
    sessionStorage.removeItem("newsScrollPosition")
    setActiveCategory(categoryId)
    if (categoryId === "all") {
      router.push("/news")
    } else {
      router.push(`/news?category=${categoryId}`)
    }
  }

  const sortedNews = [...demoNews].sort((a, b) => {
    if (a.isPinnedNews === b.isPinnedNews) {
      if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title, 'mn')
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title, 'mn')
      } else {
        const timeA = new Date(a.publishedAt).getTime()
        const timeB = new Date(b.publishedAt).getTime()
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB
      }
    }
    return a.isPinnedNews ? -1 : 1
  })

  const filteredNews = sortedNews.filter((item) => {
    if (activeCategory === "all") return true
    return item.category === activeCategory
  })

  // Pinned news (max 3)
  const pinnedNews = filteredNews.filter((item) => item.isPinnedNews).slice(0, 3)
  // Regular news
  const gridItems = filteredNews.filter((item) => !item.isPinnedNews)

  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col px-5 sm:px-20 lg:max-w-[1280px] lg:mx-auto">
        
        {/* Header */}
        <p className="text-gray-900 font-bold text-center text-2xl sm:text-3xl mb-6 sm:mb-9 lg:mb-16 pt-8 sm:pt-12">
           Мэдээ
        </p>

        {/* Category Tabs and Sort */}
        <div className="flex flex-col gap-4 mb-10 sm:mb-16">
          {/* Category Tabs and Sort Controls - Sticky */}
          <div className={`sticky top-0 z-40 bg-white -mx-5 sm:-mx-20 px-5 sm:px-20 pt-4 pb-4 transition-shadow duration-300 ${stickyBarShadow ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-200'}`}>
            <div className="lg:max-w-[1280px] lg:mx-auto">
              <div className="flex gap-3 items-center justify-between flex-wrap lg:flex-nowrap">
                {/* Category Tabs */}
                <div className="flex gap-3 items-center overflow-x-scroll lg:overflow-x-auto flex-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      aria-pressed={activeCategory === cat.id}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        activeCategory === cat.id
                          ? "bg-teal-600 text-white shadow-md transform scale-105"
                          : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative" id="sort-dropdown-container">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    aria-label={`Эрэмбэлэх: ${sortOrder === "newest" ? "Шинэ" : sortOrder === "oldest" ? "Хуучин" : sortOrder === "a-z" ? "A–Z" : "Z–A"}`}
                    aria-expanded={sortDropdownOpen}
                    aria-haspopup="menu"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 016 0v14a1 1 0 01-6 0V4zM15 4a1 1 0 016 0v14a1 1 0 01-6 0V4z" />
                    </svg>
                    <span>
                      Эрэмбэ: <span className="font-semibold">
                        {sortOrder === "newest" ? "Шинэ" : sortOrder === "oldest" ? "Хуучин" : sortOrder === "a-z" ? "A–Z" : "Z–A"}
                      </span>
                    </span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10" role="menu">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Эрэмбэлэх</p>
                      </div>
                      <button
                        onClick={() => {
                          setSortOrder("newest")
                          setSortDropdownOpen(false)
                        }}
                        role="menuitem"
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center gap-2 focus:outline-none focus:bg-teal-50 ${
                          sortOrder === "newest"
                            ? "bg-teal-50 text-teal-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sortOrder === "newest" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        Шинэ
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("oldest")
                          setSortDropdownOpen(false)
                        }}
                        role="menuitem"
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center gap-2 focus:outline-none focus:bg-teal-50 ${
                          sortOrder === "oldest"
                            ? "bg-teal-50 text-teal-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sortOrder === "oldest" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        Хуучин
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("a-z")
                          setSortDropdownOpen(false)
                        }}
                        role="menuitem"
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center gap-2 focus:outline-none focus:bg-teal-50 ${
                          sortOrder === "a-z"
                            ? "bg-teal-50 text-teal-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sortOrder === "a-z" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        A–Z
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("z-a")
                          setSortDropdownOpen(false)
                        }}
                        role="menuitem"
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center gap-2 focus:outline-none focus:bg-teal-50 ${
                          sortOrder === "z-a"
                            ? "bg-teal-50 text-teal-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sortOrder === "z-a" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        Z–A
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="pb-16">
          {/* Contextual Info */}
          {filteredNews.length > 0 && (
            <div className="mb-8 text-xs text-gray-500 tracking-wide uppercase">
              <p>
                <span className="font-semibold text-gray-600">{categories.find(c => c.id === activeCategory)?.label}</span> ангилалд <span className="font-semibold text-gray-600">{filteredNews.length}</span> мэдээ байна
              </p>
            </div>
          )}

          {/* Featured/Pinned News Section - Large Featured Card */}
          {pinnedNews.length > 0 && (
            <div className="mb-10 sm:mb-16 bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Онцлох мэдээ
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First pinned news - Large card spanning 2 columns */}
                {pinnedNews[0] && (
                  <Link
                    href={`/news/${pinnedNews[0].id}`}
                    className="group bg-white cursor-pointer rounded-2xl sm:rounded-[20px] lg:rounded-l-[28px] flex flex-col min-h-[420px] sm:col-span-2 lg:flex-row hover:shadow-lg transition-all border border-gray-200"
                  >
                    {/* Image Container */}
                    <div className="relative rounded-t-2xl sm:rounded-t-[20px] lg:rounded-t-none lg:rounded-l-[28px] overflow-hidden h-[200px] sm:h-[300px] lg:h-auto lg:w-2/3 bg-gray-200">
                      <Image
                        src={pinnedNews[0].bannerImage}
                        alt={pinnedNews[0].title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 aspect-video lg:aspect-auto"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between flex-1 p-5 lg:p-8 lg:w-1/3">
                      <div className="flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2.5 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                            {categories.find(c => c.id === pinnedNews[0].category)?.label || "Мэдээ"}
                          </span>
                        </div>
                        <p className="text-gray-900 text-xl font-bold leading-8 max-h-[128px] overflow-y-hidden text-ellipsis sm:text-2xl sm:leading-10 lg:text-2xl lg:leading-10 lg:max-h-[250px]">
                          {pinnedNews[0].title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(pinnedNews[0].publishedAt).toLocaleDateString()} • {pinnedNews[0].readTime || 2} минут унших</p>
                    </div>
                  </Link>
                )}

                {/* Second and Third pinned news - Smaller cards */}
                {pinnedNews.slice(1, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group bg-white cursor-pointer rounded-2xl sm:rounded-[20px] lg:rounded-l-[28px] flex flex-col min-h-[420px] hover:shadow-lg transition-all border border-gray-200"
                  >
                    {/* Image Container */}
                    <div className="relative rounded-t-2xl sm:rounded-t-[20px] lg:rounded-t-[28px] overflow-hidden h-[200px] sm:h-[250px] bg-gray-200">
                      <Image
                        src={item.bannerImage}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 aspect-video"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between flex-1 p-5 lg:p-8">
                      <div className="flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            {categories.find(c => c.id === item.category)?.label || "Мэдээ"}
                          </span>
                        </div>
                        <p className="text-gray-900 text-xl font-bold leading-8 max-h-[128px] overflow-y-hidden text-ellipsis lg:text-2xl lg:leading-10">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString()} • {item.readTime || 2} минут унших</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular News Section - Grid */}
          {gridItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Сүүлийн мэдээнүүд</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {gridItems.slice(0, limit).map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group bg-white cursor-pointer rounded-2xl sm:rounded-[20px] lg:rounded-l-[28px] flex flex-col min-h-[420px] hover:shadow-lg transition-all border border-gray-200 hover:translate-y-[-2px]"
                  >
                    {/* Image Container */}
                    <div className="relative rounded-t-2xl sm:rounded-t-[20px] lg:rounded-t-[28px] overflow-hidden h-[200px] sm:h-[250px] bg-gray-200">
                      <Image
                        src={item.bannerImage}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 aspect-video"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between flex-1 p-5 lg:p-8">
                      <div className="flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            {categories.find(c => c.id === item.category)?.label || "Мэдээ"}
                          </span>
                        </div>
                        <p className="text-gray-900 text-xl font-bold leading-8 max-h-[128px] overflow-y-hidden text-ellipsis lg:text-2xl lg:leading-10 group-hover:underline group-hover:decoration-teal-300 decoration-1 underline-offset-2 transition-all">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString()} • {item.readTime || 2} минут унших</p>
                    </div>
                  </Link>
                ))}
              </div>


            </div>
          )}

          {/* Empty state */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Мэдээ олдсонгүй</h3>
              <p className="text-gray-500 mb-6">Энэ төрлийн мэдээ одоогоор байхгүй байна.</p>
              <div className="flex flex-col gap-2 items-center justify-center">
                {activeCategory !== "all" && (
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="px-4 py-2 text-sm text-teal-600 font-medium hover:text-teal-700 transition-all duration-300"
                  >
                    ← Бүх ангилалд буцах
                  </button>
                )}
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-700 transition-all duration-300"
                >
                  Онцлох мэдээг үзэх
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
