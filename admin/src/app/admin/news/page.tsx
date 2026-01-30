 'use client'
import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { Input, Textarea, Select, Button } from '@/components/FormElements'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface NewsItem {
  id: string
  title_mn: string
  title_en: string
  slug: string
  excerpt_mn: string
  excerpt_en: string
  content_mn: string
  content_en: string
  titleTextColor: string
  titleTextSize: number
  titleFontWeight: string
  titleFontFamily: string
  excerptTextColor: string
  excerptTextSize: number
  excerptFontWeight: string
  excerptFontFamily: string
  contentTextColor: string
  contentTextSize: number
  contentFontWeight: string
  contentFontFamily: string
  bannerImage: string
  category: string
  publishedAt: string
  readTime: number
  isActive: boolean
  isPinnedNews: boolean
  isPinnedHome: boolean
  socialLinks: SocialLink[]
}

interface SocialLink {
  id: string
  platform: string
  url: string
  active: boolean
  icon: string
}

interface Category {
  value: string
  label: string // Mongolian label for display
  labelEn: string
  dbId: string
  color: string
}

const categories: Category[] = [
  { value: 'announcement', label: 'Бүтээгдэхүүн', labelEn: 'Announcement', dbId: 'NC_ANN', color: '#0f766e' },
  { value: 'maintenance', label: 'Үйлчилгээ', labelEn: 'Maintenance', dbId: 'NC_MAINT', color: '#0f766e' },
  { value: 'advice', label: 'Зөвлөгөө', labelEn: 'Advice', dbId: 'NC_ADV', color: '#0f766e' },
  { value: 'video', label: 'Видео бичлэг', labelEn: 'Video', dbId: 'NC_VID', color: '#0f766e' },
  { value: 'community', label: 'Нийгэмд', labelEn: 'Community', dbId: 'NC_COMM', color: '#0f766e' },
]

// Demo news data - stored locally
const demoNews: NewsItem[] = [
  {
    id: '1001',
    title_mn: 'Шинэ байраас зээл олгох үйлчилгээ эхлүүллээ',
    title_en: 'New Branch Loan Service Launched',
    slug: 'new-branch-loan-service',
    excerpt_mn: 'Улаанбаатар хотын Энхтайваны өргөнгөнцөгт байрлах шинэ салбар нь зээлийн үйлчилгээг эхлүүлээд байгаа болно.',
    excerpt_en: 'Our new branch in Ulaanbaatar offers comprehensive loan services.',
    content_mn: 'Бид та бүхний эдийн засгийн сайхан ирээдүйг дэмжихийн тулд Энхтайваны өргөнгөнцөгт байрлах шинэ салбарыг нээлээ. Энэ салбарт та зээлийн бүх төрлийн үйлчилгээг авах боломжтой болно.\n\n![Зураг](/Bichil2.png)\n\nМанай мэргэжлийн ажилтнууд та бүхний зээлийн хүсэлтийг цаг алдалгүй шийдвэрлэх бөгөөд таатай хүүтэй зээл олгоно.',
    content_en: 'We are pleased to announce the opening of our new branch. Our professional team is ready to serve you with competitive rates and excellent service.\n\n![Image](/Bichil2.png)\n\nWe offer various types of loans with flexible terms.',
    titleTextColor: '#0f172a',
    titleTextSize: 20,
    titleFontWeight: '700',
    titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    excerptTextColor: '#0f172a',
    excerptTextSize: 14,
    excerptFontWeight: '500',
    excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    contentTextColor: '#0f172a',
    contentTextSize: 16,
    contentFontWeight: '400',
    contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    bannerImage: '/Bichil1.jpg',
    category: 'announcement',
    publishedAt: '2025-12-17',
    readTime: 3,
    isActive: true,
    isPinnedNews: true,
    isPinnedHome: true,
    socialLinks: [],
  },
  {
    id: '1002',
    title_mn: 'Системийн техникийн засвал хийгдэнэ',
    title_en: 'System Maintenance Notice',
    slug: 'system-maintenance-notice',
    excerpt_mn: 'Өнгөрөх сарын 20-ноос 21-ны хооронд онлайн системийн техникийн засвал хийгдэх болно.',
    excerpt_en: 'Our online system will undergo maintenance on the 20th-21st of next month.',
    content_mn: 'Бидний онлайн платформын үйлчилгээ сайжруулах үүднээс техникийн засвал хийгдэх болно. Энэ хугацаанд систем ашиглахад саад тотоохыг өмнөө анхааруулж байна.\n\n![Засвал](/Bichil3.jpg)\n\nТа боломжтой бол энэ үеийг сайтар төлөвлөнө үү.',
    content_en: 'We will perform system maintenance to improve our online platform. Please plan accordingly during this time.\n\n![Maintenance](/Bichil3.jpg)\n\nWe apologize for any inconvenience.',
    titleTextColor: '#0f172a',
    titleTextSize: 20,
    titleFontWeight: '700',
    titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    excerptTextColor: '#0f172a',
    excerptTextSize: 14,
    excerptFontWeight: '500',
    excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    contentTextColor: '#0f172a',
    contentTextSize: 16,
    contentFontWeight: '400',
    contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    bannerImage: '/Bichil1.jpg',
    category: 'maintenance',
    publishedAt: '2025-12-15',
    readTime: 2,
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: true,
    socialLinks: [],
  },
  {
    id: '1003',
    title_mn: 'Зээлийн хүүг хэрхэн бууруулахыг мэдэх нь чухал',
    title_en: 'How to Reduce Your Loan Interest',
    slug: 'how-to-reduce-loan-interest',
    excerpt_mn: 'Зээлийн хүүг эргүүлэлтийг сайтар хэрэгжүүлэх замаар бууруулж болно.',
    excerpt_en: 'Learn strategies to reduce your loan interest through proper management.',
    content_mn: 'Зээлийн хүүг хэрхэн бууруулах нь бүх зээлэгчийн сонирхдог асуулт юм. Манай эргүүлэлтийн төлөвлөгөө ашигладаг үед та ихэвчлэн 2-3 жилээр хугацаа багасгаж, хүүгээ мэдэгдэхүйц бууруулж болно.',
    content_en: 'Reducing loan interest is important for every borrower. Our refinancing program can help you save significantly on interest payments.',
    titleTextColor: '#0f172a',
    titleTextSize: 20,
    titleFontWeight: '700',
    titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    excerptTextColor: '#0f172a',
    excerptTextSize: 14,
    excerptFontWeight: '500',
    excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    contentTextColor: '#0f172a',
    contentTextSize: 16,
    contentFontWeight: '400',
    contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    bannerImage: '/Bichil2.png',
    category: 'advice',
    publishedAt: '2025-12-10',
    readTime: 4,
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: true,
    socialLinks: [],
  },
  {
    id: '1004',
    title_mn: 'Зээлийн үйлчилгээний танилцуулгын видео',
    title_en: 'Loan Service Introduction Video',
    slug: 'loan-service-intro-video',
    excerpt_mn: 'Бидний зээлийн үйлчилгээний шинэ видео танилцуулга нь 5 минутад хүргүүлнэ.',
    excerpt_en: 'Watch our 5-minute introduction to our loan services.',
    content_mn: 'Бидний үйлчилгээний талаар илүү сайн ойлгохын тулд энэ видеог үзнэ үү. ![Видео](/Bichil1.jpg) Видеонд бидний зээлийн төрлүүд, хүүний хувь, авах нөхцөлийн талаар бүхэл санаа өгөх болно.',
    content_en: 'Watch our video to learn more about our services. ![Video](/Bichil1.jpg) It covers our loan types, rates, and application requirements.',
    titleTextColor: '#0f172a',
    titleTextSize: 20,
    titleFontWeight: '700',
    titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    excerptTextColor: '#0f172a',
    excerptTextSize: 14,
    excerptFontWeight: '500',
    excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    contentTextColor: '#0f172a',
    contentTextSize: 16,
    contentFontWeight: '400',
    contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    bannerImage: '/Bichil3.jpg',
    category: 'video',
    publishedAt: '2025-12-08',
    readTime: 5,
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: false,
    socialLinks: [],
  },
  {
    id: '1005',
    title_mn: 'Бидний сайтанд нэвтэрсэн гишүүдийн амжилтын үлгэрүүд',
    title_en: 'Customer Success Stories',
    slug: 'customer-success-stories',
    excerpt_mn: 'Бидний үйлчилгээ ашигласан хүмүүсийн амжилтын үлгэрүүдийг сонсоорой.',
    excerpt_en: 'Read inspiring stories from our successful customers.',
    content_mn: 'Өнгөрсөн жилүүдэд бидний зээлийн үйлчилгээг ашигласан олон мянган хүмүүс өөрсдийн мөчлөгийг өөрчилж чадсан. ![Амжилт](/Bichil2.png) Тэдний амжилтын үлгэрүүд бидний ажилыг урам хүч өгдөг.',
    content_en: 'Thousands of customers have improved their lives through our services. ![Success](/Bichil2.png) Their stories inspire us to continue providing excellent service.',
    titleTextColor: '#0f172a',
    titleTextSize: 20,
    titleFontWeight: '700',
    titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    excerptTextColor: '#0f172a',
    excerptTextSize: 14,
    excerptFontWeight: '500',
    excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    contentTextColor: '#0f172a',
    contentTextSize: 16,
    contentFontWeight: '400',
    contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    bannerImage: '/Bichil2.png',
    category: 'community',
    publishedAt: '2025-12-05',
    readTime: 3,
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: false,
    socialLinks: [],
  },
]

