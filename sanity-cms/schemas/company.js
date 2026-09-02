export const company = {
  name: 'company',
  title: 'Company Directory',
  type: 'document',
  fields: [
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
      name: 'distributor',
      title: 'Distributor',
      type: 'string',
      description: 'ဥပမာ - Kubota Myanmar, Yanmar Myanmar',
    },
    {
      name: 'companyGroup',
      title: 'Company Group',
      type: 'string',
      options: {
        list: [
          { title: 'Kubota Companies', value: 'kubota' },
          { title: 'Other Brand Companies', value: 'other' },
        ],
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
      name: 'branches',
      title: 'Branch Offices',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'branch',
          title: 'Branch',
          fields: [
            {
              name: 'address',
              title: 'Address',
              type: 'text',
            },
            {
              name: 'phone',
              title: 'Phone',
              type: 'string',
            },
            {
              name: 'googleMapUrl',
              title: 'Google Map URL',
              type: 'url',
            },
          ],
          preview: {
            select: {
              address: 'address',
              phone: 'phone',
            },
            prepare({ address, phone }) {
              return {
                title: address || 'No address',
                subtitle: phone || '',
              }
            },
          },
        },
      ],
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
      name: 'companyImage',
      title: 'Company Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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