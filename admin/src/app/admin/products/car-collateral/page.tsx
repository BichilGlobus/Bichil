'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Textarea, Button, PageHeader } from '@/components/FormElements'
import ProductPage from '@/components/ProductPage'
import LocalizedListEditor from '@/components/LocalizedListEditor'
import TextBlockEditor from '@/components/TextBlockEditor'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

type LocalizedItem = {
  id?: string
  mn: string
  en: string
}

type TextStyle = {
  color: string
  fontSize: {
    mobile: number
    desktop: number
  }
  fontWeight: 'normal' | 'bold'
  align: 'left' | 'center' | 'right'
}

type StylePreset = 'heroTitle' | 'sectionTitle' | 'paragraph' | 'note' | 'custom'

type TextBlock = {
  id: string
  type: 'title' | 'subtitle' | 'paragraph' | 'note'
  content_mn: string
  content_en: string
  style: TextStyle
  stylePreset: StylePreset
  placement: 'hero' | 'details' | 'footer'
  order: number
  visible: boolean
}

interface ProductData {
  id: string
  name_mn: string
  name_en: string
  name_style: TextStyle
  category_mn: string
  category_en: string
  category_style: TextStyle
  description_mn: string
  description_en: string
  description_style: TextStyle
  blocks: TextBlock[]
  stats: { interest: string; decision: string; term: string }
  statsLabelStyle: TextStyle
  statsValueStyle: TextStyle
  details: { amount: string; fee: string; interest: string; term: string; decision: string }
  detailsSectionTitle_mn: string
  detailsSectionTitle_en: string
  detailsSectionTitleStyle: TextStyle
  detailsSubtitle_mn: string
  detailsSubtitle_en: string
  detailsSubtitleStyle: TextStyle
  metricsLabelStyle: TextStyle
  metricsValueStyle: TextStyle
  materials: LocalizedItem[]
  materialsTitle_mn: string
  materialsTitle_en: string
  materialsTitleStyle: TextStyle
  materialsTextStyle: TextStyle
  materialsIconColor: string
  collateral: LocalizedItem[]
  collateralTitle_mn: string
  collateralTitle_en: string
  collateralTitleStyle: TextStyle
  collateralTextStyle: TextStyle
  collateralIconColor: string
  conditions: LocalizedItem[]
  conditionsTitle_mn: string
  conditionsTitle_en: string
  conditionsTitleStyle: TextStyle
  conditionsTextStyle: TextStyle
  conditionsIconColor: string
  status: 'draft' | 'published'
}

