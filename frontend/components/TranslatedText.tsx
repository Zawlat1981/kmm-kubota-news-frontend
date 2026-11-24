'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { extraText } from '@/lib/i18n/extraText'

export default function TranslatedText({ text }: { text: string }) {
  const { language } = useLanguage()
  const { texts, error } = useTranslatedTexts([text])
  return <>{texts[0]}{error && <> <span role="alert" className="text-red-700 text-xs">{extraText(language).translationError}</span></>}</>
}
