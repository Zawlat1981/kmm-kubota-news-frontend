import { defineField, defineType } from 'sanity'

export const dailySale = defineType({
  name: 'dailySale',
  title: 'Daily Sale',
  type: 'document',
  fields: [
    defineField({
      name: 'branch',
      title: 'Branch',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'saleDate',
      title: 'Sale Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'division',
      title: 'Region / Division',
      type: 'string',
    }),
    defineField({
      name: 'paymentType',
      title: 'Payment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Cash', value: 'Cash' },
          { title: 'Installment', value: 'Installment' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'salesPerson',
      title: 'Sales Person',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Sale Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'photoUrl',
      title: 'External Photo URL',
      type: 'url',
    }),
    defineField({
      name: 'stockRemaining',
      title: 'Stock Remaining',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
})
