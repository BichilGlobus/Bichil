'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Button, PageHeader } from '@/components/FormElements'
import Modal from '@/components/Modal'
import { PlusIcon, TrashIcon, PencilIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { SaveResetButtons } from '@/components/SaveResetButtons'
import axiosInstance from '@/app/config/axiosConfig'

interface HeroSlide {
  id: number
  type: 'i' | 'v'
  file: string
  time: number
  index: number
  visible: boolean
  file_url: string
}

export default function HeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const [mediaType, setMediaType] = useState<'i' | 'v'>('i')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  const [formData, setFormData] = useState({
    type: 'i' as 'i' | 'v',
    time: 5,
    index: 1,
    visible: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/hero-slider/')
      setSlides(response.data)
    } catch (error) {
      console.error('Error fetching slides:', error)
      alert('Өгөгдөл татахад алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const activeSlides = slides.filter(s => s.visible).sort((a, b) => a.index - b.index)
    if (activeSlides.length === 0) return

    const currentSlide = activeSlides[currentPreviewIndex]
    const timer = setTimeout(() => {
      setCurrentPreviewIndex((prev) => (prev + 1) % activeSlides.length)
    }, (currentSlide?.time || 5) * 1000)

    return () => clearTimeout(timer)
  }, [currentPreviewIndex, slides])

  const handleVideoLoad = (file: File) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      const duration = Math.round(video.duration)
      setVideoDuration(duration)
      setFormData(prev => ({ ...prev, time: duration }))
    }
    
    video.src = URL.createObjectURL(file)
  }

  const handleOpenCreate = () => {
    setEditingSlide(null)
    setMediaType('i')
    setSelectedFile(null)
    setPreviewUrl('')
    setVideoDuration(0)
    const maxIndex = slides.length > 0 ? Math.max(...slides.map(s => s.index)) : 0
    setFormData({
      type: 'i',
      time: 5,
      index: maxIndex + 1,
      visible: true,
    })
    setModalOpen(true)
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setMediaType(slide.type)
    setSelectedFile(null)
    setPreviewUrl(slide.file)
    setFormData({
      type: slide.type,
      time: slide.time,
      index: slide.index,
      visible: slide.visible,
    })
    setModalOpen(true)
  }

  const handleMediaTypeChange = (type: 'i' | 'v') => {
    setMediaType(type)
    setSelectedFile(null)
    setPreviewUrl('')
    setFormData(prev => ({
      ...prev,
      type,
      time: type === 'v' ? videoDuration : 5
    }))
  }

  const handleImageSelect = (file: File) => {
  setSelectedFile(file)  
  setPreviewUrl(URL.createObjectURL(file))  
}

