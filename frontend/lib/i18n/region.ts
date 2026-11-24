import type { SiteLanguage } from '@/contexts/LanguageContext'

const regions: Record<string, { en: string; th: string; my: string }> = {
  ayeyarwady: { en: 'Ayeyarwady', th: 'อิรวดี', my: 'ဧရာဝတီ' },
  bago: { en: 'Bago', th: 'พะโค', my: 'ပဲခူး' },
  'bago west': { en: 'Bago (West)', th: 'พะโค (ตะวันตก)', my: 'ပဲခူး (အနောက်)' },
  'bago east': { en: 'Bago (East)', th: 'พะโค (ตะวันออก)', my: 'ပဲခူး (အရှေ့)' },
  chin: { en: 'Chin', th: 'ชิน', my: 'ချင်း' },
  kachin: { en: 'Kachin', th: 'กะฉิ่น', my: 'ကချင်' },
  kayah: { en: 'Kayah', th: 'กะยา', my: 'ကယား' },
  kayin: { en: 'Kayin', th: 'กะเหรี่ยง', my: 'ကရင်' },
  magway: { en: 'Magway', th: 'มะกเว', my: 'မကွေး' },
  mandalay: { en: 'Mandalay', th: 'มัณฑะเลย์', my: 'မန္တလေး' },
  mon: { en: 'Mon', th: 'มอญ', my: 'မွန်' },
  naypyidaw: { en: 'Naypyidaw', th: 'เนปยีดอ', my: 'နေပြည်တော်' },
  rakhine: { en: 'Rakhine', th: 'ยะไข่', my: 'ရခိုင်' },
  sagaing: { en: 'Sagaing', th: 'สะกาย', my: 'စစ်ကိုင်း' },
  shan: { en: 'Shan', th: 'ฉาน', my: 'ရှမ်း' },
  tanintharyi: { en: 'Tanintharyi', th: 'ตะนาวศรี', my: 'တနင်္သာရီ' },
  yangon: { en: 'Yangon', th: 'ย่างกุ้ง', my: 'ရန်ကုန်' },
}

export function localizeRegion(value: string, language: SiteLanguage): string {
  const key = value.trim().toLowerCase().replace(/[()\-]/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/\b(state|region|division)$/, '').trim()
    .replace(/^ayeyarwaddy$/, 'ayeyarwady')
  const region = regions[key] || Object.values(regions).find((item) =>
    Object.values(item).some((name) => name.toLowerCase() === value.trim().toLowerCase()))
  if (!region) return value
  if (language === 'en' && /^[a-z]/i.test(value)) return value
  const suffix = value.trim().toLowerCase().match(/\b(state|region|division)$/)?.[1]
  if (suffix === 'state') return language === 'my' ? `${region.my}ပြည်နယ်` : language === 'th' ? `รัฐ${region.th}` : region.en
  if (suffix === 'region' || suffix === 'division') return language === 'my' ? `${region.my}တိုင်းဒေသကြီး` : language === 'th' ? `เขต${region.th}` : region.en
  return region[language]
}
