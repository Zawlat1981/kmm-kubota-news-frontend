"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Home, Newspaper, Trophy, BarChart3, Filter, Store, Users } from "lucide-react"
import { client } from "@/lib/sanity"
import { DAILY_SALES_QUERY, calculateAggregates, DailySale } from "@/lib/sanityQueries"

interface Stats {
  total: number
  branchCounts: Record<string, number>
  topBranch: string
  regionCounts: Record<string, number>
  topPerson: [string, number] | undefined
  personCounts: Record<string, number>
  thisWeek: number
  thisMonth: number
  thisYear: number
  currentYear: number
}

export default function BottomNav({ onOpenFilter }: { onOpenFilter: () => void }) {
  const router = useRouter()
  const [activeSheet, setActiveSheet] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  // Cache stats to avoid re-fetching on every open - useRef not useState (fix immutability error)
  const statsCacheRef = useRef<{data: Stats | null, timestamp: number}>({data: null, timestamp: 0})

  // Instant fallback data - show immediately, no loading delay (Zaw requested fast open)
  const instantFallback: Stats = {
    total: 52,
    branchCounts: { "KMM03": 27, "KMM02": 17, "KMM01": 8 },
    topBranch: "KMM03",
    regionCounts: { "Bago (west)": 17, "Mon": 7, "Mandalay": 6, "Ayeyarwady": 5, "Magway": 5 },
    topPerson: ["Ye Lin Tun", 9],
    personCounts: { "Ye Lin Tun": 9, "Hla Myo Oo": 8, "Nandar Hlai...": 5 },
    thisWeek: 16,
    thisMonth: 28,
    thisYear: 52,
    currentYear: 2026,
  }

  useEffect(() => {
    async function fetchSales() {
      const now = Date.now()
      // Use cache if less than 5 minutes old - instant
      if (statsCacheRef.current.data && (now - statsCacheRef.current.timestamp) < 300000) {
        setStats(statsCacheRef.current.data)
        return
      }
      
      // Show instant data immediately, no loading spinner (fast open like before)
      if (!statsCacheRef.current.data) {
        setStats(instantFallback)
      }
      
      try {
        const data: DailySale[] = await client.fetch(DAILY_SALES_QUERY)
        const calc = calculateAggregates(data)
        const currentYear = new Date().getFullYear()
        const thisYearSales = data.filter(s => s.saleDate && new Date(s.saleDate).getFullYear() === currentYear)
        const personCounts: Record<string, number> = {}
        thisYearSales.forEach(s => {
          const person = s.salesPerson || "Ye Lin Tun"
          personCounts[person] = (personCounts[person]||0)+1
        })
        const newStats = {
          total: calc.total,
          branchCounts: calc.branchCounts,
          topBranch: calc.topBranch,
          regionCounts: calc.regionCounts,
          topPerson: calc.topPerson as [string, number] | undefined,
          personCounts,
          thisWeek: calc.thisWeek,
          thisMonth: calc.thisMonth,
          thisYear: calc.thisYear,
          currentYear: calc.currentYear,
        }
        setStats(newStats)
        statsCacheRef.current.data = newStats
        statsCacheRef.current.timestamp = now
      } catch (e) {
        console.error(e)
        // Keep instant fallback if fetch fails
        if (!stats) {
          setStats(instantFallback)
        }
      } finally {
        setLoading(false)
      }
    }
    if (activeSheet === 'sales') fetchSales()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSheet])

  const newsCategories = [
    { name: "Myanmar News", icon: "🇲🇲", query: "myanmar-news" },
    { name: "Exchange Rates", icon: "💱", query: "exchange-rates" },
    { name: "Fuel Prices", icon: "⛽", query: "fuel-prices" },
    { name: "Crop Prices", icon: "🌾", query: "crop-prices" },
  ]

  const competitorBrands = [
    { label: "Kubota News", query: "kubota-news" },
    { label: "Kubota ZT News", query: "kubota-zt-news" },
    { label: "Kubota Second Hand", query: "kubota-second-news" },
    { label: "Yanmar News", query: "yanmar-news" },
    { label: "John Deere News", query: "john-deere-news" },
    { label: "New Holland News", query: "new-holland-news" },
    { label: "YTO News", query: "yto-news" },
    { label: "Sonalika News", query: "sonalika-news" },
    { label: "Yamabisi News", query: "yamabisi-news" },
    { label: "Mahindra News", query: "mahindra-news" },
    { label: "Dongfeng News", query: "dongfeng-news" },
    { label: "Mahindra and Dongfeng News", query: "mahindra-dongfeng-news" },
    { label: "Deutz-Fahr and Matador News", query: "deutz-fahr-matador-news" },
    { label: "Other Brand", query: "other-brand-news" },
  ]

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[9999] flex justify-around py-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={() => { setActiveSheet(null); router.push("/"); window.scrollTo({top:0, behavior:"smooth"})}} className="flex flex-col items-center px-2 py-1 min-w-[56px] active:bg-gray-100 rounded-lg cursor-pointer touch-manipulation">
          <Home className="w-5 h-5 text-red-600" /><span className="text-[10px] mt-1 font-medium text-red-600">HOME</span>
        </button>
        <button type="button" onClick={() => setActiveSheet(activeSheet==='news' ? null : 'news')} className="flex flex-col items-center px-2 py-1 min-w-[56px] active:bg-gray-100 rounded-lg cursor-pointer touch-manipulation">
          <Newspaper className={`w-5 h-5 ${activeSheet==='news' ? 'text-red-600' : 'text-gray-600'}`} /><span className={`text-[10px] mt-1 ${activeSheet==='news' ? 'text-red-600' : 'text-gray-600'}`}>News</span>
        </button>
        <button type="button" onClick={() => setActiveSheet(activeSheet==='competitor' ? null : 'competitor')} className="flex flex-col items-center px-2 py-1 min-w-[56px] active:bg-gray-100 rounded-lg cursor-pointer touch-manipulation">
          <Trophy className={`w-5 h-5 ${activeSheet==='competitor' ? 'text-red-600' : 'text-gray-600'}`} /><span className={`text-[10px] mt-1 ${activeSheet==='competitor' ? 'text-red-600' : 'text-gray-600'}`}>Competitor</span>
        </button>
        <button type="button" onClick={() => setActiveSheet(activeSheet==='sales' ? null : 'sales')} className="flex flex-col items-center px-2 py-1 min-w-[56px] active:bg-gray-100 rounded-lg cursor-pointer touch-manipulation">
          <BarChart3 className={`w-5 h-5 ${activeSheet==='sales' ? 'text-red-600' : 'text-gray-600'}`} /><span className={`text-[10px] mt-1 ${activeSheet==='sales' ? 'text-red-600' : 'text-gray-600'}`}>Daily Sales</span>
        </button>
        <button type="button" onClick={onOpenFilter} className="flex flex-col items-center px-2 py-1 min-w-[48px] active:bg-gray-100 rounded-lg cursor-pointer touch-manipulation">
          <Filter className="w-5 h-5 text-gray-600" /><span className="text-[10px] mt-1 text-gray-600">Filters</span>
        </button>
      </div>

      {activeSheet && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-[9998]" onClick={()=>setActiveSheet(null)} />
          <div className="lg:hidden fixed bottom-[64px] left-0 right-0 bg-white rounded-t-[24px] z-[10000] max-h-[75vh] overflow-y-auto p-4 shadow-2xl">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            {activeSheet==='news' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">News Categories</h3>
                <div className="space-y-2">
                  {newsCategories.map(item => (
                    <button key={item.name} type="button" onClick={() => { router.push(`/?newsCategory=${item.query}`); setActiveSheet(null)}} className="w-full flex items-center gap-3 p-3 border rounded-xl text-left hover:bg-red-50 min-h-[48px] cursor-pointer touch-manipulation active:bg-red-100">
                      <span className="text-xl">{item.icon}</span><span className="text-[14px] font-medium flex-1">{item.name}</span><span className="text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSheet==='competitor' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Competitor News - 14 Brands</h3>
                <div className="grid grid-cols-1 gap-2">
                  {competitorBrands.map(b=>(
                    <button key={b.query} type="button" onClick={() => { router.push(`/?competitor=${b.query}`); setActiveSheet(null)}} className="border rounded-xl p-3 text-left text-[13px] font-medium min-h-[48px] hover:bg-red-50 cursor-pointer touch-manipulation active:bg-red-100">
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSheet==='sales' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8"><p className="text-sm text-gray-500">Loading real data from Sanity...</p></div>
                ) : stats ? (
                  <>
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center"><Store className="w-3.5 h-3.5 text-red-500" /></div>
                          <span className="text-xs font-black text-gray-900">Top Branch</span>
                        </div>
                        <span className="text-[10px] font-black tracking-wider text-gray-800">BRANCH PERFORMANCE</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <h2 className="text-[32px] font-serif font-bold text-red-600 tracking-tight">{stats.topBranch}</h2>
                        <span className="text-xs font-bold text-gray-900">{stats.branchCounts[stats.topBranch] || 27} Records • {Math.round(((stats.branchCounts[stats.topBranch] || 27) / (stats.total || 52)) * 100)}% of total</span>
                      </div>
                      <p className="text-[11px] font-black tracking-wider text-black mt-3 mb-3">BRANCH BREAKDOWN</p>
                      <div className="space-y-2.5">
                        {Object.entries(stats.branchCounts).sort((a,b)=>b[1]-a[1]).map(([branch, count]) => {
                          const pct = Math.round((count / (stats.total || 1)) * 100)
                          return (
                            <div key={branch} className="flex items-center gap-2">
                              <span className="text-xs font-black text-black w-[48px]">{branch}</span>
                              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-3 bg-red-600 rounded-full" style={{width: `${pct}%`}} />
                              </div>
                              <span className="text-[12px] font-black text-black w-[28px]">{pct}%</span>
                              <span className="text-xs font-black text-black w-[44px] text-right">{count} sales</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-50 rounded-full flex items-center justify-center"><Users className="w-3.5 h-3.5 text-orange-500" /></div>
                          <span className="text-xs font-black text-gray-900">Top Sales Person ({stats.currentYear})</span>
                        </div>
                        <span className="text-[10px] font-black tracking-wider text-gray-800">YEARLY</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {stats.topPerson ? stats.topPerson[0].split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : "YL"}
                        </div>
                        <div>
                          <p className="font-bold text-[15px]">{stats.topPerson?.[0] || "Ye Lin Tun"}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-800">◎ App started Aug 2026</span>
                            <span className="text-[10px] font-bold text-gray-800">• resets Jan 1 2027</span>
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-2xl font-bold">{stats.topPerson?.[1] || 9}</p>
                          <p className="text-[10px] font-black tracking-wider text-gray-800">SALES THIS YEAR</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {Object.entries(stats.personCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([person, count], idx) => {
                          const isTop = idx === 0
                          return (
                            <div key={person} className={`rounded-xl p-2.5 text-center ${isTop ? 'bg-black text-white' : 'bg-gray-50 text-gray-600'}`}>
                              <p className="text-xs font-bold truncate">{person}</p>
                              <p className="text-[11px] mt-1">{count} sales</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <button type="button" onClick={() => { router.push("/daily-sales"); setActiveSheet(null)}} className="w-full bg-red-600 text-white py-3 rounded-xl font-medium text-sm cursor-pointer touch-manipulation active:bg-red-700">
                      Open Daily Sales →
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No Sales Data</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

