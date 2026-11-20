import { unstable_cache } from 'next/cache'
import { createClient } from '@sanity/client'

export const KMM_CHAT_DATA_CACHE_TAG = 'kmm-chat-data'

export interface KmmChatRecord {
  [key: string]: unknown
  _type?: string
}

export interface KmmChatData {
  news: KmmChatRecord[]
  priceList: KmmChatRecord[]
  products: KmmChatRecord[]
  dailySales: KmmChatRecord[]
  companies: KmmChatRecord[]
}

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9vb1irgv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
})

const KMM_CHAT_DATA_QUERY = `{
  "news": *[_type in ["news", "newsPortal"]] | order(coalesce(publishedAt, _createdAt) desc)[0...100] {
    _type,
    title,
    brand,
    publishedAt,
    category,
    summary,
    body
  },
  "priceList": *[_type == "priceList"] | order(brand asc, modelName asc)[0...150] {
    _type,
    brand,
    modelName,
    itemType,
    category,
    series,
    parentModel,
    frontDozer,
    specialDozer,
    frontLoader,
    configuration,
    horsepower,
    price,
    currency,
    notes
  },
  "products": *[_type in ["productSpec", "productMarketing", "products"]] | order(_updatedAt desc)[0...150] {
    _type,
    displayName,
    modelCode,
    category,
    grossHorsepower,
    ptoHorsepower,
    engineModel,
    engineType,
    shortDescription,
    keySellingPoints,
    applications,
    "productSpec": productSpec->{modelCode, category, grossHorsepower, ptoHorsepower}
  },
  "dailySales": *[_type in ["dailySale", "dailySales", "sale", "sales"]] | order(saleDate desc, _createdAt desc)[0...200] {
    _type,
    branch,
    saleDate,
    model,
    customerName,
    "division": coalesce(regionDivision, division, region),
    paymentType,
    salesPerson,
    stockRemaining
  },
  "companies": *[_type == "company"] | order(companyName asc)[0...100] {
    _type,
    "name": coalesce(companyName, name),
    brand,
    stateRegion,
    cityTownship,
    address,
    phone,
    email,
    website
  }
}`

const fetchKmmChatData = unstable_cache(
  async () => sanityClient.fetch<KmmChatData>(KMM_CHAT_DATA_QUERY),
  ['kmm-chat-data-v1'],
  {
    revalidate: 60 * 60,
    tags: [KMM_CHAT_DATA_CACHE_TAG],
  },
)

export function getCachedKmmChatData() {
  return fetchKmmChatData()
}

function flattenValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    return value.map(flattenValue).filter(Boolean).join(' ')
  }
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([key]) => !key.startsWith('_'))
      .map(([key, nestedValue]) => `${key} ${flattenValue(nestedValue)}`)
      .filter(Boolean)
      .join(' ')
  }
  return ''
}

function termMatchScore(term: string, text: string): number {
  if (text.includes(term)) return 1

  const characters = Array.from(term)
  if (characters.length < 5) return 0

  const trigrams = Array.from(
    { length: characters.length - 2 },
    (_, index) => characters.slice(index, index + 3).join(''),
  )
  const matches = trigrams.filter((trigram) => text.includes(trigram)).length
  const coverage = matches / trigrams.length
  return coverage >= 0.35 ? coverage : 0
}

export function findRelevantKmmData(question: string, data: KmmChatData): string {
  const normalizedQuestion = question.normalize('NFKC').toLocaleLowerCase()
  const terms = Array.from(
    new Set(normalizedQuestion.match(/[\p{L}\p{N}]+/gu) ?? []),
  ).filter((term) => Array.from(term).length > 1)

  const collections = [
    ['News', data.news],
    ['Price list', data.priceList],
    ['Products', data.products],
    ['Daily sales', data.dailySales],
    ['Companies', data.companies],
  ] as const

  const rankedRecords = collections.flatMap(([label, records]) =>
    records
      .map((record) => {
        const searchableText = flattenValue(record).normalize('NFKC').toLocaleLowerCase()
        const termScore = terms.reduce(
          (score, term) => score + termMatchScore(term, searchableText),
          0,
        )
        const phrase = normalizedQuestion.replace(/\s+/g, ' ').trim()
        const phraseScore = phrase.length > 2 && searchableText.includes(phrase) ? 2 : 0

        return {
          label,
          record,
          score: termScore + phraseScore,
          searchableText,
        }
      })
      .filter((item) => item.score > 0),
  )

  const relevantRecords = rankedRecords
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)

  if (relevantRecords.length === 0) {
    return 'No matching records were found in the cached KMM data.'
  }

  return relevantRecords
    .map(({ label, record, searchableText }) => {
      const content = flattenValue(record).slice(0, 1200)
      return `[${label}] ${content || searchableText.slice(0, 1200)}`
    })
    .join('\n\n')
}
