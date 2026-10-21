// COMPLETE UiKey with ALL keys used in project + TH/MY/EN
export type UiKey =
  | 'backToHome'
  | 'newsCategoryDefault'
  | 'myanmarNews'
  | 'fuelPrices'
  | 'cropPrices'
  | 'exchangeRates'
  | 'kubotaZtNews'
  | 'kubotaSecondNews'
  | 'kubotaNews'
  | 'yanmarNews'
  | 'johnDeereNews'
  | 'newHollandNews'
  | 'ytoNews'
  | 'sonalikaNews'
  | 'yamabisiNews'
  | 'mahindraNews'
  | 'dongfengNews'
  | 'deutzfarMatadorNews'
  | 'otherBrandNews'
  | 'home'
  | 'companies'
  | 'dailySales'
  | 'news'
  | 'stock'
  | 'contact'
  | 'viewPhoto'
  | 'modelTag'
  | 'regionTag'
  | 'closePhoto'
  | 'backToNewsPortal'
  | 'managementDashboard'
  | 'salesPerformance'
  | 'dailySalesReport'
  | 'dailySalesDescription'
  | 'thisWeeksSales'
  | 'topBranch'
  | 'records'
  | 'topSalesPerson'
  | 'noRecordsYet'
  | 'noDailySales'
  | 'salesRecords'
  | 'salesRecordsDescription'
  | 'salesMonthLabel'
  | 'stockRemainingLabel'
  | 'readMore'
  | 'showLess'
  | 'noPhoto'
  | 'saleDetails'
  | 'modelLabel'
  | 'customerLabel'
  | 'regionLabel'
  | 'newsPortal'
  | 'headerSubtitle'
  | 'withFrontDozerLabel'
  | 'withSpecialDozerLabel'
  | 'withFrontLoaderLabel'
  | 'implementsLabel'
  | 'newsSelections'
  | 'competitorNews'
  | 'mahindraDongfengNews'
  | 'dailySalesMenu'
  | 'openDailySales'
  | 'allBrandPricesDefault'
  | 'allCompaniesDefault'
  | 'sidebarFilters'
  | 'searchByTitleOrText'
  | 'searchPlaceholder'
  | 'dateFilter'
  | 'kmmKubotaFacebookPages'
  | 'selectFacebookPage'
  | 'modelsLabel'
  | 'backToMenu'
  | 'modelSelectionDefault'
  | 'pricesAndImplementsLabel'
  | 'backToModels'
  | 'chooseImplementsLabel'
  | 'machinePriceLabel'
  | 'totalPriceLabel'
  | 'kubotaCompaniesOption'
  | 'otherBrandCompaniesOption'
  | 'companiesDirectoryHeading'
  | 'brand'
  | 'region'
  | 'viewDetailArrow'
  | 'noCompanyInfo'
  | 'readFullStory'
  | 'noNewsFound'
  | 'loadMoreNews'
  | 'companyBannerTitle'
  | 'companyBannerDesc'
  | 'viewFullDirectory'
  | 'searchPastNews'
  | 'searchPastNewsDesc'
  | 'viewMonthlyArchive'

type Lang = 'th' | 'my' | 'en'

