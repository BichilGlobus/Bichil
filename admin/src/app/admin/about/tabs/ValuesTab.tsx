'use client'
import { useState, useRef, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'
import Modal from '@/components/Modal'

interface Value {
  id: string
  title_mn: string
  title_en: string
  desc_mn: string
  desc_en: string
  image_url?: string
  image_aspect_ratio?: string
  // Title styling
  title_color: string
  title_size: number
  title_weight: string
  title_family: string
  title_letter_spacing: number
  // Description styling
  desc_color: string
  desc_size: number
  desc_weight: string
  desc_family: string
  desc_letter_spacing: number
}

interface ValuesTabProps {
  onSave: (data: Value[]) => void
  onDelete?: (id: string) => void
  loading?: boolean
}

const defaultVision: Value = {
  id: 'vision',
  title_mn: 'Алсын харaa',
  title_en: 'Vision',
  desc_mn: 'Харилцагчийн хөгжлийг бизнесийн үнэ цэн болгосон хамт олон бүхий, зохистой засаглалтай хүчирхэг нэгдэл байна.',
  desc_en: 'We are a powerful unified organization with good governance, where customer development is a core business value.',
  image_url: '/public/Bichil1.jpg',
  image_aspect_ratio: '16 / 9',
  title_color: '#1e3a8a',
  title_size: 32,
  title_weight: 'bold',
  title_family: 'sans-serif',
  title_letter_spacing: 0,
  desc_color: '#4b5563',
  desc_size: 16,
  desc_weight: 'normal',
  desc_family: 'sans-serif',
  desc_letter_spacing: 0
}

const defaultMission: Value = {
  id: 'mission',
  title_mn: 'Эрхэм зорилго',
  title_en: 'Mission',
  desc_mn: 'Санхүүгийн салбарт шаталсан хэлбэрээр хөгжиж, дэмжих бизнесийг өргөжүүлэн, дэлхийн баялгийг Монгол улсдаа бий болгох эх оронч хүчирхэг нэгдэл байна.',
  desc_en: 'We are a patriotic powerful organization that progressively develops in the financial sector, expands supporting businesses, and creates global wealth for Mongolia.',
  image_url: '/images/news2.jpg',
  image_aspect_ratio: '16 / 9',
  title_color: '#6b21a8',
  title_size: 32,
  title_weight: 'bold',
  title_family: 'sans-serif',
  title_letter_spacing: 0,
  desc_color: '#4b5563',
  desc_size: 16,
  desc_weight: 'normal',
  desc_family: 'sans-serif',
  desc_letter_spacing: 0
}

const defaultValues: Value[] = [
  defaultVision,
  defaultMission,
  {
    id: '1',
    title_mn: 'Эрсдэлгүй ирээдүй',
    title_en: 'Risk-free Future',
    desc_mn: 'Гадаад болон дотоод хүчин зүйлээс шалтгаалсан эрсдэлийг тооцоолж, эрсдэлийн удирдлагыг сайжруулна.',
    desc_en: 'We improve risk management by calculating risks from external and internal factors.',
    image_url: '',
    image_aspect_ratio: '1 / 1',
    title_color: '#059669',
    title_size: 18,
    title_weight: 'semibold',
    title_family: 'sans-serif',
    title_letter_spacing: 0,
    desc_color: '#6b7280',
    desc_size: 14,
    desc_weight: 'normal',
    desc_family: 'sans-serif',
    desc_letter_spacing: 0
  },
  {
    id: '2',
    title_mn: 'Хамтын өгөөж',
    title_en: 'Mutual Benefits',
    desc_mn: 'Хувьцаа эзэмшигчдийн эрх ашгийг дээдэлж, харилцагч болон түншүүддээ харилцан үр өгөөжтэй бизнесийн сонгодог загварыг хэрэгжүүлнэ.',
    desc_en: 'We respect shareholders and provide mutual benefits to clients and partners.',
    image_url: '',
    image_aspect_ratio: '1 / 1',
    title_color: '#2563eb',
    title_size: 18,
    title_weight: 'semibold',
    title_family: 'sans-serif',
    title_letter_spacing: 0,
    desc_color: '#6b7280',
    desc_size: 14,
    desc_weight: 'normal',
    desc_family: 'sans-serif',
    desc_letter_spacing: 0
  },
  {
    id: '3',
    title_mn: 'Нэгдмэл зорилго',
    title_en: 'Unified Purpose',
    desc_mn: 'Байгууллагын хэтийн зорилго, ажилтны хүсэл тэмүүллийн нэгдлийг тэнцвэржүүлэн ажиллана.',
    desc_en: 'We balance organizational vision with employee aspirations and goals.',
    image_url: '',
    image_aspect_ratio: '1 / 1',
    title_color: '#dc2626',
    title_size: 18,
    title_weight: 'semibold',
    title_family: 'sans-serif',
    title_letter_spacing: 0,
    desc_color: '#6b7280',
    desc_size: 14,
    desc_weight: 'normal',
    desc_family: 'sans-serif',
    desc_letter_spacing: 0
  },
  {
    id: '4',
    title_mn: 'Ёс зүй, итгэл',
    title_en: 'Ethics & Trust',
    desc_mn: 'Санхүүгийн салбарын ёс зүйн хэм хэмжээг баримтлан, харилцагчийн итгэл, нууцлалын аюулгүй байдлыг хангаж ажиллана.',
    desc_en: 'We uphold financial sector ethics and ensure customer trust and confidentiality.',
    image_url: '',
    image_aspect_ratio: '1 / 1',
    title_color: '#9333ea',
    title_size: 18,
    title_weight: 'semibold',
    title_family: 'sans-serif',
    title_letter_spacing: 0,
    desc_color: '#6b7280',
    desc_size: 14,
    desc_weight: 'normal',
    desc_family: 'sans-serif',
    desc_letter_spacing: 0
  },
  {
    id: '5',
    title_mn: 'Харилцагчийн хөгжил',
    title_en: 'Customer Development',
    desc_mn: 'Харилцагчийн хөгжил нь байгууллагын бизнес хөгжлийн салшгүй хэсэг байж, харилцан үнэ цэнийг нэмэгдүүлнэ.',
    desc_en: 'Customer development is integral to our business growth and mutual value creation.',
    image_url: '',
    image_aspect_ratio: '1 / 1',
    title_color: '#f59e0b',
    title_size: 18,
    title_weight: 'semibold',
    title_family: 'sans-serif',
    title_letter_spacing: 0,
    desc_color: '#6b7280',
    desc_size: 14,
    desc_weight: 'normal',
    desc_family: 'sans-serif',
    desc_letter_spacing: 0
  }
]

export default function ValuesTab({ onSave, onDelete, loading = false }: ValuesTabProps) {
  const [values, setValues] = useState<Value[]>(defaultValues)
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingValueId, setEditingValueId] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const valuesGridRef = useRef<HTMLDivElement | null>(null)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set(defaultValues.map(v => v.id)))

  const editingValue = values.find(v => v.id === editingValueId)

  const handleEditValue = (id: string) => {
    setEditingValueId(id)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setEditingValueId(null)
  }

  const handleAddValue = () => {
    const newValue: Value = {
      id: (Math.max(...values.filter(v => !['vision', 'mission'].includes(v.id)).map(v => parseInt(v.id)), 0) + 1).toString(),
      title_mn: 'Шинэ утга',
      title_en: 'New Value',
      desc_mn: '',
      desc_en: '',
      image_url: '',
      image_aspect_ratio: '1 / 1',
      title_color: '#059669',
      title_size: 18,
      title_weight: 'semibold',
      title_family: 'sans-serif',
      title_letter_spacing: 0,
      desc_color: '#6b7280',
      desc_size: 14,
      desc_weight: 'normal',
      desc_family: 'sans-serif',
      desc_letter_spacing: 0
    }
    setValues([...values, newValue])
    setVisibleCards(prev => new Set([...prev, newValue.id]))
  }

  const handleDeleteValue = (id: string) => {
    setValues(values.filter(v => v.id !== id))
    onDelete?.(id)
  }

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      handleDeleteValue(pendingDeleteId)
      handleCloseEditModal()
      setDeleteConfirmOpen(false)
      setPendingDeleteId(null)
    }
  }

  const handleSaveValues = () => {
    onSave(values)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // IntersectionObserver for card animations
  useEffect(() => {
    if (!valuesGridRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-value-id')
            if (id) {
              setVisibleCards(prev => new Set([...prev, id]))
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = valuesGridRef.current.querySelectorAll('[data-value-id]')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 z-50">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <p className="text-sm font-semibold text-green-900">Амжилттай!</p>
              <p className="text-sm text-green-800">Үнэт зүйлсийг хадгалалаа</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Үнэт зүйлс</h2>
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex bg-slate-200/80 p-1 rounded-lg">
            <button 
              onClick={() => setPreviewLang('mn')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewLang === 'mn' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              MN
            </button>
            <button 
              onClick={() => setPreviewLang('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewLang === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-8">Урьдчилсан</h3>
        <div 
          ref={valuesGridRef}
          className="space-y-12"
        >
          {/* Vision & Mission Section */}
          {values.filter(v => ['vision', 'mission'].includes(v.id)).map((value, index) => (
            <div
              key={value.id}
              data-value-id={value.id}
              className={`transition-all duration-500 ease-out
                ${visibleCards.has(value.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className={`grid md:grid-cols-2 gap-8 items-center p-8 rounded-2xl border-2 transition-all hover:shadow-lg ${value.id === 'vision' ? 'border-blue-200 bg-linear-to-br from-blue-50 to-blue-50/50' : 'border-purple-200 bg-linear-to-br from-purple-50 to-purple-50/50'}`}>
                <div className={`space-y-4 ${value.id === 'mission' ? 'md:order-2' : ''}`}>
                  <span className={`inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full ${value.id === 'vision' ? 'text-blue-700 bg-blue-200/40' : 'text-purple-700 bg-purple-200/40'}`}>
                    {previewLang === 'mn' ? value.title_mn : value.title_en}
                  </span>
                  <h3 style={{
                    color: value.title_color,
                    fontSize: `${value.title_size}px`,
                    fontWeight: value.title_weight,
                    fontFamily: value.title_family,
                    letterSpacing: `${value.title_letter_spacing}px`
                  }} className="leading-tight">
                    {previewLang === 'mn' ? value.desc_mn : value.desc_en}
                  </h3>
                  <button
                    onClick={() => handleEditValue(value.id)}
                    className="mt-6 inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-semibold uppercase tracking-wide hover:gap-3 transition-all"
                  >
                    Засах
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {value.image_url && (
                  <div className={`relative overflow-hidden rounded-xl border border-gray-200 group ${value.id === 'mission' ? 'md:order-1' : ''}`} style={{ aspectRatio: value.image_aspect_ratio || '16 / 9' }}>
                    <img 
                      src={value.image_url} 
                      alt={previewLang === 'mn' ? value.title_mn : value.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="mt-12 pt-12 border-t border-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-slate-900">үнэт зүйлс</h4>
            <button
              onClick={() => handleAddValue()}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + Нэмэх
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.filter(v => !['vision', 'mission'].includes(v.id)).map((value, index) => (
              <div
                key={value.id}
                data-value-id={value.id}
                className={`transition-all duration-500 ease-out
                  ${visibleCards.has(value.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${(index + 2) * 75}ms` }}
              >
                <div className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-teal-300 hover:shadow-md transition-all h-full flex flex-col">
                  {/* Content */}
                  <div className="space-y-3 flex-1">
                    <h3 style={{
                      color: value.title_color,
                      fontSize: `${value.title_size}px`,
                      fontWeight: value.title_weight,
                      fontFamily: value.title_family,
                      letterSpacing: `${value.title_letter_spacing}px`
                    }} className="group-hover:text-teal-600 transition-colors line-clamp-2">
                      {previewLang === 'mn' ? value.title_mn : value.title_en}
                    </h3>
                    <p style={{
                      color: value.desc_color,
                      fontSize: `${value.desc_size}px`,
                      fontWeight: value.desc_weight,
                      fontFamily: value.desc_family,
                      letterSpacing: `${value.desc_letter_spacing}px`,
                      lineHeight: '1.5'
                    }} className="leading-relaxed text-sm line-clamp-4">
                      {previewLang === 'mn' ? value.desc_mn : value.desc_en}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditValue(value.id)}
                      className="flex-1 px-2 py-1.5 text-xs font-semibold text-teal-600 hover:bg-teal-50 rounded transition-colors"
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => handleDeleteValue(value.id)}
                      className="px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={handleCloseEditModal} 
        title={editingValue?.id === 'vision' ? 'Алсын харааг засах' : editingValue?.id === 'mission' ? 'Эрхэм зорилгийг засах' : 'Үнэт зүйлсийг засах'}
        size="xl"
      >
        {editingValue && (
          <div className="space-y-5 pb-4">
            {/* Image Upload - Only for Vision/Mission */}
            {(editingValue.id === 'vision' || editingValue.id === 'mission') && (
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/20">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Зургийг оруулах</h4>
                <div className="space-y-3">
                  <ImageUpload 
                    value={editingValue.image_url || ''}
                    onChange={(url: string) => setValues(values.map(v => v.id === editingValue.id ? {...v, image_url: url} : v))}
                    label="Үнэт зүйлийн зураг"
                  />
                  
                  {/* Image Aspect Ratio Selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Зургийн хэмжээ/харьцаа</label>
                    <select
                      value={editingValue.image_aspect_ratio || '1 / 1'}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, image_aspect_ratio: e.target.value} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="1 / 1">1:1 (Дөрвөлжин)</option>
                      <option value="16 / 9">16:9 (Видео)</option>
                      <option value="3 / 2">3:2</option>
                      <option value="4 / 3">4:3</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Title Inputs Section */}
            <div className="space-y-4">
              {/* Title Mongolian */}
              <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/20">
                <label className="block text-sm font-medium text-slate-700 mb-2">Гарчиг (Монгол)</label>
                <input
                  type="text"
                  value={editingValue.title_mn}
                  onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_mn: e.target.value} : v))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Title English */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
                <label className="block text-sm font-medium text-slate-700 mb-2">Title (English)</label>
                <input
                  type="text"
                  value={editingValue.title_en}
                  onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_en: e.target.value} : v))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Title Styling Section */}
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="text-lg">Aa</span> Гарчиг (Title)
                  </h4>
                  {/* Title Preview - Moved to header */}
                  <div style={{
                    color: editingValue.title_color,
                    fontSize: `${editingValue.title_size}px`,
                    fontWeight: editingValue.title_weight,
                    fontFamily: editingValue.title_family,
                    letterSpacing: `${editingValue.title_letter_spacing}px`
                  }} className="px-3 py-1">
                    Aa
                  </div>
                </div>

                {/* Styling Grid */}
              <div className="grid grid-cols-5 gap-3">
                  {/* Title Color */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Өнгө</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingValue.title_color}
                        onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_color: e.target.value} : v))}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={editingValue.title_color}
                        onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_color: e.target.value} : v))}
                        className="flex-1 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Title Size */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="8"
                      max="72"
                      value={editingValue.title_size}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_size: parseInt(e.target.value)} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Title Weight */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Жин</label>
                    <select
                      value={editingValue.title_weight}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_weight: e.target.value} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="semibold">Semibold</option>
                      <option value="bold">Bold</option>
                      <option value="extrabold">Extrabold</option>
                    </select>
                  </div>

                  {/* Title Family */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Фонт</label>
                    <select
                      value={editingValue.title_family}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_family: e.target.value} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                    </select>
                  </div>

                  {/* Title Letter Spacing */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Зай (px)</label>
                    <input
                      type="number"
                      min="-5"
                      max="10"
                      step="0.5"
                      value={editingValue.title_letter_spacing}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, title_letter_spacing: parseFloat(e.target.value)} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Inputs and Styling Section */}
            <div className="space-y-4">
              {/* Description Mongolian */}
              <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/20">
                <label className="block text-sm font-medium text-slate-700 mb-2">Тайлбар (Монгол)</label>
                <textarea
                  value={editingValue.desc_mn}
                  onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_mn: e.target.value} : v))}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Description English */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/20">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description (English)</label>
                <textarea
                  value={editingValue.desc_en}
                  onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_en: e.target.value} : v))}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Description Styling Section */}
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="text-base">Aa</span> Тайлбар (Description)
                  </h4>
                  {/* Description Preview - Moved to header */}
                  <div style={{
                    color: editingValue.desc_color,
                    fontSize: `${editingValue.desc_size}px`,
                    fontWeight: editingValue.desc_weight,
                    fontFamily: editingValue.desc_family,
                    lineHeight: '1.5',
                    letterSpacing: `${editingValue.desc_letter_spacing}px`
                  }} className="px-3 py-1">
                    Aa
                  </div>
                </div>

                {/* Styling Grid */}
                <div className="grid grid-cols-5 gap-3">
                  {/* Description Color */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Өнгө</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingValue.desc_color}
                        onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_color: e.target.value} : v))}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={editingValue.desc_color}
                        onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_color: e.target.value} : v))}
                        className="flex-1 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Description Size */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Хэмжээ (px)</label>
                    <input
                      type="number"
                      min="8"
                      max="72"
                      value={editingValue.desc_size}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_size: parseInt(e.target.value)} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Description Weight */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Жин</label>
                    <select
                      value={editingValue.desc_weight}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_weight: e.target.value} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="semibold">Semibold</option>
                      <option value="bold">Bold</option>
                      <option value="extrabold">Extrabold</option>
                    </select>
                  </div>

                  {/* Description Family */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Фонт</label>
                    <select
                      value={editingValue.desc_family}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_family: e.target.value} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                    </select>
                  </div>

                  {/* Description Letter Spacing */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Зай (px)</label>
                    <input
                      type="number"
                      min="-5"
                      max="10"
                      step="0.5"
                      value={editingValue.desc_letter_spacing}
                      onChange={(e) => setValues(values.map(v => v.id === editingValue.id ? {...v, desc_letter_spacing: parseFloat(e.target.value)} : v))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              {!['vision', 'mission'].includes(editingValue.id) && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(editingValue.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Устгах
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Болих
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveValues()
                  handleCloseEditModal()
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Хадгалах
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal 
              isOpen={deleteConfirmOpen} 
              onClose={() => {
                setDeleteConfirmOpen(false)
                setPendingDeleteId(null)
              }} 
              title="Устгах баталгаа"
              size="sm"
            >
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <p className="text-sm font-semibold text-red-900 mb-1">Анхаарал!</p>
                      <p className="text-sm text-red-800">
                        Та "{values.find(v => v.id === pendingDeleteId)?.title_mn}" үнэт зүйлсийг устгахын тулд үйлдэл хийж байна.
                      </p>
                      <p className="text-sm text-red-800 mt-2">
                        <strong>Энэ үйлдэл буцаах боломжгүй!</strong> Та үнэхээр устгахын хүсэж байна уу?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmOpen(false)
                      setPendingDeleteId(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Устгах
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </Modal>
    </div>
  )
}
