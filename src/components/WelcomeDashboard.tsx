import React from 'react'

export const ArtifactsMark = () => (
  <span className="artifacts-mark" aria-label="ARtifacts">
    <span className="artifacts-mark__diamond" aria-hidden="true">A</span>
    <span className="artifacts-mark__word">ARtifacts</span>
  </span>
)

export default function WelcomeDashboard() {
  return (
    <section className="artifacts-welcome" aria-labelledby="artifacts-welcome-title">
      <div className="artifacts-welcome__intro">
        <ArtifactsMark />
        <p className="artifacts-welcome__eyebrow">Pasig City Museum content studio</p>
        <h1 id="artifacts-welcome-title">Welcome to ARtifacts</h1>
        <p className="artifacts-welcome__lede">
          Your workspace for preserving stories, shaping exhibits, and preparing cultural content for the AR experience.
        </p>
      </div>
      <div className="artifacts-welcome__status">
        <span className="artifacts-welcome__status-dot" aria-hidden="true" />
        <span>Content studio ready</span>
      </div>
    </section>
  )
}
