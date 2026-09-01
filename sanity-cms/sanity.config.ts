import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'kubota-web',
  title: 'Kubota Website CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Products Section
            S.listItem()
              .title('Products')
              .icon(() => '🚜')
              .child(
                S.list()
                  .title('Products')
                  .items([
                    S.documentTypeListItem('productSpec').title('Specifications (Global)'),
                    S.documentTypeListItem('productSeries').title('Series'),
                    S.divider(),
                    S.documentTypeListItem('productMarketing').title('Marketing (Localized)'),
                    S.documentTypeListItem('locale').title('Locale Config'),
                  ])
              ),

            // Dealers Section
            S.listItem()
              .title('Dealers')
              .icon(() => '📍')
              .child(
                S.list()
                  .title('Dealers')
                  .items([
                    S.documentTypeListItem('dealer').title('All Dealers'),
                    S.documentTypeListItem('kubotaStaff').title('Kubota Staff'),
                  ])
              ),

              // Companies Section (အသစ်ထည့်ထားသည်)
               S.listItem()
                .title('Companies')
                 .icon(() => '🏢')
                 .child(
                  S.list()
                  .title('Companies')
                  .items([
                    S.documentTypeListItem('company').title('All Companies'),
                    S.documentTypeListItem('companyType').title('Company Types'),
                    ])
              ),

            // Manuals Section
            S.listItem()
              .title('Manuals & Documents')
              .icon(() => '📄')
              .child(
                S.list()
                  .title('Manuals Library')
                  .items([
                    S.documentTypeListItem('manual').title('All Manuals'),
                    S.documentTypeListItem('manualCategory').title('Categories'),
                  ])
              ),
              // News Portal Section (ဒီနေရာမှာ အသစ်ထည့်ပါ)
            S.listItem()
              .title('News Portal')
              .icon(() => '📰')
              .child(
                S.documentTypeList('newsPortal').title('All News')
              ),


            // Settings
            S.divider(),
            S.listItem()
              .title('Settings')
              .icon(() => '⚙️')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    // Add singleton settings documents here if needed
                  ])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  // Document internationalization
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => (template as any).schemaId !== 'productMarketing')
      }
      return prev
    },
    actions: (prev: any[], { schemaType }: { schemaType: string }) => {
      if (schemaType === 'productSpec') {
        return prev.map((action) =>
          action.action === 'duplicate'
            ? { ...action, disabled: true }
            : action
        )
      }
      return prev
    },
  },
})