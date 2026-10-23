"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Newspaper, Trophy, BarChart3, Filter } from "lucide-react"
import { client } from "@/lib/sanity"
import { DAILY_SALES_QUERY, calculateAggregates, DailySale } from "@/lib/sanityQueries"

interface Stats {
  total: number
  branchCounts: Record<string, number>
  topBranch: string
  regionCounts: Record<string, number>
  topPerson: [string, number] | undefined
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

  useEffect(() => {
    async function fetchSales() {
      setLoading(true)
      try {
        const data: DailySale[] = await client.fetch(DAILY_SALES_QUERY)
        const calculated = calculateAggregates(data)
        setStats({
          total: calculated.total,
          branchCounts: calculated.branchCounts,
          topBranch: calculated.topBranch,
          regionCounts: calculated.regionCounts,
          topPerson: calculated.topPerson as [string, number] | undefined,
          thisWeek: calculated.thisWeek,
          thisMonth: calculated.thisMonth,
          thisYear: calculated.thisYear,
          currentYear: calculated.currentYear,
        })
      } catch (e) {
        console.error("Sanity fetch error", e)
        // Fallback mock if Sanity fails or empty
        setStats({
          total: 0,
          branchCounts: { "KMM01": 0, "KMM02": 0, "KMM03": 0 },
          topBranch: "KMM03",
          regionCounts: {},
          topPerson: undefined,
          thisWeek: 0,
          thisMonth: 0,
          thisYear: 0,
          currentYear: new Date().getFullYear(),
        })
      } finally {
        setLoading(false)
      }
    }
    if (activeSheet === 'sales') fetchSales()
  }, [activeSheet])

  // 4 Categories only - NO Gold Prices as per user
  const newsCategories = [
    { name: "Myanmar News", icon: "🇲🇲", query: "myanmar-news" },
    { name: "Exchange Rates", icon: "💱", query: "exchange-rates" },
    { name: "Fuel Prices", icon: "⛽", query: "fuel-prices" },
    { name: "Crop Prices", icon: "🌾", query: "crop-prices" },
  ]

  // 14 Brands with exact naming as user specified
  const competitorBrands = [
    "Kubota News",
    "Kubota ZT News",
    "Kubota Second Hand",
    "Yanmar News",
    "John Deere News",
    "New Holland News",
    "YTO News",
    "Sonalika News",
    "Yamabisi News",
    "Mahindra News",
    "Dongfeng News",
    "Mahindra and Dongfeng News",
    "Deutzfhar and Matador News",
    "Other Brand"
  ]

  const handleNewsFilter = (query: string) => {
    setActiveSheet(null)
    // Use home page with filter param - prevents 404
    router.push(`/?newsCategory=${query}`)
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
  }

  const handleCompetitorFilter = (brand: string) => {
    setActiveSheet(null)
    router.push(`/?competitor=${encodeURIComponent(brand)}`)
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
  }

  const getTopRegion = () => {
    if (!stats || Object.keys(stats.regionCounts).length === 0) return null
    const sorted = Object.entries(stats.regionCounts).sort((a, b) => b[1] - a[1])
    return { region: sorted[0][0], count: sorted[0][1] }
  }

  const topRegion = getTopRegion()
  
  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around py-2 pb-safe">
        <button onClick={() => { window.scrollTo({top:0, behavior:"smooth"}); setActiveSheet(null)}} className="flex flex-col items-center px-2 py-1 min-w-[56px]">
          <Home className="w-5 h-5 text-red-600" />
          <span className="text-[10px] mt-1 font-medium text-red-600">HOME</span>
        </button>
        <button onClick={() => setActiveSheet(activeSheet==='news' ? null : 'news')} className="flex flex-col items-center px-2 py-1 min-w-[56px]">
          <Newspaper className={`w-5 h-5 ${activeSheet==='news' ? 'text-red-600' : 'text-gray-600'}`} />
          <span className={`text-[10px] mt-1 ${activeSheet==='news' ? 'text-red-600' : 'text-gray-600'}`}>News</span>
        </button>
        <button onClick={() => setActiveSheet(activeSheet==='competitor' ? null : 'competitor')} className="flex flex-col items-center px-2 py-1 min-w-[56px]">
          <Trophy className={`w-5 h-5 ${activeSheet==='competitor' ? 'text-red-600' : 'text-gray-600'}`} />
          <span className={`text-[10px] mt-1 ${activeSheet==='competitor' ? 'text-red-600' : 'text-gray-600'}`}>Competitor</span>
        </button>
        <button onClick={() => setActiveSheet(activeSheet==='sales' ? null : 'sales')} className="flex flex-col items-center px-2 py-1 min-w-[56px]">
          <BarChart3 className={`w-5 h-5 ${activeSheet==='sales' ? 'text-red-600' : 'text-gray-600'}`} />
          <span className={`text-[10px] mt-1 ${activeSheet==='sales' ? 'text-red-600' : 'text-gray-600'}`}>Daily Sales</span>
        </button>
        <button onClick={onOpenFilter} className="flex flex-col items-center px-2 py-1 min-w-[48px]">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-[10px] mt-1 text-gray-600">Filters</span>
        </button>
      </div>

