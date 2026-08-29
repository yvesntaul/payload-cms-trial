import type { CollectionConfig } from 'payload'
import { canEditDrafts, isAdmin, publishedOrStaff } from '../access/roles'

export const Exhibits: CollectionConfig = {
  slug: 'exhibits',
  versions: { drafts: true },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'sortOrder'] },
  access: { read: publishedOrStaff, create: ({ req }) => isAdmin({ req }) || Boolean(req.user && 'role' in req.user && req.user.role === 'editor'), update: canEditDrafts, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'richText' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'artifacts', type: 'relationship', relationTo: 'artifacts', hasMany: true },
    { name: 'workflowStatus', type: 'select', required: true, defaultValue: 'draft', options: ['draft', 'submitted', 'approved', 'rejected', 'archived'] },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}




