'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n/uiText'

export default function BackToMenuLink() {
  const { language } = useLanguage()
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8A8578] hover:text-[#1A1A1A] mb-4 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" strokeWidth={2} />
      {t('backToMenu', language)}
    </Link>
  )
}