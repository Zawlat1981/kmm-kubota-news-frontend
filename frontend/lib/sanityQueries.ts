// GROQ for Sanity - Daily Sales KMM01/02/03
export const DAILY_SALES_QUERY = `*[_type == "dailySale"] | order(saleDate desc) {
  _id, branch, saleDate, model, customerName, regionDivision, paymentType, salesPerson, photo{asset->{url}}
}`

export interface DailySale {
  _id: string
  branch: "KMM01" | "KMM02" | "KMM03"
  saleDate: string
  model: string
  customerName: string
  regionDivision: string
  paymentType: string
  salesPerson: string
  photo?: { asset: { url: string } }
}

export function calculateAggregates(sales: DailySale[]) {
  const currentYear = new Date().getFullYear() // 2026 - app started Aug, so data incomplete
  const thisYearSales = sales.filter(s => new Date(s.saleDate).getFullYear() === currentYear)
  const total = sales.length
  
  // Branch KMM01/02/03
  const branchCounts: Record<string, number> = {}
  sales.forEach(s => { branchCounts[s.branch] = (branchCounts[s.branch]||0)+1 })
  const topBranch = Object.entries(branchCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "KMM03"
  
  // Region: where machine sold
  const regionCounts: Record<string, number> = {}
  sales.forEach(s => { regionCounts[s.regionDivision] = (regionCounts[s.regionDivision]||0)+1 })
  
  // Top Sales Person - yearly, using available data (2 months), reset in 2027
  const personCounts: Record<string, number> = {}
  thisYearSales.forEach(s => { personCounts[s.salesPerson] = (personCounts[s.salesPerson]||0)+1 })
  const topPerson = Object.entries(personCounts).sort((a,b)=>b[1]-a[1])[0]
  
  // Week/Month/Year
  const now = new Date()
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7)
  const thisWeek = sales.filter(s => new Date(s.saleDate) >= weekAgo).length
  const thisMonth = sales.filter(s => { const d=new Date(s.saleDate); return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear() }).length
  
  return { total, branchCounts, topBranch, regionCounts, topPerson, thisWeek, thisMonth, thisYear: thisYearSales.length, currentYear }
}

