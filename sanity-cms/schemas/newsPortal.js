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
      },
    },
    {
      name: 'category',
      title: 'Category (သတင်းကဏ္ဍ)',
      type: 'string',
      options: {
        list: [
          { title: 'Kubota News', value: 'kubota-သတင်းများ' },
          { title: 'Kubota Second News', value: 'Kubota Second သတင်းများ' }, 
          { title: 'Other Brand News', value: 'Other Brand-သတင်းများ' },
          { title: 'Crop Prices', value: 'လယ်ယာထွန်ကုန် သီးနှံပေါက်ဈေးများ' },
          { title: 'Myanmar News', value: 'မြန်မာနိုင်ငံ သတင်းများ' },
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
      name: 'body',
      title: 'Content (သတင်းအသေးစိတ်)',
      type: 'text',
    },
  ],
}
