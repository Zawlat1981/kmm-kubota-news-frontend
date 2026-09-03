'use client'

import { useState } from 'react'
import {
  Truck,
  Home,
  Tag,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { t } from '@/lib/i18n/uiText'

interface Branch {
  address?: string
  phone?: string
  googleMapUrl?: string
}

interface Company {
  brand?: string
  companyGroup?: string
  category?: string
  distributor?: string
  cityTownship?: string
  stateRegion?: string
  branches?: Branch[]
  _id?: string
  companyName?: string
  companyImage?: unknown
  website?: string
  email?: string
  facebookLink?: string
  tiktokLink?: string
  viber?: string
  telegram?: string
  salesPersonName?: string
  salesPhone?: string
  salesFbLink?: string
  salesTtLink?: string
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value?: string
}) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[#C6001E]" strokeWidth={1.75} />
        <span className="text-sm text-[#8A8578]">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#1A1A1A] text-right">
        {value}
      </span>
    </div>
  )
}

export default function CompanyDetailTabs({
  company,
}: {
  company: Company
}) {
  const [tab, setTab] = useState<'details' | 'contact'>('details')
  const { language } = useLanguage()

  const rawRegion = [company.cityTownship, company.stateRegion]
    .filter(Boolean)
    .join(', ')

  const rawCategory = company.category
    ? company.distributor
      ? `${company.category} from ${company.distributor}`
      : company.category
    : ''

  // --- Translate the dynamic data fields together in one batch call ---
  // Order matters: index 0-3 map to brand / companyGroup / category / region.
  // Branch addresses are appended after, in order.
  const branchAddresses = (company.branches || []).map((b) => b.address || '')
  const dynamicValues = [
    company.brand || '',
    company.companyGroup || '',
    rawCategory,
    rawRegion,
    ...branchAddresses,
  ]
  const { texts: translatedValues } = useTranslatedTexts(dynamicValues)

  const [tBrand, tCompanyGroup, tCategory, tRegion, ...tBranchAddresses] = translatedValues

  const hasContactInfo =
    (company.branches && company.branches.length > 0) ||
    company.email ||
    company.website ||
    company.salesPersonName ||
    company.salesPhone ||
    company.facebookLink ||
    company.tiktokLink ||
    company.viber ||
    company.telegram

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-[#E5E2DA] px-5">
        {(['details', 'contact'] as const).map((key) => {
          if (key === 'contact' && !hasContactInfo) return null
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative py-3.5 mr-6 text-sm font-medium transition-colors ${
                tab === key ? 'text-[#1A1A1A]' : 'text-[#B3AEA0]'
              }`}
            >
              {key === 'details' ? t('details', language) : t('contact', language)}
              {tab === key && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#C6001E] rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      <div className="p-5">
        {tab === 'details' && (
          <div className="divide-y divide-[#EFEDE7]">
            <Field icon={Truck} label={t('brand', language)} value={tBrand} />
            <Field
              icon={Home}
              label={t('companyGroup', language)}
              value={tCompanyGroup}
            />
            <Field
              icon={Tag}
              label={t('category', language)}
              value={tCategory}
            />
            <Field icon={MapPin} label={t('region', language)} value={tRegion} />
          </div>
        )}

        {tab === 'contact' && (
          <div className="space-y-5">
            {/* Branch offices */}
            {company.branches && company.branches.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-[#8A8578] mb-2">
                  {t('branchOffices', language)}
                </h2>
                <div className="space-y-2">
                  {company.branches.map((branch, i) => {
                    const hasContent =
                      branch.address || branch.phone || branch.googleMapUrl
                    if (!hasContent) return null
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-[#E5E2DA] bg-[#FAFAF8] p-4"
                      >
                        {branch.address && (
                          <div className="flex items-start gap-2.5 mb-2">
                            <MapPin
                              className="w-4 h-4 text-[#C6001E] mt-0.5 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="text-sm font-medium text-[#1A1A1A]">
                              {tBranchAddresses[i] || branch.address}
                            </span>
                          </div>
                        )}
                        {branch.phone && (
                          <div className="flex items-center gap-2.5 mb-3">
                            <Phone
                              className="w-4 h-4 text-[#C6001E] shrink-0"
                              strokeWidth={1.75}
                            />
                            <a
                              href={`tel:${branch.phone}`}
                              className="text-sm font-medium text-[#1A1A1A] hover:underline"
                            >
                              {branch.phone}
                            </a>
                          </div>
                        )}
                        {branch.googleMapUrl && (
                          <a
                            href={branch.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full py-2 rounded-lg bg-[#C6001E] hover:bg-[#8C0016] text-white text-xs font-semibold transition-colors"
                          >
                            {t('viewOnMap', language)}
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Direct contact */}
            {(company.email || company.website) && (
              <div className="divide-y divide-[#EFEDE7]">
                <Field icon={Mail} label={t('email', language)} value={company.email} />
                <Field
                  icon={Globe}
                  label={t('website', language)}
                  value={company.website}
                />
              </div>
            )}

            {/* Sales contact */}
            {(company.salesPersonName || company.salesPhone) && (
              <div>
                <h2 className="text-xs font-semibold text-[#8A8578] mb-2">
                  {t('salesContact', language)}
                </h2>
                <div className="rounded-xl border border-[#E5E2DA] p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FBEAEA] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#C6001E]" strokeWidth={2} />
                  </div>
                  <div>
                    {company.salesPersonName && (
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {company.salesPersonName}
                      </p>
                    )}
                    {company.salesPhone && (
                      <a
                        href={`tel:${company.salesPhone}`}
                        className="text-xs text-[#8A8578] hover:text-[#C6001E]"
                      >
                        {company.salesPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Social links */}
            {(company.facebookLink ||
              company.tiktokLink ||
              company.viber ||
              company.telegram) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {company.facebookLink && (
                  <a
                    href={company.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#1A1A1A] border border-[#E5E2DA] rounded-lg px-3 py-1.5 hover:border-[#C6001E] hover:text-[#C6001E] transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {company.tiktokLink && (
                  <a
                    href={company.tiktokLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#1A1A1A] border border-[#E5E2DA] rounded-lg px-3 py-1.5 hover:border-[#C6001E] hover:text-[#C6001E] transition-colors"
                  >
                    TikTok
                  </a>
                )}
                {company.viber && (
                  <span className="text-xs font-medium text-[#1A1A1A] border border-[#E5E2DA] rounded-lg px-3 py-1.5">
                    Viber: {company.viber}
                  </span>
                )}
                {company.telegram && (
                  <a
                    href={company.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#1A1A1A] border border-[#E5E2DA] rounded-lg px-3 py-1.5 hover:border-[#C6001E] hover:text-[#C6001E] transition-colors"
                  >
                    Telegram
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}