export default {
  name: 'whoWeAre',
  title: 'Who We Are Sections',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title (ဥပမာ - Agriculture)',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description (အကြောင်းအရာ အကျဉ်း)',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image (ပုံ)',
      type: 'image',
      options: {
        hotspot: true, // ပုံကို လိုသလို ညှိလို့ရစေရန်
      },
    },
  ],
}