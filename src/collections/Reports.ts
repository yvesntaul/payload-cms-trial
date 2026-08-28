import type { CollectionConfig } from 'payload'

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: { useAsTitle: 'category', defaultColumns: ['category', 'status', 'createdAt'] },
  access: { read: ({ req }) => Boolean(req.user), create: () => true, update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'userId', type: 'text', required: true, index: true },
    { name: 'category', type: 'select', required: true, options: ['bug_report', 'feature_suggestion', 'artifact_info_error'] },
    { name: 'description', type: 'textarea', required: true },
    { name: 'deviceInfo', type: 'group', fields: [{ name: 'model', type: 'text' }, { name: 'osVersion', type: 'text' }, { name: 'appVersion', type: 'text' }] },
    { name: 'status', type: 'select', required: true, defaultValue: 'open', options: ['open', 'in_progress', 'resolved'] },
  ],
}
