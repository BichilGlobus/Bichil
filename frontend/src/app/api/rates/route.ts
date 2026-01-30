import { NextResponse } from 'next/server'

// Mock ханшийн мэдээлэл
const ratesData = [
  { symbol: 'USD/MNT', rate: 3420.50, change: 0.15, type: 'currency' },
  { symbol: 'EUR/MNT', rate: 3680.25, change: -0.22, type: 'currency' },
  { symbol: 'CNY/MNT', rate: 472.80, change: 0.08, type: 'currency' },
  { symbol: 'JPY/MNT', rate: 22.45, change: -0.12, type: 'currency' },
  { symbol: 'RUB/MNT', rate: 34.20, change: 0.35, type: 'currency' },
  { symbol: 'KRW/MNT', rate: 2.48, change: 0.05, type: 'currency' },
  { symbol: 'GBP/MNT', rate: 4320.00, change: -0.18, type: 'currency' },
  { symbol: 'Алт /гр', rate: 285000, change: 1.25, type: 'commodity' },
  { symbol: 'Мөнгө /гр', rate: 3200, change: 0.45, type: 'commodity' },
  { symbol: 'BTC/USD', rate: 97850, change: 2.35, type: 'crypto' },
  { symbol: 'ETH/USD', rate: 3650, change: 1.85, type: 'crypto' },
]

export async function GET() {
  // Simulate slight random fluctuation
  const rates = ratesData.map(item => ({
    ...item,
    rate: item.rate * (1 + (Math.random() - 0.5) * 0.001), // ±0.05% random change
    change: item.change + (Math.random() - 0.5) * 0.1, // slight change variation
    updatedAt: new Date().toISOString(),
  }))

  return NextResponse.json({
    success: true,
    data: rates,
    timestamp: new Date().toISOString(),
  })
}
