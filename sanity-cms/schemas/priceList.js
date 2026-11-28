export const priceList = {
  name: 'priceList',
  title: 'Machinery Price',
  type: 'document',
  fields: [
    {
      name: 'itemType',
      title: 'Item Type (စက် / နောက်တွဲပစ္စည်း)',
      type: 'string',
      initialValue: 'machine',
      options: {
        list: [
          { title: 'Machine (စက်)', value: 'machine' },
          { title: 'Implement (နောက်တွဲပစ္စည်း)', value: 'implement' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'brand',
      title: 'Brand (အမှတ်တံဆိပ်)',
      type: 'string',
      description: 'ဥပမာ: Kubota, Yanmar, YTO, Mahindra, Dongfeng, New Holland, John Deere, Yamabisi, Sonalika, Deutzfahr, Matador, Farmtrac, Kubota ZT Engine။ အခြား brand များအတွက် နာမည်အမှန်ကို ရိုက်ထည့်ပါ။',
      validation: (rule) => rule.required(),
    },
    {
      name: 'modelName',
      title: 'Model / Implement Name (မော်ဒယ် / ပစ္စည်းအမည်)',
      type: 'string',
      description: 'စက်မော်ဒယ် သို့မဟုတ် နောက်တွဲပစ္စည်းအမည်ကို ရိုက်ထည့်ပါ။ ဥပမာ L5228။',
      validation: (rule) => rule.required(),
    },
    {
      name: 'category',
      title: 'Machine Category (စက်အမျိုးအစား)',
      type: 'string',
      hidden: ({ document }) => document?.itemType === 'implement',
      options: {
        list: [
          { title: 'Tractor (ထွန်စက်)', value: 'tractor' },
          { title: 'Combine Harvester (ရိတ်သိမ်းခြွေလှေ့စက်)', value: 'combine-harvester' },
          { title: 'Rice Transplanter (စိုက်ပျိုးစက်)', value: 'rice-transplanter' },
          { title: 'Excavator (မြေတူးစက်)', value: 'excavator' },
          { title: 'Other Machinery (အခြားစက်)', value: 'other' },
        ],
      },
    },
    {
      name: 'parentModel',
      title: 'Matching Machine Model (တွဲဖက်စက်မော်ဒယ်)',
      type: 'string',
      hidden: ({ document }) => document?.itemType !== 'implement',
      description: 'နောက်တွဲပစ္စည်းကို စက်နှင့်တွဲပြရန် စက်၏ model အမည်အတိအကျနှင့် brand တူအောင် ထည့်ပါ။ ဥပမာ L5228။ မထည့်ပါက အခြားပစ္စည်းများအောက်တွင် ပြပါမည်။',
    },
    {
      name: 'price',
      title: 'Price (ဈေးနှုန်း)',
      type: 'number',
      description: 'ဂဏန်းသာ ရိုက်ထည့်ပါ။ ဈေးနှုန်းမရှိသေးလျှင် ဗလာထားပါ။',
      validation: (rule) => rule.min(0),
    },
    {
      name: 'currency',
      title: 'Currency (ငွေကြေး)',
      type: 'string',
      initialValue: 'MMK',
      description: 'ဥပမာ MMK။ စက်နှင့် နောက်တွဲပစ္စည်း စုစုပေါင်းတွက်ရန် ငွေကြေးတူရပါမည်။',
    },
    {
      name: 'series',
      title: 'Series (စီးရီး)',
      type: 'string',
      hidden: ({ document }) => document?.itemType === 'implement',
    },
    {
      name: 'horsepower',
      title: 'Horsepower (မြင်းကောင်ရေ)',
      type: 'number',
      hidden: ({ document }) => document?.itemType === 'implement',
      validation: (rule) => rule.min(0),
    },
    {
      name: 'frontDozer',
      title: 'Front Dozer (ရှေ့ဒိုဇာ)',
      type: 'string',
      hidden: ({ document }) => document?.itemType === 'implement',
      options: {
        list: [
          { title: 'With Front Dozer', value: 'with-front-dozer' },
          { title: 'Without Front Dozer', value: 'without-front-dozer' },
        ],
      },
    },
    {
      name: 'specialDozer',
      title: 'Special Dozer (အထူးဒိုဇာ)',
      type: 'string',
      hidden: ({ document }) => document?.itemType === 'implement',
      options: { list: [{ title: 'With Special Dozer', value: 'with-special-dozer' }] },
    },
    {
      name: 'frontLoader',
      title: 'Front Loader (ရှေ့လော့ဒါ)',
      type: 'string',
      hidden: ({ document }) => document?.itemType === 'implement',
      options: { list: [{ title: 'With Front Loader', value: 'with-front-loader' }] },
    },
    {
      name: 'image',
      title: 'Image (ပုံ)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'notes',
      title: 'Notes (မှတ်ချက်)',
      type: 'text',
      description: 'ဈေးနှုန်းနှင့်ပတ်သက်သော ထပ်မံရှင်းလင်းချက်များ။ ကိုယ်ရေးကိုယ်တာအချက်အလက်များ မထည့်ပါနှင့်။',
    },
  ],
  preview: {
    select: {
      brand: 'brand',
      model: 'modelName',
      itemType: 'itemType',
      price: 'price',
      currency: 'currency',
      frontDozer: 'frontDozer',
      specialDozer: 'specialDozer',
      frontLoader: 'frontLoader',
      media: 'image',
    },
    prepare({ brand, model, itemType, price, currency, frontDozer, specialDozer, frontLoader, media }) {
      const suffix = [
        frontDozer === 'with-front-dozer' ? '+FD' : '',
        specialDozer === 'with-special-dozer' ? '+SD' : '',
        frontLoader === 'with-front-loader' ? '+LA' : '',
      ].join('')
      return {
        title: [brand, model && `${model}${suffix}`].filter(Boolean).join(' — ') || 'Untitled price',
        subtitle: [
          itemType === 'implement' ? 'Implement' : 'Machine',
          typeof price === 'number' ? `${price.toLocaleString()}${currency ? ` ${currency}` : ''}` : 'No price',
        ].join(' · '),
        media,
      }
    },
  },
}
