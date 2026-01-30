'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPublishedPages, type PageData } from '@/data/mockPages'
import axios from 'axios'
import axiosInstance from '@/config/axiosConfig'

interface SubMenuItem {
  title_mn: string
  title_en: string
  href: string
  description?: string
}

interface MenuItem {
  title_mn: string
  title_en: string
  href?: string
  items?: SubMenuItem[]
}

// Menu data - Бүтээгдэхүүн ба Үйлчилгээ
const getMenuItems = (dynamicPages: SubMenuItem[]): MenuItem[] => [
  {
    title_mn: 'Бүтээгдэхүүн',
    title_en: 'Products',
    items: [
      {
        title_mn: 'Автомашины зээл',
        title_en: 'Car Loan',
        href: '/products/car-loan',
      },
      {
        title_mn: 'Үл хөдлөх хөрөнгийн зээл',
        title_en: 'Real Estate Loan',
        href: '/products/real-estate',
      },
      {
        title_mn: 'Дугаар барьцаалсан зээл',
        title_en: 'Phone Number Loan',
        href: '/products/phone-number',
      },
      {
        title_mn: 'Бизнес зээл',
        title_en: 'Business Loan',
        href: '/products/business',
      },
    ],
  },
  {
    title_mn: 'Үйлчилгээ',
    title_en: 'Services',
    items: [
      {
        title_mn: 'Бонд',
        title_en: 'Bond',
        href: '/services/open-bond',
      },
      {
        title_mn: 'ХБҮЦ',
        title_en: 'MSME',
        href: '/services/hbuts',
      },
      {
        title_mn: 'Итгэлцэл',
        title_en: 'Trust',
        href: '/services/trust',
      },
    ],
  },
  {
    title_mn: 'Бидний тухай',
    title_en: 'About Us',
    items: [
      {
        title_mn: 'Танилцуулга',
        title_en: 'Overview',
        href: '/about',
      },
      {
        title_mn: 'Хүний нөөц',
        title_en: 'Careers',
        href: '/about/hr',
      },
      {
        title_mn: 'Салбарын байршил',
        title_en: 'Locations',
        href: '/branches',
      },
    ],
  },
  {
    title_mn: 'Мэдээлэл',
    title_en: 'News',
    href: '/news',
  },
  {
    title_mn: 'Хуудсууд',
    title_en: 'Pages',
    items: dynamicPages.length > 0 ? dynamicPages : [
      {
        title_mn: 'Бидний тухай',
        title_en: 'About Us',
        href: '/pages/about-us',
      },
      {
        title_mn: 'Манай эрхэм зорилго',
        title_en: 'Our Mission',
        href: '/pages/our-mission',
      },
    ],
  },
]

// Дэд цэс (hover дээр гарч ирнэ)
const productSubMenus: Record<string, SubMenuItem[]> = {
  'Автомашины зээл': [
    { title_mn: 'Автомашин барьцаалсан зээл', title_en: 'Car Collateral Loan', href: '/products/car-loan/collateral' },
    { title_mn: 'Автомашин авах зээл', title_en: 'Car Purchase Loan', href: '/products/car-loan/purchase' },
  ],
  '': [ // English key
    { title_mn: 'Автомашин барьцаалсан зээл', title_en: 'Car Collateral Loan', href: '/products/car-loan/collateral' },
    { title_mn: 'Автомашин авах зээл', title_en: 'Car Purchase Loan', href: '/products/car-loan/purchase' },
  ],
  'Үл хөдлөх хөрөнгийн зээл': [
    { title_mn: 'Газар барьцаалсан зээл', title_en: 'Land Loan', href: '/products/real-estate/land' },
    { title_mn: 'Хашаа барьцаалсан зээл', title_en: 'Fence Loan', href: '/products/real-estate/fence' },
    { title_mn: 'Орон сууц барьцаалсан зээл', title_en: 'Apartment Loan', href: '/products/real-estate/apartment' },
  ],
  'Бонд': [
    { title_mn: 'Нээлттэй бонд', title_en: 'Open Bond', href: '/services/open-bond' },
    { title_mn: 'Хаалттай бонд', title_en: 'Closed Bond', href: '/services/closed-bond' },
  ],
}

