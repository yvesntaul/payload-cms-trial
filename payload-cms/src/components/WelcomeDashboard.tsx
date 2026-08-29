import React from 'react'

export const ArtifactsMark = () => (
  <img
    src="/assets/ARtifacts-Logo.png"
    alt="ARtifacts"
    style={{ width: 54, height: 'auto', display: 'block' }}
  />
)

export const ArtifactsLogo = () => (
  <img
    src="/assets/ARtifacts-FullLogo.png"
    alt="ARtifacts"
    style={{ width: 220, height: 'auto', display: 'block' }}
  />
)

export default function WelcomeDashboard() {
  return (
    <section className="artifacts-welcome" aria-labelledby="artifacts-welcome-title">
      <div className="artifacts-welcome__intro">
        <ArtifactsLogo />
        <p className="artifacts-welcome__eyebrow">Pasig City Museum Content Management System</p>
        <h1 id="artifacts-welcome-title">Welcome to ARtifacts</h1>
        <p className="artifacts-welcome__lede">
          Your workspace for preserving stories, shaping exhibits, and preparing cultural content for the AR experience.
        </p>
      </div>
    </section>
  )
}
