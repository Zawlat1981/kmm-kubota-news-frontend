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
      description: 'List ထဲမှာ မပါရင် "Other" ကို ရွေးပြီး အောက်က box မှာ ကိုယ်တိုင်ရိုက်ထည့်ပါ',
      options: {
        list: [
          { title: 'Kubota Myanmar', value: 'Kubota Myanmar' },
          { title: 'Kubota GBS', value: 'Kubota GBS' },
          { title: 'Kubota Aye Maga', value: 'Kubota Aye Maga' },
          { title: 'LST Kubota Myanmar', value: 'LST Kubota Myanmar' },
          { title: 'Royal Kubota Ayeyareaddy', value: 'Royal Kubota Ayeyareaddy' },
          { title: 'Kubota Mya Taung-Hitachi', value: 'Kubota Mya Taung-Hitachi' },
          { title: 'Kubota Myo Chit', value: 'Kubota Myo Chit' },
          { title: 'Yanmar Myanmar', value: 'Yanmar Myanmar' },
          { title: 'Win Shwe Wah (Kubota 2nd, Yanmar, YTO)', value: 'Win Shwe Wah' },
          { title: 'John Deere Myanmar', value: 'John Deere Myanmar' },
          { title: 'New Holland Myanmar', value: 'New Holland Myanmar' },
          { title: 'Shwe Agriculture (Mahindra, Yamabisi)', value: 'Shwe Agriculture' },
          { title: 'Swe Tun (Dongfeng)', value: 'Swe Tun' },
          { title: 'IME International (YTO)', value: 'IME International' },
          { title: 'Other (အခြား)', value: 'other' },
        ]
      }
    },
    {
      name: 'brandCustom',
      title: 'Custom Brand/Company Name (Other အတွက် ကိုယ်တိုင်ရိုက်ထည့်ရန်)',
      type: 'string',
      description: 'Brand field မှာ "Other" ကို ရွေးထားမှသာ ဒီ box ကို ဖြည့်ပါ',
      hidden: ({ parent }) => parent?.brand !== 'other',
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
          { title: 'Flood News (ရေးဘေးသတင်း)', value: 'flood-news' },
          { title: 'Other (အခြား)', value: 'other' },
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