const createDefaultData = (): ProductData => ({
  id: crypto.randomUUID(),
  name_mn: 'Автомашин барьцаалсан зээл',
  name_en: 'Car Collateral Loan',
  name_style: {
    color: '#0f172a',
    fontSize: { mobile: 24, desktop: 32 },
    fontWeight: 'bold',
    align: 'center',
  },
  category_mn: 'Тээврийн хэрэгсэл · Автомашин барьцаа',
  category_en: 'Vehicle · Car Collateral',
  category_style: {
    color: '#64748b',
    fontSize: { mobile: 12, desktop: 14 },
    fontWeight: 'normal',
    align: 'center',
  },
  description_mn: 'Автомашинаа барьцаалж, хүссэн зорилгодоо зориулан зээл авах боломжтой.',
  description_en: 'Use your car as collateral to get a loan for your needs.',
  description_style: {
    color: '#334155',
    fontSize: { mobile: 14, desktop: 16 },
    fontWeight: 'normal',
    align: 'center',
  },
  blocks: [
    {
      id: crypto.randomUUID(),
      type: 'title',
      content_mn: 'Хурдан шийдвэр, хялбар нөхцөл',
      content_en: 'Fast decision, easy terms',
      style: {
        color: '#1e293b',
        fontSize: { mobile: 16, desktop: 18 },
        fontWeight: 'bold',
        align: 'center',
      },
      stylePreset: 'heroTitle',
      placement: 'hero',
      order: 1,
      visible: true,
    },
    {
      id: crypto.randomUUID(),
      type: 'paragraph',
      content_mn: 'Та өөрийн хашааг барьцаалж, хүссэн зорилгодоо зориулан зээл авах боломжтой.',
      content_en: 'You can use your fence property as collateral to get a loan for your needs.',
      style: {
        color: '#64748b',
        fontSize: { mobile: 13, desktop: 14 },
        fontWeight: 'normal',
        align: 'left',
      },
      stylePreset: 'paragraph',
      placement: 'details',
      order: 1,
      visible: true,
    },
  ],
  stats: {
    interest: '2.0% - 2.6%',
    decision: '24 цаг',
    term: '60 сар',
  },
  statsLabelStyle: {
    color: '#64748b',
    fontSize: { mobile: 10, desktop: 11 },
    fontWeight: 'normal',
    align: 'center',
  },
  statsValueStyle: {
    color: '#0d9488',
    fontSize: { mobile: 14, desktop: 16 },
    fontWeight: 'bold',
    align: 'center',
  },
  details: {
    amount: '200,000,000₮',
    fee: '0-1%',
    interest: '2.0% - 2.6%',
    term: '60 сар',
    decision: '24 цаг',
  },
  detailsSectionTitle_mn: 'Бүтээгдэхүүний үндсэн нөхцөл ба шаардлагууд',
  detailsSectionTitle_en: 'Product conditions and requirements',
  detailsSectionTitleStyle: {
    color: '#64748b',
    fontSize: { mobile: 11, desktop: 12 },
    fontWeight: 'normal',
    align: 'left',
  },
  detailsSubtitle_mn: 'Автомашин барьцаалсан зээл',
  detailsSubtitle_en: 'Car Collateral Loan',
  detailsSubtitleStyle: {
    color: '#0f172a',
    fontSize: { mobile: 20, desktop: 24 },
    fontWeight: 'bold',
    align: 'left',
  },
  metricsLabelStyle: {
    color: '#64748b',
    fontSize: { mobile: 11, desktop: 11 },
    fontWeight: 'normal',
    align: 'left',
  },
  metricsValueStyle: {
    color: '#0f172a',
    fontSize: { mobile: 14, desktop: 16 },
    fontWeight: 'bold',
    align: 'left',
  },
  materials: [
    { id: crypto.randomUUID(), mn: 'Хашааны гэрчилгээ', en: 'Fence ownership certificate' },
    { id: crypto.randomUUID(), mn: 'Үнэлгээний акт', en: 'Valuation report' },
    { id: crypto.randomUUID(), mn: 'Сүүлийн 6 сарын дансны хуулга', en: 'Last 6 months bank statement' },
    { id: crypto.randomUUID(), mn: 'Орлогын тодорхойлолт', en: 'Income statement' },
    { id: crypto.randomUUID(), mn: 'Оршин суугаа хаягийн лавлагаа', en: 'Residence certificate' },
  ],
  materialsTitle_mn: 'Шаардагдах материал',
  materialsTitle_en: 'Required Documents',
  materialsTitleStyle: {
    color: '#0f172a',
    fontSize: { mobile: 14, desktop: 14 },
    fontWeight: 'bold',
    align: 'left',
  },
  materialsTextStyle: {
    color: '#334155',
    fontSize: { mobile: 12, desktop: 12 },
    fontWeight: 'normal',
    align: 'left',
  },
  materialsIconColor: '#0d9488',
  collateral: [
    { id: crypto.randomUUID(), mn: 'Өөрийн эзэмшлийн хашаа', en: 'Privately owned fence property' }
  ],
  collateralTitle_mn: 'Барьцаа хөрөнгө',
  collateralTitle_en: 'Collateral',
  collateralTitleStyle: {
    color: '#0f172a',
    fontSize: { mobile: 14, desktop: 14 },
    fontWeight: 'bold',
    align: 'left',
  },
  collateralTextStyle: {
    color: '#334155',
    fontSize: { mobile: 12, desktop: 12 },
    fontWeight: 'normal',
    align: 'left',
  },
  collateralIconColor: '#0d9488',
  conditions: [
    { id: crypto.randomUUID(), mn: 'Хашаа нь эрх зүйн маргаангүй байх', en: 'No legal disputes on the property' },
    { id: crypto.randomUUID(), mn: 'Үнэлгээний дүнгийн 60-70% хүртэл зээл олгоно', en: 'Loan up to 60-70% of valuation' },
    { id: crypto.randomUUID(), mn: 'Нотариат гэрээ байгуулна', en: 'Notarized agreement required' },
  ],
  conditionsTitle_mn: 'Нөхцөл',
  conditionsTitle_en: 'Conditions',
  conditionsTitleStyle: {
    color: '#0f172a',
    fontSize: { mobile: 14, desktop: 14 },
    fontWeight: 'bold',
    align: 'left',
  },
  conditionsTextStyle: {
    color: '#334155',
    fontSize: { mobile: 12, desktop: 12 },
    fontWeight: 'normal',
    align: 'left',
  },
  conditionsIconColor: '#f97316',
  status: 'draft' as 'draft' | 'published',
})

