import type { UiKey } from './uiText'

export function newsCategoryKey(category?: string): UiKey | undefined {
  if (!category) return 'newsCategoryDefault'
  const normalized = category.toLowerCase().replace(/[-_]+/g, ' ')
  if (category.includes('မြန်မာနိုင်ငံ') || normalized.includes('myanmar')) return 'myanmarNews'
  if (category.includes('လောင်စာဆီ') || normalized.includes('fuel')) return 'fuelPrices'
  if (category.includes('ဈေးနှုန်း') || normalized.includes('crop')) return 'cropPrices'
  if (normalized.includes('exchange')) return 'exchangeRates'
  if (normalized.includes('kubota') && normalized.includes('zt')) return 'kubotaZtNews'
  if (normalized.includes('second') || category.includes('ဒုတိယလက်သုံး')) return 'kubotaSecondNews'
  if (normalized.includes('kubota')) return 'kubotaNews'
  if (normalized.includes('yanmar') || normalized.includes('yammar')) return 'yanmarNews'
  if (normalized.includes('john') || normalized.includes('deere')) return 'johnDeereNews'
  if (normalized.includes('new holland')) return 'newHollandNews'
  if (normalized.includes('yto')) return 'ytoNews'
  if (normalized.includes('sonalika')) return 'sonalikaNews'
  if (normalized.includes('yamabisi')) return 'yamabisiNews'
  if (normalized.includes('mahindra') && normalized.includes('dongfeng')) return 'mahindraDongfengNews'
  if (normalized.includes('mahindra')) return 'mahindraNews'
  if (normalized.includes('dongfeng')) return 'dongfengNews'
  if (normalized.includes('deutz') || normalized.includes('matador')) return 'deutzfarMatadorNews'
  if (normalized.includes('other brand') || category.includes('အခြား')) return 'otherBrandNews'
  return undefined
}
