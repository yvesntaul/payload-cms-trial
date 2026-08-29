Here's a complete context document you can paste into a new file (e.g., `PROJECT_CONTEXT.md`) in your VSCode project. This gives Copilot all the information it needs to help you set up Payload CMS for your ARtifacts project.

---

# ARtifacts Project Context for AI Assistants

## Project Overview

ARtifacts is a cultural heritage platform developed in collaboration with the Pasig City Museum, housed within the historic Concepcion Mansion (built 1937, declared an Important Cultural Property in 2018). The platform consists of:

1. **Mobile AR Application** (Unity + ARCore for Android)
2. **Content Management System** (Payload CMS - replacing Strapi)
3. **Public Showcase Website** (informational and download portal)

## Tech Stack Decision

We are moving from Strapi to **Payload CMS** because:
- Strapi discontinued their free cloud plan
- Payload offers better UI customization and analytics capabilities
- Payload is MIT-licensed and fully open-source
- Can be deployed for free on Vercel, Cloudflare, or self-hosted

## Project Requirements for Payload CMS

### Core Content Models (Collections)

#### 1. Artifacts Collection
```typescript
{
  id: string
  name: string
  slug: string
  short_description: string
  full_description: string
  historical_period: string
  date_or_time_period: string
  origin: string
  cultural_significance: string
  thumbnail: Media (image)
  model_file: Media (GLB/glTF)
  audio_narration: Media (MP3/AAC)
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published' | 'archived'
  published_at: datetime
  // Assessment fields
  assessment_question: string
  assessment_options: array of { text: string, is_correct: boolean }
  // Difficulty configuration
  difficulty_config: {
    easy: { fragment_count: number, time_limit: number, pearl_reward: number }
    medium: { fragment_count: number, time_limit: number, pearl_reward: number }
    hard: { fragment_count: number, time_limit: number, pearl_reward: number }
  }
  // 3D model metadata
  model_metadata: {
    file_size: number
    polygon_count: number
    texture_resolution: string
    mobile_optimized: boolean
  }
}
```

#### 2. Exhibits Collection
```typescript
{
  id: string
  name: string
  slug: string
  description: string
  thumbnail: Media
  historical_period: string
  artifacts: Relationship (many-to-many with Artifacts)
  status: 'draft' | 'published'
  sort_order: number
}
```

#### 3. Achievements Collection
```typescript
{
  id: string
  name: string
  description: string
  icon: Media
  requirement_type: 'pearls_collected' | 'exhibits_completed' | 'perfect_score'
  requirement_value: number
}
```

#### 4. User Reports Collection
```typescript
{
  id: string
  user_id: string (from external auth)
  category: 'bug_report' | 'feature_suggestion' | 'artifact_info_error'
  description: string
  device_info: {
    model: string
    os_version: string
    app_version: string
  }
  status: 'open' | 'in_progress' | 'resolved'
  created_at: datetime
}
```

### Admin Panel Customization Requirements

1. **Branding**: Replace Payload logo with Pasig City Museum branding
2. **Theming**: Custom color scheme matching ARtifacts brand colors
3. **Custom Dashboard**: Analytics widgets showing:
   - Total artifacts published
   - User engagement metrics (from external API)
   - Assessment completion rates
   - Learning gain statistics
4. **Custom Views**: Exhibits manager with visual artifact thumbnails
5. **Role-Based Access**: Admin, Editor, Viewer roles

### Analytics Dashboard Requirements

We need a custom dashboard section with widgets that display:

1. **Content Statistics**:
   - Total artifacts, exhibits, achievements
   - Draft vs. published counts
   - Recently updated content

2. **Educational Impact** (data from Express API):
   - Average pre-assessment scores per exhibit
   - Average post-assessment scores per exhibit
   - Learning gain calculations
   - Assessment completion rates

3. **User Engagement** (data from Express API):
   - Total active users
   - Pearls earned
   - Puzzle completions by difficulty
   - Personal best times

### Integration Points

#### External APIs
- **Express Backend API**: `https://api.artifacts.ph` (user management, game progress)
- **Unity Mobile App**: Consumes Payload API for published content
- **Object Storage**: S3-compatible (Cloudflare R2, Backblaze B2, or MinIO)