export default function CarCollateralLoanAdminPage() {
  const { data, setData, saveSuccess, handleSave: handleLocalSave, handleReset } = useSaveReset<ProductData>('productCarCollateral', createDefaultData())
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  // Helper function to update data and mark as dirty
  const updateData = (updater: (prev: ProductData) => ProductData) => {
    setData((prev) => {
      const next = updater(prev)
      setIsDirty(true)
      return next
    })
  }

  // Helper function to validate localized items
  const hasEmptyLocalizedItem = (items: LocalizedItem[]) =>
    items.some((i) => !i.mn.trim() || !i.en.trim())

  // Validation helper
  const validateData = (data: ProductData): string | null => {
    if (!data.name_mn.trim()) return 'Нэр (MN) заавал'
    if (!data.name_en.trim()) return 'Name (EN) required'

    if (
      hasEmptyLocalizedItem(data.materials) ||
      hasEmptyLocalizedItem(data.collateral) ||
      hasEmptyLocalizedItem(data.conditions)
    ) {
      return 'MN ба EN бүх талбарыг бөглөнө үү'
    }

    return null
  }

  // Helper function to save data
  const saveData = useCallback(async (mode: 'auto' | 'manual') => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, mode }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save')
      }
      
      if (mode === 'manual') {
        alert('Хадгалагдлаа!')
      } else {
        console.log('Auto-saved successfully')
      }
    } catch (error) {
      console.error('Save failed:', error)
      if (mode === 'manual') {
        alert('Хадгалахад алдаа гарлаа')
      }
    } finally {
      setSaving(false)
    }
  }, [data])

  // Auto-save functionality with dirty tracking
  useEffect(() => {
    if (!isDirty || data.status === 'published') return

    const timeout = setTimeout(() => {
      saveData('auto')
      setIsDirty(false)
    }, 800)

    return () => clearTimeout(timeout)
  }, [data, isDirty, saveData])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const handleSave = async () => {
    const error = validateData(data)
    if (error) {
      alert(error)
      return
    }
    
    await saveData('manual')
    setIsDirty(false)
  }

  const handlePublish = async () => {
    const error = validateData(data)
    if (error) {
      alert(error)
      return
    }

    await saveData('manual')

    try {
      const res = await fetch('/api/admin/products/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data.id }),
      })

      if (!res.ok) {
        alert('Publish failed')
        return
      }

      setData((prev) => ({ ...prev, status: 'published' }))
      setIsDirty(false)
      alert('Нийтлэгдлээ!')
    } catch (error) {
      console.error('Publish failed:', error)
      alert('Нийтлэхэд алдаа гарлаа')
    }
  }

  return (
    <AdminLayout title="Автомашин барьцаалсан зээл">
      <div className="max-w-6xl mx-auto">
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
        
        <PageHeader
          title="Автомашин барьцаалсан зээл"
          description="Автомашин барьцаалсан зээлийн хуудсын агуулга"
          action={
            <SaveResetButtons 
              onSave={handleLocalSave}
              onReset={handleReset}
              confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
            />
          }
        />

        {/* Live Preview */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Live Preview
              </span>
            </div>
            
            {/* Preview Language Toggle */}
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
          
          <div className="bg-white">
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
              <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-14">
                <ProductPage data={data} forceLang={previewLang} />
              </div>
            </main>
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Үндсэн мэдээлэл / Basic Information</h3>
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Input
                    label="Нэр (MN)"
                    value={data.name_mn}
                    onChange={(e) => updateData((prev) => ({ ...prev, name_mn: e.target.value }))}
                    placeholder="Бүтээгдэхүүний нэр монгол хэлээр..."
                  />
                  <Input
                    label="Name (EN)"
                    value={data.name_en}
                    onChange={(e) => updateData((prev) => ({ ...prev, name_en: e.target.value }))}
                    placeholder="Product name in English..."
                  />
              </div>

              {/* Category */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Input
                    label="Ангилал (MN)"
                    value={data.category_mn}
                    onChange={(e) => updateData((prev) => ({ ...prev, category_mn: e.target.value }))}
                  />
                  <Input
                    label="Category (EN)"
                    value={data.category_en}
                    onChange={(e) => updateData((prev) => ({ ...prev, category_en: e.target.value }))}
                  />
              </div>

              {/* Description */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Textarea
                    label="Тайлбар (MN)"
                    value={data.description_mn}
                    onChange={(e) => updateData((prev) => ({ ...prev, description_mn: e.target.value }))}
                    rows={3}
                    placeholder="Дэлгэрэнгүй тайлбар..."
                  />
                  <Textarea
                    label="Description (EN)"
                    value={data.description_en}
                    onChange={(e) => updateData((prev) => ({ ...prev, description_en: e.target.value }))}
                    rows={3}
                    placeholder="Detailed description..."
                  />
              </div>
            </div>
          </div>

          {/* Text Styling */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"> Текстийн загвар / Text Styling</h3>
            
            {/* Name Style */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Нэрний загвар / Title Style</h4>
              <div className="grid grid-cols-5 gap-3">
                <Input
                  type="color"
                  label="Өнгө / Color"
                  value={data.name_style.color}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      name_style: { ...prev.name_style, color: e.target.value },
                    }))
                  }
                />
                <Input
                  type="number"
                  label="Хэмжээ (Mobile)"
                  value={data.name_style.fontSize.mobile}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      name_style: { 
                        ...prev.name_style, 
                        fontSize: { ...prev.name_style.fontSize, mobile: Number(e.target.value) }
                      },
                    }))
                  }
                />
                <Input
                  type="number"
                  label="Хэмжээ (Desktop)"
                  value={data.name_style.fontSize.desktop}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      name_style: { 
                        ...prev.name_style, 
                        fontSize: { ...prev.name_style.fontSize, desktop: Number(e.target.value) }
                      },
                    }))
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Зузаан / Weight
                  </label>
                  <select
                    value={data.name_style.fontWeight}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        name_style: { ...prev.name_style, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Байрлал / Align
                  </label>
                  <select
                    value={data.name_style.align}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        name_style: { ...prev.name_style, align: e.target.value as 'left' | 'center' | 'right' },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Style */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Ангиллын загвар / Category Style</h4>
              <div className="grid grid-cols-5 gap-3">
                <Input
                  type="color"
                  label="Өнгө / Color"
                  value={data.category_style.color}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      category_style: { ...prev.category_style, color: e.target.value },
                    }))
                  }
                />
                <Input
                  type="number"
                  label="Хэмжээ (Mobile)"
                  value={data.category_style.fontSize.mobile}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      category_style: { 
                        ...prev.category_style, 
                        fontSize: { ...prev.category_style.fontSize, mobile: Number(e.target.value) }
                      },
                    }))
                  }
                />
                <Input
                  type="number"
                  label="Хэмжээ (Desktop)"
                  value={data.category_style.fontSize.desktop}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      category_style: { 
                        ...prev.category_style, 
                        fontSize: { ...prev.category_style.fontSize, desktop: Number(e.target.value) }
                      },
                    }))
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Зузаан / Weight
                  </label>
                  <select
                    value={data.category_style.fontWeight}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        category_style: { ...prev.category_style, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Байрлал / Align
                  </label>
                  <select
                    value={data.category_style.align}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        category_style: { ...prev.category_style, align: e.target.value as 'left' | 'center' | 'right' },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description Style */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Тайлбарын загвар / Description Style</h4>
              <div className="grid grid-cols-5 gap-3">
                <Input
                  type="color"
                  label="Өнгө / Color"
                  value={data.description_style.color}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      description_style: { ...prev.description_style, color: e.target.value },
                    }))
                  }
                />
                <Input
                  type="number"
                  label="Хэмжээ (Mobile)"
                  value={data.description_style.fontSize.mobile}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      description_style: { 
                        ...prev.description_style, 
                        fontSize: { ...prev.description_style.fontSize, mobile: Number(e.target.value) }
                      },
                    }))
                  }
                />
                <Input
                  type="number"
                  label="Хэмжээ (Desktop)"
                  value={data.description_style.fontSize.desktop}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      description_style: { 
                        ...prev.description_style, 
                        fontSize: { ...prev.description_style.fontSize, desktop: Number(e.target.value) }
                      },
                    }))
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Зузаан / Weight
                  </label>
                  <select
                    value={data.description_style.fontWeight}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        description_style: { ...prev.description_style, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Байрлал / Align
                  </label>
                  <select
                    value={data.description_style.align}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        description_style: { ...prev.description_style, align: e.target.value as 'left' | 'center' | 'right' },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Text Blocks - CMS System */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <TextBlockEditor
              title=" Блок системийн контент / Block-Based Content"
              blocks={data.blocks}
              onChange={(blocks) => updateData((prev) => ({ ...prev, blocks }))}
            />
          </div>

          {/* Stats Styling */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"> Статистик загвар / Stats Styling</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Label Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.statsLabelStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      statsLabelStyle: { ...prev.statsLabelStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.statsLabelStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      statsLabelStyle: { 
                        ...prev.statsLabelStyle, 
                        fontSize: { ...prev.statsLabelStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.statsLabelStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      statsLabelStyle: { 
                        ...prev.statsLabelStyle, 
                        fontSize: { ...prev.statsLabelStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.statsLabelStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        statsLabelStyle: { ...prev.statsLabelStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.statsLabelStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        statsLabelStyle: { ...prev.statsLabelStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Value Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.statsValueStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      statsValueStyle: { ...prev.statsValueStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.statsValueStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      statsValueStyle: { 
                        ...prev.statsValueStyle, 
                        fontSize: { ...prev.statsValueStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.statsValueStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      statsValueStyle: { 
                        ...prev.statsValueStyle, 
                        fontSize: { ...prev.statsValueStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.statsValueStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        statsValueStyle: { ...prev.statsValueStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.statsValueStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        statsValueStyle: { ...prev.statsValueStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистик / Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Хүү / Interest"
                value={data.stats.interest}
                onChange={(e) => updateData((prev) => ({ ...prev, stats: { ...prev.stats, interest: e.target.value } }))}
              />
              <Input
                label="Шийдвэр / Decision"
                value={data.stats.decision}
                onChange={(e) => updateData((prev) => ({ ...prev, stats: { ...prev.stats, decision: e.target.value } }))}
              />
              <Input
                label="Хугацаа / Term"
                value={data.stats.term}
                onChange={(e) => updateData((prev) => ({ ...prev, stats: { ...prev.stats, term: e.target.value } }))}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"> Дэлгэрэнгүй хэсэг / Details Section</h3>
            
            <div className="space-y-4">
              {/* Section Titles */}
              <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-3">
                  <Input
                    label="Section Title (MN)"
                    value={data.detailsSectionTitle_mn}
                    onChange={(e) => updateData((prev) => ({ ...prev, detailsSectionTitle_mn: e.target.value }))}
                    placeholder="Дэлгэрэнгүй хэсгийн гарчиг..."
                  />
                  <Input
                    label="Section Title (EN)"
                    value={data.detailsSectionTitle_en}
                    onChange={(e) => updateData((prev) => ({ ...prev, detailsSectionTitle_en: e.target.value }))}
                    placeholder="Details section title..."
                  />
                </div>
                <div className="space-y-3 pt-2 border-t border-gray-200">
                  <Input
                    label="Subtitle (MN)"
                    value={data.detailsSubtitle_mn}
                    onChange={(e) => updateData((prev) => ({ ...prev, detailsSubtitle_mn: e.target.value }))}
                    placeholder="Дэд гарчиг..."
                  />
                  <Input
                    label="Subtitle (EN)"
                    value={data.detailsSubtitle_en}
                    onChange={(e) => updateData((prev) => ({ ...prev, detailsSubtitle_en: e.target.value }))}
                    placeholder="Subtitle..."
                  />
                </div>
              </div>

              {/* Section Title Style */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Section Title Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.detailsSectionTitleStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      detailsSectionTitleStyle: { ...prev.detailsSectionTitleStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.detailsSectionTitleStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      detailsSectionTitleStyle: { 
                        ...prev.detailsSectionTitleStyle, 
                        fontSize: { ...prev.detailsSectionTitleStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.detailsSectionTitleStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      detailsSectionTitleStyle: { 
                        ...prev.detailsSectionTitleStyle, 
                        fontSize: { ...prev.detailsSectionTitleStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.detailsSectionTitleStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        detailsSectionTitleStyle: { ...prev.detailsSectionTitleStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.detailsSectionTitleStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        detailsSectionTitleStyle: { ...prev.detailsSectionTitleStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subtitle Style */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Subtitle Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.detailsSubtitleStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      detailsSubtitleStyle: { ...prev.detailsSubtitleStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.detailsSubtitleStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      detailsSubtitleStyle: { 
                        ...prev.detailsSubtitleStyle, 
                        fontSize: { ...prev.detailsSubtitleStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.detailsSubtitleStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      detailsSubtitleStyle: { 
                        ...prev.detailsSubtitleStyle, 
                        fontSize: { ...prev.detailsSubtitleStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.detailsSubtitleStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        detailsSubtitleStyle: { ...prev.detailsSubtitleStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.detailsSubtitleStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        detailsSubtitleStyle: { ...prev.detailsSubtitleStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Metrics Label Style */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Metrics Label Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.metricsLabelStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      metricsLabelStyle: { ...prev.metricsLabelStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.metricsLabelStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      metricsLabelStyle: { 
                        ...prev.metricsLabelStyle, 
                        fontSize: { ...prev.metricsLabelStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.metricsLabelStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      metricsLabelStyle: { 
                        ...prev.metricsLabelStyle, 
                        fontSize: { ...prev.metricsLabelStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.metricsLabelStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        metricsLabelStyle: { ...prev.metricsLabelStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.metricsLabelStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        metricsLabelStyle: { ...prev.metricsLabelStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Metrics Value Style */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Metrics Value Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.metricsValueStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      metricsValueStyle: { ...prev.metricsValueStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.metricsValueStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      metricsValueStyle: { 
                        ...prev.metricsValueStyle, 
                        fontSize: { ...prev.metricsValueStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.metricsValueStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      metricsValueStyle: { 
                        ...prev.metricsValueStyle, 
                        fontSize: { ...prev.metricsValueStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.metricsValueStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        metricsValueStyle: { ...prev.metricsValueStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.metricsValueStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        metricsValueStyle: { ...prev.metricsValueStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Materials Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"> Шаардлагатай материал / Materials</h3>
            
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <Input
                  label="Section Title (MN)"
                  value={data.materialsTitle_mn}
                  onChange={(e) => updateData((prev) => ({ ...prev, materialsTitle_mn: e.target.value }))}
                  placeholder="Гарчиг (Монгол)..."
                />
                <Input
                  label="Section Title (EN)"
                  value={data.materialsTitle_en}
                  onChange={(e) => updateData((prev) => ({ ...prev, materialsTitle_en: e.target.value }))}
                  placeholder="Title (English)..."
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Title Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.materialsTitleStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsTitleStyle: { ...prev.materialsTitleStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.materialsTitleStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsTitleStyle: { 
                        ...prev.materialsTitleStyle, 
                        fontSize: { ...prev.materialsTitleStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.materialsTitleStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsTitleStyle: { 
                        ...prev.materialsTitleStyle, 
                        fontSize: { ...prev.materialsTitleStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.materialsTitleStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        materialsTitleStyle: { ...prev.materialsTitleStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.materialsTitleStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        materialsTitleStyle: { ...prev.materialsTitleStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Text Style</h4>
                <div className="grid grid-cols-6 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.materialsTextStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsTextStyle: { ...prev.materialsTextStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.materialsTextStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsTextStyle: { 
                        ...prev.materialsTextStyle, 
                        fontSize: { ...prev.materialsTextStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.materialsTextStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsTextStyle: { 
                        ...prev.materialsTextStyle, 
                        fontSize: { ...prev.materialsTextStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.materialsTextStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        materialsTextStyle: { ...prev.materialsTextStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.materialsTextStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        materialsTextStyle: { ...prev.materialsTextStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <Input
                    type="color"
                    label="Icon Color"
                    value={data.materialsIconColor}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      materialsIconColor: e.target.value,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Materials List */}
          <LocalizedListEditor
            title="Материалын жагсаалт / Materials List"
            items={data.materials}
            onChange={(items) => updateData((prev) => ({ ...prev, materials: items }))}
            addButtonLabel={{ mn: 'Материал нэмэх', en: 'Add Material' }}
            inputLabel={{ mn: 'Материал (MN)', en: 'Material (EN)' }}
          />

          {/* Collateral Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"> Барьцаа / Collateral</h3>
            
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <Input
                  label="Section Title (MN)"
                  value={data.collateralTitle_mn}
                  onChange={(e) => updateData((prev) => ({ ...prev, collateralTitle_mn: e.target.value }))}
                  placeholder="Гарчиг (Монгол)..."
                />
                <Input
                  label="Section Title (EN)"
                  value={data.collateralTitle_en}
                  onChange={(e) => updateData((prev) => ({ ...prev, collateralTitle_en: e.target.value }))}
                  placeholder="Title (English)..."
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Title Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.collateralTitleStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralTitleStyle: { ...prev.collateralTitleStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.collateralTitleStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralTitleStyle: { 
                        ...prev.collateralTitleStyle, 
                        fontSize: { ...prev.collateralTitleStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.collateralTitleStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralTitleStyle: { 
                        ...prev.collateralTitleStyle, 
                        fontSize: { ...prev.collateralTitleStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.collateralTitleStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        collateralTitleStyle: { ...prev.collateralTitleStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.collateralTitleStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        collateralTitleStyle: { ...prev.collateralTitleStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Text Style</h4>
                <div className="grid grid-cols-6 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.collateralTextStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralTextStyle: { ...prev.collateralTextStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.collateralTextStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralTextStyle: { 
                        ...prev.collateralTextStyle, 
                        fontSize: { ...prev.collateralTextStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.collateralTextStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralTextStyle: { 
                        ...prev.collateralTextStyle, 
                        fontSize: { ...prev.collateralTextStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.collateralTextStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        collateralTextStyle: { ...prev.collateralTextStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.collateralTextStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        collateralTextStyle: { ...prev.collateralTextStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <Input
                    type="color"
                    label="Icon Color"
                    value={data.collateralIconColor}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      collateralIconColor: e.target.value,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collateral List */}
          <LocalizedListEditor
            title="Барьцааны жагсаалт / Collateral List"
            items={data.collateral}
            onChange={(items) => updateData((prev) => ({ ...prev, collateral: items }))}
            addButtonLabel={{ mn: 'Барьцаа нэмэх', en: 'Add Collateral' }}
            inputLabel={{ mn: 'Барьцаа (MN)', en: 'Collateral (EN)' }}
          />

          {/* Conditions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"> Нөхцөл / Conditions</h3>
            
            <div className="space-y-4">
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <Input
                  label="Section Title (MN)"
                  value={data.conditionsTitle_mn}
                  onChange={(e) => updateData((prev) => ({ ...prev, conditionsTitle_mn: e.target.value }))}
                  placeholder="Гарчиг (Монгол)..."
                />
                <Input
                  label="Section Title (EN)"
                  value={data.conditionsTitle_en}
                  onChange={(e) => updateData((prev) => ({ ...prev, conditionsTitle_en: e.target.value }))}
                  placeholder="Title (English)..."
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Title Style</h4>
                <div className="grid grid-cols-5 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.conditionsTitleStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsTitleStyle: { ...prev.conditionsTitleStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.conditionsTitleStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsTitleStyle: { 
                        ...prev.conditionsTitleStyle, 
                        fontSize: { ...prev.conditionsTitleStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.conditionsTitleStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsTitleStyle: { 
                        ...prev.conditionsTitleStyle, 
                        fontSize: { ...prev.conditionsTitleStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.conditionsTitleStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        conditionsTitleStyle: { ...prev.conditionsTitleStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.conditionsTitleStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        conditionsTitleStyle: { ...prev.conditionsTitleStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Text Style</h4>
                <div className="grid grid-cols-6 gap-3">
                  <Input
                    type="color"
                    label="Өнгө"
                    value={data.conditionsTextStyle.color}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsTextStyle: { ...prev.conditionsTextStyle, color: e.target.value },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Mobile"
                    value={data.conditionsTextStyle.fontSize.mobile}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsTextStyle: { 
                        ...prev.conditionsTextStyle, 
                        fontSize: { ...prev.conditionsTextStyle.fontSize, mobile: Number(e.target.value) }
                      },
                    }))}
                  />
                  <Input
                    type="number"
                    label="Desktop"
                    value={data.conditionsTextStyle.fontSize.desktop}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsTextStyle: { 
                        ...prev.conditionsTextStyle, 
                        fontSize: { ...prev.conditionsTextStyle.fontSize, desktop: Number(e.target.value) }
                      },
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                    <select
                      value={data.conditionsTextStyle.fontWeight}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        conditionsTextStyle: { ...prev.conditionsTextStyle, fontWeight: e.target.value as 'normal' | 'bold' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Align</label>
                    <select
                      value={data.conditionsTextStyle.align}
                      onChange={(e) => updateData((prev) => ({
                        ...prev,
                        conditionsTextStyle: { ...prev.conditionsTextStyle, align: e.target.value as 'left' | 'center' | 'right' },
                      }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <Input
                    type="color"
                    label="Icon Color"
                    value={data.conditionsIconColor}
                    onChange={(e) => updateData((prev) => ({
                      ...prev,
                      conditionsIconColor: e.target.value,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Conditions List */}
          <LocalizedListEditor
            title="Нөхцлийн жагсаалт / Conditions List"
            items={data.conditions}
            onChange={(items) => updateData((prev) => ({ ...prev, conditions: items }))}
            addButtonLabel={{ mn: 'Нөхцөл нэмэх', en: 'Add Condition' }}
            inputLabel={{ mn: 'Нөхцөл (MN)', en: 'Condition (EN)' }}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
