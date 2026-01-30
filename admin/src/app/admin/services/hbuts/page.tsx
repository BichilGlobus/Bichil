'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Textarea, Button, PageHeader } from '@/components/FormElements'
import LocalizedListEditor from '@/components/LocalizedListEditor'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

type LocalizedItem = {
  id?: string
  mn: string
  en: string
  style?: TextStyle
}

type TextStyle = {
  fontSize?: string
  fontColor?: string
  fontFamily?: string
  fontWeight?: string
}

type ContentBlock = {
  id?: string
  title_mn: string
  title_en: string
  content_mn: string
  content_en: string
  title_style?: TextStyle
  content_style?: TextStyle
  placement?: 'section_1' | 'section_2' | 'section_3' | 'section_4'
}

interface ServiceData {
  id: string
  name_mn: string
  name_en: string
  category_mn: string
  category_en: string
  description_mn: string
  description_en: string
  stats: { interest: string; decision: string; term: string }
  materials: LocalizedItem[]
  collateral: LocalizedItem[]
  conditions: LocalizedItem[]
  blocks: ContentBlock[]
  status: 'draft' | 'published'
}

const createDefaultData = (): ServiceData => ({
  id: crypto.randomUUID(),
  name_mn: 'ХБҮЦ',
  name_en: 'HBUTS',
  category_mn: 'Үйлчилгээ · Санхүүжилт',
  category_en: 'Service · Financing',
  description_mn: 'Хөгжлийн банкны үнэт цаасны үйлчилгээ. Жижиг дунд бизнест санхүүжилт олгох төрийн дэмжлэгт хөтөлбөр.\n\nЭнэхүү үйлчилгээ нь танд шаардлагатай бичиг баримт, нөхцөлүүдийг ойлгомжтойгоор танилцуулна.',
  description_en: 'Development Bank securities service. State support program for financing small and medium enterprises.\n\nThis service will introduce you to the necessary documents and conditions.',
  stats: {
    interest: '6% - 10%',
    decision: '14-30 хоног',
    term: '3-7 жил',
  },
  materials: [
    { id: crypto.randomUUID(), mn: 'Бизнес төлөвлөгөө', en: 'Business plan' },
    { id: crypto.randomUUID(), mn: 'Санхүүгийн тайлан', en: 'Financial report' },
    { id: crypto.randomUUID(), mn: 'Ажилчдын тоо, цалингийн мэдээлэл', en: 'Employee count and salary information' },
    { id: crypto.randomUUID(), mn: 'Компанийн баримт бичиг', en: 'Company documents' },
    { id: crypto.randomUUID(), mn: 'Төсөл хөтөлбөрийн дэлгэрэнгүй тодорхойлолт', en: 'Detailed project description' },
    { id: crypto.randomUUID(), mn: 'Татварын төлбөрийн баримт', en: 'Tax payment certificate' },
  ],
  collateral: [
    { id: crypto.randomUUID(), mn: 'Үл хөдлөх хөрөнгө', en: 'Real estate' },
    { id: crypto.randomUUID(), mn: 'Тоног төхөөрөмж', en: 'Equipment' },
    { id: crypto.randomUUID(), mn: 'Бусад барьцаа хөрөнгө', en: 'Other collateral' },
  ],
  conditions: [
    { id: crypto.randomUUID(), mn: 'ЖДҮ-ийн ангилалд хамаарах байгууллага байх', en: 'Must be classified as SME' },
    { id: crypto.randomUUID(), mn: 'Шинэ ажлын байр нэмэгдүүлэх үүрэг хүлээх', en: 'Must create new jobs' },
    { id: crypto.randomUUID(), mn: 'Төслийн хэрэгжилтийн тайлан өгөх', en: 'Must provide project implementation report' },
    { id: crypto.randomUUID(), mn: 'Хууль ёсны үйл ажиллагаа явуулж байх', en: 'Must operate in accordance with law' },
  ],
  blocks: [],
  status: 'draft',
})

