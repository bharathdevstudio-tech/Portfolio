import { useCallback, useEffect, useRef } from 'react'
import TechIcon from './TechIcon'
import Reveal from './Reveal'
import Section from './Section'
import { skills } from '../data/skills'

export default function Skills() {
  const gridRef = useRef(null)
  const frameRef = useRef(0)

  const handlePointerMove = useCallback((event) => {
    if (frameRef.current) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      const card = event.target.closest?.('.skill-card')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      card.style.setProperty('--my', `${event.clientY - rect.top}px`)
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    gridRef.current?.querySelectorAll('.skill-card').forEach((card) => {
      card.style.removeProperty('--mx')
      card.style.removeProperty('--my')
    })
  }, [])

  useEffect(() => () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <Section
      id="skills"
      className="skills-section"
      title={
        <>
          Technical <span className="gradient-text">Skills</span>
        </>
      }
      subtitle="Technologies and tools I work with to build, maintain and deliver solutions."
    >
      <ul
        className="skills-grid"
        ref={gridRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {skills.map((skill, index) => (
          <Reveal
            key={skill.id}
            as="li"
            delay={index * 55}
            className="skill-card"
            style={{ '--i': index }}
            aria-label={skill.name}
          >
            <span className="skill-card-inner">
              <span className="skill-card-icon">
                <TechIcon name={skill.icon} label={skill.name} />
              </span>
              <span className="skill-card-name">{skill.name}</span>
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