const handleVideoSelect = (file: File) => {
  setSelectedFile(file)  
  handleVideoLoad(file) 
  setPreviewUrl(URL.createObjectURL(file))
}

  const handleSave = async () => {
    if (!editingSlide && !selectedFile) {
      alert('Зураг эсвэл бичлэг сонгоно уу')
      return
    }


    try {
      const payload = new FormData()
      payload.append('type', formData.type)
      payload.append('time', formData.time.toString())
      payload.append('index', formData.index.toString())
      payload.append('visible', formData.visible ? '1' : '0')

      if (selectedFile) {
        payload.append('file', selectedFile)
      }

      console.log('Sending FormData')

      if (editingSlide) {
        await axiosInstance.put(`/hero-slider/${editingSlide.id}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await axiosInstance.post('/hero-slider/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      await fetchSlides()
      setModalOpen(false)
      setSelectedFile(null)
      setPreviewUrl('')
      setVideoDuration(0)
    } catch (error: any) {
      console.error('Error:', error)
      alert(`Алдаа: ${error.response?.data?.detail || error.message}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Устгах уу?')) return
    
    try {
      await axiosInstance.delete(`/hero-slider/${id}/`)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      await fetchSlides()
    } catch (error) {
      alert('Устгахад алдаа гарлаа')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Hero Slider">
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Hero Slider">
      <div className="max-w-6xl mx-auto">
        {saveSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай!</h4>
              <p className="text-xs text-emerald-700">Хадгалагдсан</p>
            </div>
          </div>
        )}
        
        <PageHeader
          title="Hero Slider"
          description="Нүүр хуудасны слайдер"
          action={
            <Button variant="dark" onClick={handleOpenCreate}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Нэмэх
            </Button>
          }
        />

        { slides && slides.length > 0 &&  slides.filter(s => s.visible).length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200">
            <div className="px-4 py-2.5 border-b flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-slate-600">PREVIEW</span>
              <span className="text-xs text-slate-400">{slides.filter(s => s.visible).length} слайд</span>
            </div>
            
            <div className="p-6">
              <div className="relative h-[400px] rounded-xl overflow-hidden bg-black">
                {slides.filter(s => s.visible).sort((a, b) => a.index - b.index).map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      idx === currentPreviewIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {slide.file ? (
                      slide.type === 'i' ? (
                        <Image
                          src={`http://127.0.0.1:8000/${slide.file}`}
                          alt="Hero preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={`http://127.0.0.1:8000/${slide.file}`}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                        No Media
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 text-white bg-black/30 px-3 py-1 rounded-full text-sm">
                      {idx + 1} / {slides.filter(s => s.visible).length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          { slides && slides.length  && slides.sort((a, b) => a.index - b.index).map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="relative h-48 bg-black">
                 {slide.file ? (
          slide.type === 'i' ? (
            <Image
              src={`http://127.0.0.1:8000/${slide.file}`}
              alt="Hero preview"
              fill
              className="object-cover"
            />
          ) : (
            <video
              src={`http://127.0.0.1:8000/${slide.file}`}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
            No Media
          </div>
        )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleEdit(slide)} className="p-2 bg-white rounded-lg">
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </button>
                  <button onClick={() => handleDelete(slide.id)} className="p-2 bg-white rounded-lg">
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Эрэмбэ: {slide.index}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${slide.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {slide.visible ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Хугацаа: {slide.time}с</div>
              </div>
            </div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <PhotoIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">Слайд байхгүй</p>
            <Button variant="dark" onClick={handleOpenCreate}>Нэмэх</Button>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSlide ? 'Засах' : 'Нэмэх'} size="sm">
        <div className="space-y-5">
          {!editingSlide && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleMediaTypeChange('i')} className={`p-4 rounded-xl border-2 ${mediaType === 'i' ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
                <PhotoIcon className={`h-8 w-8 mx-auto mb-2 ${mediaType === 'i' ? 'text-teal-600' : 'text-slate-400'}`} />
                <div className="text-sm font-medium">Зураг</div>
              </button>
              <button onClick={() => handleMediaTypeChange('v')} className={`p-4 rounded-xl border-2 ${mediaType === 'v' ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
                <VideoCameraIcon className={`h-8 w-8 mx-auto mb-2 ${mediaType === 'v' ? 'text-teal-600' : 'text-slate-400'}`} />
                <div className="text-sm font-medium">Бичлэг</div>
              </button>
            </div>
          )}

          {mediaType === 'i' ? (
            <div>
              <label className="block text-sm font-medium mb-2">Зураг</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700" />
              {previewUrl && <Image src={previewUrl} alt="Preview" width={400} height={200} className="mt-3 rounded-lg" />}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Бичлэг</label>
              <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleVideoSelect(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700" />
              {previewUrl && <video src={previewUrl} controls className="mt-3 w-full rounded-lg" />}
              {videoDuration > 0 && <p className="text-xs text-blue-600 mt-2">Хугацаа: {videoDuration}с</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Хугацаа (сек)</label>
            <Input type="number" value={formData.time} onChange={(e) => setFormData({...formData, time: +e.target.value})} min="1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Дараалал</label>
              <Input type="number" value={formData.index} onChange={(e) => setFormData({...formData, index: +e.target.value})} min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Идэвхжүүлэх</label>
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({...formData, visible: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Буцах</button>
            <Button variant="dark" onClick={handleSave}>Хадгалах</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}