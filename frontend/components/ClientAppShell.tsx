"use client"
import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import FilterDrawer from "@/components/FilterDrawer"

export default function ClientAppShell({ children }: { children: React.ReactNode }) {
  const [filterOpen, setFilterOpen] = useState(false)
  return (
    <>
      <FilterDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <BottomNav onOpenFilter={() => setFilterOpen(true)} />
    </>
  )
}

