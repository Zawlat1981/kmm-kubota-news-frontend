import assert from 'node:assert/strict'
import test from 'node:test'
import { calculatePriceTotal, getModelImplements, getPriceModels, getUnmatchedImplements, matchesPriceBrand, priceVariantName } from './prices.ts'

test('matches known brand spelling variants and groups unknown brands under Other Brand', () => {
  assert.equal(matchesPriceBrand('Deutz-Fahr', 'Deutzfahr'), true)
  assert.equal(matchesPriceBrand('kubota zt engine', 'Kubota ZT Engine'), true)
  assert.equal(matchesPriceBrand('Kubota ZT Engine', 'Kubota'), false)
  assert.equal(matchesPriceBrand('Future Brand', 'Other Brand'), true)
  assert.equal(matchesPriceBrand('Yanmar', 'Other Brand'), false)
  assert.equal(matchesPriceBrand(undefined, 'Other Brand'), false)
})

test('keeps unpublished Kubota choices and includes published models not in the old list', () => {
  const models = getPriceModels('Kubota', [
    { _id: 'cabin', brand: 'Kubota', modelName: 'KX033-4 Cabin (3 Tons)', category: 'excavator' },
    { _id: 'fd', brand: 'Kubota', modelName: 'L3208', category: 'tractor', frontDozer: 'with-front-dozer' },
  ])
  assert.ok(models.some((item) => item.value === 'cabin'))
  assert.equal(models.filter((item) => item.name === 'L3208+FD').length, 1)
  assert.equal(models.find((item) => item.name === 'L3208').category, 'tractor')
  assert.deepEqual(getPriceModels('Kubota', []), [])
  assert.equal(priceVariantName({ _id: 'both', modelName: 'Model', frontDozer: 'with-front-dozer', frontLoader: 'with-front-loader' }), 'Model+FD+LA')
})

test('links implements only to the same brand and model', () => {
  const model = { value: '1', name: 'Model+FD', brand: 'A', machine: { _id: '1', modelName: 'Model' } }
  const items = [
    { _id: 'base', brand: 'A', itemType: 'implement', parentModel: 'Model' },
    { _id: 'variant', brand: 'A', itemType: 'implement', parentModel: 'Model+FD' },
    { _id: 'other', brand: 'B', itemType: 'implement', parentModel: 'Model' },
  ]
  assert.deepEqual(getModelImplements(model, items).map((item) => item._id), ['base', 'variant'])
  assert.deepEqual(getUnmatchedImplements('Other Brand', [model], [
    ...items, { _id: 'orphan', brand: 'A', itemType: 'implement' },
  ]).map((item) => item._id), ['other', 'orphan'])
})

test('does not invent totals when prices or compatible currencies are missing', () => {
  const machine = { _id: 'm', price: 100, currency: 'MMK' }
  assert.equal(calculatePriceTotal(machine, [{ _id: 'i', price: 25, currency: 'MMK' }]), 125)
  assert.equal(calculatePriceTotal({ _id: 'm', currency: 'MMK' }, []), undefined)
  assert.equal(calculatePriceTotal(machine, [{ _id: 'i', currency: 'MMK' }]), undefined)
  assert.equal(calculatePriceTotal(machine, [{ _id: 'i', price: 25, currency: 'USD' }]), undefined)
  assert.equal(calculatePriceTotal(machine, [{ _id: 'i', price: 25 }]), undefined)
  assert.equal(calculatePriceTotal({ _id: 'm', price: 0 }, []), 0)
})
