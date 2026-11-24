"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { extraText, type ExtraTextKey } from "@/lib/i18n/extraText";
import { t, type UiKey } from "@/lib/i18n/uiText";
import { formatLocalizedDate } from "@/lib/i18n/date";
import TranslatedText from "@/components/TranslatedText";

export function ExtraText({ textKey }: { textKey: ExtraTextKey }) {
  const { language } = useLanguage();
  return extraText(language)[textKey];
}

export function UiText({ textKey }: { textKey: UiKey }) {
  const { language } = useLanguage();
  return t(textKey, language);
}

export function CompanyGroupText({ value }: { value: string }) {
  const { language } = useLanguage();
  if (value === "kubota") return t("kubotaCompaniesOption", language);
  if (value === "other") return t("otherBrandCompaniesOption", language);
  return <TranslatedText text={value} />;
}

export function CompanyCategoryText({ value }: { value: string }) {
  const { language } = useLanguage();
  if (value === "Dealer") return extraText(language).dealer;
  if (value === "Distributor") return extraText(language).distributor;
  return <TranslatedText text={value} />;
}

export function LocalizedDate({ value, monthOnly = false }: { value: string; monthOnly?: boolean }) {
  const { language } = useLanguage();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return formatLocalizedDate(date, language, monthOnly
    ? { month: "long", year: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" });
}
