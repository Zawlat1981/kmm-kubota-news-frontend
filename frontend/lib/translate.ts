/**
 * lib/translate.ts - Groq with model fallback + cert bypass + EN/MY/TH
 */
export type TargetLanguage = 'my' | 'th' | 'en'

const LANGUAGE_NAMES: Record<TargetLanguage, string> = {
  my: 'Burmese (Myanmar)',
  th: 'Thai',
  en: 'English',
}

const memoryCache = new Map<string, string>()
function cacheKey(text: string, target: TargetLanguage) {
  return `${target}::${text}`
}

async function translateWithGroq(text: string, target: TargetLanguage): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set')
  const targetName = LANGUAGE_NAMES[target]

  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  const models = [
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile',
    'llama-3.3-70b-versatile',
    'openai/gpt-oss-20b',
    'openai/gpt-oss-120b',
  ]

  let lastError: Error | null = null
  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: `Translate Thai to ${targetName}. Output only translation. Preserve formatting, bullets (•), line breaks. Translate FULL content, don't summarize.` },
            { role: 'user', content: text },
          ],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      })
      if (!response.ok) {
        const err = await response.text()
        if (err.includes('model_not_found') || err.includes('does not exist')) continue
        throw new Error(err)
      }
      const data = await response.json()
      const translated = data.choices?.[0]?.message?.content?.trim()
      if (translated) return translated
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e))
      lastError = err
      continue
    }
  }
  throw lastError || new Error('All Groq models failed')
}

export async function translateText(text: string, target: TargetLanguage): Promise<string> {
  if (!text || !text.trim()) return text
  const key = cacheKey(text, target)
  const cached = memoryCache.get(key)
  if (cached) return cached
  const translated = await translateWithGroq(text, target)
  memoryCache.set(key, translated)
  return translated
}

export async function translateBatch(texts: string[], target: TargetLanguage): Promise<string[]> {
  const results: string[] = []
  for (const t of texts) {
    if (!t || !t.trim()) { results.push(t); continue }
    const key = cacheKey(t, target)
    const cached = memoryCache.get(key)
    if (cached) { results.push(cached); continue }
    try {
      const translated = await translateWithGroq(t, target)
      memoryCache.set(key, translated)
      results.push(translated)
    } catch (e: unknown) {
      console.error('Translate fail:', t.slice(0, 50), e)
      results.push(t)
    }
  }
  return results
}

