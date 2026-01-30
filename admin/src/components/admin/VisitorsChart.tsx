'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts'
import { CalendarIcon, ChevronDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

/* ---------------- HELPER FUNCTIONS ---------------- */

// Generate data between two dates
function generateDataForRange(startDate: Date, endDate: Date) {
    const data = []
    const current = new Date(startDate)

    while (current <= endDate) {
        const randomVisitors = Math.floor(Math.random() * 300) + 100
        const randomPageViews = Math.floor(Math.random() * 800) + 200
        const randomSessions = Math.floor(Math.random() * 200) + 50
        const randomBounceRate = Math.floor(Math.random() * 50) + 20
        
        data.push({
            name: `${current.getMonth() + 1}/${current.getDate()}`,
            fullDate: current.toISOString().split('T')[0],
            visitors: randomVisitors,
            pageViews: randomPageViews,
            sessions: randomSessions,
            bounceRate: randomBounceRate,
        })
        current.setDate(current.getDate() + 1)
    }

    return data
}

// Generate page views data based on date range
function generatePageViewsData(startDate: Date, endDate: Date) {
    const pages = [
        { name: 'ХБҮЦ', path: '/hbuts' },
        { name: 'Бизнес', path: '/business' },
        { name: 'Хүний нөөц', path: '/personal-privacy' },
        { name: 'Газар барьцаалсан зээл', path: '/products/real-estate/land' },
        { name: 'Хашаа барьцаалсан зээл', path: '/products/real-estate/fence' },
        { name: 'Орон сууц барьцаалсан зээл', path: '/products/real-estate/apartment' },
        { name: 'Дугаар барьцаалсан зээл', path: '/products/phone-number' },
    ]

    // Calculate the number of days in range
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Generate views based on date range length
    const viewsMultiplier = Math.max(1, Math.floor(daysDiff / 7))

    return pages.map(page => ({
        ...page,
        views: Math.floor(Math.random() * 5000 * viewsMultiplier) + (500 * viewsMultiplier),
        percentage: 0,
    }))
        .sort((a, b) => b.views - a.views)
        .map((item, index, arr) => ({
            ...item,
            percentage: Math.round((item.views / arr.reduce((sum, p) => sum + p.views, 0)) * 100),
        }))
}

// Format date for input
function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0]
}

/* ---------------- COMPONENT ---------------- */

