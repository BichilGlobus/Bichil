'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/AdminLayout'
import { Input, PageHeader } from '@/components/FormElements'
import ImageUpload from '@/components/ImageUpload'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

type LogoType = 'upload' | 'url' | 'svg'

interface LogoImage {
  type: LogoType
  value: string
}

type SocialType = 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'youtube' | 'telegram'

interface SocialLink {
  type: SocialType
  url: string
}

interface FooterData {
  logoText: string
  logoImage: LogoImage
  description: { mn: string; en: string }
  address: { mn: string; en: string }
  email: string
  phone: string
  socials: SocialLink[]
  copyright: { mn: string; en: string }
  // Styling options
  bgColor: string
  textColor: string
  accentColor: string
  titleSize: string
  textSize: string
  iconColor: string
}

const defaultData: FooterData = {
  logoText: 'BichilGlobus',
  logoImage: { type: 'upload', value: '' },
  description: {
    mn: 'Таны бизнесийг дэлхийд холбох финтек шийдлүүд. Бид хурдан, найдвартай, ил тод үйлчилгээг эрхэмлэнэ.',
    en: 'Fintech solutions connecting your business to the world. We prioritize fast, reliable, and transparent service.'
  },
  address: {
    mn: 'Улаанбаатар хот',
    en: 'Ulaanbaatar City'
  },
  email: 'info@bichilglobus.mn',
  phone: '+976 9999-9999',
  socials: [
    { type: 'facebook', url: 'https://facebook.com' },
    { type: 'instagram', url: 'https://instagram.com' },
    { type: 'twitter', url: 'https://twitter.com' }
  ],
  copyright: {
    mn: 'Бүх эрх хуулиар хамгаалагдсан.',
    en: 'All rights reserved.'
  },
  // Default styling
  bgColor: '#ffffff',
  textColor: '#4b5563',
  accentColor: '#14b8a6',
  titleSize: 'text-base',
  textSize: 'text-sm',
  iconColor: '#14b8a6'
}

// Helper function to get social icon
const getSocialIcon = (type: SocialType) => {
  const icons: Record<SocialType, string> = {
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    instagram: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
    twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    tiktok: 'M19.498 3.75V8.448m-4.62-3.468A4.5 4.5 0 1011.877 19m11.621-13.423V19.5m0 0a4.5 4.5 0 11-9 0',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    telegram: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.332-.373-.119l-6.869 4.332-2.993-.937c-.651-.213-.666-.651.136-.968l11.707-4.514c.55-.213 1.028.145.848.957z'
  }
  return icons[type] || ''
}