function ServicePreview({ data, lang }: { data: ServiceData; lang: 'mn' | 'en' }) {
  const name = lang === 'mn' ? data.name_mn : data.name_en
  const description = lang === 'mn' ? data.description_mn : data.description_en

  const stats = [
    { value: data.stats.interest, label: lang === 'mn' ? 'Сарын хүү' : 'Interest Rate' },
    { value: data.stats.decision, label: lang === 'mn' ? 'Шийдвэр' : 'Decision' },
    { value: data.stats.term, label: lang === 'mn' ? 'Хамгийн урт хугацаа' : 'Max Term' },
  ]

  const renderBlocks = (placement: 'section_1' | 'section_2' | 'section_3' | 'section_4') => {
    const blocksInSection = (data.blocks || []).filter(b => (b.placement || 'section_4') === placement)
    if (blocksInSection.length === 0) return null

    const fontSizeMap: { [key: string]: string } = {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
    }

    return (
      <div className="pt-10 border-t border-slate-200">
        {blocksInSection.map((block, i) => (
          <div key={i} className="mb-10">
            <h3 
              className="text-lg font-semibold text-slate-800 mb-3"
              style={{
                fontSize: block.title_style?.fontSize ? fontSizeMap[block.title_style.fontSize] : undefined,
                color: block.title_style?.fontColor || undefined,
                fontFamily: block.title_style?.fontFamily || undefined,
                fontWeight: block.title_style?.fontWeight ? parseInt(block.title_style.fontWeight) : undefined,
              }}
            >
              {lang === 'mn' ? block.title_mn : block.title_en}
            </h3>
            <p 
              className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap"
              style={{
                fontSize: block.content_style?.fontSize ? fontSizeMap[block.content_style.fontSize] : undefined,
                color: block.content_style?.fontColor || undefined,
                fontFamily: block.content_style?.fontFamily || undefined,
                fontWeight: block.content_style?.fontWeight ? parseInt(block.content_style.fontWeight) : undefined,
              }}
            >
              {lang === 'mn' ? block.content_mn : block.content_en}
            </p>
          </div>
        ))}
      </div>
    )
  }

  const materials = data.materials || []
  const collateral = data.collateral || []
  const conditions = data.conditions || []

  const getItemText = (item: LocalizedItem) => lang === 'mn' ? item.mn : item.en

  const fontSizeMap: { [key: string]: string } = {
    'text-xs': '0.75rem',
    'text-sm': '0.875rem',
    'text-base': '1rem',
    'text-lg': '1.125rem',
    'text-xl': '1.25rem',
    'text-2xl': '1.5rem',
  }

  const getItemStyle = (item: LocalizedItem) => ({
    fontSize: item.style?.fontSize ? fontSizeMap[item.style.fontSize] : undefined,
    color: item.style?.fontColor || undefined,
    fontFamily: item.style?.fontFamily || undefined,
    fontWeight: item.style?.fontWeight ? parseInt(item.style.fontWeight) : undefined,
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-slate-200/40 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-24 relative z-10">
        <header className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">{name}</h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">{description}</p>

          {stats.length > 0 && (
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center">
                  <p className="text-base font-semibold text-teal-600 mb-1">{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          )}
          
          {renderBlocks('section_1')}
        </header>

        <div className="max-w-6xl mx-auto">
          {renderBlocks('section_2')}
          
          <section className="space-y-8">
            <div className="relative bg-white rounded-[32px] p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100">
              {materials.length > 0 && (
                <div className="mb-14">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    {lang === 'mn' ? 'Шаардагдах материал' : 'Required Documents'}
                  </h3>
                  <ul className="space-y-4">
                    {materials.map((m, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-500" style={getItemStyle(m)}>
                        <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {getItemText(m)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {collateral.length > 0 && (
                <div className="mb-14">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    {lang === 'mn' ? 'Барьцаа хөрөнгө' : 'Collateral'}
                  </h3>
                  <ul className="space-y-4">
                    {collateral.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-500" style={getItemStyle(c)}>
                        <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {getItemText(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {conditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                    {lang === 'mn' ? 'Нөхцөл' : 'Conditions'}
                  </h3>
                  <ul className="space-y-4">
                    {conditions.map((cond, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-500" style={getItemStyle(cond)}>
                        <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {getItemText(cond)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {renderBlocks('section_3')}
            </div>
          </section>

          {renderBlocks('section_4')}
        </div>
      </div>
    </main>
  )
}

export default function HbutsServiceAdminPage() {
  const { data, setData, saveSuccess, handleSave: handleLocalSave, handleReset } = useSaveReset<ServiceData>(
    'servicePageHbuts',
    createDefaultData()
  )

  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateData = (updater: (prev: ServiceData) => ServiceData) => {
    setData((prev) => {
      const next = updater(prev)
      setIsDirty(true)
      return next
    })
  }

  const hasEmptyLocalizedItem = (items: LocalizedItem[]) =>
    items.some((i) => !i.mn.trim() || !i.en.trim())

  const validateData = (data: ServiceData): string | null => {
    if (!data.name_mn.trim()) return 'Нэр (MN) заавал'
    if (!data.name_en.trim()) return 'Name (EN) required'
    if (hasEmptyLocalizedItem(data.materials) || hasEmptyLocalizedItem(data.collateral || []) || hasEmptyLocalizedItem(data.conditions)) {
      return 'MN ба EN бүх талбарыг бөглөнө үү'
    }
    return null
  }

  const saveData = useCallback(
    async (mode: 'auto' | 'manual') => {
      try {
        setSaving(true)
        const response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, type: 'hbuts', mode }),
        })

        if (!response.ok) throw new Error('Failed to save')

        if (mode === 'manual') alert('Хадгалагдлаа!')
        else console.log('Auto-saved')
      } catch (error) {
        console.error('Save failed:', error)
        if (mode === 'manual') alert('Хадгалахад алдаа гарлаа')
      } finally {
        setSaving(false)
      }
    },
    [data]
  )

  useEffect(() => {
    if (!isDirty || data.status === 'published') return
    const timeout = setTimeout(() => {
      saveData('auto')
      setIsDirty(false)
    }, 800)
    return () => clearTimeout(timeout)
  }, [data, isDirty, saveData])

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

  return (
    <AdminLayout title="ХБҮЦ">
      <div className="max-w-6xl mx-auto">
        {saveSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
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
          title="ХБҮЦ"
          description="Үйлчилгээний хуудсын агуулга"
          action={<SaveResetButtons onSave={handleLocalSave} onReset={handleReset} confirmMessage="Та хадгалахдаа итгэлтэй байна уу?" />}
        />

        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Live Preview</span>
            </div>
            
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
            <ServicePreview data={data} lang={previewLang} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Name/Category + Stats Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* 🏷 Name / Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase flex items-center gap-2">
                <span>🏷</span> Нэр / Ангилал
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Нэр (МН) *"
                  placeholder="Үйлчилгээний нэр"
                  value={data.name_mn}
                  helper="Монгол хэл дээрх нэр"
                  onChange={(e) => updateData((prev) => ({ ...prev, name_mn: e.target.value }))}
                />
                <Input
                  label="Name (EN) *"
                  placeholder="Service Name"
                  value={data.name_en}
                  helper="English name"
                  onChange={(e) => updateData((prev) => ({ ...prev, name_en: e.target.value }))}
                />
                <Input
                  label="Ангилал (МН) *"
                  placeholder="Жишээ: Үйлчилгээ · Санхүүжилт"
                  value={data.category_mn}
                  helper="Монгол хэл дээрх ангилал"
                  onChange={(e) => updateData((prev) => ({ ...prev, category_mn: e.target.value }))}
                />
                <Input
                  label="Category (EN) *"
                  placeholder="Service Category"
                  value={data.category_en}
                  helper="English category"
                  onChange={(e) => updateData((prev) => ({ ...prev, category_en: e.target.value }))}
                />
              </div>
            </div>

            {/*  Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase flex items-center gap-2">
                <span></span> Статистик
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Хүү / Interest Rate *"
                  placeholder="Жишээ: 6% - 10%"
                  value={data.stats.interest}
                  helper="Жилийн хүү / Annual Interest"
                  onChange={(e) => updateData((prev) => ({ ...prev, stats: { ...prev.stats, interest: e.target.value } }))}
                />
                <Input
                  label="Шийдвэр / Decision Time *"
                  placeholder="Жишээ: 14-30 хоног"
                  value={data.stats.decision}
                  helper="Хүсэлтэд хариу ирэх хугацаа"
                  onChange={(e) => updateData((prev) => ({ ...prev, stats: { ...prev.stats, decision: e.target.value } }))}
                />
                <Input
                  label="Хугацаа / Term *"
                  placeholder="Жишээ: 3-7 жил"
                  value={data.stats.term}
                  helper="Зээлийн хугацаа"
                  onChange={(e) => updateData((prev) => ({ ...prev, stats: { ...prev.stats, term: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          {/*  Description - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase flex items-center gap-2">
              <span></span> Тайлбар / Description
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                label="Тайлбар (МН) *"
                placeholder="Үйлчилгээний дэлгэрэнгүй тайлбар"
                value={data.description_mn}
                helper="Монгол хэл дээр"
                onChange={(e) => updateData((prev) => ({ ...prev, description_mn: e.target.value }))}
                rows={4}
              />
              <Textarea
                label="Description (EN) *"
                placeholder="Detailed service description"
                value={data.description_en}
                helper="In English"
                onChange={(e) => updateData((prev) => ({ ...prev, description_en: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          {/* Materials - 3 Columns */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase"> Материал</h3>
              <LocalizedListEditor
                title="Материал"
                items={data.materials || []}
                onChange={(items) => updateData((prev) => ({ ...prev, materials: items }))}
                showStyling={true}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase"> Барьцаа</h3>
              <LocalizedListEditor
                title="Барьцаа"
                items={data.collateral || []}
                onChange={(items) => updateData((prev) => ({ ...prev, collateral: items }))}
                showStyling={true}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase"> Нөхцөл</h3>
              <LocalizedListEditor
                title="Нөхцөл"
                items={data.conditions || []}
                onChange={(items) => updateData((prev) => ({ ...prev, conditions: items }))}
                showStyling={true}
              />
            </div>
          </div>

          {/* Блок контент */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase"> Блок контент</h3>
              <button
                onClick={() => {
                  const newBlock: ContentBlock = {
                    id: crypto.randomUUID(),
                    title_mn: '',
                    title_en: '',
                    content_mn: '',
                    content_en: '',
                  }
                  updateData((prev) => ({ ...prev, blocks: [...(prev.blocks || []), newBlock] }))
                }}
                className="px-3 py-1 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                + Блок нэмэх
              </button>
            </div>
            <div className="space-y-4">
              {(data.blocks || []).length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-8">Бүтээн байгуулалтын блок байхгүй. Шинэ блок нэмэхийн тулд дээрх товчлуур дээр дарна уу.</p>
              ) : (
                (data.blocks || []).map((block, idx) => (
                  <div key={block.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => {
                          updateData((prev) => ({
                            ...prev,
                            blocks: (prev.blocks || []).filter((_, i) => i !== idx),
                          }))
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Устгах"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <Input
                        label="Гарчиг (МН)"
                        value={block.title_mn}
                        onChange={(e) => {
                          const updated = [...(data.blocks || [])]
                          updated[idx].title_mn = e.target.value
                          updateData((prev) => ({ ...prev, blocks: updated }))
                        }}
                      />
                      <Input
                        label="Title (EN)"
                        value={block.title_en}
                        onChange={(e) => {
                          const updated = [...(data.blocks || [])]
                          updated[idx].title_en = e.target.value
                          updateData((prev) => ({ ...prev, blocks: updated }))
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Textarea
                        label="Агуулга (МН)"
                        value={block.content_mn}
                        onChange={(e) => {
                          const updated = [...(data.blocks || [])]
                          updated[idx].content_mn = e.target.value
                          updateData((prev) => ({ ...prev, blocks: updated }))
                        }}
                        rows={3}
                      />
                      <Textarea
                        label="Content (EN)"
                        value={block.content_en}
                        onChange={(e) => {
                          const updated = [...(data.blocks || [])]
                          updated[idx].content_en = e.target.value
                          updateData((prev) => ({ ...prev, blocks: updated }))
                        }}
                        rows={3}
                      />
                    </div>
                    
                    {/* Placement Selection */}
                    <div className="pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Байршил сонголт / Placement</p>
                      <select
                        value={block.placement || 'section_4'}
                        onChange={(e) => {
                          const updated = [...(data.blocks || [])]
                          updated[idx].placement = e.target.value as 'section_1' | 'section_2' | 'section_3' | 'section_4'
                          updateData((prev) => ({ ...prev, blocks: updated }))
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      >
                        <option value="section_1">1️⃣ Гарчигийн доор</option>
                        <option value="section_2">2️⃣ Статистикийн доор</option>
                        <option value="section_3">3️⃣ Материал/Барьцаа/Нөхцлийн доор</option>
                        <option value="section_4">4️⃣ Хамгийн сүүлд</option>
                      </select>
                    </div>
                    
                    {/* Title Styling */}
                    <div className="pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Гарчигийн стиль / Title Style</p>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={block.title_style?.fontSize || ''}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].title_style = { ...updated[idx].title_style, fontSize: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Размер сонгох</option>
                          <option value="text-sm">Жижиг (SM)</option>
                          <option value="text-base">Байндаа (BASE)</option>
                          <option value="text-lg">Том (LG)</option>
                          <option value="text-xl">XL</option>
                          <option value="text-2xl">2XL</option>
                        </select>
                        <input
                          type="color"
                          value={block.title_style?.fontColor || '#000000'}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].title_style = { ...updated[idx].title_style, fontColor: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="w-full h-8 border border-gray-300 rounded"
                          title="Өнгө сонгох"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <select
                          value={block.title_style?.fontFamily || ''}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].title_style = { ...updated[idx].title_style, fontFamily: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Фонт сонгох</option>
                          <option value="serif">Serif</option>
                          <option value="sans-serif">Sans Serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                        <select
                          value={block.title_style?.fontWeight || ''}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].title_style = { ...updated[idx].title_style, fontWeight: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Жинг сонгох</option>
                          <option value="400">Ердийн</option>
                          <option value="600">Хагас сүүл</option>
                          <option value="700">Сүүл</option>
                          <option value="800">Маш сүүл</option>
                        </select>
                      </div>
                    </div>

                    {/* Content Styling */}
                    <div className="pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Агуулгын стиль / Content Style</p>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={block.content_style?.fontSize || ''}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].content_style = { ...updated[idx].content_style, fontSize: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Размер сонгох</option>
                          <option value="text-xs">XS</option>
                          <option value="text-sm">Жижиг (SM)</option>
                          <option value="text-base">Байндаа (BASE)</option>
                          <option value="text-lg">Том (LG)</option>
                        </select>
                        <input
                          type="color"
                          value={block.content_style?.fontColor || '#000000'}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].content_style = { ...updated[idx].content_style, fontColor: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="w-full h-8 border border-gray-300 rounded"
                          title="Өнгө сонгох"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <select
                          value={block.content_style?.fontFamily || ''}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].content_style = { ...updated[idx].content_style, fontFamily: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Фонт сонгох</option>
                          <option value="serif">Serif</option>
                          <option value="sans-serif">Sans Serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                        <select
                          value={block.content_style?.fontWeight || ''}
                          onChange={(e) => {
                            const updated = [...(data.blocks || [])]
                            updated[idx].content_style = { ...updated[idx].content_style, fontWeight: e.target.value }
                            updateData((prev) => ({ ...prev, blocks: updated }))
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Жинг сонгох</option>
                          <option value="400">Ердийн</option>
                          <option value="600">Хагас сүүл</option>
                          <option value="700">Сүүл</option>
                          <option value="800">Маш сүүл</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setData(createDefaultData())}>
              Сброс
            </Button>
            <Button onClick={handleSave} disabled={!isDirty || saving}>
              {saving ? 'Хадгалаж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
