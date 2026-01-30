'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Modal from '@/components/Modal';
import { Input, Textarea, Button, PageHeader } from '@/components/FormElements';
import ImageUpload from '@/components/ImageUpload';
import { PlusIcon, DocumentTextIcon, TrashIcon, PencilIcon, EyeIcon, LinkIcon, CalendarIcon, PhotoIcon, SparklesIcon, GlobeAltIcon, CheckCircleIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { mockPagesService, type CustomPage } from '@/data/mockPages';

export default function PagesManager() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<CustomPage | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<'mn' | 'en'>('mn');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPagesList, setShowPagesList] = useState(true);

  const [formData, setFormData] = useState({
    slug: '',
    title_mn: '',
    title_en: '',
    content_mn: '',
    content_en: '',
    meta_description_mn: '',
    meta_description_en: '',
    image_url: '',
    title_color: '#1F2937',
    title_size: 28,
    title_weight: '600',
    title_family: 'Inter, system-ui, -apple-system, sans-serif',
    content_color: '#374151',
    content_size: 16,
    content_weight: '400',
    content_family: 'Inter, system-ui, -apple-system, sans-serif',
    is_published: true,
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await mockPagesService.getAllPages();
      setPages(data);
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      if (editingPage) {
        await mockPagesService.updatePage(editingPage.id, formData);
      } else {
        await mockPagesService.createPage(formData);
      }

      await loadPages();
      resetForm();
      const message = editingPage ? 'Хуудас амжилттай шинэчлэгдлээ!' : 'Шинэ хуудас амжилттай үүслээ!';
      alert(message);
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page: CustomPage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title_mn: page.title_mn,
      title_en: page.title_en,
      content_mn: page.content_mn,
      content_en: page.content_en,
      meta_description_mn: page.meta_description_mn || '',
      meta_description_en: page.meta_description_en || '',
      image_url: page.image_url || '',
      title_color: page.title_color || '#1F2937',
      title_size: page.title_size || 28,
      title_weight: page.title_weight || '600',
      title_family: page.title_family || 'Inter, system-ui, -apple-system, sans-serif',
      content_color: page.content_color || '#374151',
      content_size: page.content_size || 16,
      content_weight: page.content_weight || '400',
      content_family: page.content_family || 'Inter, system-ui, -apple-system, sans-serif',
      is_published: page.is_published,
    });
    setIsEditing(true);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ хуудсыг устгахдаа итгэлтэй байна уу?')) return;

    try {
      await mockPagesService.deletePage(id);
      await loadPages();
      alert('Хуудас устгагдлаа!');
    } catch (error) {
      console.error('Failed to delete page:', error);
      alert('Устгахад алдаа гарлаа');
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title_mn: '',
      title_en: '',
      content_mn: '',
      content_en: '',
      meta_description_mn: '',
      meta_description_en: '',
      image_url: '',
      title_color: '#1F2937',
      title_size: 28,
      title_weight: '600',
      title_family: 'Inter, system-ui, -apple-system, sans-serif',
      content_color: '#374151',
      content_size: 16,
      content_weight: '400',
      content_family: 'Inter, system-ui, -apple-system, sans-serif',
      is_published: true,
    });
    setEditingPage(null);
    setIsEditing(false);
  };

  const handlePreview = () => {
    setPreviewData({
      id: editingPage?.id || 'preview',
      slug: formData.slug,
      title_mn: formData.title_mn,
      title_en: formData.title_en,
      content_mn: formData.content_mn,
      content_en: formData.content_en,
      meta_description_mn: formData.meta_description_mn,
      meta_description_en: formData.meta_description_en,
      image_url: formData.image_url,
      title_color: formData.title_color,
      title_size: formData.title_size,
      title_weight: formData.title_weight,
      title_family: formData.title_family,
      content_color: formData.content_color,
      content_size: formData.content_size,
      content_weight: formData.content_weight,
      content_family: formData.content_family,
      is_published: formData.is_published,
      created_at: editingPage?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setShowPreview(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Хуулагдлаа!');
  };

  return (
    <AdminLayout title="Хуудас удирдах">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Хуудас удирдах</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Нийт хуудас</div>
            <div className="text-3xl font-bold text-gray-900">{pages.length}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Нийтлэгдсэн</div>
            <div className="text-3xl font-bold text-gray-900">{pages.filter(p => p.is_published).length}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Ноорог</div>
            <div className="text-3xl font-bold text-gray-900">{pages.filter(p => !p.is_published).length}</div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  {isEditing && (
                    <div className="p-2 rounded-lg bg-amber-100">
                      <PencilIcon className="h-5 w-5 text-amber-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isEditing ? 'Хуудас засварлах' : ''}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isEditing ? `"${editingPage?.title_mn}" хуудсыг засварлаж байна` : ''}
                  </p>
                </div>
              </div>
              {isEditing && (
                <Button onClick={resetForm} variant="secondary" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                  <span>Болих</span>
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* URL Slug Section */}
              <div className="bg-gradient-to-r from-teal-50/50 to-teal-50/30 rounded-xl p-6 border border-teal-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-teal-500" />
                  URL Хаяг (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  required
                  placeholder="example-page"
                  className="w-full px-4 py-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                />
                {formData.slug && (
                  <div className="mt-3 flex items-center gap-3">
                    <code className="flex-1 bg-white text-teal-700 px-4 py-2.5 rounded-lg font-mono text-sm border border-teal-100">
                      /pages/{formData.slug}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${window.location.origin}/pages/${formData.slug}`)}
                      className="p-2.5 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors"
                      title="Хаягийг хуулах"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bilingual Content Fields */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-teal-600" />
                    Контент - Агуулга
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Монгол болон англи хэл дээрх мэдээллийг оруулна уу</p>
                </div>

                <div className="p-6 space-y-8">
                  {/* Titles */}
                  <div className="space-y-4">
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-base">🇲🇳</span>
                        Гарчиг (Монгол)
                      </label>
                      <input
                        type="text"
                        value={formData.title_mn}
                        onChange={(e) => setFormData({ ...formData, title_mn: e.target.value })}
                        required
                        placeholder="Хуудасны гарчиг"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-base">🇺🇸</span>
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        required
                        placeholder="Page title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {/* Title Styling */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-teal-500" />
                      Гарчиг тохиргоо
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Гарчиг өнгө</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={formData.title_color}
                            onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                            className="h-10 w-16 rounded border border-gray-200 bg-white cursor-pointer"
                          />
                          <span className="text-sm text-gray-600">{formData.title_color}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Гарчиг хэмжээ (px)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={18}
                            max={40}
                            step={1}
                            value={formData.title_size}
                            onChange={(e) => setFormData({ ...formData, title_size: Number(e.target.value) })}
                            className="flex-1"
                          />
                          <input
                            type="number"
                            min={18}
                            max={40}
                            value={formData.title_size}
                            onChange={(e) => setFormData({ ...formData, title_size: Number(e.target.value) || 28 })}
                            className="w-20 rounded border border-gray-200 px-2 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-800">Гарчиг фонтын жин</label>
                        <select
                          value={formData.title_weight}
                          onChange={(e) => setFormData({ ...formData, title_weight: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                          value={formData.title_family}
                          onChange={(e) => setFormData({ ...formData, title_family: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                          <span 
                            className="px-3 py-2 rounded border border-gray-200 bg-white text-lg font-semibold"
                            style={{
                              color: formData.title_color || '#1F2937',
                              fontSize: `${Math.min((formData.title_size || 28) + 10, 48)}px`,
                              fontWeight: formData.title_weight || '600',
                              fontFamily: formData.title_family || 'Inter, system-ui, -apple-system, sans-serif'
                            }}
                          >
                            A
                          </span>
                          <span>Өнгө/жин/хэмжээг урьдчилан харах</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, title_family: 'Inter, system-ui, -apple-system, sans-serif' })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Sans
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, title_family: "'Georgia', serif" })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Serif
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, title_family: "'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace" })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Mono
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ 
                              ...formData, 
                              title_color: '#1F2937',
                              title_size: 28,
                              title_weight: '600',
                              title_family: 'Inter, system-ui, -apple-system, sans-serif'
                            })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Анхны утга
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Title Preview */}
                    <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-white">
                      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">Урьдчилан харах</p>
                      <div 
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                        style={{
                          color: formData.title_color || '#1F2937',
                          fontSize: `${formData.title_size || 28}px`,
                          fontWeight: formData.title_weight || '600',
                          fontFamily: formData.title_family || 'Inter, system-ui, -apple-system, sans-serif',
                          lineHeight: '1.3'
                        }}
                      >
                        Энэ бол таны гарчигны жишээ
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-base">🇲🇳</span>
                        Агуулга (Монгол)
                      </label>
                      <textarea
                        value={formData.content_mn}
                        onChange={(e) => setFormData({ ...formData, content_mn: e.target.value })}
                        required
                        rows={8}
                        placeholder="Хуудасны агуулга..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                      />
                    </div>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-base">🇺🇸</span>
                        Content (English)
                      </label>
                      <textarea
                        value={formData.content_en}
                        onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                        required
                        rows={8}
                        placeholder="Page content..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Content Styling */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-amber-500" />
                      Агуулга тохиргоо
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Агуулга өнгө</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={formData.content_color}
                            onChange={(e) => setFormData({ ...formData, content_color: e.target.value })}
                            className="h-10 w-16 rounded border border-gray-200 bg-white cursor-pointer"
                          />
                          <span className="text-sm text-gray-600">{formData.content_color}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">Агуулга хэмжээ (px)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={14}
                            max={28}
                            step={1}
                            value={formData.content_size}
                            onChange={(e) => setFormData({ ...formData, content_size: Number(e.target.value) })}
                            className="flex-1"
                          />
                          <input
                            type="number"
                            min={14}
                            max={28}
                            value={formData.content_size}
                            onChange={(e) => setFormData({ ...formData, content_size: Number(e.target.value) || 16 })}
                            className="w-20 rounded border border-gray-200 px-2 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-800">Агуулга фонтын жин</label>
                        <select
                          value={formData.content_weight}
                          onChange={(e) => setFormData({ ...formData, content_weight: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                          value={formData.content_family}
                          onChange={(e) => setFormData({ ...formData, content_family: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                          <span 
                            className="px-3 py-2 rounded border border-gray-200 bg-white text-lg font-semibold"
                            style={{
                              color: formData.content_color || '#374151',
                              fontSize: `${Math.min((formData.content_size || 16) + 8, 40)}px`,
                              fontWeight: formData.content_weight || '400',
                              fontFamily: formData.content_family || 'Inter, system-ui, -apple-system, sans-serif'
                            }}
                          >
                            A
                          </span>
                          <span>Өнгө/жин/хэмжээг урьдчилан харах</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, content_family: 'Inter, system-ui, -apple-system, sans-serif' })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Sans
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, content_family: "'Georgia', serif" })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Serif
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, content_family: "'Roboto Mono', 'SFMono-Regular', Menlo, Consolas, monospace" })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Mono
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ 
                              ...formData, 
                              content_color: '#374151',
                              content_size: 16,
                              content_weight: '400',
                              content_family: 'Inter, system-ui, -apple-system, sans-serif'
                            })}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                          >
                            Анхны утга
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-white">
                      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">Урьдчилан харах</p>
                      <div 
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50 leading-relaxed"
                        style={{
                          color: formData.content_color || '#374151',
                          fontSize: `${formData.content_size || 16}px`,
                          fontWeight: formData.content_weight || '400',
                          fontFamily: formData.content_family || 'Inter, system-ui, -apple-system, sans-serif'
                        }}
                      >
                        Энэ бол таны агуулгын жишээ текст юм. Үзэглэгч текст өнгө, жин, хэмжээг урьдчилан харах боломжтой.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <PhotoIcon className="h-4 w-4 text-teal-500" />
                  Хуудасны зураг (Feature Image)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-teal-400 transition-colors bg-gray-50/50">
                  {formData.image_url ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Зургийн URL хаяг"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <PhotoIcon className="h-8 w-8 text-teal-500" />
                      </div>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Зургийн URL хаяг оруулах"
                        className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4"
                      />
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <span>эсвэл</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({ ...formData, image_url: event.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-6 py-3 mt-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors cursor-pointer font-medium"
                      >
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        Файл сонгох
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Published Status */}
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  {formData.is_published ? (
                    <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {formData.is_published ? 'Нийтлэгдсэн' : 'Ноорог'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.is_published ? 'Хуудас вэбсайтад харагдаж байна' : 'Хуудас нууцлагдсан байна'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  onClick={handlePreview} 
                  variant="secondary"
                  disabled={!formData.title_mn || !formData.content_mn || saving}
                  className="flex items-center gap-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  Урьдчилан үзэх
                </Button>
                <div className="flex gap-3">
                  {isEditing && (
                    <Button onClick={resetForm} variant="secondary" type="button" disabled={saving}>
                      Болих
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    disabled={saving}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Хадгалж байна...
                      </div>
                    ) : isEditing ? (
                      <>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Хадгалах
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Үүсгэх
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Modal - Popup хэлбэрээр */}
        <Modal
          isOpen={showPreview && previewData !== null}
          onClose={() => setShowPreview(false)}
          title="Хуудас урьдчилан үзэх"
          size="xl"
        >
          {previewData && (
            <div className="space-y-6">
              {/* URL Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm">
                  <LinkIcon className="h-4 w-4" />
                  /pages/{previewData.slug}
                </div>
              </div>

              {/* Feature Image */}
              {previewData.image_url && (
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={previewData.image_url}
                    alt={previewData.title_mn}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </div>
              )}

              {/* Mongolian Content Card */}
              <div 
                className="rounded-2xl border border-blue-200 overflow-hidden"
              >
                {/* Mongolian Header */}
                <div className="px-6 py-3 border-b border-blue-100 bg-blue-50">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇲🇳</span>
                    <span className="text-sm font-semibold text-gray-700">Монгол</span>
                  </div>
                </div>
                
                {/* Mongolian Title */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 
                    style={{
                      color: previewData.title_color || '#1F2937',
                      fontSize: `${previewData.title_size || 28}px`,
                      fontWeight: previewData.title_weight || '600',
                      fontFamily: previewData.title_family || 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {previewData.title_mn}
                  </h2>
                </div>

                {/* Mongolian Content Body */}
                <div className="px-6 py-6">
                  <div 
                    className="whitespace-pre-wrap leading-relaxed"
                    style={{
                      color: previewData.content_color || '#374151',
                      fontSize: `${previewData.content_size || 16}px`,
                      fontWeight: previewData.content_weight || '400',
                      fontFamily: previewData.content_family || 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {previewData.content_mn}
                  </div>
                </div>
              </div>

              {/* English Content Card */}
              <div 
                className="rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* English Header */}
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇺🇸</span>
                    <span className="text-sm font-semibold text-gray-700">English</span>
                  </div>
                </div>
                
                {/* English Title */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 
                    style={{
                      color: previewData.title_color || '#1F2937',
                      fontSize: `${previewData.title_size || 28}px`,
                      fontWeight: previewData.title_weight || '600',
                      fontFamily: previewData.title_family || 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {previewData.title_en}
                  </h2>
                </div>

                {/* English Content Body */}
                <div className="px-6 py-6">
                  <div 
                    className="whitespace-pre-wrap leading-relaxed"
                    style={{
                      color: previewData.content_color || '#374151',
                      fontSize: `${previewData.content_size || 16}px`,
                      fontWeight: previewData.content_weight || '400',
                      fontFamily: previewData.content_family || 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {previewData.content_en}
                  </div>
                </div>

                {/* Footer with Date and Status */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {new Date(previewData.updated_at).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      previewData.is_published 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {previewData.is_published ? 'Нийтлэгдсэн' : 'Ноорог'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Хаах
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Pages List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div 
            className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowPagesList(!showPagesList)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-teal-100 rounded-xl">
                  <DocumentTextIcon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Бүх хуудсууд</h2>
                  <p className="text-sm text-gray-500">
                    {loading ? 'Уншиж байна...' : `${pages.length} хуудас үүссэн`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    {pages.filter(p => p.is_published).length} нийтлэгдсэн
                  </span>
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                    {pages.filter(p => !p.is_published).length} ноорог
                  </span>
                </div>
                <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  title={showPagesList ? 'Хураах' : 'Дэлгэх'}
                >
                  {showPagesList ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {showPagesList && (
          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-teal-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-teal-600">Хуудсуудыг уншиж байна...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="group border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 flex gap-4">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {page.image_url ? (
                            <img
                              src={page.image_url}
                              alt={page.title_mn}
                              className="w-20 h-20 rounded-xl object-cover shadow-sm"
                            />
                          ) : (
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                              page.is_published ? 'bg-gradient-to-br from-emerald-100 to-emerald-50' : 'bg-gradient-to-br from-amber-100 to-amber-50'
                            }`}>
                              <DocumentTextIcon className={`h-8 w-8 ${
                                page.is_published ? 'text-emerald-500' : 'text-amber-500'
                              }`} />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                              {page.title_mn}
                            </h3>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              page.is_published 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {page.is_published ? 'НИЙТЛЭГДСЭН' : 'НООРОГ'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{page.title_en}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/pages/${page.slug}`)}
                              className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                              /pages/{page.slug}
                            </button>
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {new Date(page.created_at).toLocaleDateString('mn-MN')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                            {page.content_mn}
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setPreviewData(page); setShowPreview(true); }}
                          className="p-2.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
                          title="Урьдчилан үзэх"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(page)}
                          className="p-2.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
                          title="Засах"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Устгах"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && pages.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <DocumentTextIcon className="h-10 w-10 text-teal-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Хуудас байхгүй байна
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Эхний хуудсаа үүсгээд эхэлцгээе!
                    </p>
                    <Button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Шинэ хуудас үүсгэх
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}