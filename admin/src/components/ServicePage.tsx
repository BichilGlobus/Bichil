'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface ServiceData {
  name_mn: string
  name_en: string
  category_mn: string
  category_en: string
  description_mn: string
  description_en: string
  stats: {
    interest?: string
    decision?: string
    term?: string
  }
  details: {
    amount?: string
    fee?: string
    interest?: string
    term?: string
    decision?: string
  }
  materials: string[]
  collateral?: string[]
  conditions?: string[]
}

interface ServicePageProps {
  data: ServiceData
}

export default function ServicePage({ data }: ServicePageProps) {
  const { language, t } = useLanguage()

  const name = language === 'mn' ? data.name_mn : data.name_en
  const category = language === 'mn' ? data.category_mn : data.category_en
  const description = language === 'mn' ? data.description_mn : data.description_en

  const stats = [
    data.stats.interest && { value: data.stats.interest, label: t('Хүү', 'Interest Rate') },
    data.stats.decision && { value: data.stats.decision, label: t('Шийдвэр', 'Decision') },
    data.stats.term && { value: data.stats.term, label: t('Хугацаа', 'Term') },
  ].filter(Boolean) as { value: string; label: string }[]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-slate-200/40 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-24 relative z-10">
        {/* Hero Section */}
        <header className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            {name}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>

          <p className="mt-6 text-sm text-slate-500 max-w-2xl mx-auto">
            {t(
              'Энэхүү үйлчилгээ нь танд шаардлагатай бичиг баримт, нөхцөлүүдийг ойлгомжтойгоор танилцуулна.',
              'This service outlines the requirements and conditions you need to know.'
            )}
          </p>

          {/* Stats Cards */}
          {stats.length > 0 && (
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center shadow-none"
                >
                  <p className="text-base font-semibold text-teal-600 mb-1">{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Main content - Single column, no calculator */}
        <div className="max-w-6xl mx-auto">
          <section className="space-y-8">
            <div className="relative bg-white rounded-[32px] p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100">
              {/* Materials */}
              <div className="mb-14">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  {t('Шаардагдах материал', 'Required Documents')}
                </h3>
                <ul className="space-y-4">
                  {data.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                      <svg className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Combined Conditions (Collateral + Conditions) */}
              {((data.collateral && data.collateral.length > 0) || (data.conditions && data.conditions.length > 0)) && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    {t('Нөхцөл', 'Conditions')}
                  </h3>
                  <ul className="space-y-4">
                    {data.collateral && data.collateral.map((c, i) => (
                      <li key={`collateral-${i}`} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                        <svg className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{c}</span>
                      </li>
                    ))}
                    {data.conditions && data.conditions.map((c, i) => (
                      <li key={`condition-${i}`} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                        <svg className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer disclaimer */}
            <div className="mt-20 text-center">
              <div className="inline-block px-6 py-3 rounded-full bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-500">
                  {t(
                    'Манай үйлчилгээ нь Монгол Улсын холбогдох хууль, журамд нийцсэн.',
                    'Our services comply with applicable laws and regulations.'
                  )}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
