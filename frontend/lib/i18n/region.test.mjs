import assert from 'node:assert/strict'
import test from 'node:test'
import { localizeRegion } from './region.ts'

test('localizes known regions without sending sales records to a translation service', () => {
  assert.equal(localizeRegion('Bago (west)', 'my'), 'ပဲခူး (အနောက်)')
  assert.equal(localizeRegion('Mandalay', 'th'), 'มัณฑะเลย์')
  assert.equal(localizeRegion('ရန်ကုန်', 'en'), 'Yangon')
  assert.equal(localizeRegion('Mon State', 'my'), 'မွန်ပြည်နယ်')
  assert.equal(localizeRegion('Ayeyarwaddy', 'th'), 'อิรวดี')
  assert.equal(localizeRegion('Unknown location', 'th'), 'Unknown location')
})
