import assert from 'node:assert/strict'
import test from 'node:test'
import { newsCategoryKey } from './newsCategory.ts'

test('maps existing news category variants consistently without touching article content', () => {
  assert.equal(newsCategoryKey('kubota-zt-news'), 'kubotaZtNews')
  assert.equal(newsCategoryKey('kubota-second-news'), 'kubotaSecondNews')
  assert.equal(newsCategoryKey('mahindra-dongfeng-news'), 'mahindraDongfengNews')
  assert.equal(newsCategoryKey('deutzfar-matador-news'), 'deutzfarMatadorNews')
  assert.equal(newsCategoryKey('yammar-news'), 'yanmarNews')
  assert.equal(newsCategoryKey('မြန်မာနိုင်ငံ သတင်းများ'), 'myanmarNews')
  assert.equal(newsCategoryKey('unknown-category'), undefined)
})
