import type { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'requirementType', type: 'select', required: true, options: ['pearls_collected', 'exhibits_completed', 'perfect_score'] },
    { name: 'requirementValue', type: 'number', required: true, min: 1 },
  ],
}
