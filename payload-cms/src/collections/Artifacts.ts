import type { CollectionConfig } from 'payload'
import { canEditDrafts, isAdmin, publishedOrStaff } from '../access/roles'

export const Artifacts: CollectionConfig = {
  slug: 'artifacts',
  versions: { drafts: true },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'updatedAt'] },
  access: { read: publishedOrStaff, create: ({ req }) => isAdmin({ req }) || Boolean(req.user && 'role' in req.user && ['editor'].includes(req.user.role as string)), update: canEditDrafts, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'fullDescription', type: 'richText', required: true },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true },
    { name: 'modelFile', type: 'upload', relationTo: 'media' },
    { name: 'audioNarration', type: 'upload', relationTo: 'media' },
    { name: 'workflowStatus', type: 'select', required: true, defaultValue: 'draft', options: ['draft', 'submitted', 'approved', 'rejected', 'archived'] },
    { name: 'publishedAt', type: 'date' },
    { name: 'assessmentQuestion', type: 'textarea' },
    { name: 'assessmentOptions', type: 'array', fields: [{ name: 'text', type: 'text', required: true }, { name: 'isCorrect', type: 'checkbox', defaultValue: false, access: { read: ({ req }) => Boolean(req.user && 'role' in req.user && ['admin', 'editor'].includes(req.user.role as string)) } }] },
    {
      name: 'difficultyConfig', type: 'group', fields: ['easy', 'medium', 'hard'].map((difficulty) => ({ name: difficulty, type: 'group', fields: [
        { name: 'fragmentCount', type: 'number', min: 1 }, { name: 'timeLimit', type: 'number', min: 0 }, { name: 'pearlReward', type: 'number', min: 0 },
      ] })),
    },
    { name: 'modelMetadata', type: 'group', fields: [{ name: 'fileSize', type: 'number', min: 0 }, { name: 'polygonCount', type: 'number', min: 0 }, { name: 'textureResolution', type: 'text' }, { name: 'mobileOptimized', type: 'checkbox', defaultValue: false }] },
  ],
}




