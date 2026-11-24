"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toPng } from "html-to-image";
import { groupNewsArticles } from "./groupNews";
import { reportText, translateCategory, translateGroup } from "./reportText";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n/uiText";
import { formatLocalizedDate } from "@/lib/i18n/date";
import { extraText } from "@/lib/i18n/extraText";
import { useTranslatedTexts } from "@/hooks/useTranslatedTexts";

interface NewsArticle {
  _id: string;
  slug?: { current?: string };
  titleText?: string;
  title?: string;
  publishedAt?: string;
  _createdAt?: string;
  categoryCode?: string;
  categoryText?: string;
  categoryTitle?: string;
  imageDataUrl?: string;
  imageUrl?: string;
}

const SANITY_NEWS_CATEGORIES = [
  "Kubota News",
  "Kubota ZT News",
  "Kubota Second News",
  "Yanmar News",
  "John Deere News",
  "New Holland News",
  "YTO News",
  "Sonalika News",
  "Yamabisi News",
  "Mahindra News",
  "Dongfeng News",
  "Mahindra and Dongfeng News",
  "DeutzFhar & Matador News",
  "Crop Price & News",
  "Fuel Price & News",
  "Exchange Rates",
  "Myanmar News",
  "Other Brand News",
] as const;

function normalizeCategoryTitle(rawCategory?: unknown): string {
  const cleaned = String(rawCategory ?? "").trim();
  if (!cleaned || cleaned === "[object Object]") return "Other Brand News";

  const exactMatch = SANITY_NEWS_CATEGORIES.find(
    (cat) => cat.toLowerCase() === cleaned.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  const lower = cleaned.toLowerCase().replace(/[-_]+/g, " ");
  if (lower.includes("myanmar")) return "Myanmar News";
  if (lower.includes("exchange")) return "Exchange Rates";
  if (lower.includes("crop")) return "Crop Price & News";
  if (lower.includes("fuel")) return "Fuel Price & News";
  if (lower.includes("kubota") && lower.includes("zt")) return "Kubota ZT News";
  if (lower.includes("kubota") && lower.includes("second")) return "Kubota Second News";
  if (lower.includes("kubota")) return "Kubota News";
  if (lower.includes("yanmar") || lower.includes("yammar")) return "Yanmar News";
  if (lower.includes("john deere")) return "John Deere News";
  if (lower.includes("new holland")) return "New Holland News";
  if (lower.includes("yto")) return "YTO News";
  if (lower.includes("sonalika")) return "Sonalika News";
  if (lower.includes("yamabisi")) return "Yamabisi News";
  if (lower.includes("mahindra") && lower.includes("dongfeng")) {
    return "Mahindra and Dongfeng News";
  }
  if (lower.includes("mahindra")) return "Mahindra News";
  if (lower.includes("dongfeng")) return "Dongfeng News";
  if (lower.includes("deutz") || lower.includes("matador")) {
    return "DeutzFhar & Matador News";
  }

  return cleaned;
}

function DailyNewsReportContent() {
  const getTodayLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
  };

  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const queryDate = searchParams.get("date");
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    queryDate && /^\d{4}-\d{2}-\d{2}$/.test(queryDate)
      ? queryDate
      : getTodayLocal()
  );
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const text = reportText[language];
  const { texts: translatedTitles, isLoading: translating, error: translationError } =
    useTranslatedTexts(newsList.map((news) => news.titleText || news.title || ""), true);
  const titlesById = new Map(newsList.map((news, index) => [news._id, translatedTitles[index]]));

  useEffect(() => {
    if (!selectedDate) return;
    let isCancelled = false;

    async function fetchDailyNews() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/daily-report?date=${encodeURIComponent(selectedDate)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const items: NewsArticle[] = Array.isArray(data) ? data : [];
        if (!isCancelled) setNewsList(items);
      } catch (error) {
        console.error("Error fetching daily news:", error);
        if (!isCancelled) setNewsList([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchDailyNews();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  const formatReportDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return dateStr;
    return formatLocalizedDate(date, language, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatArticleDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return formatLocalizedDate(date, language, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `KMM-News-Report-${selectedDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error exporting PNG:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/daily-report?date=${selectedDate}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalCount = (newsList || []).length;
  const isDenseGrid = totalCount > 8;
  const isMediumGrid = totalCount > 4 && totalCount <= 8;

  const thumbnailHeightClass = isDenseGrid
    ? "h-[75px]"
    : isMediumGrid
    ? "h-[100px]"
    : "h-[135px]";

  const categorySummary = Object.values(
    (newsList || []).reduce((acc, item) => {
      const normalizedTitle = normalizeCategoryTitle(
        item.categoryText || item.categoryTitle
      );
      const label = item.categoryCode
        ? `${item.categoryCode} ${normalizedTitle}`
        : normalizedTitle;
      if (!acc[label]) acc[label] = { label, category: normalizedTitle, code: item.categoryCode, count: 0 };
      acc[label].count += 1;
      return acc;
    }, {} as Record<string, { label: string; category: string; code?: string; count: number }>)
  );
  const newsGroups = groupNewsArticles(newsList);

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-[1080px] bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6 shadow-xs flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label htmlFor="report-date" className="font-bold text-gray-700 text-sm sm:text-base">
            📅 {text.date}
          </label>
          <input
            id="report-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadImage}
            disabled={exporting || loading || translating}
            className="bg-[#235838] hover:bg-[#1a432a] text-white text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
          >
            🖼️ {exporting ? text.exporting : text.image}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={exporting || loading || translating}
            className="bg-[#D9531E] hover:bg-[#b84315] text-white text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
          >
            📄 {text.pdf}
          </button>
          <button
            onClick={handleCopyLink}
            className="col-span-2 sm:col-span-1 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-xl cursor-pointer"
          >
            {copied ? `✅ ${text.copied}` : `🔗 ${text.copy}`}
          </button>
        </div>
      </div>
      {translating && <p role="status" className="mb-3 text-sm text-gray-600 print:hidden">{extraText(language).translating}</p>}
      {translationError && <p role="alert" className="mb-3 text-sm text-red-700">{extraText(language).translationError}</p>}

      <div className="w-full overflow-x-auto pb-6">
        <div
          ref={reportRef}
          className="mx-auto w-[1080px] min-h-[1080px] shrink-0 bg-[#F5F4EF] p-9 flex flex-col font-sans text-gray-900 select-none box-border shadow-md"
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="shrink-0">
              <h1 className="flex items-center gap-3 text-[44px] font-extrabold tracking-tight leading-none whitespace-nowrap">
                <img
                  src="/kmm-logo.png"
                  alt="KMM Kubota Logo"
                  className="w-[72px] h-[44px] object-contain mix-blend-multiply"
                />
                <span className="text-[#D9531E]">{text.title}</span>
              </h1>
              <p className="text-[28px] font-bold text-gray-800 mt-2">
                {formatReportDate(selectedDate)}
              </p>
            </div>
            <div className="flex-1 min-w-0 bg-[#FAF9F5] border border-gray-200/90 rounded-2xl px-7 py-5 shadow-xs">
              <h2 className="text-[22px] font-bold text-gray-800 mb-3">
                {text.summary}
              </h2>
              {loading ? (
                <p className="text-gray-500 text-[17px] py-4">{text.loading}</p>
              ) : categorySummary.length === 0 ? (
                <p className="text-gray-400 text-[17px] py-4">
                  {text.empty}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-10 gap-y-1.5 text-[18px]">
                  {categorySummary.map((cat) => (
                    <div
                      key={cat.label}
                      className="flex min-w-0 items-center justify-between text-gray-700"
                    >
                      <span className="font-medium truncate pr-2">{cat.code ? `${cat.code} ` : ""}{translateCategory(cat.category, language)}</span>
                      <span className="font-bold text-gray-900 whitespace-nowrap">
                        {cat.count} {text.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t-2 border-[#B91C1C] pt-5 space-y-6">
            {newsGroups.map((group) => (
              <section key={group.title}>
                <h3 className="text-[22px] font-bold text-gray-800 mb-3">
                  {translateGroup(group.title, language)}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {group.articles.map((news) => {
                    const categoryName = normalizeCategoryTitle(
                      news.categoryText || news.categoryTitle
                    );
                    const newsTitle = titlesById.get(news._id) || news.titleText || news.title || "";
                    const displayImg = news.imageDataUrl || news.imageUrl || "";
                    const detailSlug = news.slug?.current || news._id;

                    return (
                      <div
                        key={news._id}
                        className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className={`w-full ${thumbnailHeightClass} bg-gray-100 overflow-hidden`}>
                            {displayImg ? (
                              <img
                                src={displayImg}
                                alt={newsTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                {text.noImage}
                              </div>
                            )}
                          </div>
                          <div className="min-h-[130px] p-3">
                            <p className="text-[11px] font-extrabold text-[#B91C1C] tracking-wide truncate">
                              {translateCategory(categoryName, language)}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {formatArticleDate(news.publishedAt || news._createdAt)}
                            </p>
                            {newsTitle && (
                              <h4 className="text-[12.5px] font-bold text-gray-800 leading-snug line-clamp-5 mt-1.5">
                                {newsTitle}
                              </h4>
                            )}
                          </div>
                        </div>
                        <div className="px-3 pb-2.5 flex items-center justify-end">
                          <Link
                            href={`/news/${encodeURIComponent(detailSlug)}`}
                            className="text-[11.5px] font-semibold text-[#1E5631] hover:underline"
                          >
                            {t("readFullStory", language)} →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyNewsReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <DailyNewsReportContent />
    </Suspense>
  );
}