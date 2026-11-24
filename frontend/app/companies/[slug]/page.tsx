import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { CompanyCategoryText, CompanyGroupText, ExtraText, UiText } from '@/components/LocalizedText'
import { formatCompanyBrand, safeCompanyWebUrl, splitCompanyWebLinks, type CompanyRecord } from '@/lib/company'
import TranslatedText from '@/components/TranslatedText'

interface CompanyDetailProps {
  params: Promise<{ slug: string }>
}

type CompanyDetail = CompanyRecord & {
  website?: string
  googleMapUrl?: string
  facebookLink?: string
  tiktokLink?: string
  viber?: string
  telegram?: string
  salesPersonName?: string
  salesPhone?: string
  salesFbLink?: string
  salesTtLink?: string
}

async function getCompany(slug: string) {
  const query = `*[_type == "company" && (slug.current == $slug || _id == $slug)][0]{
    _id, companyGroup, companyName, category, brand, stateRegion, cityTownship,
    phone, address, website, email, googleMapUrl, companyImage,
    facebookLink, tiktokLink, viber, telegram,
    salesPersonName, salesPhone, salesFbLink, salesTtLink
  }`
  return client.fetch<CompanyDetail | null>(query, { slug }, { cache: 'no-store' })
}

function DetailRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 break-words text-sm sm:text-base text-gray-900">{children}</dd>
    </div>
  )
}

function WebContact({ value, allowPlainText = false, linkText }: { value: string; allowPlainText?: boolean; linkText?: ReactNode }) {
  const links = splitCompanyWebLinks(value)
  return links.map((link, index) => {
    const href = safeCompanyWebUrl(link)
    if (!href) {
      return <span key={index} className="block">{link}{!allowPlainText && <> <span className="text-red-700 text-xs">(<ExtraText textKey="invalidLink" />)</span></>}</span>
    }
    return <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="block text-blue-700 hover:underline break-all">
      {linkText ? <>{linkText}{links.length > 1 && ` ${index + 1}`}</> : link}
    </a>
  })
}

export default async function CompanyDetailPage({ params }: CompanyDetailProps) {
  const { slug } = await params
  const company = await getCompany(slug)
  if (!company) notFound()

  const brand = formatCompanyBrand(company.brand)
  const location = [company.address, company.cityTownship, company.stateRegion].filter(Boolean).join(', ')
  const hasContact = company.phone || company.email || company.website || company.facebookLink ||
    company.tiktokLink || company.viber || company.telegram
  const hasSalesContact = company.salesPersonName || company.salesPhone || company.salesFbLink || company.salesTtLink

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-6 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition">
            ← <UiText textKey="backToMenu" />
          </Link>
          <Link href="/companies" className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition">
            <ExtraText textKey="directory" />
          </Link>
        </nav>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {company.companyImage && (
            <div className="w-full h-64 sm:h-80 bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlFor(company.companyImage).url()} alt={company.companyName || 'Company Image'} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{company.companyName}</h1>

            {(brand || company.companyGroup || company.category) && (
              <section className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4"><ExtraText textKey="companyInformation" /></h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {brand && <DetailRow label={<UiText textKey="brand" />}>{brand}</DetailRow>}
                  {company.companyGroup && <DetailRow label={<ExtraText textKey="companyGroup" />}><CompanyGroupText value={company.companyGroup} /></DetailRow>}
                  {company.category && <DetailRow label={<ExtraText textKey="category" />}><CompanyCategoryText value={company.category} /></DetailRow>}
                </dl>
              </section>
            )}

            {(location || company.googleMapUrl) && (
              <section className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4"><ExtraText textKey="location" /></h2>
                <dl className="space-y-4">
                  {location && <DetailRow label={<ExtraText textKey="location" />}><TranslatedText text={location} /></DetailRow>}
                  {company.googleMapUrl && <DetailRow label={<ExtraText textKey="map" />}><WebContact value={company.googleMapUrl} linkText={<ExtraText textKey="map" />} /></DetailRow>}
                </dl>
              </section>
            )}

            {hasContact && (
              <section className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4"><ExtraText textKey="contactInformation" /></h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {company.phone && <DetailRow label={<ExtraText textKey="phone" />}><a href={`tel:${company.phone}`} className="text-blue-700 hover:underline">{company.phone}</a></DetailRow>}
                  {company.email && <DetailRow label={<ExtraText textKey="email" />}><a href={`mailto:${company.email}`} className="text-blue-700 hover:underline break-all">{company.email}</a></DetailRow>}
                  {company.website && <DetailRow label={<ExtraText textKey="website" />}><WebContact value={company.website} /></DetailRow>}
                  {company.facebookLink && <DetailRow label="Facebook"><WebContact value={company.facebookLink} linkText="Facebook" /></DetailRow>}
                  {company.tiktokLink && <DetailRow label="TikTok"><WebContact value={company.tiktokLink} linkText="TikTok" /></DetailRow>}
                  {company.viber && <DetailRow label="Viber"><WebContact value={company.viber} allowPlainText linkText="Viber" /></DetailRow>}
                  {company.telegram && <DetailRow label="Telegram"><WebContact value={company.telegram} linkText="Telegram" /></DetailRow>}
                </dl>
              </section>
            )}

            {hasSalesContact && (
              <section className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4"><ExtraText textKey="salesContact" /></h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {company.salesPersonName && <DetailRow label={<ExtraText textKey="salesPerson" />}>{company.salesPersonName}</DetailRow>}
                  {company.salesPhone && <DetailRow label={<ExtraText textKey="salesPhone" />}><a href={`tel:${company.salesPhone}`} className="text-blue-700 hover:underline">{company.salesPhone}</a></DetailRow>}
                  {company.salesFbLink && <DetailRow label="Facebook"><WebContact value={company.salesFbLink} linkText="Facebook" /></DetailRow>}
                  {company.salesTtLink && <DetailRow label="TikTok"><WebContact value={company.salesTtLink} linkText="TikTok" /></DetailRow>}
                </dl>
              </section>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
