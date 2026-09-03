/**
 * lib/i18n/uiText.ts
 *
 * Static UI labels — translated once by hand, shown instantly (no API call,
 * no loading delay). Use this for fixed labels like "Brand", "Category", etc.
 * For dynamic content coming from Sanity (company names, descriptions, news
 * body), use the `useTranslatedTexts` hook instead — that's the Groq-powered
 * on-demand translation.
 */

import { SiteLanguage } from '@/contexts/LanguageContext'

export const uiText = {
  brand: { default: 'Brand', my: 'အမှတ်တံဆိပ်', th: 'แบรนด์' },
  companyGroup: { default: 'Company Group', my: 'ကုမ္ပဏီအုပ်စု', th: 'กลุ่มบริษัท' },
  category: { default: 'Category', my: 'အမျိုးအစား', th: 'หมวดหมู่' },
  region: { default: 'Region', my: 'ဒေသ', th: 'ภูมิภาค' },
  branchOffices: { default: 'Branch offices', my: 'ရုံးခွဲများ', th: 'สาขา' },
  salesContact: { default: 'Sales contact', my: 'အရောင်းဌာန ဆက်သွယ်ရန်', th: 'ติดต่อฝ่ายขาย' },
  viewOnMap: { default: 'View on Google Map', my: 'မြေပုံတွင် ကြည့်ရန်', th: 'ดูบนแผนที่' },
  details: { default: 'Details', my: 'အသေးစိတ်', th: 'รายละเอียด' },
  contact: { default: 'Contact', my: 'ဆက်သွယ်ရန်', th: 'ติดต่อ' },
  email: { default: 'Email', my: 'အီးမေးလ်', th: 'อีเมล' },
  website: { default: 'Website', my: 'ဝဘ်ဆိုက်', th: 'เว็บไซต์' },
  backToMenu: { default: 'Back to Menu', my: 'မီနူးသို့ ပြန်သွားရန်', th: 'กลับเมนู' },
  backToHome: { default: '← Back to Home', my: '← Home သို့ ပြန်သွားရန်', th: '← กลับหน้าแรก' },
  viewDetail: { default: 'View Detail & Contact', my: 'အသေးစိတ်နှင့် ဆက်သွယ်ရန် ကြည့်ရန်', th: 'ดูรายละเอียดและติดต่อ' },
} as const

export type UiTextKey = keyof typeof uiText

/**
 * Get a static UI label in the currently selected language.
 * Falls back to English/original if the language isn't found.
 */
export function t(key: UiTextKey, language: SiteLanguage): string {
  const entry = uiText[key]
  return entry[language] || entry.default
}