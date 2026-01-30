'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Textarea, Button, PageHeader } from '@/components/FormElements'
import { 
  DevicePhoneMobileIcon, PlusIcon, TrashIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon, 
  ChevronUpIcon, ChevronDownIcon, ShieldCheckIcon, BoltIcon, ClockIcon, UserIcon, 
  CreditCardIcon, GlobeAltIcon, StarIcon, SparklesIcon 
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import axiosInstance from '@/app/config/axiosConfig'
const iconMap: Record<string, any> = {
  check: CheckCircleIcon,
  shield: ShieldCheckIcon,
  bolt: BoltIcon,
  clock: ClockIcon,
  user: UserIcon,
  card: CreditCardIcon,
  globe: GlobeAltIcon,
  star: StarIcon,
  sparkles: SparklesIcon
}

// API interfaces
interface Translation {
  id?: number
  language_id: number
  label: string
}

interface Position {
  id?: number
  top: number
  left: number
  rotate: number
  size: number
}

interface Title {
  id?: number
  translations: Translation[]
  positions: Position[]
}

interface Feature {
  id?: number
  translations: Translation[]
  active?: boolean
  icon?: string
  iconColor?: string
  color?: string
  size?: string
  fontWeight?: string
  fontFamily?: string
}

interface AppDownloadData {
  id?: number
  image: string
  appstore: string
  playstore: string
  title_position: number
  divide: number
  font: string
  titlecolor: string
  fontcolor: string
  listcolor: string
  iconcolor: string
  buttonbgcolor: string
  buttonfontcolor: string
  appSvgCode?: string
  googleButtonBgColor?: string
  googleButtonTextColor?: string
  buttonStyle: string
  deviceFrame: string
  deviceColor?: string
  deviceRotation?: number
  featuresTextSize: string
  titles: Title[]
  lists: Feature[]
}

const fontFamilies = [
  { label: 'Sans Serif (Default)', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Mono', value: 'font-mono' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { label: 'Impact', value: 'Impact, sans-serif' },
]

const fontWeights = [
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' }
]

// Helper functions
const getTranslation = (translations: Translation[], languageId: number): string => {
  return translations.find(t => t.language_id === languageId)?.label || ''
}

const sizeToTailwind = (size: number): string => {
  if (size <= 18) return 'text-xs'
  if (size <= 20) return 'text-sm'
  if (size <= 24) return 'text-base'
  if (size <= 30) return 'text-lg'
  if (size <= 36) return 'text-2xl'
  if (size <= 42) return 'text-3xl'
  if (size <= 48) return 'text-4xl'
  if (size <= 60) return 'text-5xl'
  if (size <= 72) return 'text-6xl'
  return 'text-7xl'
}

const tailwindToSize = (tailwind: string): number => {
  const map: Record<string, number> = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
    'text-2xl': 24,
    'text-3xl': 30,
    'text-4xl': 36,
    'text-5xl': 48,
    'text-6xl': 60,
    'text-7xl': 72,
  }
  return map[tailwind] || 48
}

export default function AppDownloadPage() {
  const [data, setData] = useState<AppDownloadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [newFeature, setNewFeature] = useState({ mn: '', en: '', icon: 'check' })
  const [newTitle, setNewTitle] = useState({ mn: '', en: '' })
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState<{ mn: string; en: string; top?: number; left?: number; rotate?: number; size?: number }>({ mn: '', en: '' })
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null)
  const [editingFeature, setEditingFeature] = useState<{ mn: string; en: string; color?: string; size?: string; fontWeight?: string; fontFamily?: string; icon?: string; iconColor?: string }>({ mn: '', en: '' })
  const [previewLang, setPreviewLang] = useState<1 | 2>(2)
  const [showPreview, setShowPreview] = useState(true)
  const [showAddTitle, setShowAddTitle] = useState(true)
  const [showAddFeature, setShowAddFeature] = useState(true)
  const [imageInputType, setImageInputType] = useState<'upload' | 'svg'>('upload')
  const [svgError, setSvgError] = useState<string | null>(null)

  // Fetch data on mount
  useEffect(() => {
    fetchAppDownloadData()
  }, [])

  const fetchAppDownloadData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/app-download/1/')
      const appDownloadData = Array.isArray(response.data) ? response.data[0] : response.data
      console.log(response)
      if (appDownloadData) {
        const processedData: AppDownloadData = {
          ...appDownloadData,
          buttonStyle: appDownloadData.buttonStyle || 'solid',
          deviceFrame: appDownloadData.deviceFrame || 'none',
          deviceColor: appDownloadData.deviceColor || '#000000',
          deviceRotation: appDownloadData.deviceRotation || 0,
          featuresTextSize: appDownloadData.featuresTextSize || 'text-sm',
          googleButtonBgColor: appDownloadData.googleButtonBgColor || 'transparent',
          googleButtonTextColor: appDownloadData.googleButtonTextColor || '#334155',
          titles: appDownloadData.titles || [],
          lists: appDownloadData.lists || []
        }
        setData(processedData)
      }
      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching app download data:', err)
      setError('Өгөгдөл татахад алдаа гарлаа')
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!data) return
    
    if (!confirm('Та хадгалахдаа итгэлтэй байна уу?')) return
    
    try {
      setLoading(true)
      const response = await axiosInstance.put(`/app-download/${data.id}/`, {
        image: data.image,
        appstore: data.appstore,
        playstore: data.playstore,
        title_position: data.title_position,
        divide: data.divide,
        font: data.font,
        titlecolor: data.titlecolor,
        fontcolor: data.fontcolor,
        listcolor: data.listcolor,
        iconcolor: data.iconcolor,
        buttonbgcolor: data.buttonbgcolor,
        buttonfontcolor: data.buttonfontcolor,
        appSvgCode: data.appSvgCode,
        googleButtonBgColor: data.googleButtonBgColor,
        googleButtonTextColor: data.googleButtonTextColor,
        buttonStyle: data.buttonStyle,
        deviceFrame: data.deviceFrame,
        deviceColor: data.deviceColor,
        deviceRotation: data.deviceRotation,
        featuresTextSize: data.featuresTextSize
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setLoading(false)
    } catch (err: any) {
      console.error('Error saving:', err)
      setError('Хадгалахад алдаа гарлаа')
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Та бүх өөрчлөлтийг буцаахдаа итгэлтэй байна уу?')) return
    await fetchAppDownloadData()
  }

  const handleAddFeature = async () => {
    if (!newFeature.mn.trim() || !newFeature.en.trim() || !data) return
    
    const payload = {
      app_download_id: data.id,
      translations: [
        { language_id: 1, label: newFeature.en },
        { language_id: 2, label: newFeature.mn }
      ]
    }
    
    try {
      const response = await axiosInstance.post('/app-download-list/', payload)
      
      const newFeatureData: Feature = {
        ...response.data,
        active: true,
        icon: newFeature.icon
      }
      
      setData({
        ...data,
        lists: [...data.lists, newFeatureData]
      })
      
      setNewFeature({ mn: '', en: '', icon: 'check' })
    } catch (err: any) {
      console.error('Error adding feature:', err)
      setError('Онцлог нэмэхэд алдаа гарлаа')
    }
  }

  // Update feature
  const handleUpdateFeature = async (index: number) => {
    if (!data || !editingFeature.mn.trim() || !editingFeature.en.trim()) return
    
    const feature = data.lists[index]
    
    const payload = {
      translations: [
        { 
          id: feature.translations.find(t => t.language_id === 1)?.id,
          language_id: 1, 
          label: editingFeature.en 
        },
        { 
          id: feature.translations.find(t => t.language_id === 2)?.id,
          language_id: 2, 
          label: editingFeature.mn 
        }
      ],
      icon: editingFeature.icon,
      iconColor: editingFeature.iconColor,
      color: editingFeature.color,
      size: editingFeature.size,
      fontWeight: editingFeature.fontWeight,
      fontFamily: editingFeature.fontFamily
    }
    
    try {
      await axiosInstance.put(`/app-download-list/${feature.id}/`, payload)
      
      const newLists = [...data.lists]
      newLists[index] = {
        ...newLists[index],
        translations: payload.translations,
        icon: editingFeature.icon,
        iconColor: editingFeature.iconColor,
        color: editingFeature.color,
        size: editingFeature.size,
        fontWeight: editingFeature.fontWeight,
        fontFamily: editingFeature.fontFamily
      }
      
      setData({ ...data, lists: newLists })
      setEditingFeatureIndex(null)
    } catch (err: any) {
      console.error('Error updating feature:', err)
      setError('Онцлог шинэчлэхэд алдаа гарлаа')
    }
  }

  // Delete feature
  const handleDeleteFeature = async (index: number) => {
    if (!confirm('Устгах уу?') || !data) return
    
    const feature = data.lists[index]
    
    try {
      await axiosInstance.delete(`/app-download-list/${feature.id}/`)
      
      setData({
        ...data,
        lists: data.lists.filter((_, i) => i !== index)
      })
    } catch (err: any) {
      console.error('Error deleting feature:', err)
      setError('Онцлог устгахад алдаа гарлаа')
    }
  }

  // Toggle feature active state
  const handleToggleFeature = async (index: number) => {
    if (!data) return
    
    const feature = data.lists[index]
    const newActiveState = !feature.active
    
    try {
      await axiosInstance.patch(`/app-download-list/${feature.id}/`, {
        active: newActiveState
      })
      
      const newLists = [...data.lists]
      newLists[index].active = newActiveState
      setData({ ...data, lists: newLists })
    } catch (err: any) {
      console.error('Error toggling feature:', err)
      setError('Онцлогийн төлөв өөрчлөхөд алдаа гарлаа')
    }
  }

  // Add new title
  const handleAddTitle = async () => {
    if (!newTitle.mn.trim() || !newTitle.en.trim() || !data) return
    
    const lastPosition = data.titles[data.titles.length - 1]?.positions[0] || { top: 0, left: 0, rotate: 0, size: 48 }
    const newPosition = {
      top: lastPosition.top + 80,
      left: lastPosition.left + 20,
      rotate: Math.floor(Math.random() * 7) - 3,
      size: 48
    }
    
    const payload = {
      app_download_id: data.id,
      translations: [
        { language_id: 1, label: newTitle.en },
        { language_id: 2, label: newTitle.mn }
      ],
      position: newPosition
    }
    
    try {
      const response = await axiosInstance.post('/app-download-title/', payload)
      
      const newTitleData: Title = {
        ...response.data,
        translations: response.data.translations || payload.translations,
        positions: response.data.positions || [newPosition]
      }
      
      setData({
        ...data,
        titles: [...data.titles, newTitleData]
      })
      
      setNewTitle({ mn: '', en: '' })
    } catch (err: any) {
      console.error('Error adding title:', err)
      setError('Гарчиг нэмэхэд алдаа гарлаа')
    }
  }

  // Update title
  const handleUpdateTitle = async (index: number) => {
    if (!data || !editingTitle.mn.trim() || !editingTitle.en.trim()) return
    
    const title = data.titles[index]
    
    const payload = {
      translations: [
        { 
          id: title.translations.find(t => t.language_id === 1)?.id,
          language_id: 1, 
          label: editingTitle.en 
        },
        { 
          id: title.translations.find(t => t.language_id === 2)?.id,
          language_id: 2, 
          label: editingTitle.mn 
        }
      ],
      position: {
        id: title.positions[0]?.id,
        top: editingTitle.top ?? title.positions[0]?.top ?? 0,
        left: editingTitle.left ?? title.positions[0]?.left ?? 0,
        rotate: editingTitle.rotate ?? title.positions[0]?.rotate ?? 0,
        size: editingTitle.size ?? title.positions[0]?.size ?? 48
      }
    }
    
    try {
      await axiosInstance.put(`/app-download-title/${title.id}/`, payload)
      
      const newTitles = [...data.titles]
      newTitles[index] = {
        ...newTitles[index],
        translations: payload.translations,
        positions: [payload.position]
      }
      
      setData({ ...data, titles: newTitles })
      setEditingTitleIndex(null)
    } catch (err: any) {
      console.error('Error updating title:', err)
      setError('Гарчиг шинэчлэхэд алдаа гарлаа')
    }
  }

  // Delete title
  const handleDeleteTitle = async (index: number) => {
    if (!data || data.titles.length <= 1) {
      alert('Хамгийн багадаа 1 гарчиг байх ёстой!')
      return
    }
    if (!confirm('Устгах уу?')) return
    
    const title = data.titles[index]
    
    try {
      await axiosInstance.delete(`/app-download-title/${title.id}/`)
      
      setData({
        ...data,
        titles: data.titles.filter((_, i) => i !== index)
      })
    } catch (err: any) {
      console.error('Error deleting title:', err)
      setError('Гарчиг устгахад алдаа гарлаа')
    }
  }

  // Update title position
  const updateTitlePosition = async (index: number, field: keyof Position, value: number) => {
    if (!data) return
    
    const newTitles = [...data.titles]
    if (!newTitles[index].positions[0]) {
      newTitles[index].positions[0] = { top: 0, left: 0, rotate: 0, size: 48 }
    }
    newTitles[index].positions[0][field] = value
    setData({ ...data, titles: newTitles })
    
    // Debounce API call could be added here
    try {
      const title = newTitles[index]
      await axiosInstance.patch(`/app-download-title-position/${title.positions[0].id}/`, {
        [field]: value
      })
    } catch (err: any) {
      console.error('Error updating position:', err)
    }
  }

  const updateFeatureField = (idx: number, field: string, value: any) => {
    setEditingFeature(prev => ({ ...prev, [field]: value }))
  }

  const handleStartEditTitle = (index: number) => {
    if (!data) return
    setEditingTitleIndex(index)
    const title = data.titles[index]
    setEditingTitle({
      mn: getTranslation(title.translations, 2),
      en: getTranslation(title.translations, 1),
      top: title.positions[0]?.top,
      left: title.positions[0]?.left,
      rotate: title.positions[0]?.rotate,
      size: title.positions[0]?.size
    })
  }

  const handleStartEditFeature = (index: number) => {
    if (!data) return
    setEditingFeatureIndex(index)
    const feature = data.lists[index]
    setEditingFeature({
      mn: getTranslation(feature.translations, 2),
      en: getTranslation(feature.translations, 1),
      color: feature.color || data.listcolor,
      size: feature.size || data.featuresTextSize,
      fontWeight: feature.fontWeight,
      fontFamily: feature.fontFamily,
      icon: feature.icon || 'check',
      iconColor: feature.iconColor
    })
  }

  const validateSvg = (svgContent: string) => {
    if (!svgContent) {
      setSvgError(null)
      return true
    }
    const trimmed = svgContent.trim()
    if (!trimmed.toLowerCase().includes('<svg')) {
      setSvgError('Та зөв SVG код оруулна уу.')
      return false
    }
    
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(trimmed, "image/svg+xml")
      const errorNode = doc.querySelector("parsererror")
      if (errorNode) {
        setSvgError('Та зөв SVG код оруулна уу.')
        return false
      }
    } catch (e) {
      setSvgError('Та зөв SVG код оруулна уу.')
      return false
    }
    
    setSvgError(null)
    return true
  }

  if (loading) {
    return (
      <AdminLayout title="App Download">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Өгөгдөл уншиж байна...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!data) {
    return (
      <AdminLayout title="App Download">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">Өгөгдөл олдсонгүй</p>
            <button
              onClick={fetchAppDownloadData}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Дахин оролдох
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="App Download">
      <div className="space-y-6">
        {saveSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай хадгалагдлаа!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">Өөрчлөлтүүд хадгалагдсан.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Алдаа гарлаа!</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <PageHeader
          title="App Download Section"
          description="Апп татаж авах хэсгийг удирдах"
          action={
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                Буцаах
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-all shadow-md"
              >
                Хадгалах
              </button>
            </div>
          }
        />

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100 overflow-hidden transition-all duration-300">
          <div 
            className="px-6 py-4 border-b border-blue-100 bg-white/60 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:bg-white/80 transition-colors"
            onClick={() => setShowPreview(!showPreview)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-emerald-500 ${showPreview ? 'animate-pulse' : 'opacity-50'}`}></div>
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide select-none">
                Preview
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewLang(2)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewLang === 2 ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MN
                </button>
                <button
                  onClick={() => setPreviewLang(1)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewLang === 1 ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPreview(!showPreview)
                }}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPreview ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {showPreview && (
          <div className="p-8 animate-in slide-in-from-top-2 duration-300">
            <div className="max-w-6xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${data.title_position === 2 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <div className={`flex flex-col gap-8 ${data.title_position === 2 ? 'lg:order-2' : ''}`}>
                  {/* Scattered headline */}
                  <div className={`relative min-h-[300px] ${data.font}`}>
                    {data.titles.map((title, index) => {
                      const pos = title.positions[0]
                      if (!pos) return null
                      const tailwindSize = sizeToTailwind(pos.size)
                      return (
                        <span
                          key={index}
                          className={`absolute ${tailwindSize} font-extrabold`}
                          style={{
                            top: `${pos.top}px`,
                            left: `${pos.left}px`,
                            transform: `rotate(${pos.rotate}deg)`,
                            color: index === 1 ? data.iconcolor : data.titlecolor,
                          }}
                        >
                          {getTranslation(title.translations, previewLang)}
                        </span>
                      )
                    })}
                  </div>

                  {/* Features */}
                  <div className={`flex ${
                    data.divide === 1 ? 'flex-row flex-wrap' :
                    data.divide === 2 ? 'grid grid-cols-2' :
                    'flex-col'
                  } gap-4 mt-2 ${data.font}`}>
                    {data.lists.filter(f => f.active).map((feature, index) => {
                      const isTwSize = feature.size ? feature.size.startsWith('text-') : data.featuresTextSize?.startsWith('text-')
                      const sizeVal = feature.size || data.featuresTextSize || 'text-sm'
                      const sizeClass = isTwSize ? sizeVal : ''
                      const sizeStyle = isTwSize ? undefined : sizeVal

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 shadow-sm" style={{ backgroundColor: `${feature.iconColor || data.iconcolor}15` }}>
                            {(() => {
                              const Icon = iconMap[feature.icon || 'check'] || CheckCircleIcon
                              return <Icon className="w-5 h-5" style={{ color: feature.iconColor || data.iconcolor }} />
                            })()}
                          </div>
                          <span 
                            className={`${sizeClass}`} 
                            style={{ 
                              color: feature.color || data.listcolor || data.fontcolor,
                              fontSize: sizeStyle,
                              fontWeight: feature.fontWeight,
                              fontFamily: feature.fontFamily
                            }}
                          >
                            {getTranslation(feature.translations, previewLang)}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Download Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <a
                      href={data.appstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-6 py-3.5 font-medium transition-all ${data.font} ${
                        data.buttonStyle === 'solid' ? 'rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5' :
                        data.buttonStyle === 'outline' ? 'rounded-xl border-2 hover:bg-slate-50' :
                        data.buttonStyle === '3d' ? 'rounded-xl border-b-4 active:border-b-0 active:translate-y-1' :
                        data.buttonStyle === 'glass' ? 'rounded-xl backdrop-blur-md shadow-lg hover:bg-white/10 border border-white/20' :
                        data.buttonStyle === 'flat' ? 'rounded-sm hover:brightness-95' :
                        data.buttonStyle === 'gradient' ? 'rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5' :
                        'rounded-xl hover:bg-slate-50'
                      }`}
                      style={{
                        backgroundColor: ['solid', '3d', 'flat'].includes(data.buttonStyle) ? data.buttonbgcolor : 
                                        data.buttonStyle === 'glass' ? `${data.buttonbgcolor}CC` : 'transparent',
                        backgroundImage: data.buttonStyle === 'gradient' ? `linear-gradient(135deg, ${data.buttonbgcolor}, ${data.iconcolor})` : undefined,
                        color: ['solid', '3d', 'flat', 'gradient', 'glass'].includes(data.buttonStyle) ? data.buttonfontcolor : data.buttonbgcolor,
                        borderColor: data.buttonStyle === '3d' ? `${data.buttonbgcolor}CC` : data.buttonbgcolor
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      App Store
                    </a>

                    <a
                      href={data.playstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-6 py-3.5 font-medium transition-all ${data.font} ${
                        data.buttonStyle === 'solid' ? 'rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5' :
                        data.buttonStyle === 'outline' ? 'rounded-xl border-2 hover:bg-slate-50' :
                        data.buttonStyle === '3d' ? 'rounded-xl border-b-4 active:border-b-0 active:translate-y-1' :
                        data.buttonStyle === 'glass' ? 'rounded-xl backdrop-blur-md shadow-lg hover:bg-white/10 border border-white/20' :
                        data.buttonStyle === 'flat' ? 'rounded-sm hover:brightness-95' :
                        data.buttonStyle === 'gradient' ? 'rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5' :
                        'rounded-xl hover:bg-slate-50'
                      }`}
                      style={{
                        backgroundColor: ['solid', '3d', 'flat'].includes(data.buttonStyle) ? (data.googleButtonBgColor || '#ffffff') : 
                                        data.buttonStyle === 'glass' ? `${data.googleButtonBgColor || '#ffffff'}CC` : 'transparent',
                        backgroundImage: data.buttonStyle === 'gradient' ? `linear-gradient(135deg, ${data.googleButtonBgColor || '#ffffff'}, ${data.iconcolor})` : undefined,
                        color: ['solid', '3d', 'flat', 'gradient', 'glass'].includes(data.buttonStyle) ? (data.googleButtonTextColor || data.fontcolor) : (data.googleButtonBgColor || data.fontcolor),
                        borderColor: data.buttonStyle === '3d' ? `${data.googleButtonBgColor || '#e2e8f0'}CC` : 
                                    data.buttonStyle === 'outline' ? (data.googleButtonBgColor !== 'transparent' ? data.googleButtonBgColor : data.iconcolor) : undefined
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                      </svg>
                      Google Play
                    </a>
                  </div>
                </div>

                {/* App Image */}
                <div className={`flex justify-center lg:justify-end relative ${data.title_position === 2 ? 'lg:order-1 lg:justify-start' : ''}`}>
                  <div className="relative w-[400px] h-[600px]">
                    {data.appSvgCode ? (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: data.appSvgCode }}
                      />
                    ) : (
                      <Image
                        src={data.image}
                        alt="Mobile App"
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Feature Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Онцлог давуу талууд</h2>
            </div>
            <div className="p-6">
              {/* Add Feature Form */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-4">
                <div 
                  className="flex items-center justify-between gap-2 mb-3 cursor-pointer select-none"
                  onClick={() => setShowAddFeature(!showAddFeature)}
                >
                  <div className="flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Шинэ онцлог нэмэх</h3>
                  </div>
                  {showAddFeature ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                </div>
                
                {showAddFeature && (
                  <div className="space-y-3 animate-in slide-in-from-top-2">
                    <input
                      value={newFeature.mn}
                      onChange={(e) => setNewFeature({ ...newFeature, mn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="Монгол хэл дээрх текст"
                    />
                    <input
                      value={newFeature.en}
                      onChange={(e) => setNewFeature({ ...newFeature, en: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="English text"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    />
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">Icon сонгох</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(iconMap).map((iconKey) => {
                          const IconComponent = iconMap[iconKey]
                          const isSelected = newFeature.icon === iconKey
                          return (
                            <button
                              key={iconKey}
                              onClick={() => setNewFeature({ ...newFeature, icon: iconKey })}
                              className={`p-2 rounded-lg border transition-all ${
                                isSelected ? 'bg-teal-50 border-teal-500 text-teal-600' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleAddFeature}
                      disabled={!newFeature.mn || !newFeature.en}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-md"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Онцлог нэмэх
                    </button>
                  </div>
                )}
              </div>

              {/* Feature List */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Нийт {data.lists.length} онцлог
                </h3>
                
                {data.lists.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">Онцлог нэмэгдээгүй байна</p>
                  </div>
                ) : (
                  data.lists.map((feature, index) => (
                    <div
                      key={feature.id || index}
                      className={`p-4 bg-white rounded-lg border-2 transition-all group ${
                        feature.active ? 'border-slate-200 hover:border-teal-300' : 'border-slate-100 bg-slate-50 opacity-75'
                      }`}
                    >
                      {editingFeatureIndex === index ? (
                        <div className="space-y-3">
                          <input
                            value={editingFeature.mn}
                            onChange={(e) => updateFeatureField(index, 'mn', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Монгол"
                          />
                          <input
                            value={editingFeature.en}
                            onChange={(e) => updateFeatureField(index, 'en', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="English"
                          />
                          
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-600">Icon</label>
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(iconMap).map((iconKey) => {
                                const IconComponent = iconMap[iconKey]
                                const isSelected = editingFeature.icon === iconKey
                                return (
                                  <button
                                    key={iconKey}
                                    onClick={() => updateFeatureField(index, 'icon', iconKey)}
                                    className={`p-2 rounded-lg border transition-all ${
                                      isSelected ? 'bg-teal-50 border-teal-500 text-teal-600' : 'border-slate-200 text-slate-400'
                                    }`}
                                  >
                                    <IconComponent className="w-5 h-5" />
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleUpdateFeature(index)}
                              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            >
                              Хадгалах
                            </button>
                            <button
                              onClick={() => setEditingFeatureIndex(null)}
                              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                            >
                              Болих
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">
                              {(() => {
                                const Icon = iconMap[feature.icon || 'check'] || CheckCircleIcon
                                return <Icon className={`h-5 w-5 ${feature.active ? 'text-teal-600' : 'text-slate-400'}`} />
                              })()}
                            </div>
                            <div className={`flex-1 ${!feature.active && 'line-through text-slate-400'}`}>
                              <p className="text-slate-700 font-medium">{getTranslation(feature.translations, 2)}</p>
                              <p className="text-sm text-slate-500">{getTranslation(feature.translations, 1)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditFeature(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Засах"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleToggleFeature(index)}
                              className="p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all"
                              title={feature.active ? "Нуух" : "Харуулах"}
                            >
                              {feature.active ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteFeature(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Устгах"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Titles Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Гарчиг хэсгүүд</h2>
            </div>
            <div className="p-6">
              {/* Add Title Form */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-4">
                <div 
                  className="flex items-center justify-between gap-2 mb-3 cursor-pointer select-none"
                  onClick={() => setShowAddTitle(!showAddTitle)}
                >
                  <div className="flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Шинэ гарчиг нэмэх</h3>
                  </div>
                  {showAddTitle ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                </div>
                
                {showAddTitle && (
                  <div className="space-y-3 animate-in slide-in-from-top-2">
                    <input
                      value={newTitle.mn}
                      onChange={(e) => setNewTitle({ ...newTitle, mn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="Гарчиг (Монгол)"
                    />
                    <input
                      value={newTitle.en}
                      onChange={(e) => setNewTitle({ ...newTitle, en: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="Title (English)"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTitle()}
                    />
                    <button
                      onClick={handleAddTitle}
                      disabled={!newTitle.mn || !newTitle.en}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-md"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Гарчиг нэмэх
                    </button>
                  </div>
                )}
              </div>

              {/* Title List */}
              <div className="space-y-3">
                {data.titles.map((title, index) => (
                  <div key={title.id || index} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-teal-300 transition-colors">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Хэсэг #{index + 1}: {getTranslation(title.translations, 2)}
                      </span>
                      <div className="flex gap-2">
                        {editingTitleIndex !== index && (
                          <>
                            <button
                              onClick={() => handleStartEditTitle(index)}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Засах"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {data.titles.length > 1 && (
                              <button
                                onClick={() => handleDeleteTitle(index)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Устгах"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingTitleIndex === index ? (
                      <div className="p-4 space-y-3 bg-teal-50">
                        <input
                          value={editingTitle.mn}
                          onChange={(e) => setEditingTitle({ ...editingTitle, mn: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          placeholder="Монгол"
                        />
                        <input
                          value={editingTitle.en}
                          onChange={(e) => setEditingTitle({ ...editingTitle, en: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          placeholder="English"
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium text-slate-600">Top</label>
                            <input
                              type="number"
                              value={editingTitle.top}
                              onChange={(e) => setEditingTitle({ ...editingTitle, top: parseInt(e.target.value) })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">Left</label>
                            <input
                              type="number"
                              value={editingTitle.left}
                              onChange={(e) => setEditingTitle({ ...editingTitle, left: parseInt(e.target.value) })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">Rotate</label>
                            <input
                              type="number"
                              value={editingTitle.rotate}
                              onChange={(e) => setEditingTitle({ ...editingTitle, rotate: parseInt(e.target.value) })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">Size (px)</label>
                            <input
                              type="number"
                              value={editingTitle.size}
                              onChange={(e) => setEditingTitle({ ...editingTitle, size: parseInt(e.target.value) })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdateTitle(index)}
                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                          >
                            Хадгалах
                          </button>
                          <button
                            onClick={() => setEditingTitleIndex(null)}
                            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                          >
                            Болих
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        <p className="font-medium text-slate-800">{getTranslation(title.translations, 2)}</p>
                        <p className="text-sm text-slate-600">{getTranslation(title.translations, 1)}</p>
                        {title.positions[0] && (
                          <p className="text-xs text-slate-400">
                            Position: Top {title.positions[0].top}px, Left {title.positions[0].left}px, 
                            Rotate {title.positions[0].rotate}°, Size {title.positions[0].size}px
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Configuration */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Тохиргоо</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Store холбоосууд</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">App Store URL</label>
                <input
                  type="url"
                  value={data.appstore}
                  onChange={(e) => setData({ ...data, appstore: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="https://apps.apple.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Google Play URL</label>
                <input
                  type="url"
                  value={data.playstore}
                  onChange={(e) => setData({ ...data, playstore: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="https://play.google.com/..."
                />
              </div>
            </div>

            {/* Layout Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Байршил</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Зургийн байршил</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setData({ ...data, title_position: 1 })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      data.title_position === 1 ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Баруун тал
                  </button>
                  <button
                    onClick={() => setData({ ...data, title_position: 2 })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      data.title_position === 2 ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Зүүн тал
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Онцлогийн загвар</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setData({ ...data, divide: 0 })}
                    className={`px-3 py-2 rounded-lg border-2 text-xs transition-all ${
                      data.divide === 0 ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Босоо
                  </button>
                  <button
                    onClick={() => setData({ ...data, divide: 1 })}
                    className={`px-3 py-2 rounded-lg border-2 text-xs transition-all ${
                      data.divide === 1 ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Хэвтээ
                  </button>
                  <button
                    onClick={() => setData({ ...data, divide: 2 })}
                    className={`px-3 py-2 rounded-lg border-2 text-xs transition-all ${
                      data.divide === 2 ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Өнгөнүүд</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Гарчгийн өнгө</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.titlecolor}
                      onChange={(e) => setData({ ...data, titlecolor: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.titlecolor}
                      onChange={(e) => setData({ ...data, titlecolor: e.target.value })}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Текстийн өнгө</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.fontcolor}
                      onChange={(e) => setData({ ...data, fontcolor: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.fontcolor}
                      onChange={(e) => setData({ ...data, fontcolor: e.target.value })}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Icon өнгө</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.iconcolor}
                      onChange={(e) => setData({ ...data, iconcolor: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.iconcolor}
                      onChange={(e) => setData({ ...data, iconcolor: e.target.value })}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Button өнгө</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.buttonbgcolor}
                      onChange={(e) => setData({ ...data, buttonbgcolor: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.buttonbgcolor}
                      onChange={(e) => setData({ ...data, buttonbgcolor: e.target.value })}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Апп-ын зураг</h3>
              <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setImageInputType('upload')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      imageInputType === 'upload' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Зураг оруулах
                  </button>
                  <button
                    onClick={() => setImageInputType('svg')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      imageInputType === 'svg' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    SVG код
                  </button>
                </div>

                {imageInputType === 'upload' ? (
                  <ImageUpload
                    label=""
                    value={data.image}
                    onChange={(url) => setData({ ...data, image: url, appSvgCode: undefined })}
                  />
                ) : (
                  <div>
                    <textarea
                      value={data.appSvgCode || ''}
                      onChange={(e) => {
                        const newVal = e.target.value
                        setData({ ...data, appSvgCode: newVal, image: '' })
                        validateSvg(newVal)
                      }}
                      className={`w-full h-32 px-3 py-2 text-xs font-mono border rounded-lg ${
                        svgError ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="<svg ...> ... </svg>"
                    />
                    {svgError && <p className="text-xs text-red-500 mt-1">{svgError}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}