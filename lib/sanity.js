import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  useCdn: false, // သတင်းဝဘ်ဆိုဒ်များအတွက် ပုံများနှင့် အချက်အလက်များ အမြန်ပေါ်စေရန် true ထားပါသည်
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}