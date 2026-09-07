/**
 * lib/detectScript.ts
 *
 * Detects whether a string is primarily written in Thai script, Myanmar
 * (Burmese) script, or something else (Latin/English/mixed), based on
 * Unicode character ranges:
 *   - Myanmar script:  U+1000–U+109F
 *   - Thai script:      U+0E00–U+0E7F
 *
 * Used to skip translation entirely when the content is already in the
 * language the user wants to view — saves API calls and shows content
 * instantly instead of round-tripping through Groq for no reason.
 */

export type DetectedScript = 'my' | 'th' | 'other'

export function detectScript(text: string): DetectedScript {
  if (!text) return 'other'

  const myanmarMatches = text.match(/[\u1000-\u109F]/g)?.length || 0
  const thaiMatches = text.match(/[\u0E00-\u0E7F]/g)?.length || 0

  // Require a meaningful number of script characters before deciding —
  // a title with just one stray character shouldn't flip the detection.
  if (myanmarMatches === 0 && thaiMatches === 0) return 'other'
  return myanmarMatches >= thaiMatches ? 'my' : 'th'
}