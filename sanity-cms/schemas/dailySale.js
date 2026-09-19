export default {
  name: 'dailySale',
  title: 'Daily Sales (နေ့စဉ် အရောင်း)',
  type: 'document',
  fields: [
    {
      name: 'branch',
      title: 'Branch',
      type: 'string',
      options: {
        list: [
          { title: 'KMM01', value: 'KMM01' },
          { title: 'KMM02', value: 'KMM02' },
          { title: 'KMM03', value: 'KMM03' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'saleDate',
      title: 'Sale date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'customerName',
      title: 'Customer name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'division',
      title: 'Region / Division',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'paymentType',
      title: 'Payment type',
      type: 'string',
      options: {
        list: [
          { title: 'Cash', value: 'Cash' },
          { title: 'Installment', value: 'Installment' },
        ],
      },
      initialValue: 'Cash',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'salesPerson',
      title: 'Sales person',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'photo',
      title: 'Photo (ရောင်းထွက်ပုံ)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'photoUrl',
      title: 'Legacy Photo URL (အရင်ပုံလင့်ခ်)',
      type: 'url',
      description: 'အသစ်တင်မည့်ပုံများအတွက် အပေါ်က Photo field ကို အသုံးပြုပါ။ ဒီ field က အရင် link နဲ့သိမ်းထားသောပုံများအတွက် ဆက်ထားပါသည်။',
    },
    {
      name: 'stockRemaining',
      title: 'Stock remaining',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    },
  ],
  preview: {
    select: {
      branch: 'branch',
      saleDate: 'saleDate',
      model: 'model',
      customer: 'customerName',
    },
    prepare({ branch, saleDate, model, customer }) {
      return {
        title: `${branch || ''} - ${model || ''}`.trim(),
        subtitle: `${saleDate || ''} - ${customer || ''}`,
      }
    },
  },
}