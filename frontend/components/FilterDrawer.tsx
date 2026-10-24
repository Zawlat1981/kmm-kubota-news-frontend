"use client"
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function FilterDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [fbPage, setFbPage] = useState("")
  const [brandPrice, setBrandPrice] = useState("")
  const [company, setCompany] = useState("")

  // Sync from URL when drawer opens - use ref to avoid cascading renders warning
  useEffect(() => {
    if (!isOpen) return
    const search = searchParams.get("search") || ""
    const date = searchParams.get("date") || ""
    const fb = searchParams.get("fbPage") || ""
    const brand = searchParams.get("brandPrice") || ""
    const comp = searchParams.get("company") || ""
    // Batch updates in single tick to avoid cascading error
    if (search !== searchText) setSearchText(search)
    if (date !== dateFilter) setDateFilter(date)
    if (fb !== fbPage) setFbPage(fb)
    if (brand !== brandPrice) setBrandPrice(brand)
    if (comp !== company) setCompany(comp)
  }, [isOpen])

  if (!isOpen) return null

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Search by title or text
    if (searchText.trim()) params.set("search", searchText.trim()); else params.delete("search")
    
    // Filter by date
    if (dateFilter) params.set("date", dateFilter); else params.delete("date")
    
    // Facebook Pages - keep but don't filter news
    if (fbPage) params.set("fbPage", fbPage); else params.delete("fbPage")
    
    // All Brand Prices - this filters to show prices
    if (brandPrice) {
      params.set("brandPrice", brandPrice)
    } else {
      params.delete("brandPrice")
    }
    
    // All Companies
    if (company) {
      params.set("company", company)
    } else {
      params.delete("company")
    }

    const queryString = params.toString()
    if (queryString) {
      router.push(`/?${queryString}`)
    } else {
      router.push("/")
    }
    
    // If Facebook page selected, open it
    if (fbPage) {
      const pages: Record<string, string> = {
        mawlamyine: "https://www.facebook.com/kmmkubota",
        tharyarwaddy: "https://www.facebook.com/kmmkubotatyd",
        nawnghkio: "https://www.facebook.com/profile.php?id=100076295352470"
      }
      if (pages[fbPage]) {
        setTimeout(() => window.open(pages[fbPage], "_blank", "noopener,noreferrer"), 300)
      }
    }
    
    onClose()
  }

  const clearFilters = () => {
    setSearchText("")
    setDateFilter("")
    setFbPage("")
    setBrandPrice("")
    setCompany("")
    router.push("/")
    onClose()
  }

  const handleFbChange = (value: string) => {
    setFbPage(value)
    // Open immediately for better UX
    if (value) {
      const pages: Record<string, string> = {
        mawlamyine: "https://www.facebook.com/kmmkubota",
        tharyarwaddy: "https://www.facebook.com/kmmkubotatyd",
        nawnghkio: "https://www.facebook.com/profile.php?id=100076295352470"
      }
      if (pages[value]) window.open(pages[value], "_blank", "noopener,noreferrer")
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[10005] lg:hidden" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white z-[10010] lg:hidden overflow-y-auto flex flex-col shadow-2xl">
        <div className="bg-red-600 text-white p-4 flex justify-between items-center shrink-0">
          <span className="font-bold text-[16px]">FILTERS</span>
          <button onClick={onClose} className="p-1 active:bg-red-700 rounded"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-4 space-y-5 flex-1 overflow-y-auto pb-4">
          {/* Search */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Search by title or text</label>
            <p className="text-[11px] text-gray-400 mt-1">ခေါင်းစဉ် သို့မဟုတ် စာသားဖြင့် ရှာမယ်</p>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Search news... ex: Kubota" 
                className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Filter by date</label>
            <p className="text-[11px] text-gray-400 mt-1">ရက်စွဲဖြင့် စစ်မယ်</p>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
          </div>

          {/* Facebook Pages */}
          <div>
            <label className="text-sm font-semibold text-gray-800">KMM Kubota Facebook Pages</label>
            <select value={fbPage} onChange={(e) => handleFbChange(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
              <option value="">Select Facebook Page</option>
              <option value="mawlamyine">KMM Kubota Mawlamyine</option>
              <option value="tharyarwaddy">KMM Kubota Tharyarwaddy</option>
              <option value="nawnghkio">KMM Kubota Nawnghkio</option>
            </select>
          </div>

          {/* Brand Prices */}
          <div>
            <label className="text-sm font-semibold text-gray-800">All Brand Prices</label>
            <p className="text-[11px] text-gray-400 mt-1">Brand ဈေးနှုန်းများ ကြည့်မယ်</p>
            <select value={brandPrice} onChange={(e) => setBrandPrice(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
              <option value="">Select Brand</option>
              <option value="Kubota">Kubota - Models & Prices</option>
              <option value="Yanmar">Yanmar</option>
              <option value="John Deere">John Deere</option>
              <option value="New Holland">New Holland</option>
              <option value="YTO">YTO</option>
            </select>
          </div>

          {/* Companies */}
          <div>
            <label className="text-sm font-semibold text-gray-800">All Companies</label>
            <p className="text-[11px] text-gray-400 mt-1">Company များကြည့်မယ်</p>
            <select value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
              <option value="">Select Company</option>
              <option value="kubota">Kubota Companies</option>
              <option value="other">Other Brand Companies</option>
            </select>
          </div>
        </div>

        {/* Fixed bottom buttons - always visible above BottomNav */}
        <div className="p-4 border-t bg-white shrink-0 sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="flex gap-2">
            <button onClick={applyFilters} className="flex-1 bg-red-600 text-white py-3.5 rounded-xl text-[15px] font-bold active:bg-red-700 shadow-md touch-manipulation min-h-[48px]">Apply - စစ်မယ်</button>
            <button onClick={clearFilters} className="flex-1 border border-gray-300 py-3.5 rounded-xl text-[14px] font-medium active:bg-gray-50 touch-manipulation min-h-[48px]">Clear - ရှင်းမယ်</button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">Apply နှိပ်မှ filter အလုပ်လုပ်မယ်</p>
          {/* Extra space to avoid BottomNav overlap on some devices */}
          <div className="h-2 lg:hidden" />
        </div>
      </div>
    </>
  )
}

