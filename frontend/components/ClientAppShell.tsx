"use client"
import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import FilterDrawer from "@/components/FilterDrawer"

export default function ClientAppShell({ children }: { children: React.ReactNode }) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      {/* Filter Drawer - Search inside (Option C), Date, FB Pages, All Brand Prices, All Companies */}
      <FilterDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Bar - HOME=Latest Feed, News Cat, Competitor, Daily Sales KMM01/02/03+Regional */}
      <BottomNav onOpenFilter={() => setFilterOpen(true)} />
    </>
  )
}

