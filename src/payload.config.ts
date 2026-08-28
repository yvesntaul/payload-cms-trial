import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Achievements } from './collections/Achievements'
import { Artifacts } from './collections/Artifacts'
import { Exhibits } from './collections/Exhibits'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ['./components/WelcomeDashboard'],
      graphics: { Icon: './components/WelcomeDashboard#ArtifactsMark', Logo: './components/WelcomeDashboard#ArtifactsMark' },
      logout: { Button: './components/LogoutButton' },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Artifacts, Exhibits, Achievements],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})







