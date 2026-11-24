This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Site password and daily report

Before deploying, set `SITE_PASSWORD` to the current shared website password and
`SITE_SESSION_SECRET` to a separate, randomly generated secret of at least 32
characters in the frontend server environment. For example, generate a secret
locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
Do not use `NEXT_PUBLIC_` variables or commit these values. The site fails closed
if either value is missing. Existing browser logins must sign in again; sessions
expire after seven days and are invalidated when either value changes.

The old password was present in client-side code and may already be known to
others. Keeping it does not restore secrecy; replace it with a strong new
password when possible. Configure rate limiting for `/api/auth/login` at the
hosting platform. Sanity dataset access and the LINE and Sanity webhook
endpoints are not protected by this website password.

Set `SANITY_STUDIO_FRONTEND_URL` to the HTTPS frontend origin in the Sanity
Studio build environment and rebuild/redeploy the Studio. Its Daily News Report
menu opens the selected date on the frontend, where the normal website password
is required and image/PDF downloads and link sharing remain available.

## Languages

The language selector supports English, Thai, and Myanmar. English is the default
when no preference is saved; the selected language is stored in the browser.
Thai news titles and bodies remain unchanged when Thai is selected. They are
translated when English or Myanmar is selected, including titles on the daily
report. Translation of news and other supported content
requires `GROQ_API_KEY` on the server; a visible warning appears if it fails.
News text, company locations, and machinery notes are sent to Groq for
translation. Do not put private information in those CMS fields. Contact
details, sales records, and brand/model names are not sent for translation.
Known sales regions are translated locally; unrecognized region names remain
unchanged.

## Company directory

The directory shows company type, brands, and location. A company detail page
groups available location, company contacts, and sales contacts separately.
It displays the contact and social fields supplied in Sanity; empty fields are
omitted. Web links must use HTTP or HTTPS. Viber values that are not web links
are shown as text. Multiple web links in a field are separated by a comma and
space.

## Machinery prices

The price filter always lists the supported brands, including those without
published prices. Prices and machine categories come from Sanity `priceList`
records; unpublished prices are not estimated. Models are grouped by category,
and implements are shown with their matching machine. Implements without a
matching model appear separately. Unknown named brands are grouped under
Other Brand. Totals require a machine price and, for selected implements,
matching, specified currencies and prices.

## Sanity chat cache

The chat API caches a compact set of news, prices, products, sales, and company records on the server for up to one hour. Matching records are selected from that cache for each question. To expire the cache immediately after Sanity content changes, configure a Sanity webhook:

- URL: `https://<your-app-domain>/api/sanity/revalidate`
- Method/events: `POST` on document create, update, and delete
- Filter: `_type in ["news", "newsPortal", "priceList", "productSpec", "productMarketing", "products", "dailySale", "dailySales", "sale", "sales", "company"]`
- Header: `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`

Set `SANITY_REVALIDATE_SECRET` to a long random value in the app's server environment and use the same value in the webhook header. Keep it server-side; do not use a `NEXT_PUBLIC_` variable. If no webhook is configured, the cache refreshes automatically after its one-hour lifetime.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
