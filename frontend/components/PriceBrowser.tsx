'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { extraText } from '@/lib/i18n/extraText'
import { t } from '@/lib/i18n/uiText'
import { calculatePriceTotal, getModelImplements, getPriceModels, getUnmatchedImplements, hasPrice, priceVariantName, type PriceItem } from '@/lib/prices'
import { urlFor } from '@/lib/sanity'
import TranslatedText from '@/components/TranslatedText'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'

function formatModel(name: string, language: Parameters<typeof t>[1]) {
  const variants = name.match(/(?:\+(?:FD|SD|LA))+$/)?.[0]
  if (!variants) return name
  const labels = variants.slice(1).split('+').map((variant) => {
    if (variant === 'FD') return t('withFrontDozerLabel', language)
    if (variant === 'SD') return t('withSpecialDozerLabel', language)
    return t('withFrontLoaderLabel', language)
  })
  return `${name.slice(0, -variants.length)} ${labels.join(' ')}`
}

function PriceCard({ item, selected, onSelect }: { item: PriceItem; selected?: boolean; onSelect?: () => void }) {
  const { language } = useLanguage()
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {item.image && <div className="h-40 overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={urlFor(item.image).url()} alt={item.modelName || 'Machinery'} className="w-full h-full object-cover" />
      </div>}
      <div className="p-5">
        {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
        <h4 className="text-lg font-bold text-gray-900">{formatModel(priceVariantName(item), language)}</h4>
        {item.itemType !== 'implement' && typeof item.horsepower === 'number' && <p className="text-sm text-gray-600 mt-1">{item.horsepower} hp</p>}
        {hasPrice(item) && <p className="text-green-700 font-semibold mt-3">{item.price?.toLocaleString()} {item.currency || ''}</p>}
        {item.notes && <p className="text-sm text-gray-500 mt-2"><TranslatedText text={item.notes} /></p>}
        {onSelect && <label className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-700"><input type="checkbox" checked={selected} onChange={onSelect} className="h-4 w-4 accent-red-600" />{t('chooseImplementsLabel', language)}</label>}
      </div>
    </article>
  )
}

export default function PriceBrowser({ brand, priceList, onClose }: { brand: string; priceList: PriceItem[]; onClose: () => void }) {
  const { language } = useLanguage()
  const text = extraText(language)
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedImplementIds, setSelectedImplementIds] = useState<string[]>([])
  const options = getPriceModels(brand, priceList)
  const model = options.find((option) => option.value === selectedModel)
  const implementsList = model ? getModelImplements(model, priceList) : []
  const unmatchedImplements = getUnmatchedImplements(brand, options, priceList)
  const selectedImplements = implementsList.filter((item) => selectedImplementIds.includes(item._id))
  const total = calculatePriceTotal(model?.machine, selectedImplements)
  const categoryNames: Record<string, string> = {
    tractor: text.tractor, 'combine-harvester': text.harvester, 'rice-transplanter': text.transplanter, excavator: text.excavator,
  }
  const groups = ['tractor', 'combine-harvester', 'rice-transplanter', 'excavator', ...new Set(options.map((option) => option.category || ''))]
    .filter((category, index, all) => all.indexOf(category) === index && options.some((option) => (option.category || '') === category))
  const unknownCategories = groups.filter((category) => category && !categoryNames[category])
  const translatedCategories = useTranslatedTexts(unknownCategories)
  const categoryLabel = (category: string) => {
    if (!category) return text.otherMachinery
    if (categoryNames[category]) return categoryNames[category]
    return translatedCategories.texts[unknownCategories.indexOf(category)] || category
  }

  return (
    <section className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold text-gray-900">{model ? formatModel(model.name, language) : brand} {model ? t('pricesAndImplementsLabel', language) : t('modelsLabel', language)}</h3>
        <button type="button" onClick={() => { if (model) { setSelectedModel(''); setSelectedImplementIds([]) } else onClose() }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />{model ? t('backToModels', language) : t('backToMenu', language)}
        </button>
      </div>
      {!model ? (
        <div className="space-y-6">
        {options.length ? <div className="max-w-xl bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <label htmlFor="price-model" className="block text-sm font-semibold text-gray-700 mb-2">{t('modelsLabel', language)}</label>
          <select id="price-model" value={selectedModel} onChange={(event) => { setSelectedModel(event.target.value); setSelectedImplementIds([]) }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white">
            <option value="">{t('modelSelectionDefault', language)}</option>
            {groups.map((category) => <optgroup key={category} label={categoryLabel(category)}>
              {options.filter((option) => (option.category || '') === category).map((option) => <option key={option.value} value={option.value}>{brand === 'Other Brand' && option.brand ? `${option.brand} — ` : ''}{formatModel(option.name, language)}</option>)}
            </optgroup>)}
          </select>
          {translatedCategories.error && <p role="alert" className="text-red-700 text-xs mt-2">{text.translationError}</p>}
        </div> : <p className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-500">{unmatchedImplements.length ? text.noModels : text.noPrices} {brand}.</p>}
        {unmatchedImplements.length > 0 && <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">{text.otherImplements}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{unmatchedImplements.map((item) => <PriceCard key={item._id} item={item} />)}</div>
        </div>}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{text.machinery}{model.category && ` — ${categoryLabel(model.category)}`}</h4>
            {translatedCategories.error && <p role="alert" className="text-red-700 text-xs mb-3">{text.translationError}</p>}
            {model.machine ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><PriceCard item={model.machine} /></div>
              : <p className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-500">{text.noMachinePrice}</p>}
          </div>
          {implementsList.length > 0 && <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('implementsLabel', language)}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {implementsList.map((item) => <PriceCard key={item._id} item={item} selected={selectedImplementIds.includes(item._id)} onSelect={() => setSelectedImplementIds((current) => current.includes(item._id) ? current.filter((id) => id !== item._id) : [...current, item._id])} />)}
            </div>
          </div>}
          {model.machine && total !== undefined && <aside className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-sm text-gray-700">{t('machinePriceLabel', language)}: {model.machine.price?.toLocaleString()} {model.machine.currency || ''}</p>
            <p className="text-xl font-bold text-red-700 mt-2">{t('totalPriceLabel', language)}: {total.toLocaleString()} {model.machine.currency || ''}</p>
          </aside>}
          {model.machine && total === undefined && selectedImplements.length > 0 && <p role="status" className="text-sm text-red-700">{text.totalUnavailable}</p>}
        </div>
      )}
    </section>
  )
}
