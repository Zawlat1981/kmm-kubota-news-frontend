export default {
  name: 'news',
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
          { title: 'Kubota စက်ပစ္စည်းစျေးနှုန်းများ', value: 'kubota-prices' },
          { title: 'Kubota စက်ပစ္စည်းသတင်းများ', value: 'kubota-news' },
          { title: 'ပြိုင်ဘက်စက်ပစ္စည်းဈေးနှုန်းများ', value: 'competitor-prices' },
          { title: 'ပြိုင်ဘက်သတင်းများ', value: 'competitor-news' },
          { title: 'လယ်ယာထွန်ကုန် သီးနှံပေါက်ဈေးများ', value: 'crop-market' },
          { title: 'မြန်မာနိုင်ငံရဲ့ ထူးခြားသတင်းများ', value: 'myanmar-news' },
        ],
      },
    },
    {
      name: 'publishedAt',
      title: 'Published Date (တင်သည့်ရက်စွဲ)',
      type: 'datetime',
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
