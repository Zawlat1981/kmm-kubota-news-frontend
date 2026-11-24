/**
 * lib/translate.ts - Groq with model fallback + EN/MY/TH
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
            { role: 'system', content: `Translate the text to ${targetName}. Detect the source language. Output only the translation. Preserve company and brand names, model codes, numbers, currencies, formatting, bullets and line breaks. Translate the full content without summarizing.` },
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
      if (data.choices?.[0]?.finish_reason === 'length') {
        throw new Error('Translation was truncated')
      }
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

export async function translateBatch(texts: string[], target: TargetLanguage, strict = false): Promise<string[]> {
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
      console.error('Translation failed:', e)
      if (strict) throw e
      results.push(t)
    }
  }
  return results
}

