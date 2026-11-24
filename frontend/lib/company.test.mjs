import assert from 'node:assert/strict'
import test from 'node:test'
import { formatCompanyBrand, normalizeCompany, safeCompanyWebUrl, splitCompanyWebLinks } from './company.ts'

test('preserves string brands and joins legacy brand arrays', () => {
  assert.equal(formatCompanyBrand('Kubota'), 'Kubota')
  assert.equal(formatCompanyBrand(['Kubota', 'Yanmar']), 'Kubota, Yanmar')
  assert.deepEqual(normalizeCompany({ _id: 'company', brand: ['Kubota'] }), {
    _id: 'company', brand: 'Kubota',
  })
  assert.equal(formatCompanyBrand(undefined), undefined)
  assert.equal(formatCompanyBrand([]), undefined)
})

test('reports malformed brand data instead of crashing', (t) => {
  const originalWarn = console.warn
  const warnings = []
  console.warn = (message) => warnings.push(message)
  t.after(() => { console.warn = originalWarn })

  assert.equal(formatCompanyBrand(['Kubota', 42]), 'Kubota')
  assert.equal(formatCompanyBrand({ value: 'Kubota' }), undefined)
  assert.equal(warnings.length, 2)
})

test('only allows web URLs for company contact links', () => {
  assert.equal(safeCompanyWebUrl(' https://example.com/contact '), 'https://example.com/contact')
  assert.equal(safeCompanyWebUrl('http://example.com'), 'http://example.com/')
  assert.equal(safeCompanyWebUrl('javascript:alert(1)'), undefined)
  assert.equal(safeCompanyWebUrl('not a url'), undefined)
  assert.equal(safeCompanyWebUrl('https://example.com, https://example.org'), undefined)
})

test('separates multiple web links without splitting commas within a URL', () => {
  assert.deepEqual(splitCompanyWebLinks('https://example.com/a,b, https://example.org'), [
    'https://example.com/a,b', 'https://example.org',
  ])
})
