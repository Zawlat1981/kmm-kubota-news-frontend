'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n/uiText'

interface SalePhotoLightboxProps {
  src: string
  alt: string
  salesPerson: string
  customerName: string
  model: string
  region: string
}

export default function SalePhotoLightbox({ src, alt, salesPerson, customerName, model, region }: SalePhotoLightboxProps) {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block w-full aspect-[16/10] cursor-zoom-in overflow-hidden bg-slate-100"
        aria-label={`View larger photo: ${alt}`}
      >
        <Image src={src} alt={alt} fill unoptimized className="object-cover transition duration-300 group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
          {t('viewPhoto', language)}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} enlarged photo`}
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-h-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1000}
              unoptimized
              className="max-h-[calc(100vh-4rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
            <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-slate-950/75 px-4 py-3 text-white backdrop-blur-sm sm:px-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
                  Customer Name: {customerName}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
                  {t('modelTag', language)}: {model}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
                  {t('regionTag', language)}: {region}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
                  Sales Person: {salesPerson}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-slate-900 shadow-lg hover:bg-slate-100"
              aria-label={t('closePhoto', language)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
