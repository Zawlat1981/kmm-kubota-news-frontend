/**
 * lib/translate.ts
 *
 * Provider-agnostic translation utility.
 *
 * CURRENT PROVIDER: Groq (openai/gpt-oss-120b) — free tier, no billing card required.
 * TO SWITCH TO GOOGLE TRANSLATE LATER: implement `translateWithGoogle()` below and
 * change the `translateText()` function to call it instead of `translateWithGroq()`.
 * Nothing else in the app needs to change.
 */

export type TargetLanguage = 'my' | 'th' // Burmese | Thai

const LANGUAGE_NAMES: Record<TargetLanguage, string> = {
  my: 'Burmese (Myanmar)',
  th: 'Thai',
}

// ---- Simple in-memory cache (per server instance) ----
// Avoids re-translating the same text twice in a short window.
// For persistent caching across deployments/restarts, consider storing
// translated results back into Sanity or a KV store.
const memoryCache = new Map<string, string>()

function cacheKey(text: string, target: TargetLanguage) {
  return `${target}::${text}`
}

// ---- Provider: Groq ----
async function translateWithGroq(text: string, target: TargetLanguage): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }

  const targetName = LANGUAGE_NAMES[target]

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the user's text into ${targetName}. Only output the translated text, with no explanation, no quotation marks, and no additional commentary. Preserve the original meaning, tone, and any numbers or proper nouns.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Groq API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  const translated = data.choices?.[0]?.message?.content?.trim()

  if (!translated) {
    throw new Error('Groq API returned an empty translation')
  }

  return translated
}

// ---- Provider: Google Translate (NOT YET ACTIVE — implement when billing is set up) ----
// async function translateWithGoogle(text: string, target: TargetLanguage): Promise<string> {
//   const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
//   if (!apiKey) {
//     throw new Error('GOOGLE_TRANSLATE_API_KEY is not set in environment variables')
//   }
//   const response = await fetch(
//     `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         q: text,
//         target, // 'my' or 'th'
//         format: 'text',
//       }),
//     }
//   )
//   if (!response.ok) {
//     throw new Error(`Google Translate API error (${response.status})`)
//   }
//   const data = await response.json()
//   return data.data.translations[0].translatedText
// }

/**
 * Main entry point used across the app.
 * Swap the implementation here to change providers.
 */
export async function translateText(text: string, target: TargetLanguage): Promise<string> {
  if (!text || !text.trim()) return text

  const key = cacheKey(text, target)
  const cached = memoryCache.get(key)
  if (cached) return cached

  // --- Active provider: Groq ---
  const translated = await translateWithGroq(text, target)

  // --- To switch providers, comment the line above and uncomment below ---
  // const translated = await translateWithGoogle(text, target)

  memoryCache.set(key, translated)
  return translated
}

/**
 * Batch helper: translate multiple strings in one Groq call to save requests.
 * Useful for translating a whole company card or news card at once.
 */
export async function translateBatch(
  texts: string[],
  target: TargetLanguage
): Promise<string[]> {
  const nonEmpty = texts.filter((t) => t && t.trim())
  if (nonEmpty.length === 0) return texts

  // Check cache first
  const results: (string | null)[] = texts.map((t) => {
    if (!t || !t.trim()) return t
    return memoryCache.get(cacheKey(t, target)) ?? null
  })

  const toTranslate = texts.filter((t, i) => t && t.trim() && results[i] === null)
  if (toTranslate.length === 0) return results as string[]

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }

  const targetName = LANGUAGE_NAMES[target]
  const numbered = toTranslate.map((t, i) => `${i + 1}. ${t}`).join('\n')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate each numbered line into ${targetName}. Return ONLY the translated lines, in the same numbered format (e.g. "1. ...", "2. ..."), with no extra commentary.`,
        },
        { role: 'user', content: numbered },
      ],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Groq API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  const raw: string = data.choices?.[0]?.message?.content?.trim() || ''
  const lines = raw
    .split('\n')
    .map((l) => l.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)

  let cursor = 0
  const finalResults = texts.map((t, i) => {
    if (!t || !t.trim()) return t
    if (results[i] !== null) return results[i] as string
    const translated = lines[cursor] ?? t
    memoryCache.set(cacheKey(t, target), translated)
    cursor++
    return translated
  })

  return finalResults
}