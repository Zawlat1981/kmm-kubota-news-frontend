"use client"
export default function TopFilterBar() {
  return (
    <div className="hidden lg:flex gap-3 py-3 border-b bg-white px-4">
      <select className="border rounded px-3 py-1.5 text-sm"><option>News Categories</option></select>
      <select className="border rounded px-3 py-1.5 text-sm"><option>Competitor News</option></select>
      <select className="border rounded px-3 py-1.5 text-sm"><option>Daily Sales</option></select>
      <select className="border rounded px-3 py-1.5 text-sm"><option>All Brand Prices</option></select>
      <select className="border rounded px-3 py-1.5 text-sm"><option>All Companies</option></select>
    </div>
  )
} 

