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
      title: 'Brand / Company Name (ကုမ္ပဏီ သို့မဟုတ် Brand နာမည်)',
      type: 'string',
      description: 'ဥပမာ - Yanmar, New Holland, Shwe Agriculture စသည်ဖြင့် (ပြိုင်ဘက်သတင်းများအတွက်)',
    },
    {
      name: 'slug',
      title: 'Slug (လင့်ခ်အတွက်)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        // Custom slugify: title text + current date/time (down to the minute).
        // Two articles would need to be generated in the exact same minute
        // to collide — in practice this won't happen — so the Title field
        // itself never needs a random code appended to it anymore.
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
            .replace(/[^\w\s-]/g, '') // strips non-Latin characters (Burmese/Thai), same as Sanity's default behavior
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
          { title: 'Kubota Second News', value: 'kubota-second-news' }, 
          { title: 'Yammar News', value: 'yammar-news' },
          { title: 'John Deere News', value: 'john-deere-news' },
          { title: 'New Holland News', value: 'new-holland-news' },
          { title: 'YTO News', value: 'yto-news' },
          { title: 'Sonalika News', value: 'sonalika-news' },
          { title: 'Yamabisi News', value: 'yamabisi-news' },
          { title: 'Mahindra News', value: 'mahindra-news' },
          { title: 'Dongfeng News', value: 'dongfeng-news' },
          { title: 'Crop Prices', value: 'crop-prices' },
          { title: 'Fuel Prices', value: 'fuel-prices' },
          { title: 'Myanmar News', value: 'myanmar-news' },
        ],
      },
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
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Main Image အပြင် ထပ်ဖြည့်ချင်သော ပုံများ — အရေအတွက် ကန့်သတ်ချက် မရှိပါ',
    },
    {
      name: 'body',
      title: 'Content (သတင်းအသေးစိတ်)',
      type: 'text',
    },
  ],
}