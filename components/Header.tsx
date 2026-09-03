import Image from 'next/image'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo and Animated Tractor Container */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-16 h-16 flex items-center justify-center">
            
            {/* မီးခိုးထွက်မည့် ပုံစံ (Hover လုပ်မှ ပေါ်မည်) */}
            <div className="absolute -top-4 left-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2">
              <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-ping"></span>
              <span className="w-3.5 h-3.5 bg-gray-400 rounded-full mt-0.5 opacity-80"></span>
            </div>

            {/* ထွန်စက် Logo ပုံ */}
            <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-red-600 bg-gray-50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/kubota-logo.png.png" 
                alt="Kubota Logo"
                width={56}
                height={56}
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              KMM Kubota <span className="text-red-600">News Portal</span>
            </h1>
            <p className="text-xs text-gray-500">Agricultural Machinery News & Updates</p>
          </div>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

      </div>
    </header>
  )
}