#### Required API Endpoints
Payload should expose REST or GraphQL endpoints for:
- `GET /api/artifacts` - List published artifacts
- `GET /api/artifacts/:slug` - Single artifact with full details
- `GET /api/exhibits` - List published exhibits with artifact relationships
- `GET /api/achievements` - List all achievements
- `POST /api/reports` - Submit user feedback from mobile app

### API Security Requirements
- API keys for Unity app authentication
- CORS restricted to known client URLs
- Rate limiting on public endpoints
- Only published content accessible via API
- Draft/unpublished content hidden from external requests

### Content Workflow

```
Editor creates draft
    ↓
Editor submits for review
    ↓
Admin reviews content
    ↓
Admin approves or rejects
    ↓
Admin publishes
    ↓
Content available via API
```

Custom status field: `status: ['draft', 'submitted', 'approved', 'rejected', 'published', 'archived']`

### Deployment Requirements

- **Free hosting options**: Vercel, Cloudflare, or Oracle Cloud free tier
- **Database**: PostgreSQL (Neon, Supabase, or self-hosted)
- **Media Storage**: S3-compatible (Cloudflare R2, Backblaze B2)
- **CDN**: For fast global content delivery

### File Structure

```
artifacts-project/
├── payload-cms/
│   ├── src/
│   │   ├── collections/
│   │   │   ├── Artifacts.ts
│   │   │   ├── Exhibits.ts
│   │   │   ├── Achievements.ts
│   │   │   └── Reports.ts
│   │   ├── globals/
│   │   │   └── Header.ts (navigation)
│   │   ├── fields/
│   │   │   ├── Slug.ts
│   │   │   └── Status.ts
│   │   ├── hooks/
│   │   │   └── beforeChange.ts
│   │   ├── plugins/
│   │   │   └── dashboard-stats.ts
│   │   ├── blocks/
│   │   │   └── LayoutBuilder.ts
│   │   └── payload.config.ts
│   ├── .env
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
├── express-api/ (existing)
├── mobile-app/ (Unity)
├── infrastructure/
└── documentation/
```

### Current Development Environment

- **Editor**: Visual Studio Code
- **Node Version**: 20.9.0 or higher
- **Package Manager**: pnpm (preferred) or npm
- **Database**: PostgreSQL 16+
- **Version Control**: Git + GitHub

### Team Questions for Copilot

We need help with:

1. Setting up Payload CMS from scratch with our specific content models
2. Creating custom admin panel UI with Pasig City Museum branding
3. Building analytics dashboard widgets
4. Configuring secure API endpoints with authentication
5. Defining content relationships (Artifacts ↔ Exhibits)
6. Setting up media handling for 3D models (GLB/glTF)
7. Deploying to free hosting (Vercel or Cloudflare)
8. Customizing the admin panel with Tailwind CSS
9. Creating custom fields (Slug, Status with workflow)
10. Setting up environment variables for different environments

### Reference Materials

- Payload CMS Documentation: https://payloadcms.com/docs
- Payload GitHub: https://github.com/payloadcms/payload
- Vercel Deployment: https://payloadcms.com/docs/production/deployment
- Database Adapters: PostgreSQL, MongoDB, SQLite

### Color Scheme for Branding

- Primary: #8B4513 (Brown - historical/museum feel)
- Secondary: #D4A574 (Warm gold)
- Accent: #2C1810 (Dark brown)
- Background: #F5F0EB (Warm cream)
- Text: #1A110B (Almost black)

---

## Getting Started with Payload

### Initial Setup Steps

1. Install Node.js 20.9.0+
2. Install pnpm: `npm install -g pnpm`
3. Create new Payload project:
   ```bash
   pnpx create-payload-app
   ```
   - Choose "website" template
   - Use PostgreSQL adapter

4. Configure environment variables:
   ```
   PAYLOAD_SECRET="your-secret-key"
   DATABASE_URL="postgresql://..."
   ```

5. Start development server:
   ```bash
   pnpm dev
   ```

6. Access admin panel: `http://localhost:3000/admin`

---

**Note to Copilot**: When helping with this project, assume we need to:
- Keep all software open-source and free
- Deploy without recurring costs
- Prioritize mobile-optimized content delivery
- Support museum staff with non-technical backgrounds
- Enable educational assessment tracking through the CMS