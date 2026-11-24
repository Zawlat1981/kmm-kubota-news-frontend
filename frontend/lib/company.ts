export interface CompanyItem {
  _id: string
  slug?: { current: string }
  companyGroup?: string
  companyName?: string
  category?: string
  brand?: string
  stateRegion?: string
  cityTownship?: string
  companyImage?: { asset?: Record<string, unknown>; [key: string]: unknown }
  address?: string
  phone?: string
  email?: string
}

export type CompanyRecord = Omit<CompanyItem, 'brand'> & { brand?: unknown }

export function formatCompanyBrand(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const brands = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    if (brands.length !== value.length) console.warn('Company brand contains invalid or empty entries')
    return brands.length ? brands.join(', ') : undefined
  }
  console.warn('Company brand has an unexpected format')
  return undefined
}

export function normalizeCompany(company: CompanyRecord): CompanyItem {
  return { ...company, brand: formatCompanyBrand(company.brand) }
}

export function safeCompanyWebUrl(value: string): string | undefined {
  try {
    const trimmed = value.trim()
    if (/\s/.test(trimmed)) return undefined
    const url = new URL(trimmed)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch (error) {
    if (error instanceof TypeError) return undefined
    throw error
  }
}

export function splitCompanyWebLinks(value: string): string[] {
  return value.split(/,\s+(?=https?:\/\/)/i).map((link) => link.trim())
}
