/**
 * lib/i18n/uiText.ts
 *
 * Static UI labels — translated once by hand, shown instantly (no API call,
 * no loading delay). Use this for every fixed label/button/placeholder in
 * the app's menus and filters.
 *
 * For dynamic content coming from Sanity (news titles/body, company data),
 * use the `useTranslatedTexts` hook instead — that's the Groq-powered
 * on-demand translation, which also skips the API call automatically when
 * the content is already in the requested language (see lib/detectScript.ts).
 */

import { SiteLanguage } from '@/contexts/LanguageContext'

export const uiText = {
  // --- Header ---
  headerSubtitle: {
    default: 'Agricultural Machinery News & Updates',
    my: 'စိုက်ပျိုးရေးစက်ကိရိယာ သတင်းနှင့် အချက်အလက်များ',
    th: 'ข่าวสารและอัปเดตเครื่องจักรกลการเกษตร',
  },

  // --- Company detail page ---
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
  viewOriginalSource: { default: 'View Original Source', my: 'မူရင်းသတင်း ကြည့်ရန်', th: 'ดูแหล่งที่มาต้นฉบับ' },
  viewDetail: { default: 'View Detail & Contact', my: 'အသေးစိတ်နှင့် ဆက်သွယ်ရန် ကြည့်ရန်', th: 'ดูรายละเอียดและติดต่อ' },

  // --- News search / filter bar ---
  searchPlaceholder: {
    default: 'Search by Title or Main text...',
    my: 'ခေါင်းစဉ် သို့မဟုတ် အကြောင်းအရာဖြင့် ရှာဖွေရန်...',
    th: 'ค้นหาจากหัวข้อหรือเนื้อหา...',
  },
  brandSelectionDefault: { default: 'Brand Selection', my: 'အမှတ်တံဆိပ် ရွေးချယ်ရန်', th: 'เลือกแบรนด์' },
  allBrandPricesDefault: { default: 'All Brand Prices', my: 'အမှတ်တံဆိပ် ဈေးနှုန်းအားလုံး', th: 'ราคาทุกแบรนด์' },
  modelsLabel: { default: 'Models', my: 'မော်ဒယ်များ', th: 'รุ่น' },
  withFrontDozerLabel: { default: 'with Front Dozer', my: 'ရှေ့ဂေါ်ပါ', th: 'พร้อมใบมีดดันดินหน้า' },
  implementsLabel: { default: 'Implements', my: 'နောက်တွဲများ', th: 'อุปกรณ์ต่อพ่วง' },
  pricesAndImplementsLabel: {
    default: 'Prices & Implements',
    my: 'စျေးနှုန်းနှင့် နောက်တွဲများ',
    th: 'ราคาและอุปกรณ์ต่อพ่วง',
  },
  chooseImplementsLabel: {
    default: 'Choose implements',
    my: 'နောက်တွဲများ ရွေးချယ်ရန်',
    th: 'เลือกอุปกรณ์ต่อพ่วง',
  },
  totalPriceLabel: { default: 'Estimated Total', my: 'ခန့်မှန်း စုစုပေါင်း', th: 'ราคารวมโดยประมาณ' },
  machinePriceLabel: { default: 'Machine price', my: 'စက်စျေးနှုန်း', th: 'ราคาเครื่องจักร' },
  allCompaniesDefault: { default: 'All Companies', my: 'ကုမ္ပဏီအားလုံး', th: 'บริษัททั้งหมด' },
  kubotaCompaniesOption: { default: 'Kubota Companies', my: 'Kubota ကုမ္ပဏီများ', th: 'บริษัท Kubota' },
  otherBrandCompaniesOption: {
    default: 'Other Brand Companies',
    my: 'အခြားအမှတ်တံဆိပ် ကုမ္ပဏီများ',
    th: 'บริษัทแบรนด์อื่น',
  },
  companiesDirectoryHeading: {
    default: 'Directory',
    my: 'လမ်းညွှန်စာရင်း',
    th: 'ทำเนียบบริษัท',
  },
  noCompanyInfo: {
    default: 'No company information available for this group yet.',
    my: 'ဤအုပ်စုအတွက် ကုမ္ပဏီအချက်အလက် မရှိသေးပါ။',
    th: 'ยังไม่มีข้อมูลบริษัทสำหรับกลุ่มนี้',
  },
  noNewsFound: {
    default: 'No news found matching your search criteria.',
    my: 'သင့်ရှာဖွေမှုနှင့် ကိုက်ညီသော သတင်း မတွေ့ရှိပါ။',
    th: 'ไม่พบข่าวที่ตรงกับการค้นหาของคุณ',
  },
  loadMoreNews: { default: 'Load More News ↓', my: 'သတင်းများ ထပ်မံကြည့်ရှုရန် ↓', th: 'โหลดข่าวเพิ่มเติม ↓' },
  readFullStory: { default: 'Read full story →', my: 'အပြည့်အစုံ ဖတ်ရှုရန် →', th: 'อ่านข่าวเต็ม →' },
  viewDetailArrow: { default: 'View Detail →', my: 'အသေးစိတ် ကြည့်ရန် →', th: 'ดูรายละเอียด →' },

  // --- Bottom banners ---
  companyBannerTitle: {
    default: 'View All Kubota & Competitor Companies',
    my: 'Kubota နှင့် ပြိုင်ဘက်ကုမ္ပဏီများ အားလုံးကို ကြည့်ရှုရန်',
    th: 'ดูบริษัท Kubota และคู่แข่งทั้งหมด',
  },
  companyBannerDesc: {
    default: 'Filter by region and brand, and see full details for every company in the Company Directory.',
    my: 'ဒေသနှင့် အမှတ်တံဆိပ်အလိုက် စစ်ထုတ်ပြီး Company Directory တွင် ကုမ္ပဏီအားလုံးရဲ့ အသေးစိတ်အချက်အလက်များကို ကြည့်ရှုနိုင်ပါသည်။',
    th: 'กรองตามภูมิภาคและแบรนด์ ดูรายละเอียดครบถ้วนของทุกบริษัทในทำเนียบบริษัท',
  },
  viewFullDirectory: {
    default: 'View Full Company Directory →',
    my: 'Company Directory အပြည့်အစုံ ကြည့်ရန် →',
    th: 'ดูทำเนียบบริษัททั้งหมด →',
  },
  searchPastNews: { default: 'Search Past News', my: 'သတင်းဟောင်းများ ရှာဖွေရန်', th: 'ค้นหาข่าวย้อนหลัง' },
  searchPastNewsDesc: {
    default: 'Browse all past news, organized by month and date, in the Monthly Archive.',
    my: 'ယခင်သတင်းအားလုံးကို လ/ရက်စွဲအလိုက် စီစဉ်ထားသော Monthly Archive တွင် ကြည့်ရှုနိုင်ပါသည်။',
    th: 'เรียกดูข่าวย้อนหลังทั้งหมด จัดเรียงตามเดือนและวันที่ ใน Monthly Archive',
  },
  viewMonthlyArchive: {
    default: 'View Monthly Archive →',
    my: 'Monthly Archive ကြည့်ရန် →',
    th: 'ดู Monthly Archive →',
  },
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