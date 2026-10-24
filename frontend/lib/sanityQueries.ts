// GROQ for Sanity - Daily Sales KMM01/02/03 - Try multiple type names
export const DAILY_SALES_QUERY = `*[_type in ["dailySale", "dailySales", "sale", "sales"]] | order(saleDate desc) {
  _id, branch, saleDate, model, customerName, regionDivision, paymentType, salesPerson, photo{asset->{url}}
}`

export interface DailySale {
  _id: string
  branch: "KMM01" | "KMM02" | "KMM03" | string
  saleDate: string
  model: string
  customerName: string
  regionDivision: string
  paymentType: string
  salesPerson: string
  photo?: { asset: { url: string } }
}

export function calculateAggregates(sales: DailySale[]) {
  const currentYear = new Date().getFullYear()
  const thisYearSales = sales.filter(s => s.saleDate && new Date(s.saleDate).getFullYear() === currentYear)
  const total = sales.length
  
  const branchCounts: Record<string, number> = {}
  sales.forEach(s => { 
    const branch = s.branch || "KMM03"
    branchCounts[branch] = (branchCounts[branch]||0)+1 
  })
  const topBranch = Object.entries(branchCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "KMM03"
  
  const regionCounts: Record<string, number> = {}
  sales.forEach(s => { 
    const region = s.regionDivision || "Ayeyarwady"
    regionCounts[region] = (regionCounts[region]||0)+1 
  })
  
  const personCounts: Record<string, number> = {}
  thisYearSales.forEach(s => { 
    const person = s.salesPerson || "Unknown"
    personCounts[person] = (personCounts[person]||0)+1 
  })
  const topPerson = Object.entries(personCounts).sort((a,b)=>b[1]-a[1])[0]
  
  const now = new Date()
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7)
  const thisWeek = sales.filter(s => s.saleDate && new Date(s.saleDate) >= weekAgo).length
  const thisMonth = sales.filter(s => { 
    if (!s.saleDate) return false
    const d=new Date(s.saleDate); 
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear() 
  }).length
  
  return { total, branchCounts, topBranch, regionCounts, topPerson, thisWeek, thisMonth, thisYear: thisYearSales.length, currentYear }
}

