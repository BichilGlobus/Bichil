'use client'

import { useState } from 'react'

export default function CalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<string>('10000000')
  const [interestRate, setInterestRate] = useState<string>('2.0')
  const [loanTerm, setLoanTerm] = useState<string>('12')
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const monthlyRate = parseFloat(interestRate) / 100
    const months = parseInt(loanTerm)

    if (
      isNaN(principal) ||
      isNaN(monthlyRate) ||
      isNaN(months) ||
      principal <= 0 ||
      months <= 0
    ) {
      alert('Та бүх талбарыг зөв бөглөнө үү')
      return
    }

    const interest = principal * monthlyRate * months
    const total = principal + interest
    const monthly = total / months

    setMonthlyPayment(monthly)
    setTotalPayment(total)
    setTotalInterest(interest)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('mn-MN').format(Math.round(num))
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-slate-900">
            Зээлийн тооцоолуур
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Зээлийн сарын төлбөр, нийт хүүг энгийн байдлаар тооцоолно.
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-slate-900 mb-6">
                Мэдээлэл оруулах
              </h2>

              {/* Loan Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Зээлийн дүн (₮)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatNumber(parseFloat(loanAmount))}
                    onChange={(e) =>
                      setLoanAmount(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="10,000,000"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                    ₮
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="1000000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="mt-3 w-full accent-teal-600"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>₮1M</span>
                  <span>₮100M</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Сарын хүү (%)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      if (value.split('.').length <= 2) setInterestRate(value)
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="2.0"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="mt-3 w-full accent-teal-600"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>0.5%</span>
                  <span>5.0%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Зээлийн хугацаа (сар)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loanTerm}
                    onChange={(e) =>
                      setLoanTerm(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="12"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                    сар
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="3"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="mt-3 w-full accent-teal-600"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>3 сар</span>
                  <span>60 сар</span>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateLoan}
                className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
              >
                Тооцоолох
              </button>
            </div>
          </div>

          {/* Results - Sticky Sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-slate-900 mb-6">
                Үр дүн
              </h2>

              {monthlyPayment !== null ? (
                <div className="space-y-5">
                  {/* Monthly Payment - Always Scanning */}
                  <div className="relative rounded-lg overflow-hidden border border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 p-4">
                    {/* Animated scanning line - Always visible */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 w-2 h-full bg-gradient-to-b from-transparent via-teal-400 to-transparent animate-scan-line shadow-[0_0_20px_rgba(45,212,191,0.8)]"></div>
                    </div>
                    
                    {/* Glow effect - Always visible with pulse */}
                    <div className="absolute inset-0 opacity-20 animate-pulse pointer-events-none">
                      <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-teal-300 to-transparent blur-xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-xs font-medium text-teal-700 mb-1">
                        Сарын төлбөр
                      </p>
                      <div className="text-2xl font-semibold text-teal-900">
                        ₮{formatNumber(monthlyPayment)}
                      </div>
                      <p className="mt-1 text-xs text-teal-700">/ сар</p>
                    </div>
                  </div>

                  {/* Total Payment - Always Scanning */}
                  <div className="relative rounded-lg overflow-hidden border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    {/* Animated scanning line - Always visible */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 w-2 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-scan-line shadow-[0_0_20px_rgba(96,165,250,0.8)]"></div>
                    </div>
                    
                    {/* Glow effect - Always visible with pulse */}
                    <div className="absolute inset-0 opacity-20 animate-pulse pointer-events-none">
                      <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-300 to-transparent blur-xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-xs font-medium text-blue-700 mb-1">
                        Нийт төлөх дүн
                      </p>
                      <div className="text-xl font-semibold text-blue-900">
                        ₮{formatNumber(totalPayment!)}
                      </div>
                    </div>
                  </div>

                  {/* Total Interest - Always Scanning */}
                  <div className="relative rounded-lg overflow-hidden border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                    {/* Animated scanning line - Always visible */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 w-2 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-scan-line shadow-[0_0_20px_rgba(192,132,252,0.8)]"></div>
                    </div>
                    
                    {/* Glow effect - Always visible with pulse */}
                    <div className="absolute inset-0 opacity-20 animate-pulse pointer-events-none">
                      <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-purple-300 to-transparent blur-xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        Нийт хүү
                      </p>
                      <div className="text-xl font-semibold text-purple-900">
                        ₮{formatNumber(totalInterest!)}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Үндсэн зээл</span>
                      <span className="font-medium text-slate-900">
                        ₮{formatNumber(parseFloat(loanAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Хугацаа</span>
                      <span className="font-medium text-slate-900">
                        {loanTerm} сар
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Сарын хүү</span>
                      <span className="font-medium text-slate-900">
                        {interestRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2 py-8 text-sm text-slate-500">
                  <p>Энд тооцооллын үр дүн харагдана.</p>
                  <p>Зээлийн мэдээллээ оруулаад "Тооцоолох" товчийг дарна уу.</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <p className="font-medium mb-1">Анхааруулга</p>
          <p>
            Энэхүү тооцоолуур нь зөвхөн мэдээллийн зорилготой бөгөөд бодит зээлийн
            нөхцөл өөр байж болно.
          </p>
        </div>

        {/* Product Links */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Бүтээгдэхүүн дотор тооцоолуур ашиглах
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Car Loans */}
            <a
              href="/products/car-loan/collateral"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-sm">Автомашин барьцаалсан</p>
                  <p className="text-xs text-slate-500">Зогсоол / Унах машин</p>
                </div>
              </div>
            </a>

            <a
              href="/products/car-loan/purchase"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-sm">Автомашин авах</p>
                  <p className="text-xs text-slate-500">Лизингийн зээл</p>
                </div>
              </div>
            </a>

            {/* Real Estate */}
            <a
              href="/products/real-estate/apartment"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 14v3m4-3v3m4-3v3M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-sm">Орон сууц барьцаалсан</p>
                  <p className="text-xs text-slate-500">100 сая хүртэл</p>
                </div>
              </div>
            </a>

            <a
              href="/products/real-estate/fence"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-sm">Хашаа байшин барьцаалсан</p>
                  <p className="text-xs text-slate-500">80 сая хүртэл</p>
                </div>
              </div>
            </a>

            <a
              href="/products/real-estate/land"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-sm">Газар, гараж барьцаалсан</p>
                  <p className="text-xs text-slate-500">80 сая хүртэл</p>
                </div>
              </div>
            </a>

            <a
              href="/products/phone-number"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-sm">Дугаар барьцаалсан</p>
                  <p className="text-xs text-slate-500">8811 / 9911</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
