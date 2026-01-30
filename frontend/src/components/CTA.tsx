'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/config/axiosConfig'

interface Translation {
  id: number
  language: number
  label: string
}

interface SlideData {
  id: number
  file: string 
  file_url: string 
  index: number
  font: string
  color: string
  number: string
  titles: Translation[]
  subtitles: Translation[]
}

export default function AccordionSlider() {
  const [active, setActive] = useState<number>(-1)
  const [hoveredSlide, setHoveredSlide] = useState<number>(-1)
  const [isMobile, setIsMobile] = useState(false)
  const [slidesData, setSlidesData] = useState<SlideData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axiosInstance.get('/CTA/') 
        if (response && response.status === 200) {
          const sortedSlides = response.data.sort((a: SlideData, b: SlideData) => a.index - b.index)
          setSlidesData(sortedSlides)
        }
      } catch (err) {
        console.error('Error fetching CTA slides:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  const getTranslation = (translations: Translation[]) => {
    const langId = language === 'mn' ? 2 : 1
    const translation = translations.find(t => t.language === langId)
    return translation?.label || translations[0]?.label || ''
  }

  const getSubtitles = (subtitles: Translation[]) => {
    const langId = language === 'mn' ? 2 : 1
    return subtitles.filter(sub => sub.language === langId)
  }

  const getImageUrl = (slide: SlideData): string => {
    if (slide.file_url) {
      if (slide.file_url.startsWith('/')) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
        return `${baseURL}${slide.file_url}`
      }
      return slide.file_url
    }
    
    if (slide.file) {
      if (slide.file.startsWith('http')) {
        return slide.file
      }
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
      return `${baseURL}/${slide.file}`
    }
    
    return '' // No image
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const setActiveSlide = (i: number) => {
    if (isMobile) {
      setActive(i)
    } else {
      setActive((prev) => (prev === i ? -1 : i))
    }
  }

  const handleSlideClick = (i: number, e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setActiveSlide(i)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previousSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, slidesData.length])

  const nextSlide = () => {
    setActive((prev) => {
      if (prev === -1) return 0
      return (prev + 1) % slidesData.length
    })
  }

  const previousSlide = () => {
    setActive((prev) => {
      if (prev === -1) return slidesData.length - 1
      return (prev - 1 + slidesData.length) % slidesData.length
    })
  }

  if (loading) {
    return (
      <div className="slider-container">
        <div className="accordion-slider">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="slide-skeleton" />
          ))}
        </div>
        <style jsx>{`
          .slider-container {
            width: 100%;
            max-width: 1200px;
            height: 80vh;
            position: relative;
            overflow: hidden;
            margin: 0 auto;
            padding: 28px 16px 16px;
          }
          .accordion-slider {
            display: flex;
            height: calc(100% - 40px);
            gap: 18px;
          }
          .slide-skeleton {
            flex: 1;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 18px;
          }
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  if (slidesData.length === 0) {
    return null
  }

  return (
    <div className="slider-container">
      <div className="accordion-slider" role="list">
        {slidesData.map((s, i) => {
          const title = getTranslation(s.titles)
          const subtitles = getSubtitles(s.subtitles)
          const imageUrl = getImageUrl(s)
          
          return (
            <div
              key={s.id}
              className={`slide ${isMobile ? (active === i ? 'active' : '') : (hoveredSlide === i ? 'active' : '')}`}
              style={{ 
                backgroundImage: imageUrl ? `url('${imageUrl}')` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundColor: imageUrl ? 'transparent' : '#667eea'
              }}
              onMouseEnter={!isMobile ? () => setHoveredSlide(i) : undefined}
              onMouseLeave={!isMobile ? () => setHoveredSlide(-1) : undefined}
              onClick={(e) => handleSlideClick(i, e)}
              role="listitem"
              aria-expanded={isMobile ? active === i : hoveredSlide === i}
            >
              <div className="slide-content">
                {s.number && s.number !== '0' && (
                  <div className="slide-number">{s.number}</div>
                )}
                
                <div 
                  className="car-brand"
                  style={{ 
                    fontFamily: s.font || 'Arial, sans-serif',
                    color: s.color && s.color !== '#' ? s.color : 'rgba(255,255,255,0.95)'
                  }}
                >
                  {title}
                </div>
                
                {isMobile && active !== i && subtitles.length > 0 && (
                  <div className="tap-hint">
                    {language === 'mn' ? 'Дэлгэрэнгүй харах ▾' : 'Tap to expand ▾'}
                  </div>
                )}
                
                {!isMobile && subtitles.length > 0 && (
                  <div className="slide-details">
                    <ul className="slide-features">
                      {subtitles.map((subtitle) => (
                        <li key={subtitle.id}>{subtitle.label}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isMobile && active === i && subtitles.length > 0 && (
                  <div className="slide-details-mobile">
                    <ul className="slide-features">
                      {subtitles.map((subtitle) => (
                        <li key={subtitle.id}>{subtitle.label}</li>
                      ))}
                    </ul>
                    <button 
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Clicked on slide:', s.id)
                      }}
                    >
                      <span>{language === 'mn' ? 'Дэлгэрэнгүй үзэх' : 'View Details'}</span>
                      <span className="arrow">→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .slider-container {
          width: 100%;
          max-width: 1200px;
          height: 80vh;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          padding: 28px 16px 16px;
        }

        .accordion-slider {
          display: flex;
          height: calc(100% - 40px);
          position: relative;
          gap: 18px;
        }

        .slide {
          flex: 1;
          position: relative;
          cursor: pointer;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: all 0.8s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
          filter: grayscale(0.7) contrast(0.95);
          display: flex;
          align-items: flex-end;
          border-radius: 18px;
          min-width: 140px;
        }

        .slide:hover { filter: grayscale(0.15) contrast(1); transform: scale(1.01); }
        .slide.active { flex: 2.7; filter: grayscale(0) contrast(1.02); transform: scale(1.02); border: 2px solid rgba(159,255,107,0.12); }

        .slide::before {
          content: "";
          position: absolute;
          top: 0; left:0; right:0; bottom:0;
          background: linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.72) 75%);
          transition: all 0.6s ease;
        }

        .slide-content {
          position: absolute;
          bottom: 30px;
          left: 28px;
          right: 28px;
          color: white;
          z-index: 3;
          display: flex;
          flex-direction: column;
        }
        .slide.active .slide-content { bottom: 84px; transition: all 0.8s cubic-bezier(0.4,0,0.2,1) 0.12s; }

        .slide-number {
          font-size: 48px;
          font-weight: 800;
          color: rgba(255,255,255,0.15);
          margin-bottom: -10px;
          line-height: 1;
        }

        .car-brand {
          font-size: 16px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          margin-bottom: 8px;
          position: relative;
          z-index: 10;
        }

        .slide-details {
          margin-top: 6px;
        }
        
        .slide:not(.active) .slide-details {
          display: none;
        }

        .slide-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .slide-features li {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          padding: 4px 0;
          padding-left: 18px;
          position: relative;
          font-weight: 500;
        }

        .slide-features li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #9fff6b;
          font-weight: 700;
          font-size: 14px;
        }

        .tap-hint {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          font-weight: 400;
        }

        .slide-details-mobile {
          margin-top: 12px;
          animation: slideIn 0.3s ease-out;
          display: flex;
          flex-direction: column;
        }

        .view-details-btn {
          margin-top: 20px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.12);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }

        .view-details-btn .arrow {
          color: #9fff6b;
          transition: transform 0.25s ease;
        }

        .view-details-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(159,255,107,0.6);
        }

        .view-details-btn:hover .arrow {
          transform: translateX(4px);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .slider-container { height: 72vh; padding: 20px 12px; }
          .car-brand { font-size: 15px; }
          .slide-number { font-size: 40px; }
        }
        
        @media (max-width: 640px) {
          .slider-container { 
            height: auto; 
            min-height: auto;
            padding: 20px 16px 12px;
          }
          .accordion-slider { 
            flex-direction: column; 
            gap: 12px; 
            height: auto;
          }
          .slide { 
            min-height: 100px; 
            border-radius: 16px;
            flex: none;
            transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
          }
          .slide.active { 
            min-height: 320px;
            flex: none;
            transform: scale(1);
            transition: min-height 0.45s cubic-bezier(0.4,0,0.2,1);
          }
          .slide:hover {
            transform: scale(1);
          }
          .slide-content {
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
          .slide.active .slide-content {
            bottom: 60px;
          }
          .car-brand { 
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.3px;
          }
          .slide-number { 
            font-size: 36px;
            margin-bottom: -8px;
          }
        }
        
        @media (max-width: 380px) {
          .slider-container {
            padding: 16px 12px 10px;
            min-height: auto;
          }
          .slide {
            min-height: 90px;
          }
          .slide.active {
            min-height: 300px;
            transition: min-height 0.45s cubic-bezier(0.4,0,0.2,1);
          }
          .car-brand {
            font-size: 16px;
          }
          .slide-number { 
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  )
}