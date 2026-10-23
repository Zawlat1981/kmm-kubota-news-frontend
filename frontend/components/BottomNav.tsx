"use client"
import { useState } from "react"
import { Home, Newspaper, Trophy, BarChart3, Filter } from "lucide-react"

export default function BottomNav({ onOpenFilter }: { onOpenFilter: () => void }) {
  const [activeSheet, setActiveSheet] = useState<string | null>(null)
  
  return (
    <>
      {/* Bottom Bar - Mobile Only - 4 items + Filters */}
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
            {activeSheet==='sales' && (
              <div className="space-y-4">
                <h3 className="font-bold">Daily Sales - KMM01/02/03 + Regional</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 p-3 rounded-xl"><div className="font-bold">1,247</div><div className="text-xs">All Total</div></div>
                  <div className="bg-red-50 p-3 rounded-xl"><div className="font-bold text-red-600">KMM03 🏆</div><div className="text-xs">Top Branch</div></div>
                  <div className="bg-blue-50 p-3 rounded-xl"><div className="font-bold">127</div><div className="text-xs">Ayeyarwady #1</div></div>
                </div>
                <div className="border rounded-xl p-3 space-y-2">
                  <h4 className="font-semibold text-sm">Branch Breakdown</h4>
                  <div className="flex justify-between text-xs"><span>KMM01</span><span>342 Units 28%</span></div><div className="w-full bg-gray-200 h-2 rounded"><div className="bg-orange-500 h-2 rounded" style={{width:"28%"}} /></div>
                  <div className="flex justify-between text-xs"><span>KMM02</span><span>418 Units 35%</span></div><div className="w-full bg-gray-200 h-2 rounded"><div className="bg-blue-500 h-2 rounded" style={{width:"35%"}} /></div>
                  <div className="flex justify-between text-xs"><span>KMM03 👑</span><span>487 Units 39%</span></div><div className="w-full bg-gray-200 h-2 rounded"><div className="bg-red-500 h-2 rounded" style={{width:"39%"}} /></div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