const initialFormData = {
  title_mn: '',
  title_en: '',
  slug: '',
  excerpt_mn: '',
  excerpt_en: '',
  content_mn: '',
  content_en: '',
  titleTextColor: '#0f172a',
  titleTextSize: 20,
  titleFontWeight: '700',
  titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  excerptTextColor: '#0f172a',
  excerptTextSize: 14,
  excerptFontWeight: '500',
  excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  contentTextColor: '#0f172a',
  contentTextSize: 16,
  contentFontWeight: '400',
  contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  bannerImage: '',
  category: 'announcement',
  readTime: 3,
  isActive: true,
  isPinnedNews: false,
  isPinnedHome: false,
  socialLinks: [] as SocialLink[],
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>(demoNews)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [categoryTabs, setCategoryTabs] = useState<Category[]>(categories)
  const [categoryTabsBackup, setCategoryTabsBackup] = useState<Category[] | null>(null)
  const [newCategoryNameMn, setNewCategoryNameMn] = useState('')
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#0f766e')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newSocialPlatform, setNewSocialPlatform] = useState('')
  const [newSocialUrl, setNewSocialUrl] = useState('')
  const [newSocialIcon, setNewSocialIcon] = useState('')

  // Additional images for gallery
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [additionalVideos, setAdditionalVideos] = useState<string[]>([])
  const [galleryWidth, setGalleryWidth] = useState<'1' | '2' | '3' | '4'>('3')
  const [showPreview, setShowPreview] = useState(true)

  const canAddCategory = newCategoryNameMn.trim().length > 0 && newCategoryNameEn.trim().length > 0

  const getCategoryColor = (value: string) =>
    categoryTabs.find((cat) => cat.value === value)?.color || '#0f766e'

  const filteredNews = activeCategory === 'all'
    ? news
    : news.filter(item => item.category === activeCategory)

  const sortedNews = [...filteredNews].sort((a, b) => {
    const aPinned = a.isPinnedNews || a.isPinnedHome
    const bPinned = b.isPinnedNews || b.isPinnedHome
    if (aPinned === bPinned) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    return aPinned ? -1 : 1
  })

  const titleStyle = {
    color: formData.titleTextColor || '#0f172a',
    fontSize: `${formData.titleTextSize || 20}px`,
    fontWeight: formData.titleFontWeight || '700',
    fontFamily: formData.titleFontFamily || 'Inter, system-ui, -apple-system, sans-serif',
  }

  const excerptStyle = {
    color: formData.excerptTextColor || '#0f172a',
    fontSize: `${formData.excerptTextSize || 14}px`,
    fontWeight: formData.excerptFontWeight || '500',
    fontFamily: formData.excerptFontFamily || 'Inter, system-ui, -apple-system, sans-serif',
  }

  const contentStyle = {
    color: formData.contentTextColor || '#0f172a',
    fontSize: `${formData.contentTextSize || 16}px`,
    fontWeight: formData.contentFontWeight || '400',
    fontFamily: formData.contentFontFamily || 'Inter, system-ui, -apple-system, sans-serif',
  }

  const resetTitleStyle = () => setFormData({
    ...formData,
    titleTextColor: '#0f172a',
    titleTextSize: 20,
    titleFontWeight: '700',
    titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  })

  const applyTitlePreset = (preset: 'sans' | 'serif' | 'mono') => {
    if (preset === 'serif') {
      setFormData({
        ...formData,
        titleTextColor: '#0f172a',
        titleTextSize: 24,
        titleFontWeight: '700',
        titleFontFamily: "'Georgia', serif",
      })
    } else if (preset === 'mono') {
      setFormData({
        ...formData,
        titleTextColor: '#0f172a',
        titleTextSize: 22,
        titleFontWeight: '600',
        titleFontFamily: "'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
      })
    } else {
      setFormData({
        ...formData,
        titleTextColor: '#0f172a',
        titleTextSize: 24,
        titleFontWeight: '700',
        titleFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      })
    }
  }

  const resetExcerptStyle = () => setFormData({
    ...formData,
    excerptTextColor: '#0f172a',
    excerptTextSize: 14,
    excerptFontWeight: '500',
    excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  })

  const applyExcerptPreset = (preset: 'sans' | 'serif' | 'light') => {
    if (preset === 'serif') {
      setFormData({
        ...formData,
        excerptTextColor: '#2d2d2d',
        excerptTextSize: 15,
        excerptFontWeight: '500',
        excerptFontFamily: "'Georgia', serif",
      })
    } else if (preset === 'light') {
      setFormData({
        ...formData,
        excerptTextColor: '#475569',
        excerptTextSize: 13,
        excerptFontWeight: '400',
        excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      })
    } else {
      setFormData({
        ...formData,
        excerptTextColor: '#334155',
        excerptTextSize: 14,
        excerptFontWeight: '500',
        excerptFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      })
    }
  }

  const resetContentStyle = () => setFormData({
    ...formData,
    contentTextColor: '#0f172a',
    contentTextSize: 16,
    contentFontWeight: '400',
    contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  })

  const applyContentPreset = (preset: 'sans' | 'serif' | 'mono') => {
    if (preset === 'serif') {
      setFormData({
        ...formData,
        contentTextColor: '#1f2937',
        contentTextSize: 17,
        contentFontWeight: '400',
        contentFontFamily: "'Georgia', serif",
      })
    } else if (preset === 'mono') {
      setFormData({
        ...formData,
        contentTextColor: '#0f172a',
        contentTextSize: 15,
        contentFontWeight: '500',
        contentFontFamily: "'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
      })
    } else {
      setFormData({
        ...formData,
        contentTextColor: '#1f2937',
        contentTextSize: 16,
        contentFontWeight: '400',
        contentFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      })
    }
  }

  const getSocialIcon = (platform: string) => {
    const map: Record<string, string> = {
      facebook: '👍',
      instagram: '📸',
      x: '✖',
      youtube: '▶',
      linkedin: '💼',
      custom: '🔗',
    }
    return map[platform] || '🔗'
  }

  const renderSocialIcon = (icon?: string, platform?: string) => {
    const content = icon?.trim()
    if (content && content.startsWith('<svg')) {
      return (
        <span
          className="inline-flex w-4 h-4 items-center justify-center"
          aria-hidden
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
    return (
      <span className="text-base leading-none">
        {content || getSocialIcon(platform || '')}
      </span>
    )
  }

  const toEmbedUrl = (url: string) => {
    if (!url) return ''
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com')) {
        const vid = u.searchParams.get('v')
        return vid ? `https://www.youtube.com/embed/${vid}` : ''
      }
      if (u.hostname === 'youtu.be') {
        const vid = u.pathname.replace('/', '')
        return vid ? `https://www.youtube.com/embed/${vid}` : ''
      }
      return ''
    } catch {
      return ''
    }
  }

  const PinBadge = () => (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white shadow-sm"
      aria-label="Pinned"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 6.75h9m-7.5 0 1.5 4.5v4.5l3-2.25v-2.25l1.5-4.5m-6 0h6"
        />
      </svg>
    </span>
  )

  const derivePlatformFromUrl = (url: string) => {
    try {
      const host = new URL(url).hostname
      if (host.includes('facebook')) return 'facebook'
      if (host.includes('instagram')) return 'instagram'
      if (host.includes('twitter') || host === 'x.com' || host.endsWith('.x.com')) return 'x'
      if (host.includes('youtube')) return 'youtube'
      if (host.includes('linkedin')) return 'linkedin'
      return host.replace(/^www\./, '') || 'link'
    } catch {
      return 'link'
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate titles
    if (!formData.title_mn.trim()) {
      errors.title_mn = 'Монгол гарчиг оруулна уу'
    }
    if (!formData.title_en.trim()) {
      errors.title_en = 'Англи гарчиг оруулна уу'
    }

    // Validate excerpts
    if (!formData.excerpt_mn.trim()) {
      errors.excerpt_mn = 'Монгол товч тайлбар оруулна уу'
    }
    if (!formData.excerpt_en.trim()) {
      errors.excerpt_en = 'Англи товч тайлбар оруулна уу'
    }

    // Validate content
    if (!formData.content_mn.trim()) {
      errors.content_mn = 'Монгол агуулга оруулна уу'
    }
    if (!formData.content_en.trim()) {
      errors.content_en = 'Англи агуулга оруулна уу'
    }

    // Validate banner image
    if (!formData.bannerImage) {
      errors.bannerImage = 'Үндсэн зураг заавал оруулна уу'
    }

    // Validate social links URLs
    const invalidLinks = (formData.socialLinks || []).filter((link) => {
      try {
        new URL(link.url)
        return false
      } catch {
        return true
      }
    })
    if (invalidLinks.length > 0) {
      errors.socialLinks = 'Сошиал холбооснуудын URL буруу байна'
    }

    // Validate video URLs
    const invalidVideos = additionalVideos.filter((vid) => !toEmbedUrl(vid))
    if (invalidVideos.length > 0) {
      errors.videos = 'YouTube видеонуудын URL буруу байна'
    }

    // Validate pinned news count - max 1 per category for isPinnedNews
    if (formData.isPinnedNews && !editingNews) {
      const pinnedInCategory = news.filter(item => item.isPinnedNews && item.category === formData.category).length
      if (pinnedInCategory >= 1) {
        errors.pinnedNews = `"${formData.category}" ангилалд аль хэдийн онцлох мэдээ байгаа`
      }
    }

    if (formData.isPinnedHome && !editingNews) {
      const pinnedHomeCount = news.filter(item => item.isPinnedHome).length
      if (pinnedHomeCount >= 3) {
        errors.pinnedHome = 'Нүүр хуудасны онцлох мэдээ 3-аас олон байж болохгүй'
      }
    }

    // If editing, allow replacing existing pinned item
    if (editingNews && formData.isPinnedNews) {
      const pinnedInCategory = news.filter(item => item.isPinnedNews && item.category === formData.category && item.id !== editingNews.id).length
      if (pinnedInCategory >= 1) {
        errors.pinnedNews = `"${formData.category}" ангилалд аль хэдийн онцлох мэдээ байгаа`
      }
    }

    if (editingNews && formData.isPinnedHome) {
      const pinnedHomeCount = news.filter(item => item.isPinnedHome && item.id !== editingNews.id).length
      if (pinnedHomeCount >= 3) {
        errors.pinnedHome = 'Нүүр хуудасны онцлох мэдээ 3-аас олон байж болохгүй'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    // Validate form
    if (!validateForm()) {
      // Show specific error message if available
      const errorList = Object.values(formErrors).filter(Boolean)
      const errorMsg = errorList.length > 0 
        ? errorList[0] 
        : 'Маягтыг шалгаж дахин оруулна уу'
      setErrorMessage(errorMsg)
      return
    }

    setIsSaving(true)
    try {
      if (editingNews) {
        const updatedNews = news.map(item =>
          item.id === editingNews.id
            ? {
                ...item,
                title_mn: formData.title_mn,
                title_en: formData.title_en,
                slug: formData.slug,
                excerpt_mn: formData.excerpt_mn,
                excerpt_en: formData.excerpt_en,
                content_mn: formData.content_mn,
                content_en: formData.content_en,
                titleTextColor: formData.titleTextColor,
                titleTextSize: formData.titleTextSize,
                titleFontWeight: formData.titleFontWeight,
                titleFontFamily: formData.titleFontFamily,
                excerptTextColor: formData.excerptTextColor,
                excerptTextSize: formData.excerptTextSize,
                excerptFontWeight: formData.excerptFontWeight,
                excerptFontFamily: formData.excerptFontFamily,
                contentTextColor: formData.contentTextColor,
                contentTextSize: formData.contentTextSize,
                contentFontWeight: formData.contentFontWeight,
                contentFontFamily: formData.contentFontFamily,
                bannerImage: formData.bannerImage,
                category: formData.category,
                readTime: formData.readTime,
                isActive: formData.isActive,
                isPinnedNews: formData.isPinnedNews,
                isPinnedHome: formData.isPinnedHome,
                socialLinks: formData.socialLinks || [],
              }
            : item
        )
        setNews(updatedNews)
        setSuccessMessage('Мэдээ амжилттай шинэчлэгдлээ')
      } else {
        const newItem: NewsItem = {
          id: Date.now().toString(),
          title_mn: formData.title_mn,
          title_en: formData.title_en,
          slug: formData.slug,
          excerpt_mn: formData.excerpt_mn,
          excerpt_en: formData.excerpt_en,
          content_mn: formData.content_mn,
          content_en: formData.content_en,
          titleTextColor: formData.titleTextColor,
          titleTextSize: formData.titleTextSize,
          titleFontWeight: formData.titleFontWeight,
          titleFontFamily: formData.titleFontFamily,
          excerptTextColor: formData.excerptTextColor,
          excerptTextSize: formData.excerptTextSize,
          excerptFontWeight: formData.excerptFontWeight,
          excerptFontFamily: formData.excerptFontFamily,
          contentTextColor: formData.contentTextColor,
          contentTextSize: formData.contentTextSize,
          contentFontWeight: formData.contentFontWeight,
          contentFontFamily: formData.contentFontFamily,
          bannerImage: formData.bannerImage,
          category: formData.category,
          publishedAt: new Date().toISOString().split('T')[0],
          readTime: formData.readTime,
          isActive: formData.isActive,
          isPinnedNews: formData.isPinnedNews,
          isPinnedHome: formData.isPinnedHome,
          socialLinks: formData.socialLinks || [],
        }
        setNews([newItem, ...news])
        setSuccessMessage('Шинэ мэдээ амжилттай нэмэгдлээ')
      }
      setTimeout(() => {
        handleCloseModal()
        setSuccessMessage('')
      }, 1500)
    } catch (error) {
      console.error(error)
      setErrorMessage('Алдаа гарлаа. Дахин оруулна уу')
      setTimeout(() => setErrorMessage(''), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item)
    setFormData({
      title_mn: item.title_mn,
      title_en: item.title_en,
      slug: item.slug,
      excerpt_mn: item.excerpt_mn,
      excerpt_en: item.excerpt_en,
      content_mn: item.content_mn,
      content_en: item.content_en,
      titleTextColor: item.titleTextColor || '#0f172a',
      titleTextSize: item.titleTextSize || 20,
      titleFontWeight: item.titleFontWeight || '700',
      titleFontFamily: item.titleFontFamily || 'Inter, system-ui, -apple-system, sans-serif',
      excerptTextColor: item.excerptTextColor || '#0f172a',
      excerptTextSize: item.excerptTextSize || 14,
      excerptFontWeight: item.excerptFontWeight || '500',
      excerptFontFamily: item.excerptFontFamily || 'Inter, system-ui, -apple-system, sans-serif',
      contentTextColor: item.contentTextColor || '#0f172a',
      contentTextSize: item.contentTextSize || 16,
      contentFontWeight: item.contentFontWeight || '400',
      contentFontFamily: item.contentFontFamily || 'Inter, system-ui, -apple-system, sans-serif',
      bannerImage: item.bannerImage,
      category: item.category,
      readTime: item.readTime || 3,
      isActive: item.isActive,
      isPinnedNews: item.isPinnedNews,
      isPinnedHome: item.isPinnedHome,
      socialLinks: item.socialLinks || [],
    })
    setModalOpen(true)
  }

  const handleDelete = async (item: NewsItem) => {
    if (confirm('Энэ мэдээг устгахыг сайн дүгнэлээ?')) {
      setIsDeleting(item.id)
      try {
        setNews(news.filter(n => n.id !== item.id))
        setSuccessMessage('Мэдээ амжилттай устгалаа')
        setTimeout(() => setSuccessMessage(''), 3000)
      } catch (error) {
        console.error(error)
        setErrorMessage('Устгахад алдаа гарлаа')
        setTimeout(() => setErrorMessage(''), 3000)
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingNews(null)
    setFormData(initialFormData)
    setFormErrors({})
    setErrorMessage('')
    setSuccessMessage('')
    setAdditionalImages([])
    setAdditionalVideos([])
  }

  const handleAddCategory = () => {
    if (!newCategoryNameMn.trim() || !newCategoryNameEn.trim()) {
      alert('Ангиллын нэрийг Монгол болон Англиар оруулна уу!')
      return
    }

    const baseName = newCategoryNameEn || newCategoryNameMn
    const newCategoryId = baseName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')

    if (categoryTabs.some((cat) => cat.value === newCategoryId)) {
      alert('Энэ ангилал аль хэдийн байгаа!')
      return
    }

    const newCategory: Category = {
      value: newCategoryId,
      label: newCategoryNameMn.trim(),
      labelEn: newCategoryNameEn.trim(),
      dbId: `NC_${newCategoryId.toUpperCase()}`,
      color: newCategoryColor,
    }

    setCategoryTabs([...categoryTabs, newCategory])
    setNewCategoryNameMn('')
    setNewCategoryNameEn('')
    setNewCategoryColor('#0f766e')
    setShowAddCategory(false)
  }

  const handleDeleteCategory = (value: string) => {
    const nextCategories = categoryTabs.filter((cat) => cat.value !== value)
    setCategoryTabs(nextCategories)
    if (activeCategory === value) setActiveCategory('all')
  }

  const handleUpdateCategoryColor = (value: string, color: string) => {
    setCategoryTabs((prev) => prev.map((cat) => (cat.value === value ? { ...cat, color } : cat)))
  }

  const handleUpdateCategoryLabel = (value: string, field: 'label' | 'labelEn', text: string) => {
    setCategoryTabs((prev) => prev.map((cat) => (cat.value === value ? { ...cat, [field]: text } : cat)))
  }

  const handleCategoryPanelClose = () => {
    const proceed = confirm('Буцах дарвал хийсэн өөрчлөлт хадгалагдахгүй. Буцах уу?')
    if (!proceed) return
    if (categoryTabsBackup) {
      setCategoryTabs(categoryTabsBackup)
    }
    setCategoryTabsBackup(null)
    setShowAddCategory(false)
    setNewCategoryNameMn('')
    setNewCategoryNameEn('')
    setNewCategoryColor('#0f766e')
  }

  const handleCategorySave = () => {
    const proceed = confirm('Өөрчлөлт шууд frontend дээр харагдана. Хадгалах уу?')
    if (!proceed) return
    if (!canAddCategory) {
      alert('MN/EN нэрийг бүрэн оруулаад өнгөө сонгоно уу.')
      return
    }
    handleAddCategory()
    setCategoryTabsBackup(null)
  }

  const handleCategoryPanelToggle = () => {
    if (showAddCategory) {
      handleCategoryPanelClose()
    } else {
      setCategoryTabsBackup(categoryTabs)
      setShowAddCategory(true)
    }
  }

  const handleAddSocialLink = () => {
    if (!newSocialUrl.trim()) {
      alert('URL оруулна уу')
      return
    }

    const newLink: SocialLink = {
      id: `${newSocialPlatform}-${Date.now()}`,
      platform: newSocialPlatform.trim() || derivePlatformFromUrl(newSocialUrl.trim()),
      url: newSocialUrl.trim(),
      active: true,
      icon: newSocialIcon.trim() || getSocialIcon(newSocialPlatform.trim() || derivePlatformFromUrl(newSocialUrl.trim())),
    }

    setFormData({
      ...formData,
      socialLinks: [...(formData.socialLinks || []), newLink],
    })
    setNewSocialUrl('')
    setNewSocialIcon('')
  }

  const handleToggleSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: (formData.socialLinks || []).map((link) =>
        link.id === id ? { ...link, active: !link.active } : link
      ),
    })
  }

  const handleDeleteSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: (formData.socialLinks || []).filter((link) => link.id !== id),
    })
  }

  return (
    <AdminLayout title="Мэдээ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error/Success Toast Messages - Fixed Position */}
        {errorMessage && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 shadow-lg flex items-start gap-3 max-w-sm">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Алдаа</h3>
                <p className="text-sm text-red-800 mt-0.5">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage('')}
                className="flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 shadow-lg flex items-start gap-3 max-w-sm">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-medium text-green-900">Амжилттай</h3>
                <p className="text-sm text-green-800 mt-0.5">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="flex-shrink-0 text-green-400 hover:text-green-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мэдээ мэдээлэл</h1>
            <p className="text-sm text-gray-500 mt-1">Компанийн мэдээ, мэдээлэл удирдах</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5" />
              Шинэ мэдээ
            </button>
          </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* All */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === 'all'
                ? 'text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              style={activeCategory === 'all' ? { backgroundColor: 'var(--color-teal-600)' } : undefined}
            >
              Бүгд
            </button>
            
            {/* Categories */}
            {categoryTabs.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.value
                  ? 'text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                style={activeCategory === cat.value ? { backgroundColor: 'var(--color-teal-600)' } : undefined}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={handleCategoryPanelToggle}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-300 flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-teal-600)' }}
            >
              <PlusIcon className="h-4 w-4" />
              Шинэ ангилал
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <PlusIcon className="h-4 w-4 text-gray-500" />
                Шинэ ангилал нэмэх
              </div>
              <div className="grid gap-3 md:grid-cols-3" aria-describedby="new-category-help">
                <input
                  type="text"
                  value={newCategoryNameMn}
                  onChange={(e) => setNewCategoryNameMn(e.target.value)}
                  placeholder="Нэр (MN)"
                  maxLength={50}
                  className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-colors ${newCategoryNameMn.trim() ? 'border-gray-300 focus:ring-teal-500' : 'border-red-300 focus:ring-red-500'}`}
                  aria-invalid={!newCategoryNameMn.trim()}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      handleCategoryPanelClose()
                    }
                  }}
                />
                <input
                  type="text"
                  value={newCategoryNameEn}
                  onChange={(e) => setNewCategoryNameEn(e.target.value)}
                  placeholder="Name (EN)"
                  maxLength={50}
                  className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-colors ${newCategoryNameEn.trim() ? 'border-gray-300 focus:ring-teal-500' : 'border-red-300 focus:ring-red-500'}`}
                  aria-invalid={!newCategoryNameEn.trim()}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      handleCategoryPanelClose()
                    }
                  }}
                />
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5">
                  <label htmlFor="category-color" className="text-xs text-gray-500">Color</label>
                  <input
                    id="category-color"
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-gray-200 bg-white"
                    aria-label="Category color"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  disabled
                  aria-disabled
                  className="px-3.5 py-2 text-white rounded-lg transition-colors font-medium shadow-sm opacity-40 cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-teal-600)' }}
                  title="Хадгалах/Буцах товчыг ашиглана"
                  aria-label="Нэмэх (идэвхгүй)"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
                <button
                  disabled
                  aria-disabled
                  className="px-3.5 py-2 rounded-lg border border-gray-300 text-gray-500 opacity-60 cursor-not-allowed"
                  title="Хадгалах/Буцах товчыг ашиглана"
                  aria-label="Цуцлах (идэвхгүй)"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Цуцлах дарвал таны өөрчлөлт хадгалагдахгүй.</p>
              <div className="flex items-center justify-between text-xs text-gray-500 w-full" id="new-category-help">
                <span className={`${canAddCategory ? 'text-gray-500' : 'text-red-600'}`}>
                  {canAddCategory
                    ? 'MN / EN нэрийг бөглөж, өнгөө сонгоод Enter эсвэл “Нэмэх” дарж хадгална. Хадгалсан даруйд frontend дээр шууд харагдана.'
                    : 'Нэмэхийн өмнө MN болон EN нэрийг бүрэн бөглөнө үү.'}
                </span>
                <span>
                  MN {newCategoryNameMn.trim().length}/50 · EN {newCategoryNameEn.trim().length}/50
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Ангилал засах / устгах</span>
                  <span>Өнгийг шууд сольж болно</span>
                </div>
                <div className="space-y-2">
                  {categoryTabs.map((cat) => (
                    <div
                      key={cat.value}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: cat.color }}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <input
                            type="text"
                            value={cat.label}
                            onChange={(e) => handleUpdateCategoryLabel(cat.value, 'label', e.target.value)}
                            className="w-full text-sm font-semibold text-gray-900 truncate bg-transparent border border-transparent focus:border-gray-300 rounded px-1 py-0.5"
                            aria-label={`${cat.label} монгол нэр`}
                          />
                          <input
                            type="text"
                            value={cat.labelEn}
                            onChange={(e) => handleUpdateCategoryLabel(cat.value, 'labelEn', e.target.value)}
                            className="w-full text-xs text-gray-600 truncate bg-transparent border border-transparent focus:border-gray-300 rounded px-1 py-0.5"
                            aria-label={`${cat.label} english name`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={cat.color}
                          onChange={(e) => handleUpdateCategoryColor(cat.value, e.target.value)}
                          className="h-9 w-12 cursor-pointer rounded border border-gray-200 bg-white"
                          aria-label={`${cat.label} өнгө`}
                        />
                        <button
                          onClick={() => handleDeleteCategory(cat.value)}
                          className="p-2 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                          aria-label={`${cat.label} устгах`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                  <button
                    onClick={handleCategoryPanelClose}
                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Хийгдсэн өөрчлөлт хадгалагдахгүй"
                    aria-label="Буцах (хадгалахгүй)"
                  >
                    Буцах
                  </button>
                  <button
                    onClick={handleCategorySave}
                    className="px-4 py-2 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: 'var(--color-teal-600)' }}
                  >
                    Хадгалах
                  </button>
                </div>
                <p className="text-xs text-right text-gray-500 mt-2">
                  Таны хийсэн өөрчлөлтүүд урьдчилан харагдаж байна. Хадгалах бол “Хадгалах”, буцах бол “Буцах” дарна уу (Өөрчлөлт хадгалагдахгүй).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedNews.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                {item.bannerImage ? (
                  <Image
                    src={item.bannerImage}
                    alt={item.title_mn}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {(item.isPinnedNews || item.isPinnedHome) && (
                  <span className="absolute top-2 left-2">
                    <PinBadge />
                  </span>
                )}

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={isSaving || isDeleting === item.id}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={isSaving || isDeleting !== null}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isDeleting === item.id ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span
                    className="px-2.5 py-1 rounded-lg font-medium"
                    style={{
                      backgroundColor: getCategoryColor(item.category),
                      color: '#ffffff',
                    }}
                  >
                    {categoryTabs.find((c) => c.value === item.category)?.label || 'Ангилал' }
                  </span>
                  <span className="text-slate-500">{item.publishedAt}</span>
                </div>
                <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2">
                  {item.title_mn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.excerpt_mn}
                </p>
                {(item.socialLinks && item.socialLinks.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600">
                    {item.socialLinks
                      .filter((link) => link.active)
                      .map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          {renderSocialIcon(link.icon, link.platform)}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {sortedNews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">Мэдээ олдсонгүй</h3>
            <p className="text-slate-500">Энэ төрлийн мэдээ одоогоор байхгүй байна.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingNews ? 'Мэдээ засах' : 'Шинэ мэдээ'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5 pb-4">
          
          {/* ===== SECTION 1: TITLE ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Гарчиг (Title)
            </h4>
            <div className="space-y-4">
              <Input
                label="Гарчиг (Монгол)"
                value={formData.title_mn}
                onChange={(e) => {
                  setFormData({ ...formData, title_mn: e.target.value })
                  if (formErrors.title_mn) {
                    setFormErrors({ ...formErrors, title_mn: '' })
                  }
                }}
                placeholder="Мэдээний гарчиг"
                error={formErrors.title_mn}
                required
              />
              <Input
                label="Гарчиг (English)"
                value={formData.title_en}
                onChange={(e) => {
                  setFormData({ ...formData, title_en: e.target.value })
                  if (formErrors.title_en) {
                    setFormErrors({ ...formErrors, title_en: '' })
                  }
                }}
                placeholder="News title"
                error={formErrors.title_en}
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800">Гарчиг өнгө</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.titleTextColor}
                      onChange={(e) => setFormData({ ...formData, titleTextColor: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-200 bg-white cursor-pointer"
                      aria-label="Гарчиг өнгө"
                    />
                    <span className="text-sm text-gray-600">{formData.titleTextColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800">Гарчиг хэмжээ (px)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={16}
                      max={32}
                      step={1}
                      value={formData.titleTextSize}
                      onChange={(e) => setFormData({ ...formData, titleTextSize: Number(e.target.value) })}
                      className="flex-1"
                      aria-label="Гарчиг хэмжээ"
                    />
                    <input
                      type="number"
                      min={16}
                      max={32}
                      value={formData.titleTextSize}
                      onChange={(e) => setFormData({ ...formData, titleTextSize: Number(e.target.value) || 20 })}
                      className="w-20 rounded border border-gray-200 px-2 py-2 text-sm"
                      aria-label="Гарчиг хэмжээ тоогоор"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-800">Гарчиг фонтын жин</label>
                  <select
                    value={formData.titleFontWeight}
                    onChange={(e) => setFormData({ ...formData, titleFontWeight: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Гарчиг фонтын жин"
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-800">Гарчиг фонт (Font family)</label>
                  <select
                    value={formData.titleFontFamily}
                    onChange={(e) => setFormData({ ...formData, titleFontFamily: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Гарчиг фонт"
                  >
                    <option value="Inter, system-ui, -apple-system, sans-serif">Inter / System sans</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                    <option value="'Helvetica Neue', Arial, sans-serif">Helvetica / Arial</option>
                    <option value="'Georgia', serif">Georgia (Serif)</option>
                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                    <option value="'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace">Mono</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-3 text-xs text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={titleStyle}>Aa</span>
                    <span>Өнгө/жин/хэмжээг урьдчилан харах · Preview color/weight/size</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyTitlePreset('sans')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sans
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTitlePreset('serif')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTitlePreset('mono')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Mono
                    </button>
                    <button
                      type="button"
                      onClick={resetTitleStyle}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Анхны утга
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECTION 2: EXCERPT (SUMMARY) ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Товч тайлбар (Summary)
            </h4>
            <div className="space-y-4">
              <Textarea
                label="Товч тайлбар (Монгол)"
                value={formData.excerpt_mn}
                onChange={(e) => {
                  setFormData({ ...formData, excerpt_mn: e.target.value })
                  if (formErrors.excerpt_mn) {
                    setFormErrors({ ...formErrors, excerpt_mn: '' })
                  }
                }}
                error={formErrors.excerpt_mn}
                rows={2}
                placeholder="Мэдээний товч тайлбар..."
              />
              <Textarea
                label="Товч тайлбар (English)"
                value={formData.excerpt_en}
                onChange={(e) => {
                  setFormData({ ...formData, excerpt_en: e.target.value })
                  if (formErrors.excerpt_en) {
                    setFormErrors({ ...formErrors, excerpt_en: '' })
                  }
                }}
                error={formErrors.excerpt_en}
                rows={2}
                placeholder="Brief description..."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800">Товч тайлбар өнгө</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.excerptTextColor}
                      onChange={(e) => setFormData({ ...formData, excerptTextColor: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-200 bg-white cursor-pointer"
                      aria-label="Товч тайлбар өнгө"
                    />
                    <span className="text-sm text-gray-600">{formData.excerptTextColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800">Товч тайлбар хэмжээ (px)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={12}
                      max={22}
                      step={1}
                      value={formData.excerptTextSize}
                      onChange={(e) => setFormData({ ...formData, excerptTextSize: Number(e.target.value) })}
                      className="flex-1"
                      aria-label="Товч тайлбар хэмжээ"
                    />
                    <input
                      type="number"
                      min={12}
                      max={22}
                      value={formData.excerptTextSize}
                      onChange={(e) => setFormData({ ...formData, excerptTextSize: Number(e.target.value) || 14 })}
                      className="w-20 rounded border border-gray-200 px-2 py-2 text-sm"
                      aria-label="Товч тайлбар хэмжээ тоогоор"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-800">Товч тайлбар фонтын жин</label>
                  <select
                    value={formData.excerptFontWeight}
                    onChange={(e) => setFormData({ ...formData, excerptFontWeight: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Товч тайлбар фонтын жин"
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-800">Товч тайлбар фонт (Font family)</label>
                  <select
                    value={formData.excerptFontFamily}
                    onChange={(e) => setFormData({ ...formData, excerptFontFamily: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Товч тайлбар фонт"
                  >
                    <option value="Inter, system-ui, -apple-system, sans-serif">Inter / System sans</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                    <option value="'Helvetica Neue', Arial, sans-serif">Helvetica / Arial</option>
                    <option value="'Georgia', serif">Georgia (Serif)</option>
                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                    <option value="'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace">Mono</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-3 text-xs text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={excerptStyle}>Aa</span>
                    <span>Өнгө/жин/хэмжээг урьдчилан харах · Preview color/weight/size</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyExcerptPreset('sans')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sans
                    </button>
                    <button
                      type="button"
                      onClick={() => applyExcerptPreset('serif')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => applyExcerptPreset('light')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={resetExcerptStyle}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Анхны утга
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECTION 3: CONTENT ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Агуулга (Content)
            </h4>
            <div className="space-y-4">
              <Textarea
                label="Агуулга (Монгол)"
                value={formData.content_mn}
                onChange={(e) => {
                  setFormData({ ...formData, content_mn: e.target.value })
                  if (formErrors.content_mn) {
                    setFormErrors({ ...formErrors, content_mn: '' })
                  }
                }}
                error={formErrors.content_mn}
                rows={8}
                placeholder="Мэдээний дэлгэрэнгүй агуулга..."
              />
              <Textarea
                label="Агуулга (English)"
                value={formData.content_en}
                onChange={(e) => {
                  setFormData({ ...formData, content_en: e.target.value })
                  if (formErrors.content_en) {
                    setFormErrors({ ...formErrors, content_en: '' })
                  }
                }}
                error={formErrors.content_en}
                rows={8}
                placeholder="Detailed content..."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800">Агуулга өнгө</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.contentTextColor}
                      onChange={(e) => setFormData({ ...formData, contentTextColor: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-200 bg-white cursor-pointer"
                      aria-label="Агуулга өнгө"
                    />
                    <span className="text-sm text-gray-600">{formData.contentTextColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800">Агуулга хэмжээ (px)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={14}
                      max={26}
                      step={1}
                      value={formData.contentTextSize}
                      onChange={(e) => setFormData({ ...formData, contentTextSize: Number(e.target.value) })}
                      className="flex-1"
                      aria-label="Агуулга хэмжээ"
                    />
                    <input
                      type="number"
                      min={14}
                      max={26}
                      value={formData.contentTextSize}
                      onChange={(e) => setFormData({ ...formData, contentTextSize: Number(e.target.value) || 16 })}
                      className="w-20 rounded border border-gray-200 px-2 py-2 text-sm"
                      aria-label="Агуулга хэмжээ тоогоор"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-800">Агуулга фонтын жин</label>
                  <select
                    value={formData.contentFontWeight}
                    onChange={(e) => setFormData({ ...formData, contentFontWeight: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Агуулга фонтын жин"
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-800">Агуулга фонт (Font family)</label>
                  <select
                    value={formData.contentFontFamily}
                    onChange={(e) => setFormData({ ...formData, contentFontFamily: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Агуулга фонт"
                  >
                    <option value="Inter, system-ui, -apple-system, sans-serif">Inter / System sans</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                    <option value="'Helvetica Neue', Arial, sans-serif">Helvetica / Arial</option>
                    <option value="'Georgia', serif">Georgia (Serif)</option>
                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                    <option value="'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace">Mono</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-3 text-xs text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <span className="px-2 py-1 rounded border border-gray-200 bg-white" style={contentStyle}>Aa</span>
                    <span>Өнгө/жин/хэмжээг урьдчилан харах · Preview color/weight/size</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyContentPreset('sans')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sans
                    </button>
                    <button
                      type="button"
                      onClick={() => applyContentPreset('serif')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => applyContentPreset('mono')}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Mono
                    </button>
                    <button
                      type="button"
                      onClick={resetContentStyle}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Анхны утга
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ===== SECTION 4: ADDITIONAL IMAGES ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-base font-semibold text-gray-900">Нэмэлт зургууд</h5>
              <div className="flex gap-1">
                {(['1', '2', '3', '4'] as const).map((width) => (
                  <button
                    key={width}
                    type="button"
                    onClick={() => setGalleryWidth(width)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      galleryWidth === width
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title={`${width} баганатай`}
                  >
                    {width}✕
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <ImageUpload
                label="Зураг нэмэх"
                value=""
                onChange={(url) => {
                  if (url && !additionalImages.includes(url)) {
                    setAdditionalImages([...additionalImages, url])
                  }
                }}
              />
            </div>

            {additionalImages.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-3">Нийт {additionalImages.length} зураг</div>
                <div className={`grid gap-3 ${galleryWidth === '1' ? 'grid-cols-1' : galleryWidth === '2' ? 'grid-cols-2' : galleryWidth === '3' ? 'grid-cols-3' : 'grid-cols-4'}`}>
                  {additionalImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden flex items-center justify-center border-2 border-gray-300 shadow-sm group-hover:shadow-md transition-shadow">
                        {img ? (
                          <img src={img} alt={`Зураг ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                        ) : (
                          <span className="text-xs text-gray-500">Зураг {idx + 1}</span>
                        )}
                      </div>
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity">
                        {idx + 1}
                      </div>
                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...additionalImages];
                              [newImages[idx], newImages[idx - 1]] = [newImages[idx - 1], newImages[idx]];
                              setAdditionalImages(newImages);
                            }}
                            className="px-2.5 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 font-medium transition-colors"
                            title="Дээш шилжүүлэх"
                          >
                            ↑
                          </button>
                        )}
                        {idx < additionalImages.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...additionalImages];
                              [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                              setAdditionalImages(newImages);
                            }}
                            className="px-2.5 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 font-medium transition-colors"
                            title="Доош шилжүүлэх"
                          >
                            ↓
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setAdditionalImages(additionalImages.filter((_, i) => i !== idx))}
                          className="px-2.5 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 font-medium transition-colors"
                          title="Устгах"
                        >
                          ✕ Устгах
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {additionalImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Зургууд оруулаагүй байна</p>
              </div>
            )}
          </div>

          {/* ===== SECTION 4.1: ADDITIONAL VIDEOS ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-base font-semibold text-gray-900 mb-4">Нэмэлт бичлэгүүд (YouTube)</h5>

            <div className="mb-4 flex gap-3 flex-col md:flex-row">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... эсвэл youtu.be/..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const target = e.target as HTMLInputElement
                    const val = target.value.trim()
                    if (val && toEmbedUrl(val)) {
                      setAdditionalVideos([...additionalVideos, val])
                      target.value = ''
                    }
                  }
                }}
              />
              <Button
                type="button"
                onClick={(e) => {
                  const input = (e.currentTarget.parentElement?.querySelector('input[type="url"]') as HTMLInputElement | null)
                  const val = input?.value.trim() || ''
                  if (val && toEmbedUrl(val)) {
                    setAdditionalVideos([...additionalVideos, val])
                    if (input) input.value = ''
                  }
                }}
              >
                Бичлэг нэмэх
              </Button>
            </div>

            {additionalVideos.length > 0 && (
              <div className="space-y-3">
                {additionalVideos.map((vid, idx) => {
                  const embed = toEmbedUrl(vid)
                  return (
                    <div key={idx} className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-600">
                        <span className="truncate">{vid}</span>
                        <button
                          type="button"
                          onClick={() => setAdditionalVideos(additionalVideos.filter((_, i) => i !== idx))}
                          className="px-2 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
                        >
                          Устгах
                        </button>
                      </div>
                      {embed ? (
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                          <iframe
                            src={embed}
                            title={`video-${idx}`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="p-3 text-xs text-red-600">Энэ холбоосыг хөрвүүлж чадсангүй. YouTube линк оруулна уу.</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {additionalVideos.length === 0 && (
              <p className="text-xs text-gray-600 italic">Бичлэг оруулаагүй байна</p>
            )}
          </div>

          {/* ===== SECTION 5: SETTINGS ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Сонголт (Settings)
            </h4>
            <div className="space-y-4">
              <Input
                label="Slug (URL)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="sustainability-report-2024"
              />
              <Select
                label="Ангилал"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={categoryTabs}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">Унших минут</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={formData.readTime || 3}
                    onChange={(e) => setFormData({ ...formData, readTime: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.readTime || 3}
                    onChange={(e) => setFormData({ ...formData, readTime: Number(e.target.value) || 3 })}
                    className="w-16 rounded border border-gray-200 px-2 py-2 text-sm"
                  />
                  <span className="text-sm text-gray-500">мин</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-lg border border-gray-200 px-3 py-3 bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    id="pin-news-page"
                    type="checkbox"
                    checked={formData.isPinnedNews}
                    onChange={(e) => {
                      setFormData({ ...formData, isPinnedNews: e.target.checked })
                      if (formErrors.pinnedNews) {
                        setFormErrors({ ...formErrors, pinnedNews: '' })
                      }
                    }}
                    className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <div className="flex flex-col">
                    <label htmlFor="pin-news-page" className="text-sm font-semibold text-gray-900">Онцлох (Мэдээ хуудас)</label>
                    <span className="text-xs text-gray-500">Мэдээ хуудасны онцлох жагсаалтанд орно. Ангилал бүрд 1 мэдээ л pin хийж болно.</span>
                  </div>
                </div>
                {formErrors.pinnedNews && (
                  <div className="ml-7 p-2 rounded bg-red-50 border border-red-200">
                    <p className="text-xs text-red-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {formErrors.pinnedNews}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    id="pin-home"
                    type="checkbox"
                    checked={formData.isPinnedHome}
                    onChange={(e) => {
                      setFormData({ ...formData, isPinnedHome: e.target.checked })
                      if (formErrors.pinnedHome) {
                        setFormErrors({ ...formErrors, pinnedHome: '' })
                      }
                    }}
                    className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <div className="flex flex-col">
                    <label htmlFor="pin-home" className="text-sm font-semibold text-gray-900">Онцлох (Нүүр “Мэдээ, мэдээлэл”)</label>
                    <span className="text-xs text-gray-500">Нүүр хуудасны онцлох жагсаалтанд орно. Нийтлэг 3 мэдээ л pin хийж болно.</span>
                  </div>
                </div>
                {formErrors.pinnedHome && (
                  <div className="ml-7 p-2 rounded bg-red-50 border border-red-200">
                    <p className="text-xs text-red-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {formErrors.pinnedHome}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== SECTION 5.5: SOCIAL LINKS ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              Сошиал холбоос
              <span className="text-xs text-gray-500">(Facebook, Instagram, X гэх мэт)</span>
            </h4>
            <div className="grid gap-3 md:grid-cols-3 items-end">
              <Input
                label="URL"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
              <Input
                label="Icon (SVG эсвэл emoji)"
                value={newSocialIcon}
                onChange={(e) => setNewSocialIcon(e.target.value)}
                placeholder="👍 эсвэл <svg ...>"
              />
              <div className="md:col-span-3 flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddSocialLink}
                  disabled={!newSocialUrl.trim()}
                >
                  Холбоос нэмэх
                </Button>
              </div>
            </div>

            {(formData.socialLinks || []).length > 0 && (
              <div className="mt-4 space-y-2">
                {(formData.socialLinks || []).map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={link.active}
                        onChange={() => handleToggleSocialLink(link.id)}
                        className="h-4 w-4"
                        aria-label={`${link.platform} идэвхжүүлэх`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 truncate">
                          {renderSocialIcon(link.icon, link.platform)}
                          <span className="truncate">{link.platform}</span>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-teal-700 hover:underline break-all"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="p-2 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                      aria-label={`${link.platform} устгах`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(formData.socialLinks || []).length === 0 && (
              <p className="text-xs text-gray-500 mt-3">Одоогоор холбоос нэмэгдээгүй байна.</p>
            )}
          </div>

          {/* ===== SECTION 6: BANNER IMAGE ===== */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-4">Үндсэн зураг (Заавал)</h4>
            <ImageUpload
              label="Үндсэн зураг нэмэх"
              value={formData.bannerImage}
              onChange={(url) => {
                setFormData({ ...formData, bannerImage: url })
                if (formErrors.bannerImage) {
                  setFormErrors({ ...formErrors, bannerImage: '' })
                }
              }}
            />
            {formErrors.bannerImage && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {formErrors.bannerImage}
              </p>
            )}
            
            {formData.bannerImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerImage: '' })}
                className="mt-3 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
              >
                Зураг устгах
              </button>
            )}
          </div>

          {/* ===== PREVIEW ===== */}
          {(formData.bannerImage || formData.title_mn || formData.excerpt_mn || formData.content_mn || additionalImages.length > 0 || additionalVideos.length > 0 || (formData.socialLinks && formData.socialLinks.length > 0)) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-semibold text-gray-900">Урьдчилан харагдах байдал (Frontend шиг)</h4>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                  title={showPreview ? 'Нуух' : 'Харуулах'}
                >
                  {showPreview ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M15.171 13.576l1.414 1.414a1 1 0 00.707-.293l1.415-1.415a10.016 10.016 0 01-3.536.294z" />
                    </svg>
                  )}
                </button>
              </div>

              {showPreview && (
                <>
              {/* ГАДНА ХЭСЭГ - НҮҮР ХУУДАСТ ХАРАГДАХ */}
              <div className="mb-8">
                <div className="mb-4 px-4 py-2 bg-teal-50 border-l-4 border-teal-600 rounded">
                  <p className="text-sm font-semibold text-teal-900"> Гадна хэсэг (Нүүр хуудас - мэдээ картын хэлбэр)</p>
                </div>

                {/* Featured card preview - like frontend */}
                {formData.bannerImage && (
                  <div className="mb-4 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="relative h-60 lg:h-auto lg:w-2/3 bg-gray-200 overflow-hidden">
                        <img
                          src={formData.bannerImage}
                          alt={formData.title_mn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Content */}
                      <div className="flex flex-col justify-between h-auto lg:w-1/3 p-6 space-y-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-teal-600">
                            {categoryTabs.find(c => c.value === formData.category)?.label || 'Мэдээ'}
                          </p>
                          <h3 style={titleStyle} className="line-clamp-3">
                            {formData.title_mn || 'Мэдээний гарчиг'}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                          {new Date().toLocaleDateString()} • {formData.readTime || 3} минут унших
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ДОТОРЬ ХЭСЭГ - МЭДЭЭНИЙ ДҮНД ХАРАГДАХ */}
              <div>
                <div className="mb-4 px-4 py-2 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <p className="text-sm font-semibold text-blue-900"> Дотор хэсэг (Мэдээ хуудас - нэмэлт мэдээллүүд)</p>
                </div>

                {/* Ангилал */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                    {categoryTabs.find(c => c.value === formData.category)?.label || 'Мэдээ'}
                  </span>
                </div>

                {/* Гарчиг */}
                {formData.title_mn && (
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {formData.title_mn}
                  </h3>
                )}

                {/* Огноо + Унших минут */}
                <p className="text-sm text-gray-500 mb-4">
                  {new Date().toLocaleDateString()} • {formData.readTime || 3} минут унших
                </p>

                {/* Зураг */}
                {formData.bannerImage && (
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <img
                      src={formData.bannerImage}
                      alt={formData.title_mn}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Товч тайлбар */}
                {formData.excerpt_mn && (
                  <p style={excerptStyle} className="mb-6 leading-relaxed border-l-4 border-teal-200 pl-4">
                    {formData.excerpt_mn}
                  </p>
                )}

                {/* Агуулга */}
                {formData.content_mn && (
                  <div className="mb-6 space-y-3 leading-relaxed">
                    {formData.content_mn
                      .split('\n')
                      .filter(line => line.trim() !== '' && !line.includes('!['))
                      .slice(0, 5)
                      .map((line, idx) => (
                        <p key={idx} style={contentStyle}>{line}</p>
                      ))}
                    {formData.content_mn.split('\n').filter(line => line.trim() !== '').length > 5 && (
                      <p className="text-sm text-gray-500 italic">...түлээлүүлэх</p>
                    )}
                  </div>
                )}

                {/* Нэмэлт зургууд */}
                {additionalImages.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Нэмэлт зургууд</h5>
                    <div className={`grid gap-3 ${galleryWidth === '1' ? 'grid-cols-1' : galleryWidth === '2' ? 'grid-cols-2' : galleryWidth === '3' ? 'grid-cols-3' : 'grid-cols-4'}`}>
                      {additionalImages.map((img, idx) => (
                        <div key={idx} className="overflow-hidden rounded border border-gray-200 bg-gray-50 aspect-square">
                          <img src={img} alt={`Нэмэлт зураг ${idx + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Нэмэлт бичлэгүүд */}
                {additionalVideos.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Нэмэлт бичлэгүүд</h5>
                    <div className="space-y-3">
                      {additionalVideos.map((vid, idx) => {
                        const embed = toEmbedUrl(vid)
                        return (
                          <div key={idx} className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                            <div className="px-3 py-2 text-xs text-gray-600 truncate">{vid}</div>
                            {embed ? (
                              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                  src={embed}
                                  title={`preview-video-${idx}`}
                                  className="absolute inset-0 w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <div className="p-3 text-xs text-red-600">Энэ холбоосыг хөрвүүлж чадсангүй. YouTube линк оруулна уу.</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Social links preview */}
                {(formData.socialLinks && formData.socialLinks.length > 0) && (
                  <div className="mt-4 space-y-2">
                    <h5 className="text-sm font-semibold text-gray-900">Сошиал холбоос</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.socialLinks
                        .filter((link) => link.active)
                        .map((link) => (
                          <span
                            key={link.id}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs text-slate-700"
                          >
                            {renderSocialIcon(link.icon, link.platform)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
                </>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 justify-end border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Хадгалж байна...
                </>
              ) : (
                editingNews ? 'Шинэчлэх' : 'Нэмэх'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}