export default function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<number | null>(null)
  const [mobileActiveSubDropdown, setMobileActiveSubDropdown] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dynamicPages, setDynamicPages] = useState<SubMenuItem[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const [ categories, setCategories] = useState([])
  const [ categoryWaiting, setCategoryWaiting] = useState< boolean | null>(null)

  useEffect(() => {
    const fetchProduts = async () => {
      try 
      {
        const response = await axiosInstance.get(`/categories/`)

        if(response && response.status === 200)
        {
          setCategories(response?.data || [])
        }
      }
      catch(err)
      {
        console.log(err)
      }
      finally
      {

      }
    }
    fetchProduts()
  }, [])

  console.log(categories)

  // Load dynamic pages on mount
  useEffect(() => {
    const loadPages = () => {
      const pages = getPublishedPages()
      const pagesItems = pages.map((page: PageData) => ({
        title_mn: page.title_mn,
        title_en: page.title_en,
        href: `/pages/${page.slug}`
      }))
      setDynamicPages(pagesItems)
    }
    
    loadPages()
    
    // Listen for localStorage changes (when admin updates pages)
    const handleStorageChange = () => {
      loadPages()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('pages-updated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('pages-updated', handleStorageChange)
    }
  }, [])

  const menuItems = getMenuItems(dynamicPages)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 6)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setActiveSubDropdown(null)
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Floating Header Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1240px] z-[99999]">
        <header
          className={`w-full rounded-2xl transition-all duration-300 border ${scrolled
              ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-white/50'
              : 'bg-white/70 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-white/40'
            }`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 lg:h-16">
              {/* Logo */}
              <div className="flex items-center gap-6 lg:gap-8">
                <Link href="/" className="flex items-center">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                      src="/images/logo.jpg"
                      alt="Logo"
                      width={44}
                      height={44}
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>

                  {categories && categories.length > 0 
                  
                  ?
                    categories.map((e, i) => (
                      <div
                        key={i}
                        className='relative'
                        
                      >
                        
                      </div>
                    ))
                    
                  :

                  ""
                }
                  {menuItems.map((item, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => item.items && setActiveDropdown(index)}
                      onMouseLeave={() => {
                        if (!item.items) return
                        setActiveDropdown(null)
                        setActiveSubDropdown(null)
                      }}
                    >
                      {item.items ? (
                        <>
                          <button
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === index
                                ? 'bg-gray-100 text-teal-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                              }`}
                          >
                            {language === 'mn' ? item.title_mn : item.title_en}
                            <svg
                              className={`w-4 h-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''
                                }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Dropdown Menu - pt-2 нь gap үүсгэж hover-ийг алдахгүй болгоно */}
                          {activeDropdown === index && (
                            <div className="absolute top-full left-0 pt-2 w-72">
                              <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                {item.items.map((subItem, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className="relative"
                                    onMouseEnter={() => setActiveSubDropdown(subItem.title_mn)}
                                  >
                                    {/* Хэрэв дэд цэс байвал div, байхгүй бол Link */}
                                    {productSubMenus[subItem.title_mn] ? (
                                      <div
                                        className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${activeSubDropdown === subItem.title_mn ? 'bg-gray-50' : ''
                                          }`}
                                      >
                                        <div className="text-sm font-medium text-gray-900">{language === 'mn' ? subItem.title_mn : subItem.title_en}</div>
                                        <svg
                                          className="w-4 h-4 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <Link
                                        href={subItem.href}
                                        className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-900 hover:text-teal-600"
                                        onClick={() => {
                                          setActiveDropdown(null)
                                          setActiveSubDropdown(null)
                                        }}
                                      >
                                        {language === 'mn' ? subItem.title_mn : subItem.title_en}
                                      </Link>
                                    )}

                                    {/* Sub-dropdown - pl-2 нь gap үүсгэж hover алдахгүй */}
                                    {activeSubDropdown === subItem.title_mn && productSubMenus[subItem.title_mn] && (
                                      <div className="absolute left-full top-0 pl-2 w-64">
                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                          {productSubMenus[subItem.title_mn].map((nestedItem, nestedIndex) => (
                                            <Link
                                              key={nestedIndex}
                                              href={nestedItem.href}
                                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                                              onClick={() => {
                                                setActiveDropdown(null)
                                                setActiveSubDropdown(null)
                                              }}
                                            >
                                              {language === 'mn' ? nestedItem.title_mn : nestedItem.title_en}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href || '#'}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                        >
                          {language === 'mn' ? item.title_mn : item.title_en}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    aria-label="Хэл сонгох"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{language === 'mn' ? 'MN' : 'EN'}</span>
                    <svg className={`w-3 h-3 text-gray-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {langOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                      <button
                        onClick={() => {
                          setLanguage('mn')
                          setLangOpen(false)
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm font-medium transition-colors ${language === 'mn'
                            ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-base">🇲🇳</span>
                        Монгол
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('en')
                          setLangOpen(false)
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm font-medium transition-colors ${language === 'en'
                            ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-base">🇺🇸</span>
                        English
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Цэс"
                >
                  {mobileOpen ? (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
              <div className="lg:hidden py-4 border-t border-gray-100">
                <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                  {menuItems.map((item, index) => (
                    <div key={index}>
                      {item.items ? (
                        <div>
                          <button
                            onClick={() => setMobileActiveDropdown(mobileActiveDropdown === index ? null : index)}
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50/80 rounded-lg"
                          >
                            <span className="font-medium">{language === 'mn' ? item.title_mn : item.title_en}</span>
                            <svg
                              className={`w-5 h-5 transition-transform duration-200 ${mobileActiveDropdown === index ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {mobileActiveDropdown === index && (
                            <div className="pl-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                              {item.items.map((subItem, subIndex) => (
                                <div key={subIndex}>
                                  {/* Хэрэв дэд цэс байвал button, байхгүй бол Link */}
                                  {productSubMenus[subItem.title_mn] ? (
                                    <>
                                      <button
                                        onClick={() => setMobileActiveSubDropdown(mobileActiveSubDropdown === subItem.title_mn ? null : subItem.title_mn)}
                                        className="flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50/80 rounded-lg"
                                      >
                                        <span className="text-sm">{language === 'mn' ? subItem.title_mn : subItem.title_en}</span>
                                        <svg
                                          className={`w-4 h-4 transition-transform duration-200 ${mobileActiveSubDropdown === subItem.title_mn ? 'rotate-90' : ''}`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </button>

                                      {mobileActiveSubDropdown === subItem.title_mn && (
                                        <div className="pl-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                          {productSubMenus[subItem.title_mn].map((nestedItem, nestedIndex) => (
                                            <Link
                                              key={nestedIndex}
                                              href={nestedItem.href}
                                              className="block px-4 py-2 text-sm text-gray-500 hover:text-teal-600 hover:bg-gray-50/80 rounded-lg"
                                              onClick={() => {
                                                setMobileOpen(false)
                                                setMobileActiveDropdown(null)
                                                setMobileActiveSubDropdown(null)
                                              }}
                                            >
                                              {language === 'mn' ? nestedItem.title_mn : nestedItem.title_en}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <Link
                                      href={subItem.href}
                                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-gray-50/80 rounded-lg"
                                      onClick={() => {
                                        setMobileOpen(false)
                                        setMobileActiveDropdown(null)
                                      }}
                                    >
                                      {language === 'mn' ? subItem.title_mn : subItem.title_en}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href || '#'}
                          className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50/80 rounded-lg"
                          onClick={() => setMobileOpen(false)}
                        >
                          {language === 'mn' ? item.title_mn : item.title_en}
                        </Link>
                      )}
                    </div>
                  ))}

                </nav>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  )
}
