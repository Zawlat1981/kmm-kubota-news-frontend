import { t, type UiKey } from "@/lib/i18n/uiText";
import type { SiteLanguage } from "@/contexts/LanguageContext";

export const reportText = {
  en: {
    date: "Select date:",
    language: "Language",
    image: "Download Image",
    pdf: "Download PDF",
    copy: "Copy Link",
    copied: "Link Copied!",
    exporting: "Exporting...",
    title: "News Report",
    summary: "Published news by category",
    loading: "Loading news...",
    empty: "No news for the selected date.",
    count: "news",
    noImage: "No Image",
    general: "General Prices & News",
    flood: "Flood News",
  },
  th: {
    date: "เลือกวันที่:",
    language: "ภาษา",
    image: "ดาวน์โหลดรูปภาพ",
    pdf: "ดาวน์โหลด PDF",
    copy: "คัดลอกลิงก์",
    copied: "คัดลอกลิงก์แล้ว!",
    exporting: "กำลังส่งออก...",
    title: "รายงานข่าว",
    summary: "สรุปประเภทข่าวที่ลงเผยแพร่",
    loading: "กำลังโหลดข้อมูลข่าว...",
    empty: "ยังไม่มีรายการข่าวสำหรับวันที่เลือก",
    count: "ข่าว",
    noImage: "ไม่มีรูปภาพ",
    general: "ราคาและข่าวทั่วไป",
    flood: "ข่าวน้ำท่วม",
  },
  my: {
    date: "ရက်စွဲရွေးရန်:",
    language: "ဘာသာစကား",
    image: "ပုံဒေါင်းလုဒ်လုပ်ရန်",
    pdf: "PDF ဒေါင်းလုဒ်လုပ်ရန်",
    copy: "လင့်ခ်ကူးရန်",
    copied: "လင့်ခ်ကူးပြီးပါပြီ!",
    exporting: "ထုတ်ယူနေသည်...",
    title: "သတင်းအစီရင်ခံစာ",
    summary: "ထုတ်ပြန်ထားသော သတင်းအမျိုးအစားများ",
    loading: "သတင်းများ ရယူနေသည်...",
    empty: "ရွေးချယ်ထားသောရက်တွင် သတင်းမရှိပါ။",
    count: "သတင်း",
    noImage: "ပုံမရှိပါ",
    general: "အထွေထွေဈေးနှုန်းနှင့် သတင်းများ",
    flood: "ရေကြီးမှုသတင်း",
  },
} satisfies Record<SiteLanguage, Record<string, string>>;

const categoryKeys: Record<string, UiKey> = {
  "Kubota News": "kubotaNews",
  "Kubota ZT News": "kubotaZtNews",
  "Kubota Second News": "kubotaSecondNews",
  "Yanmar News": "yanmarNews",
  "John Deere News": "johnDeereNews",
  "New Holland News": "newHollandNews",
  "YTO News": "ytoNews",
  "Sonalika News": "sonalikaNews",
  "Yamabisi News": "yamabisiNews",
  "Mahindra News": "mahindraNews",
  "Dongfeng News": "dongfengNews",
  "Mahindra and Dongfeng News": "mahindraDongfengNews",
  "DeutzFhar & Matador News": "deutzfarMatadorNews",
  "Crop Price & News": "cropPrices",
  "Fuel Price & News": "fuelPrices",
  "Exchange Rates": "exchangeRates",
  "Myanmar News": "myanmarNews",
  "Other Brand News": "otherBrandNews",
};

export function translateCategory(category: string, language: SiteLanguage): string {
  if (category === "Flood News") return reportText[language].flood;
  if (language === "en") return category;
  const key = categoryKeys[category];
  return key ? t(key, language) : category;
}

export function translateGroup(group: string, language: SiteLanguage): string {
  if (group === "General Prices & News") return reportText[language].general;
  if (group === "Flood News") return reportText[language].flood;
  return translateCategory(group, language);
}
