'use client'
import { useState } from 'react'
import Image from 'next/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { extraText } from '@/lib/i18n/extraText'

export default function SitePasswordGuard() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<'incorrectPassword' | 'signInError' | 'connectionError' | ''>('')
  const [show, setShow] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { language } = useLanguage()
  const text = extraText(language)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (response.ok) {
        window.location.reload()
        return
      }
      setError(response.status === 401 ? 'incorrectPassword' : 'signInError')
    } catch (err) {
      console.error('Site login failed:', err)
      setError('connectionError')
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-4">
        <div className="relative w-full max-w-[380px]">
          <div className="flex justify-end mb-4"><LanguageSwitcher /></div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-full pl-1.5 pr-4 py-1.5 shadow-sm">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white flex items-center justify-center border border-gray-100">
                <Image src="/kubota-logo.png" alt="Kubota Logo" width={28} height={28} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-semibold text-gray-900">KMM Kubota News Portal</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-[32px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] p-8">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-xl">🔒</span>
            </div>
            <div className="text-center mb-6">
              <h1 className="text-[20px] font-bold text-gray-900">{text.locked}</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder={text.password}
                  aria-label={text.password}
                  className={`w-full h-[48px] px-4 pr-12 bg-gray-50 border rounded-2xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    error ? 'border-red-300 focus:border-red-400 focus:ring-red-50 bg-red-50/50' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-100'
                  }`}
                  autoFocus
                />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? text.hidePassword : text.showPassword} className="absolute right-0 top-0 h-[48px] w-12 flex items-center justify-center text-gray-400 hover:text-gray-600">
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
              {error && <div role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{text[error]}</div>}
              <button
                type="submit"
                disabled={!password || submitting}
                className="w-full h-[48px] bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl text-[14px] transition flex items-center justify-center gap-2"
              >
                {submitting ? text.signingIn : text.enter}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
}

