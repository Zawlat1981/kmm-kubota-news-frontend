'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n/uiText'

export default function BackToHomeLink() {
  const { language } = useLanguage()
  return (
    <Link
      href="/"
      className="text-sm font-semibold text-red-600 hover:underline mb-6 inline-block"
    >
      {t('backToHome', language)}
    </Link>
  )
}