"use client";

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import Container from "@/components/Container"
import { demoNews, NewsItem } from "@/data/demoNews"

const categories = [
  { id: 'announcement', label: 'Мэдээлэл' },
  { id: 'maintenance', label: 'Үйлчилгээ' },
  { id: 'advice', label: 'Зөвлөгөө' },
  { id: 'video', label: 'Видео бичлэг' },
  { id: 'community', label: 'Нийгэмд' },
]

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [newsId]);

  const fetchNews = async () => {
    try {
      setError(false);
      // Find the news from demo data
      const foundNews = demoNews.find((item) => item.id === newsId);
      setNews(foundNews || null);

      // Get related news (same category, excluding current)
      if (foundNews) {
        const related = demoNews
          .filter((item) =>
            item.id !== newsId &&
            item.category === foundNews.category
          )
          .slice(0, 3);
        setRelatedNews(related);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Get next news (by date)
  const getNextNews = () => {
    const sortedByDate = [...demoNews].sort((a, b) => 
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
    const currentIndex = sortedByDate.findIndex(item => item.id === newsId);
    if (currentIndex > 0) {
      return sortedByDate[currentIndex - 1];
    }
    return null;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container>
          {/* Breadcrumb Skeleton */}
          <div className="py-4">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          {/* Main Content Skeleton */}
          <div className="py-8">
            {/* Back Button Skeleton */}
            <div className="mb-6 h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
              {/* Category & Date Skeleton */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>

              {/* Title Skeleton */}
              <div className="mb-4 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>

              {/* Excerpt Skeleton */}
              <div className="mb-8 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>

              {/* Banner Image Skeleton */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-200 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>

              {/* Related News Skeleton */}
              <div className="border-t pt-8">
                <div className="h-7 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg overflow-hidden">
                      <div className="relative aspect-video bg-gray-200 animate-pulse"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-20 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Мэдээ олдсонгүй</h1>
            <Link href="/news" className="inline-flex items-center gap-2 px-4 py-2.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium group">
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Алдаа гарлаа</h1>
            <p className="text-gray-600 mb-6">Мэдээ ачаалахад асуудал гарав. Дахин оролдоно уу.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setError(false);
                  setLoading(true);
                  fetchNews();
                }}
                className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all duration-200"
              >
                Дахин ачаалах
              </button>
              <Link
                href="/news"
                className="px-6 py-2.5 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Мэдээ рүү буцах
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const categoryLabel = categories.find(c => c.id === news.category)?.label || 'Мэдээ';
  const pinnedBadge = null

  return (
    <main className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="py-4 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            Нүүр
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-teal-600 transition-colors">
            Мэдээ
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{news.title}</span>
        </div>

        {/* Header */}
        <div className="py-8">
          <Link href="/news" className="inline-flex items-center gap-2 px-4 py-2.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-300 mb-6 font-medium group">
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Буцах</span>
          </Link>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
            {/* Title & Category */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  {categoryLabel}
                </span>
                {pinnedBadge}
                <span className="text-gray-500 text-sm">{new Date(news.publishedAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {news.title}
              </h1>
              <p className="text-lg text-gray-600">
                {news.excerpt}
              </p>
            </div>

            {/* Banner Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedImage(news.bannerImage)}>
              <Image
                src={news.bannerImage}
                alt={news.title}
                fill
                unoptimized
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {news.content}
              </div>
            </div>

            {/* Social Share */}
            <div className="border-t border-b py-8 mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Мэдээг хуваалцах</h3>
              <div className="flex items-center gap-3">
                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  title="Facebook-д хуваалцах"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Twitter/X Share */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${encodeURIComponent(news.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  title="X-д хуваалцах"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.979 6.694H2.42l7.728-8.835L1.497 2.25h6.886l4.612 6.105L17.457 2.25zM16.369 20.033h1.83L5.337 4.059H3.425l12.944 15.974z" />
                  </svg>
                </a>

                {/* Instagram Share (Copy link) */}
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Мэдээний холбоосыг хулиалуулж авлаа');
                    }
                  }}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  title="Instagram-д хуваалцах"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.696.272.273 2.69.073 7.052.012 8.331 0 8.756 0 12s.012 3.669.07 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.7.07 4.948.07 3.248 0 3.669-.012 4.948-.07 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.07-1.7.07-4.948 0-3.248-.012-3.667-.07-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110 2.881 1.44 1.44 0 010-2.881z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Related News */}

            {/* Next News */}
            {getNextNews() && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Дараагийн мэдээ</h2>
                {(() => {
                  const nextNews = getNextNews();
                  return (
                    <Link
                      href={`/news/${nextNews?.id}`}
                      className="group flex gap-4 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-teal-300"
                    >
                      <div className="relative w-40 aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={nextNews?.bannerImage || ''}
                          alt={nextNews?.title || ''}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">
                            {categories.find(c => c.id === nextNews?.category)?.label || 'Мэдээ'}
                          </p>
                          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                            {nextNews?.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{nextNews?.publishedAt && new Date(nextNews.publishedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center pr-4 text-teal-600 group-hover:translate-x-1 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-96 md:max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Том зураг"
              width={1200}
              height={800}
              unoptimized
              className="object-contain w-full h-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 text-gray-900 rounded-full p-2 hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
