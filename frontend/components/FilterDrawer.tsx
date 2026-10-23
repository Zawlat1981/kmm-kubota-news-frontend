"use client"
import { X, Search } from "lucide-react"

export default function FilterDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white z-50 lg:hidden overflow-y-auto">
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <span className="font-bold">FILTERS</span>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-5">
          {/* Option C: Search inside drawer */}
          <div>
            <label className="text-sm font-semibold">Search by title or text</label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input placeholder="Search news..." className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Filter by date</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold">KMM Kubota Facebook Pages</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm mt-2">
              <option>Select Facebook Page</option>
              <option>KMM Kubota Mawlamyine</option>
              <option>KMM Kubota Tharyarwaddy</option>
              <option>KMM Kubota Nawnghkio</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">All Brand Prices</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm mt-2">
              <option>Select Brand</option><option>Kubota</option><option>Yanmar</option><option>John Deere</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">All Companies</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm mt-2">
              <option>Select Company</option><option>Kaung Gyi Aung</option><option>LST Kubota</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm">Apply</button>
            <button className="flex-1 border py-2 rounded-lg text-sm">Clear</button>
          </div>
        </div>
      </div> 
    </>
  )
}