      {activeSheet && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-[60]" onClick={()=>setActiveSheet(null)} />
          <div className="lg:hidden fixed bottom-[64px] left-0 right-0 bg-white rounded-t-[24px] z-[70] max-h-[75vh] overflow-y-auto p-4 shadow-2xl">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            {activeSheet==='news' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">News Categories</h3>
                <p className="text-xs text-gray-500">Myanmar News, Exchange Rates, Fuel Prices, Crop Prices</p>
                <div className="space-y-2">
                  {newsCategories.map(item => (
                    <button 
                      key={item.name} 
                      onClick={() => handleNewsFilter(item.query)}
                      className="w-full flex items-center gap-3 p-3 border rounded-xl text-left hover:bg-red-50 hover:border-red-200 min-h-[48px] transition"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-[14px] font-medium flex-1">{item.name}</span>
                      <span className="text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSheet==='competitor' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Competitor News - 14 Brands</h3>
                <p className="text-xs text-gray-500">Select brand to view latest news</p>
                <div className="grid grid-cols-1 gap-2">
                  {competitorBrands.map(b=>(
                    <button 
                      key={b} 
                      onClick={() => handleCompetitorFilter(b)}
                      className="border rounded-xl p-3 text-left text-[13px] font-medium min-h-[48px] hover:bg-red-50 hover:border-red-200 transition"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSheet==='sales' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Daily Sales - KMM01/02/03 + Regional</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">Loading real data from Sanity...</p>
                    <div className="mt-2 animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : stats && stats.total > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 p-3 rounded-xl border"><div className="text-xl font-bold">{stats.total}</div><div className="text-[11px] text-gray-600">All Total</div></div>
                      <div className="bg-red-50 p-3 rounded-xl border border-red-100"><div className="text-lg font-bold text-red-600">{stats.topBranch} 🏆</div><div className="text-[11px] text-gray-600">Top Branch</div></div>
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">{topRegion ? topRegion.count : 0}</div>
                        <div className="text-[11px] text-gray-600">{topRegion ? `${topRegion.region}` : "Ayeyarwady"} #1</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-xl p-3 space-y-3 bg-white">
                      <h4 className="font-semibold text-sm">Branch Breakdown - KMM01 / KMM02 / KMM03</h4>
                      <p className="text-[11px] text-gray-500">Tap to see how many each branch sold - Real Sanity Data</p>
                      {Object.entries(stats.branchCounts).length > 0 ? Object.entries(stats.branchCounts).map(([branch, count]) => {
                        const total = stats.total || 1
                        const pct = Math.round((count / total) * 100)
                        const isTop = branch === stats.topBranch
                        return (
                          <div key={branch}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className={`font-medium ${isTop ? 'text-red-600' : ''}`}>{branch} {isTop ? '👑' : ''}</span>
                              <span>{count} Units {pct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                              <div className={`h-2.5 rounded-full ${branch==='KMM01'?'bg-orange-500':branch==='KMM02'?'bg-blue-500':'bg-red-500'}`} style={{width:`${pct}%`}} />
                            </div>
                          </div>
                        )
                      }) : (
                        <p className="text-xs text-gray-500">No branch data yet - Add dailySale in Sanity Studio</p>
                      )}
                    </div>

                    {stats.topPerson && (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                        <h4 className="font-semibold text-[13px] mb-1">Top Sales Person ({stats.currentYear})</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-[14px] font-medium">{stats.topPerson[0]}</span>
                          <span className="font-bold text-[14px]">{stats.topPerson[1]} Sales</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">App started 2 months ago. Reset Jan 2027.</p>
                      </div>
                    )}

                    <div className="bg-gray-50 border rounded-xl p-3">
                      <h4 className="font-semibold text-[13px] mb-2">Regional Sales - Where machines delivered</h4>
                      {Object.keys(stats.regionCounts).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(stats.regionCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([region, count]) => (
                            <div key={region} className="flex justify-between text-xs">
                              <span>{region}</span><span className="font-bold">{count} Units</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No regional data yet</p>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] text-gray-400">Real-time from Sanity - Type: dailySale</p>
                      <p className="text-[11px] text-gray-400">KMM01, KMM02, KMM03 branches</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm font-medium">No Sales Data Yet</p>
                      <p className="text-xs text-gray-600 mt-1">Add documents with _type: &quot;dailySale&quot; in Sanity Studio</p>
                      <p className="text-xs text-gray-500 mt-2">Required fields: branch (KMM01/02/03), saleDate, model, salesPerson, regionDivision</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center opacity-60">
                      <div className="bg-gray-50 p-3 rounded-xl border"><div className="text-xl font-bold">0</div><div className="text-[11px]">All Total</div></div>
                      <div className="bg-red-50 p-3 rounded-xl border"><div className="text-lg font-bold text-red-600">KMM03</div><div className="text-[11px]">Top Branch</div></div>
                      <div className="bg-blue-50 p-3 rounded-xl border"><div className="text-lg font-bold">0</div><div className="text-[11px]">Region #1</div></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

