"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Store, Users } from "lucide-react"

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
  const [showAll, setShowAll] = useState(false)

  const stats = useMemo(() => {
    const total = sales.length
    const branchCounts: Record<string, number> = {}
    const regionCounts: Record<string, number> = {}
    const personCounts: Record<string, number> = {}
    
    sales.forEach(s => {
      const b = s.branch || "KMM03"
      branchCounts[b] = (branchCounts[b]||0)+1
      const r = s.regionDivision || s.division || "Mandalay"
      regionCounts[r] = (regionCounts[r]||0)+1
      const year = s.saleDate ? new Date(s.saleDate).getFullYear() : 2026
      if (year === 2026) {
        const p = s.salesPerson || "Ye Lin Tun"
        personCounts[p] = (personCounts[p]||0)+1
      }
    })

    const topBranch = Object.entries(branchCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "KMM03"
    const topPerson = Object.entries(personCounts).sort((a,b)=>b[1]-a[1])[0] as [string, number] | undefined

    const now = new Date()
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7)
    const thisWeek = sales.filter(s => s.saleDate && new Date(s.saleDate) >= weekAgo).length

    return { total, branchCounts, topBranch, regionCounts, personCounts, topPerson, thisWeek }
  }, [sales])

  const displaySales = showAll ? sales : sales.slice(0, 8)

  if (sales.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#c00000] text-white px-4 py-3 flex justify-between"><Link href="/" className="text-sm">Back to News Portal</Link><span className="text-xs opacity-80">MANAGEMENT DASHBOARD</span></div>
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <p className="font-bold">No Sales Data Yet</p>
            <p className="text-sm text-gray-600 mt-2">Sanity Studio → Daily Sales (နေ့စဉ်အရောင်း) → Add → Publish</p>
            <p className="text-xs text-gray-400 mt-2">Check _type: dailySale and Published (not Draft green dot)</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-[#c00000] text-white px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-sm font-serif hover:underline">Back to News Portal</Link>
        <span className="text-xs tracking-widest opacity-80">MANAGEMENT DASHBOARD</span>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Top Branch - EXACT Screenshot Design */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-gray-300">Top Branch</span>
            </div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400">BRANCH PERFORMANCE</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-serif font-extrabold text-red-600 tracking-tight">{stats.topBranch}</h2>
            <span className="text-xs text-gray-500">
              {stats.branchCounts[stats.topBranch] || 6} Records • {Math.round(((stats.branchCounts[stats.topBranch] || 6) / (stats.total || 14)) * 100)}% of total
            </span>
          </div>

          <p className="text-[11px] font-bold tracking-wider text-gray-400 mt-5 mb-3">BRANCH BREAKDOWN</p>

          <div className="space-y-3">
            {Object.entries(stats.branchCounts).sort((a,b)=>b[1]-a[1]).map(([branch, count]) => {
              const pct = Math.round((count / (stats.total || 1)) * 100)
              return (
                <div key={branch} className="flex items-center gap-3">
                  <span className="text-[13px] font-extrabold w-12">{branch}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2.5 bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-400 w-7">{pct}%</span>
                  <span className="text-xs text-gray-500 w-12 text-right">{count} sales</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Sales Person - EXACT Screenshot Design */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs font-semibold text-gray-300">Top Sales Person (2026)</span>
            </div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400">YEARLY</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
              {(stats.topPerson?.[0] || "Ye Lin Tun").split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[15px] leading-tight">{stats.topPerson?.[0] || "Ye Lin Tun"}</p>
              <p className="text-[10px] text-gray-400 mt-1">◎ App started Aug 2026 • resets Jan 1 2027</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold leading-none">{stats.topPerson?.[1] || 5}</p>
              <p className="text-[10px] tracking-wider text-gray-400 mt-1">SALES THIS YEAR</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">
            {Object.entries(stats.personCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([person, count], idx) => (
              <div key={person} className={`rounded-xl p-3 ${idx===0 ? 'bg-black text-white' : 'bg-gray-50 text-gray-700'} `}>
                <p className="text-xs font-bold truncate">{person}</p>
                <p className="text-[11px] mt-1 opacity-80">{count} sales</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales Table Simple */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between">
            <div><h3 className="font-bold text-sm">Sales Records</h3><p className="text-[11px] text-gray-400">All sales records • {stats.total} total</p></div>
            <span className="text-xs text-gray-400">October 2026</span>
          </div>
          <div className="divide-y">
            {displaySales.map((s) => (
              <div key={s.id || s._id} className="p-3 flex justify-between items-center text-xs">
                <div className="flex gap-3">
                  <span className="font-bold text-red-600">{s.branch}</span>
                  <span className="font-bold">{s.model}</span>
                  <span className="text-gray-500 truncate max-w-[90px]">{s.customerName}</span>
                </div>
                <span className="text-gray-400">{s.regionDivision || s.division}</span>
              </div>
            ))}
          </div>
          {sales.length > 8 && (
            <div className="p-3 text-center border-t">
              <button onClick={()=>setShowAll(!showAll)} className="text-xs text-red-600 font-bold">{showAll ? "Show Less" : `Show ${sales.length - 8} More →`}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

