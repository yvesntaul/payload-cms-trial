import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true, create: ({ req }) => isAdmin({ req }) || Boolean(req.user && 'role' in req.user && req.user.role === 'editor'), update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}



