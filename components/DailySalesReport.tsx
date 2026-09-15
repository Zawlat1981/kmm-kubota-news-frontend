'use client'

import Link from 'next/link'
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
}

function formatDate(date: string, language: Parameters<typeof t>[1]) {
  return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : language === 'my' ? 'my-MM' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export default function DailySalesReport({ sales }: { sales: SaleRecord[] }) {
  const { language } = useLanguage()
  const branchCount = new Set(sales.map((sale) => sale.branch)).size
  const latestSaleDate = sales[0]?.saleDate

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
            <Link href="/internal/login?redirect=/internal/daily-sales/add" className="inline-flex items-center justify-center text-sm font-bold text-white bg-[#c8102e] hover:bg-[#a80d25] rounded-lg px-5 py-3 shadow-sm transition">
              + {t('addDailySale', language)}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-slate-100 bg-slate-50/70">
            <div className="px-6 py-4 border-r border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('totalSales', language)}</p>
              <p className="text-2xl font-bold text-slate-950 mt-1">{sales.length}</p>
            </div>
            <div className="px-6 py-4 sm:border-r border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('activeBranches', language)}</p>
              <p className="text-2xl font-bold text-slate-950 mt-1">{branchCount}<span className="text-sm font-medium text-slate-400"> / 3</span></p>
            </div>
            <div className="col-span-2 sm:col-span-1 px-6 py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('latestReport', language)}</p>
              <p className="text-base font-bold text-slate-950 mt-2">{latestSaleDate ? formatDate(latestSaleDate, language) : t('noRecordsYet', language)}</p>
            </div>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">{t('noDailySales', language)}</div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">{t('salesRecords', language)}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('salesRecordsDescription', language)}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5">{sales.length} {t('records', language)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sales.map((sale) => (
                <article key={sale.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {sale.photoUrl ? <SalePhotoLightbox src={sale.photoUrl} alt={`${sale.model} sale`} /> : <div className="w-full aspect-[16/10] bg-slate-100 flex items-center justify-center text-sm text-slate-400">{t('noPhoto', language)}</div>}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3 pb-1">
                      <h2 className="text-sm font-semibold text-slate-700">{t('saleDetails', language)}</h2>
                      <span className="text-xs font-bold text-red-700 bg-red-50 rounded-md px-2.5 py-1">{sale.branch}</span>
                    </div>
                    <div className="space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-700">
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('modelLabel', language)}</span><span>{sale.model}</span></p>
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('customerLabel', language)}</span><span>{sale.customerName}</span></p>
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('regionLabel', language)}</span><span>{sale.division}</span></p>
                      <p className="flex gap-3"><span className="w-24 shrink-0 font-semibold">{t('paymentLabel', language)}</span><span>{sale.paymentType}</span></p>
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
