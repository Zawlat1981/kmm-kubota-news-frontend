import assert from 'node:assert/strict'
import test from 'node:test'
import { priceList } from './priceList.js'
import { getModelImplements, getPriceModels, getUnmatchedImplements, hasPrice } from '../../frontend/lib/prices.ts'

test('price records created in Studio match the website model and implement views', () => {
  const machine = { _id: 'machine', itemType: 'machine', brand: 'Yanmar', modelName: 'YM-1', category: 'tractor', price: 100, currency: 'MMK' }
  const implement = { _id: 'implement', itemType: 'implement', brand: 'Yanmar', modelName: 'Plough', parentModel: 'YM-1', price: 20, currency: 'MMK' }
  const unknownBrand = { _id: 'other', itemType: 'machine', brand: 'Example Brand', modelName: 'EX-1' }
  const records = [machine, implement, unknownBrand]
  const models = getPriceModels('Yanmar', records)

  assert.equal(models[0].machine, machine)
  assert.deepEqual(getModelImplements(models[0], records), [implement])
  assert.deepEqual(getUnmatchedImplements('Yanmar', models, records), [])
  assert.equal(getPriceModels('Other Brand', records)[0].machine, unknownBrand)
  assert.equal(hasPrice(unknownBrand), false)
})

test('Studio preview distinguishes machine variants and does not invent a missing price', () => {
  const preview = priceList.preview.prepare({
    brand: 'Kubota', model: 'L5228', itemType: 'machine',
    frontDozer: 'with-front-dozer', price: 100, currency: 'MMK',
  })
  assert.equal(preview.title, 'Kubota — L5228+FD')
  assert.match(preview.subtitle, /100 MMK/)
  assert.equal(priceList.preview.prepare({ brand: 'Yanmar', model: 'Plough', itemType: 'implement' }).subtitle, 'Implement · No price')
})

test('implement and machine fields are displayed for the appropriate item type', () => {
  const parentModel = priceList.fields.find((field) => field.name === 'parentModel')
  const category = priceList.fields.find((field) => field.name === 'category')
  assert.equal(parentModel.hidden({ document: { itemType: 'implement' } }), false)
  assert.equal(parentModel.hidden({ document: { itemType: 'machine' } }), true)
  assert.equal(category.hidden({ document: { itemType: 'machine' } }), false)
  assert.equal(category.hidden({ document: { itemType: 'implement' } }), true)
})
