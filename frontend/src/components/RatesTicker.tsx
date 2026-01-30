'use client'

import { useEffect, useState } from 'react'

interface RateItem {
  symbol: string
  rate: number
  change: number
  type: 'currency' | 'commodity' | 'crypto'
}

export default function RatesTicker() {
  const [rates, setRates] = useState<RateItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/rates')
      const data = await res.json()
      if (data.success) {
        setRates(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    // Refresh rates every 30 seconds
    const interval = setInterval(fetchRates, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatRate = (rate: number, symbol: string) => {
    if (symbol.includes('BTC') || symbol.includes('ETH')) {
      return rate.toLocaleString('en-US', { maximumFractionDigits: 0 })
    }
    if (rate > 10000) {
      return rate.toLocaleString('en-US', { maximumFractionDigits: 0 })
    }
    return rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900 py-2">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-xs">Ханш ачааллаж байна...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 py-2 overflow-hidden">
      <div className="ticker-container">
        <div className="ticker-content">
          {/* Duplicate content for seamless loop */}
          {[...rates, ...rates].map((item, idx) => (
            <div key={idx} className="ticker-item">
              <span className="text-slate-300 font-medium">{item.symbol}</span>
              <span className="text-white font-bold mx-2">{formatRate(item.rate, item.symbol)}</span>
              <span className={`text-xs font-medium ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
              </span>
              <span className="mx-4 text-slate-600">|</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ticker-container {
          position: relative;
          width: 100%;
        }
        
        .ticker-content {
          display: flex;
          animation: ticker 40s linear infinite;
          white-space: nowrap;
        }
        
        .ticker-item {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          padding: 0 4px;
        }
        
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .ticker-container:hover .ticker-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
