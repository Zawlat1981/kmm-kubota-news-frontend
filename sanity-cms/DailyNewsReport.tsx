import { useState } from 'react'

export default function DailyNewsReport() {
  const [date, setDate] = useState(() => {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  })
  const frontendUrl = process.env.SANITY_STUDIO_FRONTEND_URL
  let reportUrl: string | undefined

  if (frontendUrl) {
    try {
      const url = new URL('/daily-report', frontendUrl)
      if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
        url.searchParams.set('date', date)
        reportUrl = url.toString()
      }
    } catch {
      // The setup message below explains the invalid URL.
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Daily News Report</h2>
      <p>Choose a date and open the report to download an image or PDF, or copy its link.</p>
      {reportUrl ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label htmlFor="daily-report-date">Date</label>
          <input id="daily-report-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          {date && <a href={reportUrl} target="_blank" rel="noopener noreferrer">Open Report ↗</a>}
        </div>
      ) : (
        <p role="alert">Set SANITY_STUDIO_FRONTEND_URL to the HTTPS website URL and rebuild Sanity Studio.</p>
      )}
    </div>
  )
}