export default function VisitorsChart() {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const [startDate, setStartDate] = useState(formatDateForInput(sevenDaysAgo))
    const [endDate, setEndDate] = useState(formatDateForInput(today))
    const [showCustom, setShowCustom] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState('visitors')
    const [showDropdown, setShowDropdown] = useState(false)
    const [chartData, setChartData] = useState<ReturnType<typeof generateDataForRange>>([])
    const [pageViewsData, setPageViewsData] = useState<ReturnType<typeof generatePageViewsData>>([])
    const [showPageViews, setShowPageViews] = useState(true)
    const [calendarMonth, setCalendarMonth] = useState(new Date())
    const [selectingStartDate, setSelectingStartDate] = useState(true)
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [dateError, setDateError] = useState<string>('')
    
    const dropdownRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    const centerModal = useCallback(() => {
        if (typeof window === 'undefined') {
            return
        }

        const width = modalRef.current?.offsetWidth ?? 384
        const height = modalRef.current?.offsetHeight ?? 420
        const x = Math.max((window.innerWidth - width) / 2, 16)
        const y = Math.max((window.innerHeight - height) / 2, 80)

        setModalPosition({ x, y })
    }, [])

    // Load saved modal position on mount (fallback to centered)
    useEffect(() => {
        const initializePosition = () => {
            try {
                const saved = localStorage.getItem('modalPosition')
                if (saved) {
                    const pos = JSON.parse(saved)
                    if (
                        typeof pos?.x === 'number' &&
                        typeof pos?.y === 'number' &&
                        typeof window !== 'undefined'
                    ) {
                        const width = modalRef.current?.offsetWidth ?? 384
                        const height = modalRef.current?.offsetHeight ?? 420
                        const minX = 16
                        const minY = 80
                        const maxX = Math.max(window.innerWidth - width - 16, minX)
                        const maxY = Math.max(window.innerHeight - height - 16, minY)
                        const boundedX = Math.min(Math.max(pos.x, minX), maxX)
                        const boundedY = Math.min(Math.max(pos.y, minY), maxY)
                        setModalPosition({ x: boundedX, y: boundedY })
                        return
                    }
                }
            } catch (e) {
                console.error('Failed to load modal position')
                localStorage.removeItem('modalPosition')
            }

            centerModal()
        }

        initializePosition()
    }, [centerModal])

    // Save modal position to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem('modalPosition', JSON.stringify(modalPosition))
        } catch (e) {
            console.error('Failed to save modal position')
        }
    }, [modalPosition])

    useEffect(() => {
        if (!showCustom) {
            return
        }

        const frame = requestAnimationFrame(() => {
            centerModal()
        })

        return () => cancelAnimationFrame(frame)
    }, [showCustom, centerModal])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Handle modal dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return
            setModalPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
            })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, dragOffset])

    const handleModalMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect()
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
            setIsDragging(true)
        }
    }

    // Chart options
    const chartOptions = [
        { 
            key: 'visitors', 
            label: 'Зочилсон хүний тоо', 
            color: '#059669',
            type: 'line',
            unit: 'хүн',
            description: 'Вэбсайтад зочилсон давтагдашгүй хэрэглэгчдийн тоо'
        },
        { 
            key: 'sessions', 
            label: 'Сешн тоо', 
            color: '#f59e0b',
            type: 'bar',
            unit: 'сешн',
            description: 'Хэрэглэгч вэбсайтад зочилсон давталтын тоо (нэг удаагийн зочлого)'
        },
        { 
            key: 'bounceRate', 
            label: 'Bounce Rate (%)', 
            color: '#ef4444',
            type: 'line',
            unit: '%',
            description: 'Зөвхөн нэг хуудас үзээд явсан зочдын хувь хэмжээ (бага байх нь сайн)'
        },
    ]

    const currentOption = chartOptions.find(opt => opt.key === selectedMetric) || chartOptions[0]

    // Format number consistently for server/client hydration
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('mn-MN').format(num)
    }

    // Preset ranges
    const presets = [
        { label: '7 хоног', days: 7 },
        { label: '30 хоног', days: 30 },
        { label: '3 сар', days: 90 },
        { label: '6 сар', days: 180 },
        { label: '1 жил', days: 365 },
    ]

    const applyPreset = (days: number) => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - days)
        setStartDate(formatDateForInput(start))
        setEndDate(formatDateForInput(end))
        setShowCustom(false)
    }

    // Generate chart data based on selected range
    // Use useEffect to prevent hydration mismatches from Math.random()
    useEffect(() => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        setChartData(generateDataForRange(start, end))
        setPageViewsData(generatePageViewsData(start, end))
    }, [startDate, endDate])

    return (
        <div className="bg-white border border-gray-100 p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">
                            {currentOption.label}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {startDate} - {endDate}
                        </p>
                    </div>

                    {/* Chart Type Selector */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs
                                text-gray-600 border border-gray-200 hover:bg-gray-50 
                                transition-colors rounded-sm"
                        >
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: currentOption.color }}
                            />
                            {currentOption.label}
                            <ChevronDownIcon className="h-3 w-3" />
                        </button>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 
                                rounded-sm shadow-lg z-10 min-w-64">
                                {chartOptions.map(option => (
                                    <button
                                        key={option.key}
                                        onClick={() => {
                                            setSelectedMetric(option.key)
                                            setShowDropdown(false)
                                        }}
                                        className={`w-full flex flex-col items-start gap-1 px-3 py-3 text-sm text-left
                                            hover:bg-gray-50 transition-colors ${
                                                selectedMetric === option.key ? 'bg-gray-50' : ''
                                            }`}
                                        title={option.description}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div 
                                                className="w-2 h-2 rounded-full flex-shrink-0" 
                                                style={{ backgroundColor: option.color }}
                                            />
                                            <span className="text-gray-700 font-medium">{option.label}</span>
                                            {selectedMetric === option.key && (
                                                <span className="ml-auto text-xs text-gray-400">✓</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 ml-5 leading-relaxed">
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-2">
                    {/* Preset buttons */}
                    {presets.map(preset => (
                        <button
                            key={preset.label}
                            onClick={() => applyPreset(preset.days)}
                            className="px-3 py-1.5 text-xs
                text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {preset.label}
                        </button>
                    ))}

                    {/* Custom date toggle */}
                    <button
                        onClick={() => setShowCustom(!showCustom)}
                        className={`px-3 py-1.5 text-xs transition-colors flex items-center gap-1 ${showCustom
                            ? 'text-gray-700 bg-gray-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <CalendarIcon className="h-3.5 w-3.5" />
                        Огноо сонгох
                    </button>
                </div>
            </div>

            {/* Custom Date Picker */}
            {showCustom && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 z-40 transition-opacity pointer-events-auto"
                        onClick={() => setShowCustom(false)}
                    />
                    
                    {/* Modal */}
                    <div 
                        ref={modalRef}
                        onMouseDown={handleModalMouseDown}
                        className="fixed z-50 w-96 max-w-[calc(100vw-2rem)] p-4 bg-white rounded-lg border border-gray-200 shadow-lg animate-in fade-in zoom-in-95 duration-300 cursor-grab active:cursor-grabbing transition-transform pointer-events-auto"
                        style={{
                            left: `${modalPosition.x}px`,
                            top: `${modalPosition.y}px`,
                        }}
                    >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600 text-sm"
                                >
                                    ◀
                                </button>
                                <h3 className="text-base font-bold text-gray-800">
                                    {calendarMonth.getFullYear()}-{String(calendarMonth.getMonth() + 1).padStart(2, '0')}
                                </h3>
                                <button
                                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600 text-sm"
                                >
                                    ▶
                                </button>
                            </div>

                            {/* Day Labels */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Пн', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'].map(day => (
                                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {Array.from({ length: 42 }, (_, i) => {
                                    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
                                    const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
                                    const daysInPrevMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 0).getDate();
                                    
                                    let dayNumber: number;
                                    let isCurrentMonth = false;
                                    let isOtherMonth = false;

                                    if (i < firstDay) {
                                        dayNumber = daysInPrevMonth - firstDay + i + 1;
                                        isOtherMonth = true;
                                    } else if (i < firstDay + daysInMonth) {
                                        dayNumber = i - firstDay + 1;
                                        isCurrentMonth = true;
                                    } else {
                                        dayNumber = i - firstDay - daysInMonth + 1;
                                        isOtherMonth = true;
                                    }

                                    const date = new Date(
                                        calendarMonth.getFullYear(),
                                        isOtherMonth && i >= firstDay + daysInMonth ? calendarMonth.getMonth() + 1 : calendarMonth.getMonth(),
                                        dayNumber
                                    );
                                    const dateStr = formatDateForInput(date);
                                    const isStartDate = dateStr === startDate;
                                    const isEndDate = dateStr === endDate;
                                    const isBetween = dateStr > startDate && dateStr < endDate;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                if (selectingStartDate) {
                                                    setStartDate(dateStr);
                                                    setSelectingStartDate(false);
                                                } else {
                                                    if (dateStr < startDate) {
                                                        setStartDate(dateStr);
                                                        setEndDate(startDate);
                                                    } else {
                                                        setEndDate(dateStr);
                                                    }
                                                    setSelectingStartDate(true);
                                                }
                                            }}
                                            className={`py-1.5 text-xs font-medium rounded transition-all ${
                                                !isCurrentMonth
                                                    ? 'text-gray-300 cursor-default'
                                                    : isStartDate || isEndDate
                                                    ? 'bg-teal-600 text-white font-bold'
                                                    : isBetween
                                                    ? 'bg-teal-50 text-teal-600'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                            disabled={!isCurrentMonth}
                                        >
                                            {dayNumber}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Selected Dates Display */}
                            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg mb-4">
                                <span className="px-2 py-1 text-gray-700 text-xs font-bold">
                                    {new Date(startDate).toLocaleDateString('mn-MN')}
                                </span>
                                <span className="text-gray-400 text-xs">—</span>
                                <span className="px-2 py-1 text-gray-700 text-xs font-bold">
                                    {new Date(endDate).toLocaleDateString('mn-MN')}
                                </span>
                            </div>

                            {/* Error Message */}
                            {dateError && (
                                <div className="mb-4 p-2 bg-white border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-600 font-medium">{dateError}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowCustom(false)
                                        setDateError('')
                                    }}
                                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors"
                                >
                                    Цуцлах
                                </button>
                                <button
                                    onClick={() => {
                                        // Validate dates
                                        if (!startDate || !endDate) {
                                            setDateError('Эхлэлийн огнөө ба төгсөлтийн огнөө сонгоно уу')
                                            return
                                        }
                                        if (new Date(startDate) > new Date(endDate)) {
                                            setDateError('Эхлэлийн огнөө төгсөлтийн огнөөгөөс өмнө байх ёстой')
                                            return
                                        }
                                        setDateError('')
                                        setShowCustom(false)
                                    }}
                                    className="flex-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-lg transition-colors"
                                >
                                    Сонгох
                                </button>
                            </div>
                        </div>
                    </>
                )}

            {/* Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    {currentOption.type === 'line' && (
                        <LineChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={currentOption.color} stopOpacity={0.08} />
                                    <stop offset="100%" stopColor={currentOption.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                stroke="transparent"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={{ stroke: '#f3f4f6' }}
                                interval={Math.floor(chartData.length / 10) || 0}
                            />
                            <YAxis
                                stroke="transparent"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={{ stroke: '#f3f4f6' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: 12,
                                    padding: '8px 12px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                }}
                                labelStyle={{
                                    color: '#4b5563',
                                    fontWeight: 500,
                                    marginBottom: 4,
                                }}
                                itemStyle={{
                                    color: '#6b7280',
                                }}
                                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                labelFormatter={(label) => {
                                    const item = chartData.find(d => d.name === label)
                                    return item?.fullDate || label
                                }}
                                formatter={(value) => [`${value} ${currentOption.unit}`, currentOption.label]}
                            />

                            <Line
                                type="monotone"
                                dataKey={selectedMetric}
                                stroke={currentOption.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                    r: 4,
                                    fill: currentOption.color,
                                    strokeWidth: 0
                                }}
                                fill="url(#colorMetric)"
                                animationDuration={500}
                            />
                        </LineChart>
                    )}

                    {currentOption.type === 'area' && (
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={currentOption.color} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={currentOption.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                stroke="transparent"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={{ stroke: '#f3f4f6' }}
                                interval={Math.floor(chartData.length / 10) || 0}
                            />
                            <YAxis
                                stroke="transparent"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={{ stroke: '#f3f4f6' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: 12,
                                    padding: '8px 12px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                }}
                                labelStyle={{
                                    color: '#4b5563',
                                    fontWeight: 500,
                                    marginBottom: 4,
                                }}
                                itemStyle={{
                                    color: '#6b7280',
                                }}
                                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                labelFormatter={(label) => {
                                    const item = chartData.find(d => d.name === label)
                                    return item?.fullDate || label
                                }}
                                formatter={(value) => [`${value} ${currentOption.unit}`, currentOption.label]}
                            />

                            <Area
                                type="monotone"
                                dataKey={selectedMetric}
                                stroke={currentOption.color}
                                strokeWidth={2}
                                fill="url(#colorMetric)"
                                animationDuration={500}
                            />
                        </AreaChart>
                    )}

                    {currentOption.type === 'bar' && (
                        <BarChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                stroke="transparent"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={{ stroke: '#f3f4f6' }}
                                interval={Math.floor(chartData.length / 10) || 0}
                            />
                            <YAxis
                                stroke="transparent"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={{ stroke: '#f3f4f6' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: 12,
                                    padding: '8px 12px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                }}
                                labelStyle={{
                                    color: '#4b5563',
                                    fontWeight: 500,
                                    marginBottom: 4,
                                }}
                                itemStyle={{
                                    color: '#6b7280',
                                }}
                                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                labelFormatter={(label) => {
                                    const item = chartData.find(d => d.name === label)
                                    return item?.fullDate || label
                                }}
                                formatter={(value) => [`${value} ${currentOption.unit}`, currentOption.label]}
                            />

                            <Bar
                                dataKey={selectedMetric}
                                fill={currentOption.color}
                                radius={[2, 2, 0, 0]}
                                animationDuration={500}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Page Views Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Хэрэглэгч аль хуудсыг илүү үзэж байна</h3>
                    <button
                        onClick={() => setShowPageViews(!showPageViews)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 
                            border border-gray-200 rounded-sm transition-colors"
                        title={showPageViews ? 'Дүүргэх' : 'Дэлгэх'}
                    >
                        {showPageViews ? (
                            <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                            <EyeIcon className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {showPageViews && (
                    <>
                        {/* Page Views Chart */}
                        <div className="mt-6 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pageViewsData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f3f4f6"
                                        horizontal={false}
                                    />
                                    <XAxis
                                        type="number"
                                        stroke="transparent"
                                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#f3f4f6' }}
                                    />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        stroke="transparent"
                                        tick={{ fontSize: 11, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#f3f4f6' }}
                                        width={190}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            fontSize: 12,
                                            padding: '8px 12px',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        }}
                                        labelStyle={{
                                            color: '#4b5563',
                                            fontWeight: 500,
                                            marginBottom: 4,
                                        }}
                                        itemStyle={{
                                            color: '#6b7280',
                                        }}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                        formatter={(value) => [`${formatNumber(value as number)} үзлэг`, 'Үзлэгийн тоо']}
                                    />
                                    <Bar
                                        dataKey="views"
                                        fill="#0d9488"
                                        radius={[0, 4, 4, 0]}
                                        animationDuration={500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
