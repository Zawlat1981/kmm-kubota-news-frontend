export default {
  name: 'priceList',
  title: 'Price List (စက်စျေးနှုန်း)',
  type: 'document',
  fields: [
    {
      name: 'brand',
      title: 'Brand (အမှတ်တံဆိပ်)',
      type: 'string',
      options: {
        list: [
          { title: 'Kubota', value: 'Kubota' },
          { title: 'Kubota Second', value: 'Kubota Second' },
          { title: 'Yanmar', value: 'Yanmar' },
          { title: 'John Deere', value: 'John Deere' },
          { title: 'New Holland', value: 'New Holland' },
          { title: 'YTO', value: 'YTO' },
          { title: 'Sonalika', value: 'Sonalika' },
          { title: 'Yamabisi', value: 'Yamabisi' },
          { title: 'Mahindra', value: 'Mahindra' },
          { title: 'Dongfeng', value: 'Dongfeng' },
          { title: 'DeutzFahr & Matador', value: 'DeutzFahr & Matador' },
          { title: 'Other Brands', value: 'Other Brands' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'modelName',
      title: 'Model Name (မော်ဒယ်အမည်)',
      type: 'string',
      description: 'ဥပမာ - M8540, DC70G Pro',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'itemType',
      title: 'Item Type (အမျိုးအစား)',
      type: 'string',
      options: {
        list: [
          { title: 'Machine / Model', value: 'machine' },
          { title: 'Implement / Attachment', value: 'implement' },
        ],
      },
      initialValue: 'machine',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Machine Type (စက်အမျိုးအစား)',
      type: 'string',
      options: {
        list: [
          { title: 'Tractor', value: 'tractor' },
          { title: 'Combine Harvester', value: 'combine-harvester' },
          { title: 'Rice Transplanter', value: 'rice-transplanter' },
          { title: 'Excavator', value: 'excavator' },
          { title: 'Power Tiller', value: 'power-tiller' },
          { title: 'Implement / Attachment', value: 'implement' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'series',
      title: 'Series (စီးရီး)',
      type: 'string',
      description: 'ဥပမာ - B-series, L-series, MU-series, M-series (မရှိရင် အလွတ်ထားပါ)',
    },
    {
      name: 'parentModel',
      title: 'Parent Machine Model (သက်ဆိုင်ရာစက်မော်ဒယ်)',
      type: 'string',
      description: 'Implement ဖြစ်မှ ဖြည့်ပါ။ ဥပမာ - B2240s, L3228, DC70G Pro',
      hidden: ({ parent }) => parent?.itemType !== 'implement',
    },
    {
      name: 'frontDozer',
      title: 'Front Dozer (ရှေ့ဂေါ်)',
      type: 'string',
      options: {
        list: [
          { title: 'Front Dozer မပါ', value: 'without-front-dozer' },
          { title: 'Front Dozer ပါ', value: 'with-front-dozer' },
        ],
      },
      description: 'Tractor model တွေမှာသာ ရွေးပါ။ Implement တွေအတွက် အလွတ်ထားပါ။',
      hidden: ({ parent }) => parent?.itemType === 'implement',
    },
    {
      name: 'frontLoader',
      title: 'Front Loader (ရှိလျှင်သာ)',
      type: 'string',
      options: {
        list: [{ title: 'Front Loader ပါ', value: 'with-front-loader' }],
      },
      description: 'ဒီ model မှာ Front Loader ပါမှ ရွေးပါ။ မရှိရင် အလွတ်ထားပါ။',
      hidden: ({ parent }) => parent?.itemType === 'implement',
    },
    {
      name: 'horsepower',
      title: 'Horsepower (hp)',
      type: 'number',
      description: 'သက်ဆိုင်ရာ Model ဆိုရင် ဖြည့်ပါ (ဥပမာ - 85)',
    },
    {
      name: 'price',
      title: 'Price (ဈေးနှုန်း)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: 'currency',
      title: 'Currency (ငွေကြေးအမျိုးအစား)',
      type: 'string',
      options: {
        list: [
          { title: 'MMK (ကျပ်)', value: 'MMK' },
          { title: 'THB (บาท)', value: 'THB' },
          { title: 'USD ($)', value: 'USD' },
        ],
      },
      initialValue: 'MMK',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'quantityInStock',
      title: 'KMM Stock Quantity (KMM လက်ကျန် အရေအတွက်)',
      type: 'number',
      description: 'KMM ကုမ္ပဏီ ကိုယ်တိုင်ရဲ့ လက်ကျန်စာရင်း (Internal — Customer ကို တိုက်ရိုက် မပြသရန်) — ဥပမာ 3 = 3 စီး ကျန်',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'image',
      title: 'Image (ပုံ)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'notes',
      title: 'Notes (မှတ်ချက်)',
      type: 'text',
      description: 'ဥပမာ - Promotion, Discount, အထူးအခြေအနေများ',
    },
    {
      name: 'lastUpdated',
      title: 'Last Price Update (နောက်ဆုံးဈေးနှုန်း ပြင်ဆင်သည့်ရက်)',
      type: 'datetime',
      description: 'ဈေးနှုန်း ပြောင်းလဲတိုင်း ဒီရက်စွဲကို Update လုပ်ပါ',
    },
  ],
  preview: {
    select: {
      brand: 'brand',
      model: 'modelName',
      price: 'price',
      currency: 'currency',
      media: 'image',
    },
    prepare({ brand, model, price, currency, media }) {
      return {
        title: `${brand || ''} ${model || ''}`.trim(),
        subtitle: price ? `${price.toLocaleString()} ${currency || ''}` : 'No price set',
        media,
      }
    },
  },
}