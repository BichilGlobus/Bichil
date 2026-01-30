'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Button, PageHeader } from '@/components/FormElements'
import Modal from '@/components/Modal'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import axiosInstance from '@/app/config/axiosConfig'

// ✅ Backend-тэй тохирсон interface
interface CTASlide {
  id: number
  file: string
  file_url: string
  index: number
  font: string
  color: string
  number: string
  titles: Array<{
    id: number
    language: number
    label: string
  }>
  subtitles: Array<{
    id: number
    language: number
    label: string
  }>
}

interface FormData {
  number: string
  title_mn: string
  title_en: string
  subtitle_mn: string
  subtitle_en: string
  font: string
  textColor: string
  index: number
}

export default function CTAPage() {
  const [slides, setSlides] = useState<CTASlide[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CTASlide | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  const [formData, setFormData] = useState<FormData>({
    number: '01',
    title_mn: '',
    title_en: '',
    subtitle_mn: '',
    subtitle_en: '',
    font: 'Arial',
    textColor: '#ffffff',
    index: 1,
  })

  // Backend-ээс слайдууд татах
  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/CTA/')
      setSlides(response.data)
    } catch (err) {
      console.error('Backend-ээс татахад алдаа:', err)
      setError('Өгөгдөл татахад алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  // Helper functions
  const getTitle = (slide: CTASlide, lang: 'mn' | 'en') => {
    const languageId = lang === 'mn' ? 2 : 1
    return slide.titles.find(t => t.language === languageId)?.label || ''
  }

  const getSubtitle = (slide: CTASlide, lang: 'mn' | 'en') => {
    const languageId = lang === 'mn' ? 2 : 1
    return slide.subtitles.find(s => s.language === languageId)?.label || ''
  }

  // Зураг сонгох
  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  // Modal нээх - Create
  const handleOpenCreate = () => {
    setError(null)
    setEditingSlide(null)
    setSelectedFile(null)
    setPreviewUrl('')
    
    const maxIndex = slides.length > 0 ? Math.max(...slides.map(s => s.index)) : 0
    
    setFormData({
      number: `0${slides.length + 1}`,
      title_mn: '',
      title_en: '',
      subtitle_mn: '',
      subtitle_en: '',
      font: 'Arial',
      textColor: '#ffffff',
      index: maxIndex + 1,
    })
    setModalOpen(true)
  }

  // Modal нээх - Edit
  const handleOpenEdit = (slide: CTASlide) => {
    setError(null)
    setEditingSlide(slide)
    setSelectedFile(null)
    setPreviewUrl(slide.file_url)
    
    setFormData({
      number: slide.number,
      title_mn: getTitle(slide, 'mn'),
      title_en: getTitle(slide, 'en'),
      subtitle_mn: getSubtitle(slide, 'mn'),
      subtitle_en: getSubtitle(slide, 'en'),
      font: slide.font,
      textColor: slide.color,
      index: slide.index,
    })
    setModalOpen(true)
  }

  // Create хийх
  const createSlide = async () => {
    if (!selectedFile) {
      setError('Зураг сонгоно уу')
      return
    }
    
    if (!formData.title_mn && !formData.title_en) {
      setError('Гарчиг оруулна уу')
      return
    }

    try {
      setSaving(true)
      setError(null)
      
      const payload = new FormData()
      
      // ✅ Файл нэмэх
      payload.append('file', selectedFile)
      
      // ✅ Бусад fields
      payload.append('number', formData.number)
      payload.append('index', formData.index.toString())
      payload.append('font', formData.font)
      payload.append('color', formData.textColor)
      
      // ✅ Titles array (JSON string)
      const titles = [
        { language: 1, label: formData.title_en || '' },
        { language: 2, label: formData.title_mn || '' }
      ]
      payload.append('titles', JSON.stringify(titles))
      
      // ✅ Subtitles array (JSON string)
      const subtitles = [
        { language: 1, label: formData.subtitle_en || '' },
        { language: 2, label: formData.subtitle_mn || '' }
      ]
      payload.append('subtitles', JSON.stringify(subtitles))
      
      console.log('Creating slide...')
      
      await axiosInstance.post('/CTA/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      await fetchSlides()
      setSuccess('Слайд амжилттай нэмэгдлээ!')
      setModalOpen(false)
      setSelectedFile(null)
      setPreviewUrl('')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      const message = err.response?.data?.detail || err.response?.data?.error || err.message || 'Алдаа гарлаа'
      setError(message)
      console.error('Create error:', err.response?.data || err)
    } finally {
      setSaving(false)
    }
  }

  // Update хийх
  const updateSlide = async () => {
    if (!editingSlide) return
    
    if (!formData.title_mn && !formData.title_en) {
      setError('Гарчиг оруулна уу')
      return
    }

    try {
      setSaving(true)
      setError(null)
      
      const payload = new FormData()
      
      // ✅ Шинэ файл байвал нэмэх
      if (selectedFile) {
        payload.append('file', selectedFile)
      }
      
      // ✅ Бусад fields
      payload.append('number', formData.number)
      payload.append('index', formData.index.toString())
      payload.append('font', formData.font)
      payload.append('color', formData.textColor)
      
      // ✅ Titles
      const titles = [
        { language: 1, label: formData.title_en || '' },
        { language: 2, label: formData.title_mn || '' }
      ]
      payload.append('titles', JSON.stringify(titles))
      
      // ✅ Subtitles
      const subtitles = [
        { language: 1, label: formData.subtitle_en || '' },
        { language: 2, label: formData.subtitle_mn || '' }
      ]
      payload.append('subtitles', JSON.stringify(subtitles))
      
      console.log('Updating slide...')
      
      await axiosInstance.put(`/CTA/${editingSlide.id}/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      await fetchSlides()
      setSuccess('Слайд амжилттай засагдлаа!')
      setModalOpen(false)
      setEditingSlide(null)
      setSelectedFile(null)
      setPreviewUrl('')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      const message = err.response?.data?.detail || err.response?.data?.error || err.message || 'Алдаа гарлаа'
      setError(message)
      console.error('Update error:', err.response?.data || err)
    } finally {
      setSaving(false)
    }
  }

  // Save handler
  const handleSave = () => {
    if (editingSlide) {
      updateSlide()
    } else {
      createSlide()
    }
  }

  // Delete хийх
  const handleDelete = async (id: number) => {
    if (!confirm('Устгах уу?')) return
    
    try {
      await axiosInstance.delete(`/CTA/${id}/`)
      await fetchSlides()
      setSuccess('Слайд амжилттай устгагдлаа!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Устгахад алдаа:', err)
      setError('Слайд устгахад алдаа гарлаа')
    }
  }

  return (
    <AdminLayout title="CTA Slider">
      <div className="max-w-6xl mx-auto">
        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай!</h4>
              <p className="text-xs text-emerald-700">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Алдаа!</h4>
              <p className="text-xs text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <PageHeader
          title="CTA Accordion Slider"
          description="Нүүр хуудасны интерактив слайдер"
          action={
            <Button onClick={handleOpenCreate} disabled={saving}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Шинэ слайд
            </Button>
          }
        />

        {/* Live Preview */}
        {slides.length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 uppercase">Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                  <button
                    onClick={() => setPreviewLang('mn')}
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      previewLang === 'mn' ? 'bg-teal-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    MN
                  </button>
                  <button
                    onClick={() => setPreviewLang('en')}
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      previewLang === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative h-[500px] rounded-xl overflow-hidden">
                <div className="flex h-full gap-4">
                  {slides
                    .sort((a, b) => a.index + b.index)
                    .map((slide, index) => {
                      const isHovered = hoveredIndex === index
                      
                      return (
                        <div
                          key={slide.id}
                          className={`relative transition-all duration-700 cursor-pointer overflow-hidden rounded-2xl ${
                            isHovered ? 'flex-[2.7]' : 'flex-1'
                          }`}
                          style={{
                            filter: isHovered ? 'grayscale(0)' : 'grayscale(0.7)',
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            minWidth: '100px',
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <Image
                            src={`http://127.0.0.1:8000${slide.file_url}`}
                            alt={getTitle(slide, previewLang)}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          
                          <div 
                            className={`absolute ${isHovered ? 'bottom-16' : 'bottom-8'} left-6 right-6 z-10 transition-all duration-700`}
                            style={{ color: slide.color || '#ffffff', fontFamily: slide.font }}
                          >
                            <div className="text-base font-bold mb-2">
                              {getTitle(slide, previewLang)}
                            </div>
                            
                            <div className={`transition-all duration-600 overflow-hidden ${
                              isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                            }`}>
                              <p className="text-sm font-medium">
                                {getSubtitle(slide, previewLang)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides
            .sort((a, b) => a.index - b.index)
            .map((slide) => (
              <div key={slide.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-white rounded-full text-sm font-bold">
                      {slide.number}
                    </span>
                    <span className="text-sm text-slate-500">Эрэмбэ: {slide.index}</span>
                  </div>
                </div>

                <div className="relative h-48">
                  <Image
                    src={`http://127.0.0.1:8000${slide.file_url}`}
                    alt={getTitle(slide, 'mn')}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(slide)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50"
                    >
                      <PencilIcon className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                      {slide.font}
                    </span>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-slate-200"
                      style={{ backgroundColor: slide.color }}
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{getTitle(slide, 'mn')}</h3>
                  <p className="text-sm text-slate-600 mb-1">{getSubtitle(slide, 'mn')}</p>
                  <p className="text-xs text-slate-400 italic">{getTitle(slide, 'en')}</p>
                </div>
              </div>
            ))}
        </div>

        {slides.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Слайд байхгүй</h3>
            <p className="text-sm text-slate-500 mb-4">Эхний слайдаа нэмнэ үү</p>
            <Button onClick={handleOpenCreate}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Слайд нэмэх
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Уншиж байна...</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingSlide(null)
          setSelectedFile(null)
          setPreviewUrl('')
        }}
        title={editingSlide ? 'Слайд засах' : 'Шинэ слайд нэмэх'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Зураг {editingSlide && '(шинэ зураг сонговол солигдоно)'}
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-teal-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageSelect(file)
                }}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700"
              />
            </div>
            {previewUrl && (
              <div className="mt-3 relative h-48 rounded-lg overflow-hidden border">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          <Input
            label="Дугаар"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="01"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Гарчиг (Монгол)"
              value={formData.title_mn}
              onChange={(e) => setFormData({ ...formData, title_mn: e.target.value })}
            />
            <Input
              label="Гарчиг (English)"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Дэд гарчиг (Монгол)"
              value={formData.subtitle_mn}
              onChange={(e) => setFormData({ ...formData, subtitle_mn: e.target.value })}
            />
            <Input
              label="Дэд гарчиг (English)"
              value={formData.subtitle_en}
              onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Фонт</label>
              <select
                value={formData.font}
                onChange={(e) => setFormData({ ...formData, font: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Өнгө</label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <Input
              label="Эрэмбэ"
              type="number"
              value={formData.index.toString()}
              onChange={(e) => setFormData({ ...formData, index: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Болих
            </button>
            <Button variant="dark" onClick={handleSave} disabled={saving}>
              {saving ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}