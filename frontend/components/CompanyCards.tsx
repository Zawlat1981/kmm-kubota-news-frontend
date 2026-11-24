'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { extraText } from '@/lib/i18n/extraText'
import { t } from '@/lib/i18n/uiText'
import type { CompanyItem } from '@/lib/company'
import { urlFor } from '@/lib/sanity'
import { CompanyCategoryText, CompanyGroupText } from '@/components/LocalizedText'
import TranslatedText from '@/components/TranslatedText'

export default function CompanyCards({ companies }: { companies: CompanyItem[] }) {
  const { language } = useLanguage()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.length > 0 ? companies.map((company) => {
        const detailId = company.slug?.current || company._id
        return (
          <Link href={`/companies/${encodeURIComponent(detailId)}`} key={company._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group">
            {company.companyImage ? (
              <div className="h-40 overflow-hidden bg-gray-100"><img src={urlFor(company.companyImage).url()} alt={company.companyName || 'Company'} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /></div>
            ) : (
              <div className="h-40 bg-red-50 flex items-center justify-center text-red-500 font-bold text-xl">🏢 {company.companyName?.charAt(0) || 'C'}</div>
            )}
            <div className="p-5 flex flex-col flex-grow">
              <h4 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-red-600 transition">{company.companyName}</h4>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {company.companyGroup && <div className="flex items-start gap-2"><span>📂</span><span className="font-medium text-gray-700">{extraText(language).companyGroup}:</span> <CompanyGroupText value={company.companyGroup} /></div>}
                {company.category && <div className="flex items-start gap-2"><span>📑</span><span className="font-medium text-gray-700">{extraText(language).category}:</span> <CompanyCategoryText value={company.category} /></div>}
                {company.brand && <div className="flex items-center gap-2"><span>🏷</span><span className="font-medium text-gray-700">{t('brand', language)}:</span> <span>{company.brand}</span></div>}
                {(company.cityTownship || company.stateRegion) && <div className="flex items-center gap-2"><span>📍</span><span className="font-medium text-gray-700">{t('region', language)}:</span> <span><TranslatedText text={[company.cityTownship, company.stateRegion].filter(Boolean).join(', ')} /></span></div>}
              </div>
              <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center gap-1">{t('viewDetailArrow', language)}</span>
            </div>
          </Link>
        )
      }) : <p className="col-span-full text-sm text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">{t('noCompanyInfo', language)}</p>}
    </div>
  )
}
