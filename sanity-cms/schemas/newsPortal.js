export default {
  name: 'newsPortal',
  title: 'News Portal',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'News Title (သတင်းခေါင်းစဉ်)',
      type: 'string',
    },
    {
      name: 'brand',
      title: 'News Source (သတင်းဌာနအမည်)',
      type: 'string',
      description: 'သတင်းဌာန သို့မဟုတ် အရင်းအမြစ်အမည်ကို ကိုယ်တိုင်ရိုက်ထည့်ပါ',
    },
    {
      name: 'brandCustom',
      title: 'Custom Brand/Company Name (Other အတွက် ကိုယ်တိုင်ရိုက်ထည့်ရန်)',
      type: 'string',
      description: 'Brand field မှာ "Other" ကို ရွေးထားမှသာ ဒီ box ကို ဖြည့်ပါ',
      hidden: ({ parent }) => parent?.brand !== 'other',
    },
    {
      name: 'slug',
      title: 'Slug (လင့်ခ်အတွက်)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => {
          const now = new Date()
          const yyyy = now.getFullYear()
          const mm = String(now.getMonth() + 1).padStart(2, '0')
          const dd = String(now.getDate()).padStart(2, '0')
          const hh = String(now.getHours()).padStart(2, '0')
          const min = String(now.getMinutes()).padStart(2, '0')
          const dateStamp = `${yyyy}${mm}${dd}${hh}${min}`
          const base = (input || '')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 60)

          return base ? `${base}-${dateStamp}` : dateStamp
        },
      },
    },
    {
      name: 'category',
      title: 'Category (သတင်းကဏ္ဍ)',
      type: 'string',
      options: {
        list: [
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
        ],
      },
    },
    {
      name: 'categoryCustom',
      title: 'Custom Category (Other ရွေးထားရင်သာ ဖြည့်ပါ)',
      type: 'string',
      description: 'Category field မှာ "Other" ကို ရွေးထားမှသာ ဒီ box ကို ဖြည့်ပါ',
      hidden: ({ parent }) => parent?.category !== 'other',
    },
    {
      name: 'publishedAt',
      title: 'Published Date (တင်သည့်ရက်စွဲ)',
      type: 'datetime',
    },
    {
      name: 'sourceUrl',
      title: 'Source URL (မူရင်းသတင်းလင့်ခ် / Share Link)',
      type: 'url',
      description: 'မူရင်းသတင်းဖော်ပြထားသော ဝဘ်ဆိုဒ်လင့်ခ် (သို့မဟုတ် Source လင့်ခ်ကို ထည့်ရန်)',
    },
    {
      name: 'mainImage',
      title: 'Main Image (သတင်းပုံ)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'gallery',
      title: 'Additional Images (ပုံနောက်ထပ်များ)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Main Image အပြင် ထပ်ဖြည့်ချင်သော ပုံများ — အရေအတွက် ကန့်သတ်ချက် မရှိပါ',
    },
    {
      name: 'body',
      title: 'Content (သတင်းအသေးစိတ်)',
      type: 'text',
    },
  ],
}
