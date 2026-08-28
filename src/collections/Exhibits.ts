import type { CollectionConfig } from 'payload'

export const Exhibits: CollectionConfig = {
  slug: 'exhibits',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'sortOrder'] },
  access: { read: ({ req }) => Boolean(req.user) || { status: { equals: 'published' } } },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'richText' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'historicalPeriod', type: 'text' },
    { name: 'artifacts', type: 'relationship', relationTo: 'artifacts', hasMany: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: ['draft', 'published'] },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
