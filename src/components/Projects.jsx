import { useMemo, useState } from 'react'
import { FaGithub, FaLink, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6'
import { FaExternalLinkAlt } from 'react-icons/fa'
import TechIcon from './TechIcon'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'
import { projects, projectFilters } from '../data/projects'

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [failedShots, setFailedShots] = useState({})
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((project) => {
      if (filter !== 'All' && !project.tags.includes(filter)) return false
      if (!q) return true
      const haystack = `${project.title} ${project.description} ${project.category} ${project.tags.join(' ')}`
      return haystack.toLowerCase().includes(q)
    })
  }, [filter, query])

  return (
    <Section
      id="work"
      eyebrow="Featured Work"
      title={
        <>
          Projects I&apos;m <span className="gradient-text">proud of</span>
        </>
      }
      subtitle="Real products I designed, built and shipped — from full-stack platforms to focused UI experiments."
    >
      <Reveal className="projects-toolbar" as="div">
        <div className="projects-search">
          <FaMagnifyingGlass className="projects-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="projects-search-input"
            placeholder="Search projects by name, tech or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search projects"
          />
          {query ? (
            <button
              type="button"
              className="projects-search-clear"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <FaXmark aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="projects-filters" role="group" aria-label="Filter projects by technology">
          {projectFilters.map((tech) => (
            <button
              key={tech}
              type="button"
              className={`filter-chip ${filter === tech ? 'active' : ''}`}
              aria-pressed={filter === tech}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </Reveal>

      <p className="projects-count" aria-live="polite">
        Showing <strong>{shown.length}</strong> of {projects.length} projects
      </p>

      {shown.length === 0 ? (
        <p className="projects-empty">
          No projects match your search. Try a different keyword or filter.
        </p>
      ) : (
      <div className="projects-grid">
        {shown.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) * 90} className="project-card">
            <TiltCard>
              <div className="project-thumb" style={{ background: project.placeholder.gradient }}>
                {project.screenshot && !failedShots[project.id] ? (
                  <img
                    className="project-thumb-img"
                    src={project.screenshot}
                    alt={`${project.title} — live site preview`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedShots((prev) => ({ ...prev, [project.id]: true }))}
                  />
                ) : (
                  <span
                    className="project-thumb-fallback"
                    role="img"
                    aria-label={`${project.title} — project preview`}
                  >
                    <TechIcon name={project.placeholder.icon} label="Preview" size="2.4rem" />
                  </span>
                )}
              </div>

              <div className="project-body">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <ul className="project-tags" aria-label="Technologies used">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="tag">{tag}</span>
                    </li>
                  ))}
                </ul>

                <div className="project-actions">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      className="btn btn-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — live demo`}
                    >
                      <FaExternalLinkAlt size="0.8em" aria-hidden="true" />
                      Live Demo
                    </a>
                  ) : (
                    <span className="btn btn-ghost" style={{ opacity: 0.55, cursor: 'not-allowed' }} title="Demo URL not set yet">
                      <FaLink size="0.8em" aria-hidden="true" />
                      Demo Soon
                    </span>
                  )}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      className="btn btn-ghost"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — source on GitHub`}
                    >
                      <FaGithub size="0.9em" aria-hidden="true" />
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      )}
    </Section>
  )
}