export default function FooterPage() {
  const { data, setData, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<FooterData>('footerConfig', defaultData)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lang, _setLang] = useState<'mn' | 'en'>('mn')

  return (
    <AdminLayout title="Footer">
      <div className="max-w-4xl mx-auto">
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
          title="Footer удирдлага"
          description="Веб сайтын доод хэсгийн мэдээлэл"
          action={
            <SaveResetButtons 
              onSave={saveData}
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
                Preview
              </span>
            </div>
          </div>
          <div className="p-4">
            <footer className="text-white rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: data.bgColor }}>
              <div className="px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Column 1 - About */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {data.logoImage.value ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          {data.logoImage.type === 'svg' && data.logoImage.value.startsWith('<svg') ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: data.logoImage.value }}
                              className="w-10 h-10 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                            />
                          ) : data.logoImage.type === 'url' && data.logoImage.value.endsWith('.svg') ? (
                            <object
                              data={data.logoImage.value}
                              type="image/svg+xml"
                              className="w-10 h-10"
                              aria-label="Logo"
                            />
                          ) : (
                            <Image
                              src={data.logoImage.value}
                              alt="Logo"
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ background: `linear-gradient(to bottom right, ${data.accentColor}, ${data.accentColor}dd)` }}>
                          BG
                        </div>
                      )}
                      <span className={`${data.titleSize} font-bold text-white`}>{data.logoText}</span>
                    </div>
                    <p className={`${data.textSize} leading-relaxed`} style={{ color: data.textColor }}>
                      {data.description[lang]}
                    </p>
                  </div>

                  {/* Column 2 - Contact */}
                  <div>
                    <h4 className={`${data.titleSize} font-semibold mb-4 text-white`}>
                      {lang === 'mn' ? 'Холбоо барих' : 'Contact Us'}
                    </h4>
                    <div className={`space-y-3 ${data.textSize}`} style={{ color: data.textColor }}>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: data.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{data.address[lang]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: data.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{data.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: data.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{data.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 - Social */}
                  <div>
                    <h4 className={`${data.titleSize} font-semibold mb-4 text-white`}>
                      {lang === 'mn' ? 'Биднийг дагах' : 'Follow Us'}
                    </h4>
                    <div className="flex gap-3">
                      {data.socials.map((social) => (
                        <a 
                          key={social.type}
                          href={social.url} 
                          className="w-10 h-10 rounded-full bg-gray-800 hover:opacity-80 flex items-center justify-center transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d={getSocialIcon(social.type)} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t px-8 py-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className={data.textSize} style={{ color: data.textColor }}>
                    © {new Date().getFullYear()} {data.logoText}. {data.copyright[lang]}
                  </p>
                  <div className={`flex gap-6 ${data.textSize}`} style={{ color: data.textColor }}>
                    <a href="#" className="transition-colors hover:opacity-80">
                      {lang === 'mn' ? 'Нууцлал' : 'Privacy'}
                    </a>
                    <a href="#" className="transition-colors hover:opacity-80">
                      {lang === 'mn' ? 'Үйлчилгээний нөхцөл' : 'Terms of Service'}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Үндсэн мэдээлэл */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Үндсэн мэдээлэл
              </h3>
            </div>
            <div className="space-y-4">
              <Input
                label="Лого текст"
                value={data.logoText}
                onChange={(e) => setData({ ...data, logoText: e.target.value })}
                placeholder="BichilGlobus"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
             
                </label>
                <ImageUpload
                  value={data.logoImage.type === 'upload' ? data.logoImage.value : ''}
                  onChange={(url) => setData({ ...data, logoImage: { type: 'upload', value: url } })}
                  label="Лого зураг нэмэх"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  URL оруулах
                </label>
                <div className="relative group">
                  <input
                    type="url"
                    value={data.logoImage.type === 'url' ? data.logoImage.value : ''}
                    onChange={(e) => setData({ ...data, logoImage: { type: 'url', value: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all placeholder:text-slate-400 hover:border-teal-300"
                    placeholder="https://example.com/logo.svg"
                  />
                  {data.logoImage.type === 'url' && data.logoImage.value && (
                    <button
                      onClick={() => setData({ ...data, logoImage: { type: 'url', value: '' } })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title="Цэвэрлэх"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                  <span>JPG, PNG, SVG форматыг дэмжинэ. Жишээ: https://cdn.example.com/logo.svg</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
                  </svg>
                  SVG код оруулах
                </label>
                <div className="relative group">
                  <textarea
                    value={data.logoImage.type === 'svg' ? data.logoImage.value : ''}
                    onChange={(e) => setData({ ...data, logoImage: { type: 'svg', value: e.target.value } })}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-mono resize-none transition-all placeholder:text-slate-400 hover:border-teal-300"
                    placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="blue"/>\n</svg>'}
                  />
                  {data.logoImage.type === 'svg' && data.logoImage.value && (
                    <button
                      onClick={() => setData({ ...data, logoImage: { type: 'svg', value: '' } })}
                      className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title="Цэвэрлэх"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/></svg>
                  <span>SVG кодыг Figma, Illustrator эсвэл текст редактороос хуулаж оруулна</span>
                </p>
              </div>
              {data.logoImage.value && (
                <div className="rounded-lg border border-slate-300 p-3 bg-slate-50">
                  <div className="text-xs text-slate-600 mb-2">Лого урьдчилан харах:</div>
                  <div className="flex items-center justify-center bg-white rounded p-4 border border-slate-200">
                    {data.logoImage.type === 'svg' && data.logoImage.value.startsWith('<svg') ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: data.logoImage.value }}
                        className="h-12 w-12 flex items-center justify-center"
                      />
                    ) : data.logoImage.type === 'url' && data.logoImage.value.endsWith('.svg') ? (
                      <object
                        data={data.logoImage.value}
                        type="image/svg+xml"
                        className="h-12 w-12"
                        aria-label="Logo SVG"
                      />
                    ) : (
                      <Image
                        src={data.logoImage.value}
                        alt="Logo preview"
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                      />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 break-all">{data.logoImage.value.substring(0, 100)}{data.logoImage.value.length > 100 ? '...' : ''}</div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Тайлбар (Монгол)
                </label>
                <textarea
                  value={data.description.mn}
                  onChange={(e) => setData({ 
                    ...data, 
                    description: { ...data.description, mn: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
                  placeholder="Компанийн тухай богино тайлбар..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={data.description.en}
                  onChange={(e) => setData({ 
                    ...data, 
                    description: { ...data.description, en: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
                  placeholder="Brief company description..."
                />
              </div>
            </div>
          </div>

          {/* Холбоо барих */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Холбоо барих
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Хаяг (Монгол)
                </label>
                <input
                  type="text"
                  value={data.address.mn}
                  onChange={(e) => setData({ 
                    ...data, 
                    address: { ...data.address, mn: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="Улаанбаатар хот, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address (English)
                </label>
                <input
                  type="text"
                  value={data.address.en}
                  onChange={(e) => setData({ 
                    ...data, 
                    address: { ...data.address, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="Ulaanbaatar City, ..."
                />
              </div>
              <Input
                label="И-мэйл"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="info@example.com"
              />
              <Input
                label="Утас"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="+976 9999-9999"
              />
            </div>
          </div>

          {/* Нийгмийн сүлжээ */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Нийгмийн сүлжээ</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{data.socials.length} / 7 холбоос</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                {7 - data.socials.length} боломжтой
              </div>
            </div>

            {/* Socials List - Enhanced */}
            {data.socials.length === 0 ? (
              <div className="mb-6">
                <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-dashed border-slate-300">
                  <div className="mb-3 flex justify-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Нийгмийн сүлжээний холбоос байхгүй</p>
                  <p className="text-xs text-slate-500">Доор нэмэх товчлуур дарж эхлээрэй</p>
                </div>
              </div>
            ) : (
              <div className="mb-6 space-y-2.5">
                {data.socials.map((social, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all duration-200"
                  >
                    {/* Drag Handle */}
                    <div className="flex-shrink-0 flex flex-col gap-0.5 cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-current" />
                      ))}
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d={getSocialIcon(social.type)} />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{social.type.charAt(0).toUpperCase() + social.type.slice(1)}</p>
                      <p className="text-xs text-slate-500 truncate">{social.url || 'URL байхгүй'}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          const newUrl = prompt(
                            `${social.type.charAt(0).toUpperCase() + social.type.slice(1)} холбоос оруулах\n\nЖишээ:\nFacebook: https://facebook.com/yourpage\nInstagram: https://instagram.com/yourprofile`,
                            social.url
                          )
                          if (newUrl !== null) {
                            if (newUrl.trim() === '') {
                              alert(' URL хоосон байж болохгүй')
                              return
                            }
                            if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                              const shouldAdd = confirm(' URL https:// эсвэл http:// үгүүтэй байна.\n\n✓ https:// нэмэх үү?')
                              if (shouldAdd) {
                                const fixedUrl = 'https://' + newUrl
                                const newSocials = [...data.socials]
                                newSocials[index].url = fixedUrl
                                setData({ ...data, socials: newSocials })
                              }
                              return
                            }
                            const newSocials = [...data.socials]
                            newSocials[index].url = newUrl
                            setData({ ...data, socials: newSocials })
                          }
                        }}
                        className="p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors hover:shadow-sm"
                        title="Засах"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Move Up */}
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const newSocials: SocialLink[] = JSON.parse(JSON.stringify(data.socials))
                            const temp = newSocials[index]
                            newSocials[index] = newSocials[index - 1]
                            newSocials[index - 1] = temp
                            setData({ ...data, socials: newSocials })
                          }}
                          className="p-2 text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                          title="Дээшлүүлэх"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Move Down */}
                      {index < data.socials.length - 1 && (
                        <button
                          onClick={() => {
                            const newSocials: SocialLink[] = JSON.parse(JSON.stringify(data.socials))
                            const temp = newSocials[index]
                            newSocials[index] = newSocials[index + 1]
                            newSocials[index + 1] = temp
                            setData({ ...data, socials: newSocials })
                          }}
                          className="p-2 text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                          title="Доошлуулах"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-7-7m7 7l7-7" />
                          </svg>
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          const isConfirmed = confirm(
                            `❌ ${social.type.charAt(0).toUpperCase() + social.type.slice(1)} устгах уу?\n\n${social.url}\n\nЭнэ үйлдэлийг буцаах боломжгүй`
                          )
                          if (isConfirmed) {
                            setData({
                              ...data,
                              socials: data.socials.filter((_, i) => i !== index)
                            })
                          }
                        }}
                        className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors hover:shadow-sm"
                        title="Устгах"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Social - Quick Card */}
            {data.socials.length < 7 && (
              <div className="mb-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-300 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    +
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Нийгмийн сүлжээ нэмэх</h4>
                  <span className="ml-auto text-xs text-teal-600 font-medium bg-teal-100 px-2 py-1 rounded-full">{7 - data.socials.length} үлдсэн</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {(['facebook', 'instagram', 'twitter', 'tiktok', 'linkedin', 'youtube', 'telegram'] as const).map(type => {
                    const isAdded = data.socials.some(s => s.type === type)
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          if (!isAdded) {
                            const exampleUrls: Record<typeof type, string> = {
                              facebook: 'https://facebook.com/yourpage',
                              instagram: 'https://instagram.com/yourprofile',
                              twitter: 'https://twitter.com/yourprofile',
                              tiktok: 'https://tiktok.com/@yourprofile',
                              linkedin: 'https://linkedin.com/company/yourcompany',
                              youtube: 'https://youtube.com/c/yourchannelname',
                              telegram: 'https://t.me/yourchannel'
                            }
                            const url = prompt(
                              `${type.charAt(0).toUpperCase() + type.slice(1)} URL оруулах\n\nЖишээ: ${exampleUrls[type]}`
                            )
                            if (url) {
                              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                const fixedUrl = 'https://' + url
                                setData({
                                  ...data,
                                  socials: [...data.socials, { type, url: fixedUrl }]
                                })
                              } else {
                                setData({
                                  ...data,
                                  socials: [...data.socials, { type, url }]
                                })
                              }
                            }
                          }
                        }}
                        disabled={isAdded}
                        className={`p-3 rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                            : 'bg-white hover:bg-teal-100 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md'
                        }`}
                        title={isAdded ? 'Аль хэдийн нэмсэн' : `${type} нэмэх`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d={getSocialIcon(type)} />
                        </svg>
                        <span className="text-xs font-medium truncate">{type}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-blue-700">
                  <p className="font-semibold mb-1">Заавар:</p>
                  <ul className="space-y-0.5 ml-2">
                    <li>• Иконыг дээр дарж URL шууд оруулна</li>
                    <li>• Дээшлүүлэх/доошлуулах товчоор дараалал өөрчилнө</li>
                    <li>• Устгахаас өмнө баталгаа авна</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Өнгө болон харагдах байдал */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Өнгө & Үсэг
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Арын өнгө
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.bgColor}
                    onChange={(e) => setData({ ...data, bgColor: e.target.value })}
                    className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.bgColor}
                    onChange={(e) => setData({ ...data, bgColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    placeholder="#111827"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Текстийн өнгө
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.textColor}
                    onChange={(e) => setData({ ...data, textColor: e.target.value })}
                    className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.textColor}
                    onChange={(e) => setData({ ...data, textColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    placeholder="#9ca3af"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Онцлох өнгө
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.accentColor}
                    onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                    className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.accentColor}
                    onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    placeholder="#14b8a6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Иконы өнгө
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.iconColor}
                    onChange={(e) => setData({ ...data, iconColor: e.target.value })}
                    className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.iconColor}
                    onChange={(e) => setData({ ...data, iconColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    placeholder="#14b8a6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Гарчгийн хэмжээ
                </label>
                <select
                  value={data.titleSize}
                  onChange={(e) => setData({ ...data, titleSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                  <option value="text-xl">XL</option>
                  <option value="text-2xl">2XL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Текстийн хэмжээ
                </label>
                <select
                  value={data.textSize}
                  onChange={(e) => setData({ ...data, textSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="text-xs">XSmall</option>
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Copyright</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Copyright текст (Монгол)
                </label>
                <input
                  type="text"
                  value={data.copyright.mn}
                  onChange={(e) => setData({ 
                    ...data, 
                    copyright: { ...data.copyright, mn: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="Бүх эрх хуулиар хамгаалагдсан."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Copyright Text (English)
                </label>
                <input
                  type="text"
                  value={data.copyright.en}
                  onChange={(e) => setData({ 
                    ...data, 
                    copyright: { ...data.copyright, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="All rights reserved."
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500">
                 {lang === 'mn' 
                  ? `Жилийн дугаар автоматаар харагдана: © ${new Date().getFullYear()}` 
                  : `Year is automatically displayed: © ${new Date().getFullYear()}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Helper Section */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                {lang === 'mn' ? 'Хэрэглэгчийн заавар' : 'User Guide'}
              </h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• {lang === 'mn' 
                  ? 'Footer нь веб сайтын бүх хуудсанд харагдана' 
                  : 'Footer is displayed on all website pages'}
                </li>
                <li>• {lang === 'mn' 
                  ? 'Нийгмийн сүлжээний холбоос бүрэн URL хэлбэрээр оруулна' 
                  : 'Enter social media links in full URL format'}
                </li>
                <li>• {lang === 'mn' 
                  ? 'Лого текст болон тайлбар нь брэнд identity-д ашиглагдана' 
                  : 'Logo text and description are used in brand identity'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
