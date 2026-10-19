'use client'

import { useState } from 'react'

interface StockItem {
  id: string
  branchCode: string
  brand?: string | null
  modelNumber: string
  serialNumber?: string | null
  addedAt: string
}

export default function StockBranchView({
  items,
  branchCodes,
}: {
  items: StockItem[]
  branchCodes: string[]
}) {
  const [selectedBranch, setSelectedBranch] = useState(branchCodes[0] || '')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredItems = items.filter((item) => item.branchCode === selectedBranch)

  const handleDelete = async (id: string) => {
    if (!confirm('ဒီ Item ကို ဖျက်မှာ သေချာပါသလား? (ဥပမာ - ရောင်းပြီးသွားရင်)')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/internal/stock?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('ဖျက်၍ မရပါ — ထပ်ကြိုးစားပါ')
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (branchCodes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        Stock Data မရှိသေးပါ — &quot;+ Add Stock Item&quot; နှိပ်ပြီး စတင်ဖြည့်ပါ
      </div>
    )
  }

  return (
    <div>
      {/* Branch tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {branchCodes.map((code) => (
          <button
            key={code}
            onClick={() => setSelectedBranch(code)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedBranch === code
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">{selectedBranch}</span> — Total{' '}
          <span className="font-bold text-red-600">{filteredItems.length}</span> unit(s) in stock
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Brand</th>
              <th className="text-left px-4 py-3">Model Number</th>
              <th className="text-left px-4 py-3">Serial Number</th>
              <th className="text-left px-4 py-3">Added</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.brand || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{item.modelNumber}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.serialNumber || '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(item.addedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-xs text-gray-400 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {selectedBranch} အတွက် Stock Item မရှိသေးပါ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}