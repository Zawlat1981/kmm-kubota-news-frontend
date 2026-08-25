import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo and Animated Tractor */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-red-600 bg-gray-50 flex items-center justify-center">
            <Image 
              src="/kubota-logo.png.png" 
              alt="Kubota Logo"
              width={56}
              height={56}
              className="object-cover group-hover:animate-bounce transition-all duration-300"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              KMM Kubota <span className="text-red-600">News Portal</span>
            </h1>
            <p className="text-xs text-gray-500">Agricultural Machinery News & Updates</p>
          </div>
        </div>

      </div>
    </header>
  )
}