import './styles.css'

type Artifact = {
  id: string
  name: string
  slug: string
  shortDescription?: string
  thumbnail?: { url?: string; alt?: string }
}

const payloadApiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api'

async function getPublishedArtifacts(): Promise<Artifact[]> {
  try {
    const response = await fetch(`${payloadApiUrl}/artifacts?where[_status][equals]=published&limit=3`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return []
    const data = (await response.json()) as { docs?: Artifact[] }
    return data.docs || []
  } catch {
    return []
  }
}

export const metadata = {
  description: 'ARtifacts connects Pasig City Museum stories with an augmented reality experience.',
  title: 'ARtifacts | Pasig City Museum',
}

export default async function HomePage() {
  const artifacts = await getPublishedArtifacts()

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a className="brand" href="/" aria-label="ARtifacts home">
          <span className="brand__mark" aria-hidden="true">A</span>
          <span>ARtifacts</span>
        </a>
        <a className="site-nav__admin" href="/admin">Admin panel <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section className="welcome">
          <p className="kicker">Pasig City Museum - Content Management System</p>
          <h1>Welcome to ARtifacts.</h1>
          <p className="welcome__copy">
            A digital companion for discovering the objects and stories that make Pasig’s history feel close enough to touch.
          </p>
          <a className="button button--primary" href="#collection">View the collection <span aria-hidden="true">↓</span></a>
        </section>

        <section className="collection" id="collection">
          <div className="section-heading">
            <div>
              <p className="kicker">From the museum</p>
              <h2>Featured artifacts</h2>
            </div>
            <p>Published content from the ARtifacts CMS.</p>
          </div>
          {artifacts.length > 0 ? (
            <div className="artifact-list">
              {artifacts.map((artifact) => (
                <article className="artifact-item" key={artifact.id}>
                  {artifact.thumbnail?.url && <img src={artifact.thumbnail.url} alt={artifact.thumbnail.alt || artifact.name} />}
                  <div>
                    <p className="artifact-item__slug">{artifact.slug}</p>
                    <h3>{artifact.name}</h3>
                    <p>{artifact.shortDescription}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>The collection is taking shape.</h3>
              <p>Publish an artifact in the CMS and it will appear here automatically.</p>
              <a className="button button--quiet" href="/admin/collections/artifacts">Open artifacts <span aria-hidden="true">↗</span></a>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span>ARtifacts / Pasig City Museum</span>
        <span>Stories preserved. Perspectives opened.</span>
      </footer>
    </div>
  )
}