const dict: Record<Lang, Record<UiKey, string>> = {
  th: {
    backToHome: '← กลับหน้าแรก',
    newsCategoryDefault: 'ข่าวสาร',
    myanmarNews: 'ข่าวพม่า',
    fuelPrices: 'ราคาน้ำมัน',
    cropPrices: 'ราคาพืชผล',
    exchangeRates: 'อัตราแลกเปลี่ยน',
    kubotaZtNews: 'ข่าว Kubota ZT',
    kubotaSecondNews: 'Kubota มือสอง',
    kubotaNews: 'ข่าว Kubota',
    yanmarNews: 'ข่าว Yanmar',
    johnDeereNews: 'ข่าว John Deere',
    newHollandNews: 'ข่าว New Holland',
    ytoNews: 'ข่าว YTO',
    sonalikaNews: 'ข่าว Sonalika',
    yamabisiNews: 'ข่าว Yamabisi',
    mahindraNews: 'ข่าว Mahindra',
    dongfengNews: 'ข่าว Dongfeng',
    deutzfarMatadorNews: 'ข่าว Deutz-Fahr Matador',
    otherBrandNews: 'แบรนด์อื่นๆ',
    home: 'หน้าหลัก',
    companies: 'บริษัท',
    dailySales: 'ยอดขายรายวัน',
    news: 'ข่าวสาร',
    stock: 'สต็อก',
    contact: 'ติดต่อ',
    viewPhoto: 'ดูรูปภาพ',
    modelTag: 'รุ่น',
    regionTag: 'ภูมิภาค',
    closePhoto: 'ปิดรูปภาพ',
    backToNewsPortal: 'กลับสู่พอร์ทัลข่าว',
    managementDashboard: 'แดชบอร์ดผู้บริหาร',
    salesPerformance: 'ประสิทธิภาพการขาย',
    dailySalesReport: 'รายงานยอดขายรายวัน',
    dailySalesDescription: 'สรุปยอดขายรายวันของทุกสาขา',
    thisWeeksSales: 'ยอดขายสัปดาห์นี้',
    topBranch: 'สาขายอดนิยม',
    records: 'รายการ',
    topSalesPerson: 'พนักงานขายยอดเยี่ยม',
    noRecordsYet: 'ยังไม่มีบันทึก',
    noDailySales: 'ไม่มียอดขายรายวัน',
    salesRecords: 'บันทึกการขาย',
    salesRecordsDescription: 'รายการบันทึกการขายทั้งหมด',
    salesMonthLabel: 'เดือน',
    stockRemainingLabel: 'สต็อกคงเหลือ',
    readMore: 'อ่านเพิ่มเติม',
    showLess: 'แสดงน้อยลง',
    noPhoto: 'ไม่มีรูปภาพ',
    saleDetails: 'รายละเอียดการขาย',
    modelLabel: 'รุ่น',
    customerLabel: 'ลูกค้า',
    regionLabel: 'ภูมิภาค',
    newsPortal: 'พอร์ทัลข่าวเกษตร',
    headerSubtitle: 'ข้อมูลการเกษตรและเครื่องจักร',
    withFrontDozerLabel: 'พร้อมใบมีดหน้า',
    withSpecialDozerLabel: 'พร้อมใบมีดพิเศษ',
    withFrontLoaderLabel: 'พร้อมตักหน้า',
    implementsLabel: 'อุปกรณ์ต่อพ่วง',
    newsSelections: 'หมวดหมู่ข่าว',
    competitorNews: 'ข่าวคู่แข่ง',
    mahindraDongfengNews: 'ข่าว Mahindra & Dongfeng',
    dailySalesMenu: 'ยอดขายรายวัน',
    openDailySales: 'เปิดดูยอดขาย',
    allBrandPricesDefault: 'ราคาทุกแบรนด์',
    allCompaniesDefault: 'บริษัททั้งหมด',
    sidebarFilters: 'ตัวกรอง',
    searchByTitleOrText: 'ค้นหาตามชื่อหรือข้อความ',
    searchPlaceholder: 'ค้นหาข่าว...',
    dateFilter: 'กรองตามวันที่',
    kmmKubotaFacebookPages: 'เพจ Facebook KMM Kubota',
    selectFacebookPage: 'เลือกเพจ Facebook',
    modelsLabel: 'รุ่น',
    backToMenu: 'กลับสู่เมนู',
    modelSelectionDefault: 'เลือกรุ่น',
    pricesAndImplementsLabel: 'ราคาและอุปกรณ์ต่อพ่วง',
    backToModels: 'กลับสู่รุ่น',
    chooseImplementsLabel: 'เลือกอุปกรณ์ต่อพ่วง',
    machinePriceLabel: 'ราคาเครื่อง',
    totalPriceLabel: 'ราคารวม',
    kubotaCompaniesOption: 'บริษัท Kubota',
    otherBrandCompaniesOption: 'บริษัทแบรนด์อื่น',
    companiesDirectoryHeading: 'ไดเรกทอรีบริษัท',
    brand: 'แบรนด์',
    region: 'ภูมิภาค',
    viewDetailArrow: 'ดูรายละเอียด →',
    noCompanyInfo: 'ไม่มีข้อมูลบริษัท',
    readFullStory: 'อ่านเรื่องเต็ม',
    noNewsFound: 'ไม่พบข่าว',
    loadMoreNews: 'โหลดข่าวเพิ่มเติม',
    companyBannerTitle: 'ไดเรกทอรีบริษัทการเกษตร',
    companyBannerDesc: 'ค้นหาบริษัทตัวแทนจำหน่ายทั่วประเทศ',
    viewFullDirectory: 'ดูไดเรกทอรีทั้งหมด',
    searchPastNews: 'ค้นหาข่าวเก่า',
    searchPastNewsDesc: 'ค้นหาข่าวจากคลัง',
    viewMonthlyArchive: 'ดูคลังรายเดือน',
  },
  my: {
    backToHome: '← ပင်မသို့ ပြန်သွားရန်',
    newsCategoryDefault: 'သတင်း',
    myanmarNews: 'မြန်မာသတင်း',
    fuelPrices: 'လောင်စာဆီဈေးနှုန်း',
    cropPrices: 'သီးနှံဈေးနှုန်း',
    exchangeRates: 'ငွေလဲနှုန်း',
    kubotaZtNews: 'Kubota ZT သတင်း',
    kubotaSecondNews: 'Kubota တစ်ပတ်ရစ်သတင်း',
    kubotaNews: 'Kubota သတင်း',
    yanmarNews: 'Yanmar သတင်း',
    johnDeereNews: 'John Deere သတင်း',
    newHollandNews: 'New Holland သတင်း',
    ytoNews: 'YTO သတင်း',
    sonalikaNews: 'Sonalika သတင်း',
    yamabisiNews: 'Yamabisi သတင်း',
    mahindraNews: 'Mahindra သတင်း',
    dongfengNews: 'Dongfeng သတင်း',
    deutzfarMatadorNews: 'Deutz-Fahr Matador သတင်း',
    otherBrandNews: 'အခြားတံဆိပ်များ',
    home: 'ပင်မ',
    companies: 'ကုမ္ပဏီများ',
    dailySales: 'နေ့စဉ်ရောင်းအား',
    news: 'သတင်းများ',
    stock: 'စတော့',
    contact: 'ဆက်သွယ်ရန်',
    viewPhoto: 'ဓာတ်ပုံကြည့်ရန်',
    modelTag: 'မော်ဒယ်',
    regionTag: 'ဒေသ',
    closePhoto: 'ဓာတ်ပုံပိတ်ရန်',
    backToNewsPortal: 'သတင်းပေါ်တယ်သို့ ပြန်သွားရန်',
    managementDashboard: 'စီမံခန့်ခွဲမှု ဒက်ရှ်ဘုတ်',
    salesPerformance: 'ရောင်းအားစွမ်းဆောင်ရည်',
    dailySalesReport: 'နေ့စဉ်ရောင်းအားအစီရင်ခံစာ',
    dailySalesDescription: 'ဌာနခွဲအားလုံး၏ နေ့စဉ်ရောင်းအားအကျဉ်းချုပ်',
    thisWeeksSales: 'ယခုအပတ်ရောင်းအား',
    topBranch: 'ထိပ်တန်းဌာနခွဲ',
    records: 'မှတ်တမ်းများ',
    topSalesPerson: 'ထိပ်တန်းအရောင်းဝန်ထမ်း',
    noRecordsYet: 'မှတ်တမ်းမရှိသေးပါ',
    noDailySales: 'နေ့စဉ်ရောင်းအားမရှိပါ',
    salesRecords: 'ရောင်းအားမှတ်တမ်းများ',
    salesRecordsDescription: 'ရောင်းအားမှတ်တမ်းအားလုံး',
    salesMonthLabel: 'လ',
    stockRemainingLabel: 'လက်ကျန်စတော့',
    readMore: 'ပိုပြီးဖတ်ရန်',
    showLess: 'လျှော့ပြရန်',
    noPhoto: 'ဓာတ်ပုံမရှိ',
    saleDetails: 'ရောင်းအားအသေးစိတ်',
    modelLabel: 'မော်ဒယ်',
    customerLabel: 'ဖောက်သည်',
    regionLabel: 'ဒေသ',
    newsPortal: 'စိုက်ပျိုးရေးသတင်းပေါ်တယ်',
    headerSubtitle: 'စိုက်ပျိုးရေးနှင့်စက်ပစ္စည်းသတင်းအချက်အလက်',
    withFrontDozerLabel: 'ရှေ့ဘလိတ်ပါပြီး',
    withSpecialDozerLabel: 'အထူးဘလိတ်ပါပြီး',
    withFrontLoaderLabel: 'ရှေ့ဂေါ်ပါပြီး',
    implementsLabel: 'နောက်တွဲပစ္စည်းများ',
    newsSelections: 'သတင်းအမျိုးအစားများ',
    competitorNews: 'ပြိုင်ဘက်သတင်းများ',
    mahindraDongfengNews: 'Mahindra & Dongfeng သတင်း',
    dailySalesMenu: 'နေ့စဉ်ရောင်းအား',
    openDailySales: 'နေ့စဉ်ရောင်းအားကြည့်ရန်',
    allBrandPricesDefault: 'တံဆိပ်အားလုံးဈေးနှုန်း',
    allCompaniesDefault: 'ကုမ္ပဏီအားလုံး',
    sidebarFilters: 'စစ်ထုတ်မှုများ',
    searchByTitleOrText: 'ခေါင်းစဉ် သို့မဟုတ် စာသားဖြင့် ရှာဖွေရန်',
    searchPlaceholder: 'သတင်းရှာဖွေရန်...',
    dateFilter: 'ရက်စွဲဖြင့် စစ်ထုတ်ရန်',
    kmmKubotaFacebookPages: 'KMM Kubota Facebook စာမျက်နှာများ',
    selectFacebookPage: 'Facebook စာမျက်နှာရွေးရန်',
    modelsLabel: 'မော်ဒယ်များ',
    backToMenu: 'မီနူးသို့ ပြန်သွားရန်',
    modelSelectionDefault: 'မော်ဒယ်ရွေးရန်',
    pricesAndImplementsLabel: 'ဈေးနှုန်းနှင့် နောက်တွဲပစ္စည်းများ',
    backToModels: 'မော်ဒယ်များသို့ ပြန်သွားရန်',
    chooseImplementsLabel: 'နောက်တွဲပစ္စည်းရွေးရန်',
    machinePriceLabel: 'စက်ဈေးနှုန်း',
    totalPriceLabel: 'စုစုပေါင်းဈေးနှုန်း',
    kubotaCompaniesOption: 'Kubota ကုမ္ပဏီများ',
    otherBrandCompaniesOption: 'အခြားတံဆိပ်ကုမ္ပဏီများ',
    companiesDirectoryHeading: 'ကုမ္ပဏီလမ်းညွှန်',
    brand: 'တံဆိပ်',
    region: 'ဒေသ',
    viewDetailArrow: 'အသေးစိတ်ကြည့်ရန် →',
    noCompanyInfo: 'ကုမ္ပဏီအချက်အလက်မရှိ',
    readFullStory: 'အပြည့်အစုံဖတ်ရန်',
    noNewsFound: 'သတင်းမတွေ့ပါ',
    loadMoreNews: 'သတင်းများ ပိုမိုတင်ရန်',
    companyBannerTitle: 'စိုက်ပျိုးရေးကုမ္ပဏီလမ်းညွှန်',
    companyBannerDesc: 'တစ်နိုင်ငံလုံးရှိ ကိုယ်စားလှယ်ကုမ္ပဏီများရှာဖွေရန်',
    viewFullDirectory: 'လမ်းညွှန်အပြည့်အစုံကြည့်ရန်',
    searchPastNews: 'အတိတ်သတင်းများရှာဖွေရန်',
    searchPastNewsDesc: 'သတင်းသိုလှောင်ရာမှ ရှာဖွေရန်',
    viewMonthlyArchive: 'လစဉ်သိုလှောင်ရာကြည့်ရန်',
  },
  en: {
    backToHome: '← Back to Home',
    newsCategoryDefault: 'NEWS',
    myanmarNews: 'Myanmar News',
    fuelPrices: 'Fuel Prices',
    cropPrices: 'Crop Prices',
    exchangeRates: 'Exchange Rates',
    kubotaZtNews: 'Kubota ZT News',
    kubotaSecondNews: 'Kubota Second-Hand',
    kubotaNews: 'Kubota News',
    yanmarNews: 'Yanmar News',
    johnDeereNews: 'John Deere News',
    newHollandNews: 'New Holland News',
    ytoNews: 'YTO News',
    sonalikaNews: 'Sonalika News',
    yamabisiNews: 'Yamabisi News',
    mahindraNews: 'Mahindra News',
    dongfengNews: 'Dongfeng News',
    deutzfarMatadorNews: 'Deutz-Fahr Matador News',
    otherBrandNews: 'Other Brands',
    home: 'Home',
    companies: 'Companies',
    dailySales: 'Daily Sales',
    news: 'News',
    stock: 'Stock',
    contact: 'Contact',
    viewPhoto: 'View Photo',
    modelTag: 'Model',
    regionTag: 'Region',
    closePhoto: 'Close Photo',
    backToNewsPortal: 'Back to News Portal',
    managementDashboard: 'Management Dashboard',
    salesPerformance: 'Sales Performance',
    dailySalesReport: 'Daily Sales Report',
    dailySalesDescription: 'Summary of daily sales across all branches',
    thisWeeksSales: "This Week's Sales",
    topBranch: 'Top Branch',
    records: 'Records',
    topSalesPerson: 'Top Sales Person',
    noRecordsYet: 'No records yet',
    noDailySales: 'No daily sales',
    salesRecords: 'Sales Records',
    salesRecordsDescription: 'All sales records',
    salesMonthLabel: 'Month',
    stockRemainingLabel: 'Stock Remaining',
    readMore: 'Read More',
    showLess: 'Show Less',
    noPhoto: 'No Photo',
    saleDetails: 'Sale Details',
    modelLabel: 'Model',
    customerLabel: 'Customer',
    regionLabel: 'Region',
    newsPortal: 'Agricultural News Portal',
    headerSubtitle: 'Agricultural and Machinery Information',
    withFrontDozerLabel: 'With Front Dozer',
    withSpecialDozerLabel: 'With Special Dozer',
    withFrontLoaderLabel: 'With Front Loader',
    implementsLabel: 'Implements',
    newsSelections: 'News Categories',
    competitorNews: 'Competitor News',
    mahindraDongfengNews: 'Mahindra & Dongfeng News',
    dailySalesMenu: 'Daily Sales',
    openDailySales: 'Open Daily Sales',
    allBrandPricesDefault: 'All Brand Prices',
    allCompaniesDefault: 'All Companies',
    sidebarFilters: 'Filters',
    searchByTitleOrText: 'Search by title or text',
    searchPlaceholder: 'Search news...',
    dateFilter: 'Filter by date',
    kmmKubotaFacebookPages: 'KMM Kubota Facebook Pages',
    selectFacebookPage: 'Select Facebook Page',
    modelsLabel: 'Models',
    backToMenu: 'Back to Menu',
    modelSelectionDefault: 'Select Model',
    pricesAndImplementsLabel: 'Prices and Implements',
    backToModels: 'Back to Models',
    chooseImplementsLabel: 'Choose Implements',
    machinePriceLabel: 'Machine Price',
    totalPriceLabel: 'Total Price',
    kubotaCompaniesOption: 'Kubota Companies',
    otherBrandCompaniesOption: 'Other Brand Companies',
    companiesDirectoryHeading: 'Companies Directory',
    brand: 'Brand',
    region: 'Region',
    viewDetailArrow: 'View Detail →',
    noCompanyInfo: 'No company info',
    readFullStory: 'Read Full Story',
    noNewsFound: 'No news found',
    loadMoreNews: 'Load More News',
    companyBannerTitle: 'Agricultural Companies Directory',
    companyBannerDesc: 'Find dealer companies nationwide',
    viewFullDirectory: 'View Full Directory',
    searchPastNews: 'Search Past News',
    searchPastNewsDesc: 'Search from archive',
    viewMonthlyArchive: 'View Monthly Archive',
  },
}

export function t(key: UiKey, lang: Lang | string): string {
  const l = (lang === 'my' || lang === 'en' ? lang : 'th') as Lang
  return dict[l][key] || dict['th'][key] || key
}

