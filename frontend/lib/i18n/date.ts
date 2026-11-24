import type { SiteLanguage } from "@/contexts/LanguageContext";

const myanmarMonths = [
  "ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်",
  "ဇူလိုင်", "သြဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ",
];

export function formatLocalizedDate(
  date: Date,
  language: SiteLanguage,
  options: Intl.DateTimeFormatOptions,
): string {
  if (language === "my") {
    const digits = (value: number) => String(value).replace(/\d/g, (digit) => "၀၁၂၃၄၅၆၇၈၉"[Number(digit)]);
    return [
      options.day && digits(date.getDate()),
      options.month && myanmarMonths[date.getMonth()],
      options.year && digits(date.getFullYear()),
    ].filter(Boolean).join(" ");
  }
  return date.toLocaleDateString(language === "th" ? "th-TH" : "en-US", options);
}
