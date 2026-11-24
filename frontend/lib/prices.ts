export const PRICE_BRANDS = [
  'Kubota', 'Yanmar', 'YTO', 'Mahindra', 'Dongfeng', 'New Holland', 'John Deere',
  'Yamabisi', 'Sonalika', 'Deutzfahr', 'Matador', 'Farmtrac', 'Kubota ZT Engine', 'Other Brand',
] as const

export interface PriceItem {
  _id: string
  brand?: string
  modelName?: string
  itemType?: 'machine' | 'implement'
  category?: string
  series?: string
  parentModel?: string
  frontDozer?: 'with-front-dozer' | 'without-front-dozer'
  specialDozer?: 'with-special-dozer'
  frontLoader?: 'with-front-loader'
  horsepower?: number
  price?: number
  currency?: string
  image?: Record<string, unknown>
  notes?: string
}

const kubotaModelNames = [
  'B2440s', 'B2440s+SD', 'L3208', 'L3208+FD', 'L4018', 'L4018+FD', 'L5228', 'L5228+FD', 'L5228+SD', 'L5228+LA',
  'MU4902', 'MU4902+FD', 'MU5702', 'MU5702+FD', 'M6040SU', 'M6040SU+FD', 'M6040HI', 'M6040HI+FD',
  'M6240SU', 'M6240SU+FD', 'M6240HI', 'M6240HI+FD', 'M7040', 'M7040+FD', 'M8540', 'M8540+FD', 'M8540+LA',
  'M9540', 'M9540+FD', 'M9540+LA', 'M108s', 'M108s+FD', 'DC70G Pro', 'SPV6-CMD',
  'U17-3 (1.7 Tons)', 'KX033-4 (3 Tons)', 'U55-6 (5 Tons)', 'U55-6 Cabin (5 Tons)', 'KX080-3 (8 Tons)',
]

function brandKey(brand: string) {
  return brand.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function matchesPriceBrand(itemBrand: string | undefined, selectedBrand: string): boolean {
  if (!itemBrand?.trim()) return false
  const key = brandKey(itemBrand)
  const knownBrand = PRICE_BRANDS.find((brand) => brandKey(brand) === key)
  return selectedBrand === 'Other Brand' ? !knownBrand || knownBrand === 'Other Brand' : knownBrand === selectedBrand
}

export function priceVariantName(item: PriceItem): string {
  const suffix = [
    item.frontDozer === 'with-front-dozer' ? '+FD' : '',
    item.specialDozer === 'with-special-dozer' ? '+SD' : '',
    item.frontLoader === 'with-front-loader' ? '+LA' : '',
  ].join('')
  return `${item.modelName || ''}${suffix}`
}

export interface PriceModelOption {
  value: string
  name: string
  category?: string
  brand?: string
  machine?: PriceItem
}

export function getPriceModels(brand: string, items: PriceItem[]): PriceModelOption[] {
  const machines = items.filter((item) => matchesPriceBrand(item.brand, brand) && item.itemType !== 'implement' && item.modelName)
  const options: PriceModelOption[] = machines.map((machine) => ({
    value: machine._id,
    name: priceVariantName(machine),
    category: machine.category,
    brand: machine.brand,
    machine,
  }))
  if (brand === 'Kubota' && machines.length > 0) {
    for (const name of kubotaModelNames) {
      if (options.some((option) => option.name === name)) continue
      const base = name.replace(/\+(FD|SD|LA)$/, '')
      const category = machines.find((machine) => machine.modelName === base)?.category
      options.push({ value: `unpublished:${name}`, name, category, brand: 'Kubota', machine: undefined })
    }
  }
  return options
}

export function getModelImplements(model: PriceModelOption, items: PriceItem[]): PriceItem[] {
  const base = model.machine?.modelName || model.name.replace(/\+(FD|SD|LA)$/, '')
  return items.filter((item) => item.itemType === 'implement' && !!item.brand && !!model.brand &&
    brandKey(item.brand) === brandKey(model.brand) && (item.parentModel === base || item.parentModel === model.name))
}

export function getUnmatchedImplements(brand: string, models: PriceModelOption[], items: PriceItem[]): PriceItem[] {
  return items.filter((item) => item.itemType === 'implement' && matchesPriceBrand(item.brand, brand) &&
    !models.some((model) => getModelImplements(model, [item]).length > 0))
}

export function hasPrice(item: PriceItem): item is PriceItem & { price: number } {
  return typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0
}

export function calculatePriceTotal(machine: PriceItem | undefined, implementsList: PriceItem[]): number | undefined {
  if (!machine || !hasPrice(machine) || implementsList.some((item) => !hasPrice(item))) return undefined
  if (implementsList.length && (!machine.currency || implementsList.some((item) => item.currency !== machine.currency))) return undefined
  return implementsList.reduce((total, item) => total + (hasPrice(item) ? item.price : 0), machine.price)
}
