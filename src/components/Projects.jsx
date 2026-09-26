import { useMemo, useState } from 'react'
import { FaGithub, FaLink } from 'react-icons/fa6'
import { FaExternalLinkAlt } from 'react-icons/fa'
import TechIcon from './TechIcon'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'
import { projects, projectFilters } from '../data/projects'

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const shown = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.tags.includes(filter))),
    [filter]
  )

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
      <Reveal className="projects-filters" as="div" role="group" aria-label="Filter projects by technology">
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
      </Reveal>

      <div className="projects-grid">
        {shown.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) * 90} className="project-card">
            <TiltCard>
              <div
                className="project-thumb"
                style={{ background: project.placeholder.gradient }}
                role="img"
                aria-label={`${project.title} — project preview`}
              >
                <TechIcon name={project.placeholder.icon} label="Preview" size="3.2rem" />
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
    </Section>
  )
}