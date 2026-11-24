"use client"
/* eslint-disable @next/next/no-img-element */
import { useState, useMemo } from "react"
import Link from "next/link"
import { Store, Users, MapPin, TrendingUp, Calendar, BarChart3, Filter, X, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { extraText } from "@/lib/i18n/extraText"
import { t } from "@/lib/i18n/uiText"
import { formatLocalizedDate } from "@/lib/i18n/date"
import { localizeRegion } from "@/lib/i18n/region"

interface Sale {
  id?: string
  _id?: string
  branch: string
  saleDate: string
  model: string
  customerName: string
  regionDivision?: string
  division?: string
  paymentType: string
  salesPerson: string
  photo?: { asset: { url: string } } | null
  photoUrl?: string | null
  stockRemaining?: number | null
}

export default function DailySalesReport({ sales }: { sales: Sale[] }) {
  const { language } = useLanguage()
  const text = extraText(language)
  const [showAll, setShowAll] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL')
  const [showDateFilter, setShowDateFilter] = useState(false)

  const T = {
    en: {
      totalSales: 'TOTAL SALES',
      allTimeTotal: 'All Time Total',
      thisFilter: 'This Filter',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      cars: 'units',
      carShort: 'units',
      topBranch: 'Top Branch',
      branchPerformance: 'BRANCH PERFORMANCE',
      branchBreakdown: 'BRANCH BREAKDOWN',
      topRegion: 'Top Region',
      regionPerformance: 'REGION PERFORMANCE',
      regionBreakdown: 'REGION BREAKDOWN',
      topSalesPerson: 'Top Sales Person',
      yearly: 'YEARLY',
      salesRecords: 'Sales Records',
      allRecords: 'All sales records',
      clickPhoto: 'Click photo to view large',
      sales: 'sales',
      filterByYearMonth: 'Filter by Year & Month',
      year: 'YEAR',
      month: 'MONTH',
      allMonths: 'All Months',
      reset: 'Reset to 2026 All',
      apply: 'Apply',
      archiveInfo: 'Archive Info',
      thisYear: 'This Year',
      lastYear: 'Last year viewable',
      autoReset: 'Year end auto reset',
      butSaved: 'but',
      saved: 'data saved',
      backToNews: 'Back to News Portal',
      managementDashboard: 'MANAGEMENT DASHBOARD',
      records: 'Records',
      total: 'Total',
      regions: 'Regions',
      stock: 'Stock',
      noPhoto: 'No Photo',
      view: 'View',
      noSalesYet: 'No Sales Data Yet',
      studioHelp: 'Sanity Studio → Daily Sales → Add → Publish',
      checkType: 'Check _type: dailySale and Published (not Draft green dot)',
      filtered: 'filtered', filter: 'Filter', noSalesFor: 'No sales for',
      tryFilter: 'Try a different year/month or reset the filter',
      showMore: 'Show more records', nextYear: 'Next year', future: 'Future',
      yearReset: 'New year starts in', monthHint: 'View records by month',
      archiveYear: 'Select a year to view past records',
      archiveReset: 'Records are saved when the year resets',
      archiveField: 'A Year field in Sanity Studio is recommended',
    },
    th: {
      totalSales: 'ยอดขายรวม',
      allTimeTotal: 'ยอดสะสมทั้งหมด',
      thisFilter: 'ตัวกรองนี้',
      thisWeek: 'สัปดาห์นี้',
      thisMonth: 'เดือนนี้',
      cars: 'คัน',
      carShort: 'คัน',
      topBranch: 'สาขายอดเยี่ยม',
      branchPerformance: 'ผลงานสาขา',
      branchBreakdown: 'รายละเอียดสาขา',
      topRegion: 'ภูมิภาคยอดเยี่ยม',
      regionPerformance: 'ผลงานภูมิภาค',
      regionBreakdown: 'รายละเอียดภูมิภาค',
      topSalesPerson: 'พนักงานขายยอดเยี่ยม',
      yearly: 'รายปี',
      salesRecords: 'บันทึกการขาย',
      allRecords: 'บันทึกทั้งหมด',
      clickPhoto: 'คลิกดูรูปใหญ่',
      sales: 'การขาย',
      filterByYearMonth: 'กรองตามปีและเดือน',
      year: 'ปี',
      month: 'เดือน',
      allMonths: 'ทุกเดือน',
      reset: 'รีเซ็ตเป็น 2026 ทั้งหมด',
      apply: 'ใช้',
      archiveInfo: 'ข้อมูลเก็บถาวร',
      thisYear: 'ปีนี้',
      lastYear: 'ปีที่แล้ว',
      autoReset: 'สิ้นปีรีเซ็ตอัตโนมัติ',
      butSaved: 'แต่ข้อมูล',
      saved: 'ยังเก็บไว้',
      backToNews: 'กลับไปที่ข่าว',
      managementDashboard: 'แดชบอร์ดผู้บริหาร',
      records: 'รายการ',
      total: 'รวม',
      regions: 'ภูมิภาค',
      stock: 'สต็อก',
      noPhoto: 'ไม่มีรูป',
      view: 'ดู',
      noSalesYet: 'ยังไม่มีข้อมูลยอดขาย',
      studioHelp: 'Sanity Studio → ยอดขายรายวัน → เพิ่ม → เผยแพร่',
      checkType: 'ตรวจสอบ _type: dailySale และเผยแพร่แล้ว (ไม่ใช่ฉบับร่าง)',
      filtered: 'กรองแล้ว', filter: 'ตัวกรอง', noSalesFor: 'ไม่มียอดขายสำหรับ',
      tryFilter: 'ลองเลือกปีหรือเดือนอื่น หรือรีเซ็ตตัวกรอง',
      showMore: 'แสดงรายการเพิ่มเติม', nextYear: 'ปีหน้า', future: 'อนาคต',
      yearReset: 'เริ่มปีใหม่ใน', monthHint: 'ดูรายการตามเดือน',
      archiveYear: 'เลือกปีเพื่อดูรายการย้อนหลัง',
      archiveReset: 'ข้อมูลจะถูกเก็บไว้เมื่อเริ่มปีใหม่',
      archiveField: 'แนะนำให้เพิ่มช่องปีใน Sanity Studio',
    },
    my: {
      totalSales: 'စုစုပေါင်းအရောင်း',
      allTimeTotal: 'စုစုပေါင်းအချိန်အားလုံး',
      thisFilter: 'ဒီ Filter',
      thisWeek: 'ဒီအပတ်',
      thisMonth: 'ဒီလ',
      cars: 'စီး',
      carShort: 'စီး',
      topBranch: 'အကောင်းဆုံးဌာနခွဲ',
      branchPerformance: 'ဌာနခွဲစွမ်းဆောင်ရည်',
      branchBreakdown: 'ဌာနခွဲအသေးစိတ်',
      topRegion: 'အကောင်းဆုံးဒေသ',
      regionPerformance: 'ဒေသစွမ်းဆောင်ရည်',
      regionBreakdown: 'ဒေသအသေးစိတ်',
      topSalesPerson: 'အကောင်းဆုံးအရောင်းဝန်ထမ်း',
      yearly: 'နှစ်အလိုက်',
      salesRecords: 'အရောင်းမှတ်တမ်းများ',
      allRecords: 'မှတ်တမ်းအားလုံး',
      clickPhoto: 'ပုံကြီးကြည့်ရန် နှိပ်ပါ',
      sales: 'အရောင်း',
      filterByYearMonth: 'နှစ်နှင့်လအလိုက် စစ်မယ်',
      year: 'နှစ်',
      month: 'လ',
      allMonths: 'လအားလုံး',
      reset: '2026 All ပြန်စ',
      apply: 'ကြည့်မယ်',
      archiveInfo: 'မှတ်တမ်းသိမ်းခြင်း',
      thisYear: 'ဒီနှစ်',
      lastYear: 'ပြီးခဲ့တဲ့နှစ်',
      autoReset: 'နှစ်ကုန်ရင် Auto reset',
      butSaved: 'ဒါပေမယ့်',
      saved: 'သိမ်းထားမယ်',
      backToNews: 'သတင်းပေါ်တယ်သို့ ပြန်သွားမည်',
      managementDashboard: 'စီမံခန့်ခွဲမှု ဒက်ရှ်ဘုတ်',
      records: 'မှတ်တမ်း',
      total: 'စုစုပေါင်း',
      regions: 'ဒေသများ',
      stock: 'စတော့',
      noPhoto: 'ပုံမရှိ',
      view: 'ကြည့်မယ်',
      noSalesYet: 'အရောင်းအချက်အလက် မရှိသေးပါ',
      studioHelp: 'Sanity Studio → နေ့စဉ်အရောင်း → ထည့်ရန် → ထုတ်ပြန်ရန်',
      checkType: '_type: dailySale နှင့် ထုတ်ပြန်ပြီးဖြစ်ကြောင်း စစ်ဆေးပါ',
      filtered: 'စစ်ထုတ်ထားသည်', filter: 'စစ်ထုတ်မှု', noSalesFor: 'အရောင်းစာရင်းမရှိပါ',
      tryFilter: 'အခြားနှစ်၊ လကို ရွေးပါ သို့မဟုတ် ပြန်စပါ',
      showMore: 'မှတ်တမ်းများ ထပ်ကြည့်ရန်', nextYear: 'နောက်နှစ်', future: 'နောင်နှစ်',
      yearReset: 'နှစ်သစ်ပြန်စမည့်နှစ်', monthHint: 'လအလိုက် မှတ်တမ်းကြည့်ရန်',
      archiveYear: 'ယခင်မှတ်တမ်းကြည့်ရန် နှစ်ရွေးပါ',
      archiveReset: 'နှစ်သစ်စသော်လည်း မှတ်တမ်းများ သိမ်းထားပါမည်',
      archiveField: 'Sanity Studio တွင် Year field ထည့်ထားရန် အကြံပြုပါသည်',
    },
  }

  // Default to English base, fallback to English
  const tt = T[language]



  // Get available years and months from data
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    sales.forEach(s => {
      if (s.saleDate) {
        const y = new Date(s.saleDate).getFullYear()
        if (y) years.add(y)
      }
    })
    if (years.size === 0) years.add(2026)
    return Array.from(years).sort((a,b) => b - a)
  }, [sales])

  const availableMonths = useMemo(() => {
    return [
      { value: 'ALL', label: tt.allMonths },
      ...Array.from({ length: 12 }, (_, month) => ({
        value: String(month),
        label: formatLocalizedDate(new Date(2026, month, 1), language, { month: 'long' }),
      })),
    ]
  }, [language, tt.allMonths])

  // Filtered sales based on selected year/month
  const filteredByDate = useMemo(() => {
    return sales.filter(s => {
      if (!s.saleDate) return true
      const d = new Date(s.saleDate)
      const y = d.getFullYear()
      const m = d.getMonth()
      if (y !== selectedYear) return false
      if (selectedMonth !== 'ALL' && m !== parseInt(selectedMonth)) return false
      return true
    })
  }, [sales, selectedYear, selectedMonth])

  const stats = useMemo(() => {
    const total = filteredByDate.length
    const totalAllTime = sales.length
    const branchCounts: Record<string, number> = {}
    const regionCounts: Record<string, number> = {}
    const personCounts: Record<string, number> = {}
    
    filteredByDate.forEach(s => {
      const b = s.branch || "KMM03"
      branchCounts[b] = (branchCounts[b]||0)+1
      const r = (s.regionDivision || s.division || "Mandalay").trim() || "Mandalay"
      regionCounts[r] = (regionCounts[r]||0)+1
      const p = s.salesPerson || "Ye Lin Tun"
      personCounts[p] = (personCounts[p]||0)+1
    })

    const topBranch = Object.entries(branchCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "KMM03"
    const topRegion = Object.entries(regionCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Mandalay"
    const topPerson = Object.entries(personCounts).sort((a,b)=>b[1]-a[1])[0] as [string, number] | undefined

    const now = new Date()
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7)
    const thisWeek = filteredByDate.filter(s => s.saleDate && new Date(s.saleDate) >= weekAgo).length
    const thisMonthCount = filteredByDate.filter(s => {
      if (!s.saleDate) return false
      const d = new Date(s.saleDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    // Previous year comparison
    const prevYearSales = sales.filter(s => {
      if (!s.saleDate) return false
      return new Date(s.saleDate).getFullYear() === selectedYear - 1
    }).length

    // All years data for archive
    const yearStats: Record<number, number> = {}
    sales.forEach(s => {
      if (s.saleDate) {
        const y = new Date(s.saleDate).getFullYear()
        yearStats[y] = (yearStats[y]||0)+1
      }
    })

    return { total, totalAllTime, branchCounts, topBranch, regionCounts, topRegion, personCounts, topPerson, thisWeek, thisMonthCount, prevYearSales, yearStats }
  }, [filteredByDate, sales, selectedYear])

  const displaySales = showAll ? filteredByDate : filteredByDate.slice(0, 8)
  const monthLabel = availableMonths.find(m => m.value === selectedMonth)?.label || ''

  if (sales.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#c00000] text-white px-4 py-3 flex justify-between"><Link href="/" className="text-sm font-bold">{tt.backToNews}</Link><span className="text-xs opacity-80 font-bold">{tt.managementDashboard}</span></div>
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <p className="font-bold">{tt.noSalesYet}</p>
            <p className="text-sm text-gray-600 mt-2">{tt.studioHelp}</p>
            <p className="text-xs text-gray-400 mt-2">{tt.checkType}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="bg-[#c00000] text-white px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-sm font-serif hover:underline font-bold">{tt.backToNews}</Link>
        <span className="text-xs tracking-widest opacity-80 font-bold">{tt.managementDashboard}</span>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* 0. TOTAL SALES - First at top - Zaw requested */}
        <div className="bg-gradient-to-br from-[#FF6A00] to-[#E55A00] rounded-2xl shadow-lg p-5 text-white relative overflow-hidden border border-orange-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-5 -mb-5"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-xs tracking-widest opacity-90 font-bold">{tt.totalSales}</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight mt-2">{stats.totalAllTime}</h1>
                <p className="text-[13px] opacity-90 mt-1 font-bold">{tt.allTimeTotal} • {stats.totalAllTime} {tt.cars}</p>
                
                <div className="flex gap-3 mt-4">
                  <div className="bg-white/20 rounded-xl px-3 py-2">
                    <p className="text-[11px] opacity-80 font-bold">{tt.thisFilter}</p>
                    <p className="text-lg font-bold">{stats.total} {tt.carShort}</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2">
                    <p className="text-[11px] opacity-80 font-bold">{tt.thisWeek}</p>
                    <p className="text-lg font-bold">{stats.thisWeek} {tt.carShort}</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2">
                    <p className="text-[11px] opacity-80 font-bold">{tt.thisMonth}</p>
                    <p className="text-lg font-bold">{stats.thisMonthCount} {tt.carShort}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="bg-white text-[#FF6A00] rounded-xl px-3 py-2 font-bold text-xs">
                  {selectedYear} {selectedMonth !== 'ALL' ? `- ${monthLabel}` : ''}
                </div>
                {stats.prevYearSales > 0 && (
                  <p className="text-[10px] mt-2 opacity-70">{selectedYear-1}: {stats.prevYearSales} {tt.carShort}</p>
                )}
                <p className="text-[10px] mt-3 opacity-60 text-right leading-tight">
                  {text.appStarted}<br/>{text.resets}<br/>{text.archiveSaved}
                </p>
              </div>
            </div>

            {/* Year breakdown mini */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {Object.entries(stats.yearStats).sort((a,b)=>parseInt(b[0])-parseInt(a[0])).map(([year, count]) => (
                <div key={year} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold ${parseInt(year)===selectedYear ? 'bg-white text-[#FF6A00]' : 'bg-white/20 text-white'}`}>
                  {year}: {count} {tt.carShort}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Top Branch */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-xs font-black text-gray-900">{tt.topBranch}</span>
            </div>
            <span className="text-[11px] font-black tracking-wider text-gray-700">{tt.branchPerformance}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-red-600 tracking-tight">{stats.topBranch}</h2>
            <span className="text-xs text-gray-800 font-medium">
              {stats.branchCounts[stats.topBranch] || 27} {tt.records} • {Math.round(((stats.branchCounts[stats.topBranch] || 27) / (stats.total || 52)) * 100)}% {text.ofTotal}
            </span>
          </div>

          <p className="text-[11px] font-black tracking-wider text-gray-700 mt-5 mb-3">{tt.branchBreakdown}</p>

          <div className="space-y-3">
            {Object.entries(stats.branchCounts).sort((a,b)=>b[1]-a[1]).map(([branch, count]) => {
              const pct = Math.round((count / (stats.total || 1)) * 100)
              return (
                <div key={branch} className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-black w-12">{branch}</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-900 w-7">{pct}%</span>
                  <span className="text-xs text-gray-800 font-medium w-12 text-right">{count} {tt.sales}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Region Breakdown */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs font-black text-gray-800">{tt.topRegion}</span>
            </div>
            <span className="text-[11px] font-black tracking-wider text-gray-700">{tt.regionPerformance}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-blue-700 tracking-tight truncate">{localizeRegion(stats.topRegion, language)}</h2>
            <span className="text-xs text-gray-800 font-medium">
              {stats.regionCounts[stats.topRegion] || 0} {tt.records} • {Math.round(((stats.regionCounts[stats.topRegion] || 0) / (stats.total || 1)) * 100)}% {text.ofTotal}
            </span>
          </div>

          <p className="text-[11px] font-black tracking-wider text-gray-700 mt-5 mb-3">{tt.regionBreakdown}</p>

          <div className="space-y-3">
            {Object.entries(stats.regionCounts).sort((a,b)=>b[1]-a[1]).map(([region, count]) => {
              const pct = Math.round((count / (stats.total || 1)) * 100)
              return (
                <div key={region} className="flex items-center gap-3">
                  <span className="text-[12px] font-black text-gray-900 w-24 truncate" title={localizeRegion(region, language)}>{localizeRegion(region, language)}</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-900 w-7">{pct}%</span>
                  <span className="text-xs text-gray-800 font-medium w-16 text-right">{count} {tt.carShort}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-gray-800 bg-blue-50 border border-blue-100 rounded-lg p-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{tt.total} {stats.total} {tt.cars} • {Object.keys(stats.regionCounts).length} {tt.regions} • {tt.filter}: {selectedYear} {monthLabel}</span>
          </div>
        </div>

        {/* 3. Top Sales Person */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs font-black text-gray-800">{tt.topSalesPerson} ({selectedYear})</span>
            </div>
            <span className="text-[11px] font-black tracking-wider text-gray-700">{tt.yearly}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
              {(stats.topPerson?.[0] || "Ye Lin Tun").split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[15px] leading-tight">{stats.topPerson?.[0] || "Ye Lin Tun"}</p>
              <p className="text-[10px] text-gray-400 mt-1">◎ {text.appStarted} • {text.resets} • {text.archiveSaved}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold leading-none">{stats.topPerson?.[1] || 5}</p>
              <p className="text-[10px] tracking-wider text-gray-400 mt-1">{text.salesThisYear}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">
            {Object.entries(stats.personCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([person, count], idx) => (
              <div key={person} className={`rounded-xl p-3 ${idx===0 ? 'bg-black text-white' : 'bg-gray-50 text-gray-700'} `}>
                <p className="text-xs font-bold truncate">{person}</p>
                <p className="text-[11px] mt-1 opacity-80">{count} {tt.sales}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Sales Records with Date Filter Button - Zaw requested clickable October 2026 box */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h3 className="font-bold text-[15px] flex items-center gap-2">
                <span className="w-1 h-4 bg-red-600 rounded-full inline-block"></span>
                {tt.salesRecords}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 ml-3">{tt.allRecords} • {stats.total} {tt.filtered} / {stats.totalAllTime} {tt.total} • {tt.clickPhoto}</p>
            </div>
            
            {/* Clickable Date Filter - October 2026 box that Zaw circled */}
            <button 
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-3 py-2 rounded-xl font-bold text-[12px] transition active:bg-red-200 touch-manipulation"
            >
              <Calendar className="w-3.5 h-3.5" />
              <div className="text-left leading-tight">
                <div>{monthLabel}</div>
                <div>{selectedYear}</div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition ${showDateFilter ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Date Filter Dropdown - Year + Month */}
          {showDateFilter && (
            <div className="p-4 bg-amber-50/50 border-b space-y-4 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-700 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" /> {tt.filterByYearMonth}
                </p>
                <button onClick={() => setShowDateFilter(false)} className="p-1 hover:bg-white rounded-full">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500">{tt.year}</label>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>
                        {year} - {stats.yearStats[year] || 0} {tt.carShort}
                      </option>
                    ))}
                    <option value={2027}>2027 - {tt.nextYear}</option>
                    <option value={2028}>2028 - {tt.future}</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">{tt.yearReset} {selectedYear+1}</p>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-gray-500">{tt.month}</label>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {availableMonths.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">{tt.monthHint}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedYear(2026); setSelectedMonth('ALL'); setShowDateFilter(false) }}
                  className="flex-1 bg-white border border-gray-200 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-50"
                >
                  {tt.reset}
                </button>
                <button 
                  onClick={() => setShowDateFilter(false)}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-red-700"
                >
                  {tt.apply} - {stats.total} {tt.carShort}
                </button>
              </div>

              <div className="bg-white rounded-xl p-3 border">
                <p className="text-[11px] font-bold text-gray-600">📦 {tt.archiveInfo}:</p>
                <div className="mt-2 space-y-1 text-[11px] text-gray-500">
                  <p>• {selectedYear}: {stats.totalAllTime} {tt.carShort} {tt.total}, {stats.total} {tt.carShort} {tt.filtered}</p>
                  <p>• {tt.archiveYear}</p>
                  <p>• {tt.archiveReset}</p>
                  <p>• {tt.archiveField}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="divide-y divide-gray-100">
            {displaySales.length > 0 ? displaySales.map((s) => {
              const photoUrl = s.photo?.asset?.url || s.photoUrl
              const saleDate = s.saleDate ? formatLocalizedDate(new Date(s.saleDate), language, { month: 'short', day: 'numeric', year: new Date(s.saleDate).getFullYear() !== selectedYear ? 'numeric' : undefined }) : ''
              return (
                <div key={s.id || s._id} className="p-3 flex gap-3 hover:bg-gray-50 transition group">
                  <div className="shrink-0">
                    {photoUrl ? (
                      <button 
                        onClick={() => window.open(photoUrl, '_blank')}
                        className="relative w-[64px] h-[64px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-red-200 transition"
                        title={tt.clickPhoto}
                      >
                        <img src={photoUrl} alt={s.model} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] bg-black/60 px-1.5 py-0.5 rounded">👁️ {tt.view}</span>
                        </div>
                      </button>
                    ) : (
                      <div className="w-[64px] h-[64px] rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <span className="text-[16px]">📷</span>
                        <span className="text-[8px] text-gray-400 mt-0.5">{tt.noPhoto}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">{s.branch}</span>
                          <span className="font-bold text-[13px] text-gray-900 truncate">{s.model}</span>
                          {s.paymentType && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">{s.paymentType.toLowerCase() === 'cash' ? text.cash : s.paymentType.toLowerCase() === 'installment' ? text.installment : s.paymentType}</span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-700 mt-1 truncate font-medium">👤 {s.customerName || t('customerLabel', language)}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1">📍 {s.regionDivision || s.division ? localizeRegion(s.regionDivision || s.division || '', language) : t('regionLabel', language)}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="truncate">👨‍💼 {s.salesPerson || text.salesPerson}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-gray-400">{saleDate}</p>
                        {s.stockRemaining !== null && s.stockRemaining !== undefined && (
                          <p className="text-[9px] mt-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border">{tt.stock}: {s.stockRemaining}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">{tt.noSalesFor} {selectedYear} {selectedMonth !== 'ALL' ? monthLabel : ''}</p>
                <p className="text-xs mt-1">{tt.tryFilter}</p>
                <button onClick={() => { setSelectedYear(2026); setSelectedMonth('ALL') }} className="mt-3 text-xs bg-red-50 text-red-600 px-4 py-2 rounded-full">{tt.reset}</button>
              </div>
            )}
          </div>
          
          {filteredByDate.length > 8 && (
            <div className="p-3 text-center border-t bg-gray-50/50">
              <button onClick={()=>setShowAll(!showAll)} className="text-xs text-red-600 font-bold bg-white border border-red-100 px-4 py-2 rounded-full hover:bg-red-50 transition">
                {showAll ? `↑ ${t('showLess', language)}` : `↓ ${tt.showMore} (${filteredByDate.length - 8}) →`}
              </button>
            </div>
          )}
          
          <div className="p-2.5 bg-blue-50/50 border-t text-[10px] text-gray-500 text-center">
            💡 {tt.clickPhoto} • {stats.total} {tt.carShort} {tt.filtered} / {stats.totalAllTime} {tt.carShort} {tt.total} • {tt.year} {selectedYear} • {monthLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

