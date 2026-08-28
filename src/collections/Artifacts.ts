import type { CollectionConfig } from 'payload'

export const Artifacts: CollectionConfig = {
  slug: 'artifacts',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'updatedAt'] },
  access: { read: ({ req }) => Boolean(req.user) || { status: { equals: 'published' } } },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'fullDescription', type: 'richText' },
    { name: 'historicalPeriod', type: 'text' },
    { name: 'dateOrTimePeriod', type: 'text' },
    { name: 'origin', type: 'text' },
    { name: 'culturalSignificance', type: 'textarea' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true },
    { name: 'modelFile', type: 'upload', relationTo: 'media' },
    { name: 'audioNarration', type: 'upload', relationTo: 'media' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: ['draft', 'submitted', 'approved', 'rejected', 'published', 'archived'] },
    { name: 'publishedAt', type: 'date' },
    { name: 'assessmentQuestion', type: 'textarea' },
    { name: 'assessmentOptions', type: 'array', fields: [{ name: 'text', type: 'text', required: true }, { name: 'isCorrect', type: 'checkbox', defaultValue: false }] },
    {
      name: 'difficultyConfig', type: 'group', fields: ['easy', 'medium', 'hard'].map((difficulty) => ({ name: difficulty, type: 'group', fields: [
        { name: 'fragmentCount', type: 'number', min: 1 }, { name: 'timeLimit', type: 'number', min: 0 }, { name: 'pearlReward', type: 'number', min: 0 },
      ] })),
    },
    { name: 'modelMetadata', type: 'group', fields: [{ name: 'fileSize', type: 'number', min: 0 }, { name: 'polygonCount', type: 'number', min: 0 }, { name: 'textureResolution', type: 'text' }, { name: 'mobileOptimized', type: 'checkbox', defaultValue: false }] },
  ],
}
