export const company = {
  name: 'company',
  title: 'Company Directory',
  type: 'document',
  fields: [{
      name: 'companyGroup',
      title: 'Company Group',
      type: 'string',
      options: {
        list: [
          { title: 'Kubota Company', value: 'kubota' },
          { title: 'Other Brand Company', value: 'other' },
        ],
        layout: 'dropdown',
      },
    },
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Distributor', 'Dealer'],
      },
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
    },
    {
      name: 'stateRegion',
      title: 'State / Region',
      type: 'string',
    },
    {
      name: 'cityTownship',
      title: 'City / Township',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
    },
    {
      name: 'googleMapUrl',
      title: 'Google Map URL',
      type: 'url',
    },
    {
      name: 'companyImage',
      title: 'Company Image',
      type: 'image',
      options: {
        hotspot: true, // ပုံကို လိုသလို ချိန်ညှိ (Crop) လို့ရအောင်ပါ
      }
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'facebookLink',
      title: 'Facebook Link',
      type: 'url',
    },
    {
      name: 'tiktokLink',
      title: 'TikTok Link',
      type: 'url',
    },
    {
      name: 'viber',
      title: 'Viber',
      type: 'string',
    },
    {
      name: 'telegram',
      title: 'Telegram',
      type: 'url',
    },
    // Sales Team အပိုင်း
    {
      name: 'salesPersonName',
      title: 'Sales Person Name',
      type: 'string',
    },
    {
      name: 'salesPhone',
      title: 'Sales Phone',
      type: 'string',
    },
    {
      name: 'salesFbLink',
      title: 'Sales FB Link',
      type: 'url',
    },
    {
      name: 'salesTtLink',
      title: 'Sales TT Link',
      type: 'url',
    }
  ]
}