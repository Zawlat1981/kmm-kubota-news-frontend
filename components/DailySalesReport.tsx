'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n/uiText'
import SalePhotoLightbox from '@/app/daily-sales/SalePhotoLightbox'

interface SaleRecord {
  id: string
  branch: string
  saleDate: string
  model: string
  customerName: string
  division: string
  paymentType: string
  salesPerson: string
  photoUrl: string | null
  stockRemaining: number | null
}

function formatDate(date: string, language: Parameters<typeof t>[1]) {
  return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : language === 'my' ? 'my-MM' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

function dateKey(date: string) {
  return date.slice(0, 10)
}

function monthKey(date: string) {
  return date.slice(0, 7)
}

function daysFrom(date: string, days: number) {
  const value = new Date(`${dateKey(date)}T00:00:00.000Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

function getCurrentWeekStart() {
  const today = new Date()
  const day = today.getUTCDay()
  const daysSinceMonday = day === 0 ? 6 : day - 1
  today.setUTCDate(today.getUTCDate() - daysSinceMonday)
  return today.toISOString().slice(0, 10)
}

function getTopNames(records: SaleRecord[], getName: (sale: SaleRecord) => string) {
  const counts = new Map<string, number>()
  records.forEach((sale) => counts.set(getName(sale), (counts.get(getName(sale)) || 0) + 1))
  const highestCount = Math.max(0, ...counts.values())
  return Array.from(counts.entries())
    .filter(([, count]) => count === highestCount)
    .map(([name]) => name)
}

function formatMonth(month: string, language: Parameters<typeof t>[1]) {
  return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : language === 'my' ? 'my-MM' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${month}-01T00:00:00.000Z`))
}

