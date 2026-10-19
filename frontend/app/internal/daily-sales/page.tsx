import { redirect } from 'next/navigation'
export default function LegacyDailySalesPage() {
  redirect(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://kmm-kubota-cms.sanity.studio')
}