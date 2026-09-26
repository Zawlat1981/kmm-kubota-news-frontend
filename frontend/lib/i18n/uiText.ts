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
  newsSelectionDefault: { default: 'News Selection', my: 'သတင်း ရွေးချယ်ရန်', th: 'เลือกข่าว' },
  newsSelections: { default: 'News Selections', my: 'သတင်းများ ရွေးချယ်ရန်', th: 'เลือกหมวดข่าว' },
  competitorNews: { default: 'Competitor News', my: 'ပြိုင်ဘက်သတင်းများ', th: 'ข่าวคู่แข่ง' },
  dailySalesMenu: {
    default: 'KMM Kubota Daily Sales Report',
    my: 'KMM Kubota နေ့စဉ် အရောင်းအစီရင်ခံစာ',
    th: 'รายงานยอดขายประจำวัน KMM Kubota',
  },
  openDailySales: { default: 'Open Daily Sales Report', my: 'နေ့စဉ် အရောင်းအစီရင်ခံစာ ဖွင့်ရန်', th: 'เปิดรายงานยอดขายประจำวัน' },
  allBrandPricesDefault: { default: 'All Brand Prices', my: 'အမှတ်တံဆိပ် ဈေးနှုန်းအားလုံး', th: 'ราคาทุกแบรนด์' },
  modelsLabel: { default: 'Models', my: 'မော်ဒယ်များ', th: 'รุ่น' },
  modelSelectionDefault: { default: 'Select a model', my: 'မော်ဒယ် ရွေးချယ်ရန်', th: 'เลือกรุ่น' },
  backToModels: { default: 'Back to Models', my: 'မော်ဒယ်များသို့ ပြန်သွားရန်', th: 'กลับไปยังรุ่น' },
  withFrontDozerLabel: { default: 'with Front Dozer', my: 'ရှေ့ဂေါ်ပါ', th: 'พร้อมใบมีดดันดินหน้า' },
  withSpecialDozerLabel: { default: 'with Special Dozer', my: 'Special Dozer ပါ', th: 'พร้อมใบมีดพิเศษ' },
  withFrontLoaderLabel: { default: 'with Loader', my: 'Loader ပါ', th: 'พร้อมชุดตักหน้า' },
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
  sidebarFilters: { default: 'Sidebar Filters', my: 'ဘေးဘား စစ်ထုတ်မှုများ', th: 'ตัวกรองแถบด้านข้าง' },
  searchByTitleOrText: { default: 'Search by Title or Main text', my: 'ခေါင်းစဉ် သို့မဟုတ် အကြောင်းအရာဖြင့် ရှာရန်', th: 'ค้นหาจากหัวข้อหรือเนื้อหา' },
  dateFilter: { default: 'Date mm/dd/yyyy', my: 'ရက်စွဲ လ/ရက်/နှစ်', th: 'วันที่ ดด/วว/ปปปป' },
  kmmKubotaFacebookPages: { default: 'KMM Kubota Facebook Pages', my: 'KMM Kubota Facebook စာမျက်နှာများ', th: 'เพจ Facebook KMM Kubota' },
  selectFacebookPage: { default: 'Select a Facebook Page', my: 'Facebook စာမျက်နှာ ရွေးချယ်ရန်', th: 'เลือกเพจ Facebook' },
  myanmarNews: { default: 'Myanmar News', my: 'မြန်မာသတင်း', th: 'ข่าวเมียนมา' },
  exchangeRates: { default: 'Exchange Rates', my: 'ငွေလဲနှုန်းများ', th: 'อัตราแลกเปลี่ยน' },
  fuelPrices: { default: 'Fuel Price & News', my: 'လောင်စာဆီဈေးနှုန်းနှင့် သတင်းများ', th: 'ราคาน้ำมันและข่าวสาร' },
  cropPrices: { default: 'Crop Price & News', my: 'သီးနှံဈေးနှုန်းနှင့် သတင်းများ', th: 'ราคาพืชผลและข่าวสาร' },
  kubotaNews: { default: 'Kubota News', my: 'Kubota သတင်း', th: 'ข่าว Kubota' },
  kubotaSecondNews: { default: 'Kubota Second News', my: 'Kubota ဒုတိယသတင်း', th: 'ข่าว Kubota ที่สอง' },
  yanmarNews: { default: 'Yanmar News', my: 'Yanmar သတင်း', th: 'ข่าว Yanmar' },
  johnDeereNews: { default: 'John Deere News', my: 'John Deere သတင်း', th: 'ข่าว John Deere' },
  newHollandNews: { default: 'New Holland News', my: 'New Holland သတင်း', th: 'ข่าว New Holland' },
  ytoNews: { default: 'YTO News', my: 'YTO သတင်း', th: 'ข่าว YTO' },
  sonalikaNews: { default: 'Sonalika News', my: 'Sonalika သတင်း', th: 'ข่าว Sonalika' },
  yamabisiNews: { default: 'Yamabisi News', my: 'Yamabisi သတင်း', th: 'ข่าว Yamabisi' },
  mahindraNews: { default: 'Mahindra News', my: 'Mahindra သတင်း', th: 'ข่าว Mahindra' },
  dongfengNews: { default: 'Dongfeng News', my: 'Dongfeng သတင်း', th: 'ข่าว Dongfeng' },
  mahindraDongfengNews: { default: 'Mahindra and Dongfeng News', my: 'Mahindra နှင့် Dongfeng သတင်း', th: 'ข่าว Mahindra และ Dongfeng' },
  deutzfarMatadorNews: { default: 'Deutzfhar & Matador News', my: 'Deutzfhar နှင့် Matador သတင်း', th: 'ข่าว Deutzfhar และ Matador' },
  otherBrandNews: { default: 'Other Brand News', my: 'အခြားအမှတ်တံဆိပ် သတင်းများ', th: 'ข่าวแบรนด์อื่น' },
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
  backToNewsPortal: { default: '← News Portal', my: '← သတင်းစာမျက်နှာ', th: '← หน้าข่าว' },
  managementDashboard: { default: 'Management Dashboard', my: 'စီမံခန့်ခွဲမှု Dashboard', th: 'แดชบอร์ดผู้บริหาร' },
  salesPerformance: { default: 'Sales Performance', my: 'အရောင်းစွမ်းဆောင်ရည်', th: 'ประสิทธิภาพการขาย' },
  dailySalesReport: { default: 'Daily Sales Report', my: 'နေ့စဉ် အရောင်းအစီရင်ခံစာ', th: 'รายงานยอดขายประจำวัน' },
  dailySalesDescription: {
    default: 'Daily sales records by branch',
    my: 'ရုံးခွဲအလိုက် နေ့စဉ် ရောင်းချပြီး စက်စာရင်း',
    th: 'รายการขายประจำวันแยกตามสาขา',
  },
  thisWeeksSales: { default: "This Week's Sales", my: 'ဒီအပတ် အရောင်း', th: 'ยอดขายสัปดาห์นี้' },
  topBranch: { default: 'Top Branch', my: 'အရောင်းအများဆုံး ရုံးခွဲ', th: 'สาขาที่ขายดีที่สุด' },
  topSalesPerson: { default: 'Top Sales Person', my: 'အရောင်းအကောင်းဆုံး Sales Person', th: 'พนักงานขายยอดเยี่ยม' },
  readMore: { default: 'Read more', my: 'ဆက်ကြည့်ရန်', th: 'อ่านเพิ่มเติม' },
  showLess: { default: 'Show less', my: 'အနည်းငယ်သာပြရန်', th: 'แสดงน้อยลง' },
  addDailySale: { default: 'Add Daily Sale', my: 'နေ့စဉ် အရောင်းထည့်ရန်', th: 'เพิ่มรายการขาย' },
  totalSales: { default: 'Total sales', my: 'စုစုပေါင်း အရောင်း', th: 'ยอดขายทั้งหมด' },
  activeBranches: { default: 'Active branches', my: 'အသုံးပြုနေသော ရုံးခွဲများ', th: 'สาขาที่มีรายการ' },
  latestReport: { default: 'Latest report', my: 'နောက်ဆုံးအစီရင်ခံစာ', th: 'รายงานล่าสุด' },
  noRecordsYet: { default: 'No records yet', my: 'မှတ်တမ်း မရှိသေးပါ', th: 'ยังไม่มีรายการ' },
  noDailySales: { default: 'No daily sales records yet.', my: 'နေ့စဉ် အရောင်းမှတ်တမ်း မရှိသေးပါ။', th: 'ยังไม่มีรายการขายประจำวัน' },
  salesRecords: { default: 'Sales records', my: 'အရောင်းမှတ်တမ်းများ', th: 'รายการขาย' },
  salesRecordsDescription: {
    default: 'Recent sold machine records',
    my: 'နောက်ဆုံး ရောင်းချပြီး စက်များ၏ မှတ်တမ်းများ',
    th: 'รายการเครื่องจักรที่ขายล่าสุด',
  },
  salesMonthLabel: { default: 'Month', my: 'လ', th: 'เดือน' },
  stockRemainingLabel: { default: 'Stock remaining', my: 'လက်ကျန်', th: 'สต็อกคงเหลือ' },
  editLabel: { default: 'Edit', my: 'ပြင်ရန်', th: 'แก้ไข' },
  editStockTitle: { default: 'Edit stock remaining', my: 'လက်ကျန် ပြင်ရန်', th: 'แก้ไขสต็อกคงเหลือ' },
  editStockDescription: { default: 'Enter the stock remaining for this sale record.', my: 'ဤရောင်းစာရင်းအတွက် လက်ကျန်ကို ဖြည့်ပါ။', th: 'กรอกสต็อกคงเหลือสำหรับรายการนี้' },
  cancelLabel: { default: 'Cancel', my: 'မလုပ်တော့ပါ', th: 'ยกเลิก' },
  saveLabel: { default: 'Save', my: 'သိမ်းရန်', th: 'บันทึก' },
  savingLabel: { default: 'Saving...', my: 'သိမ်းနေသည်...', th: 'กำลังบันทึก...' },
  salesPersonTag: { default: 'Sales person', my: 'အရောင်းဝန်ထမ်း', th: 'พนักงานขาย' },
  modelTag: { default: 'Model', my: 'မော်ဒယ်', th: 'รุ่น' },
  regionTag: { default: 'Region', my: 'ဒေသ', th: 'ภูมิภาค' },
  records: { default: 'records', my: 'မှတ်တမ်း', th: 'รายการ' },
  saleDetails: { default: 'Sale details', my: 'အရောင်းအသေးစိတ်', th: 'รายละเอียดการขาย' },
  modelLabel: { default: 'Model:', my: 'မော်ဒယ်:', th: 'รุ่น:' },
  customerLabel: { default: 'Customer:', my: 'ဖောက်သည်:', th: 'ลูกค้า:' },
  regionLabel: { default: 'Region:', my: 'ဒေသ:', th: 'ภูมิภาค:' },
  paymentLabel: { default: 'Payment:', my: 'ငွေပေးချေမှု:', th: 'การชำระเงิน:' },
  noPhoto: { default: 'No photo', my: 'ပုံမရှိပါ', th: 'ไม่มีรูปภาพ' },
  viewPhoto: { default: 'View photo', my: 'ပုံကြီးကြည့်ရန်', th: 'ดูรูปภาพ' },
  closePhoto: { default: 'Close enlarged photo', my: 'ပုံကြီးပိတ်ရန်', th: 'ปิดรูปภาพขนาดใหญ่' },

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