export default function DailySalesReport({ sales }: { sales: SaleRecord[] }) {
  const { language } = useLanguage()
  const latestSaleDate = sales[0]?.saleDate
  const latestMonth = latestSaleDate ? monthKey(latestSaleDate) : ''
  const [selectedMonth, setSelectedMonth] = useState(latestMonth)
  const [showFullMonth, setShowFullMonth] = useState(false)
  const monthOptions = useMemo(() => Array.from(new Set(sales.map((sale) => monthKey(sale.saleDate)))), [sales])
  const monthSales = sales.filter((sale) => monthKey(sale.saleDate) === selectedMonth)
  const latestMonthSaleDate = monthSales[0]?.saleDate
  const weekStartDate = latestMonthSaleDate ? daysFrom(latestMonthSaleDate, -6) : ''
  const displayedSales = showFullMonth
    ? monthSales
    : monthSales.filter((sale) => dateKey(sale.saleDate) >= weekStartDate)
  const reportDate = latestSaleDate
  const currentMonth = monthKey(new Date().toISOString())
  const currentPeriodSales = sales.filter((sale) => monthKey(sale.saleDate) === currentMonth)
  const weekStart = getCurrentWeekStart()
  const thisWeekSales = sales.filter((sale) => dateKey(sale.saleDate) >= weekStart && dateKey(sale.saleDate) <= dateKey(new Date().toISOString()))
  const topBranches = getTopNames(currentPeriodSales, (sale) => sale.branch)
  const topSalesPeople = getTopNames(currentPeriodSales, (sale) => sale.salesPerson)
  const topBranchSales = topBranches[0] ? currentPeriodSales.filter((sale) => sale.branch === topBranches[0]).length : 0

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <div className="border-b border-red-900/20 bg-[#b5121b] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-white/80 hover:text-white transition">{t('backToNewsPortal', language)}</Link>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">{t('managementDashboard', language)}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700 mb-3">KMM Kubota · {t('salesPerformance', language)}</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">{t('dailySalesReport', language)}</h1>
              <p className="text-sm sm:text-base text-slate-500 mt-2">{t('dailySalesDescription', language)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-slate-100 bg-slate-50/70">
            <div className="px-6 py-4 border-r border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('thisWeeksSales', language)}</p>
              <p className="text-2xl font-bold text-slate-950 mt-1">{thisWeekSales.length}</p>
            </div>
            <div className="px-6 py-4 sm:border-r border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('topBranch', language)}</p>
              <p className="text-base font-bold text-slate-950 mt-2 min-h-7">{topBranches.length ? topBranches.join(' & ') : t('noRecordsYet', language)}</p>
              <p className="text-xs text-slate-500 mt-1 min-h-4">{topBranches.length ? `${topBranchSales} ${t('records', language)}` : ''}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 px-6 py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('topSalesPerson', language)}</p>
              <p className="text-base font-bold text-slate-950 mt-2">{topSalesPeople.length ? topSalesPeople.join(' & ') : t('noRecordsYet', language)}</p>
              <p className="text-xs text-slate-500 mt-1">{reportDate ? formatDate(reportDate, language) : ''}</p>
            </div>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">{t('noDailySales', language)}</div>
        ) : (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">{t('salesRecords', language)}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('salesRecordsDescription', language)}</p>
              </div>
              <label className="text-xs font-semibold text-slate-500">
                {t('salesMonthLabel', language)}
                <select
                  value={selectedMonth}
                  onChange={(event) => {
                    setSelectedMonth(event.target.value)
                    setShowFullMonth(false)
                  }}
                  className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {monthOptions.map((month) => <option key={month} value={month}>{formatMonth(month, language)}</option>)}
                </select>
              </label>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Branch</th>
                      <th className="px-5 py-4">Model</th>
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-5 py-4">Region</th>
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4">{t('stockRemainingLabel', language)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-red-50/40">
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">{formatDate(sale.saleDate, language)}</td>
                        <td className="px-5 py-4 font-bold text-red-700">{sale.branch}</td>
                        <td className="px-5 py-4 font-semibold text-slate-800">{sale.model}</td>
                        <td className="px-5 py-4 text-slate-700">{sale.customerName}</td>
                        <td className="px-5 py-4 text-slate-700">{sale.division}</td>
                        <td className="px-5 py-4 text-slate-700">{sale.paymentType}</td>
                        <td className="px-5 py-4 font-bold text-emerald-700">{sale.stockRemaining ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">{displayedSales.length} / {monthSales.length} {t('records', language)}</span>
                {monthSales.length > displayedSales.length && (
                  <button type="button" onClick={() => setShowFullMonth(true)} className="text-sm font-bold text-red-700 hover:text-red-900">
                    {t('readMore', language)}
                  </button>
                )}
                {showFullMonth && monthSales.length > 7 && (
                  <button type="button" onClick={() => setShowFullMonth(false)} className="text-sm font-bold text-red-700 hover:text-red-900">
                    {t('showLess', language)}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {displayedSales.map((sale) => (
                <article key={sale.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {sale.photoUrl ? <SalePhotoLightbox src={sale.photoUrl} alt={`${sale.model} sale`} salesPerson={sale.salesPerson} customerName={sale.customerName} model={sale.model} region={sale.division} /> : <div className="w-full aspect-[16/10] bg-slate-100 flex items-center justify-center text-sm text-slate-400">{t('noPhoto', language)}</div>}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3 pb-1">
                      <h2 className="text-sm font-semibold text-slate-700">{t('saleDetails', language)}</h2>
                      <span className="text-xs font-bold text-red-700 bg-red-50 rounded-md px-2.5 py-1">{sale.branch}</span>
                    </div>
                    <div className="space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-700">
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('modelLabel', language)}</span><span>{sale.model}</span></p>
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('customerLabel', language)}</span><span>{sale.customerName}</span></p>
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('regionLabel', language)}</span><span>{sale.division}</span></p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between gap-2">
                      <span>{formatDate(sale.saleDate, language)}</span>
                      <span className="font-medium text-slate-700">{sale.salesPerson}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
