import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';

interface NewsReportArticle {
  _id: string;
  _type: string;
  slug?: { current?: string };
  publishedAt?: string;
  _createdAt?: string;
  imageUrl?: string;
}

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9vb1irgv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
});

function toThailandDateString(dateInput: string): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
}

async function urlToBase64(url?: string): Promise<string> {
  if (!url) return '';
  try {
    const thumbUrl = `${url}?w=450&auto=format&q=80`;
    const res = await fetch(thumbUrl, { cache: 'no-store' });
    if (!res.ok) return '';
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch {
    return '';
  }
}

export async function GET(req: NextRequest) {
  const targetDate = req.nextUrl.searchParams.get('date') || '';

  try {
    const query = `*[_type in ["news", "newsPortal", "post", "article"] && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _createdAt) desc)[0...100] {
      _id,
      _type,
      "titleText": coalesce(title.th, title_th, title.en, title, headline, name, "Untitled News"),
      slug,
      "categoryText": coalesce(category->title, category.title, category, type, ""),
      publishedAt,
      _createdAt,
      "imageUrl": coalesce(mainImage.asset->url, image.asset->url, coverImage.asset->url, thumbnail.asset->url)
    }`;
    const allNews = await sanityClient.fetch<NewsReportArticle[]>(query);

    const filtered = targetDate
      ? allNews.filter((item) => {
          const rawDate = item.publishedAt || item._createdAt || '';
          return toThailandDateString(rawDate) === targetDate;
        })
      : allNews;

    const withBase64Images = await Promise.all(
      filtered.map(async (item) => ({
        ...item,
        imageDataUrl: await urlToBase64(item.imageUrl),
      }))
    );

    return NextResponse.json(withBase64Images);
  } catch (error) {
    console.error('Daily Report API Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch daily report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 
