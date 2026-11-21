import assert from 'node:assert/strict'
import test from 'node:test'
import newsPortal from './newsPortal.js'

test('allows news sources to be entered freely while retaining legacy custom sources', () => {
  const brand = newsPortal.fields.find((field) => field.name === 'brand')
  const brandCustom = newsPortal.fields.find((field) => field.name === 'brandCustom')
  assert.equal(brand.type, 'string')
  assert.equal(brand.options, undefined)
  assert.equal(brandCustom.hidden({ parent: { brand: 'other' } }), false)
})

test('offers the current news categories using their established values', () => {
  const category = newsPortal.fields.find((field) => field.name === 'category')
  assert.deepEqual(category.options.list, [
    { title: 'Kubota News', value: 'kubota-news' },
    { title: 'Kubota ZT News', value: 'kubota-zt-news' },
    { title: 'Kubota Second News', value: 'kubota-second-news' },
    { title: 'Yanmar News', value: 'yanmar-news' },
    { title: 'John Deere News', value: 'john-deere-news' },
    { title: 'New Holland News', value: 'new-holland-news' },
    { title: 'YTO News', value: 'yto-news' },
    { title: 'Sonalika News', value: 'sonalika-news' },
    { title: 'Yamabisi News', value: 'yamabisi-news' },
    { title: 'Mahindra News', value: 'mahindra-news' },
    { title: 'Dongfeng News', value: 'dongfeng-news' },
    { title: 'Mahindra and Dongfeng News', value: 'mahindra-dongfeng-news' },
    { title: 'DeutzFhar & Matador News', value: 'deutzfar-matador-news' },
    { title: 'Crop Price & News', value: 'crop-prices' },
    { title: 'Fuel Price & News', value: 'fuel-prices' },
    { title: 'Exchange Rates', value: 'exchange-rates' },
    { title: 'Myanmar News', value: 'myanmar-news' },
    { title: 'Other Brand News', value: 'other-brand-news' },
  ])
})

test('restores editable article links, publication dates and additional images', () => {
  const slug = newsPortal.fields.find((field) => field.name === 'slug')
  const publishedAt = newsPortal.fields.find((field) => field.name === 'publishedAt')
  const gallery = newsPortal.fields.find((field) => field.name === 'gallery')
  assert.equal(slug.type, 'slug')
  assert.equal(slug.options.source, 'title')
  assert.match(slug.options.slugify('စမ်းသပ်သတင်း'), /^\d{12}$/)
  assert.match(slug.options.slugify('Example News'), /^example-news-\d{12}$/)
  assert.equal(publishedAt.type, 'datetime')
  assert.deepEqual(gallery.of.map((item) => item.type), ['image'])
})
