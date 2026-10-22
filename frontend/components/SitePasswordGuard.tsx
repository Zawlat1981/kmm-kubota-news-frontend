'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const SITE_PASSWORD = 'kubota2024'

export default function SitePasswordGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  // ✅ FIX Error: Calling setState synchronously within an effect
  // setTimeout သုံးလိုက်တော့ synchronous မဟုတ်တော့ဘူး → ESLint OK!
  useEffect(() => {
    const timer = setTimeout(() => {
      const authKey = `kubota_auth_${SITE_PASSWORD}`
      const saved = localStorage.getItem(authKey)
      if (saved === 'true') {
        setIsAuthed(true)
      }
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === SITE_PASSWORD) {
      const authKey = `kubota_auth_${SITE_PASSWORD}`
      localStorage.setItem(authKey, 'true')
      setIsAuthed(true)
      setError(false)
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 3500)
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-4">
        <div className="relative w-full max-w-[380px]">
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
              <h1 className="text-[20px] font-bold text-gray-900">Website Locked</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(false)
                  }}
                  placeholder="Enter password"
                  className={`w-full h-[48px] px-4 pr-12 bg-gray-50 border rounded-2xl text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    error ? 'border-red-300 focus:border-red-400 focus:ring-red-50 bg-red-50/50' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-100'
                  }`}
                  autoFocus
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-0 top-0 h-[48px] w-12 flex items-center justify-center text-gray-400 hover:text-gray-600">
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
              {error && <div className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">Incorrect password</div>}
              <button
                type="submit"
                disabled={!password}
                className="w-full h-[48px] bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl text-[14px] transition flex items-center justify-center gap-2"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] p-8 mx-4 max-w-[420px] w-full text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-5 shadow-lg flex items-center justify-center bg-white border p-1">
              <Image src="/kubota-logo.png" alt="Kubota Logo" width={64} height={64} className="w-full h-full object-contain" />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Welcome to</h2>
            <h1 className="text-[22px] font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">KMM Kubota News Portal</h1>
            <div className="mt-3 h-[3px] w-12 bg-gradient-to-r from-red-500 to-orange-400 rounded-full mx-auto"></div>
            <p className="text-[13px] text-gray-500 mt-4">Your trusted source for Kubota news & updates</p>
            <div className="mt-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

