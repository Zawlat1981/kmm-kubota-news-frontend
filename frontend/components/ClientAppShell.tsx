"use client"
import { useState } from "react"
import TopFilterBar from "@/components/TopFilterBar"
import BottomNav from "@/components/BottomNav"
import FilterDrawer from "@/components/FilterDrawer"

export default function ClientAppShell({ children }: { children: React.ReactNode }) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      {/* Desktop Top Filters - Hidden on Mobile (Top အနီရောင် Dropdown မလိုတော့ဘူး) */}
      <TopFilterBar />

      {/* Filter Drawer - Option C: Search inside drawer */}
      <FilterDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Bar - 4 Main + Filters */}
      <BottomNav onOpenFilter={() => setFilterOpen(true)} />
    </>
  )
}