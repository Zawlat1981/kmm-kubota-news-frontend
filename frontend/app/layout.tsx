import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SitePasswordGuard from "@/components/SitePasswordGuard";
import ClientAppShell from "@/components/ClientAppShell";
import KmmChatbot from "@/components/KmmChatbot";
import { cookies } from "next/headers";
import { isValidSiteSession, SITE_SESSION_COOKIE } from "@/lib/siteAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KMM Kubota News Portal",
  description: "Agricultural Directory - KMM Kubota News Portal",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authenticated = isValidSiteSession((await cookies()).get(SITE_SESSION_COOKIE)?.value);
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 pb-[80px] lg:pb-0">
        {authenticated ? (
          <LanguageProvider>
            <ClientAppShell>{children}</ClientAppShell>
            <KmmChatbot />
          </LanguageProvider>
        ) : (
          <SitePasswordGuard />
        )}
      </body>
    </html>
  );
}

