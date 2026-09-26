import { FaBriefcase, FaGraduationCap, FaCircleCheck } from 'react-icons/fa6'
import Section from './Section'
import Reveal from './Reveal'
import { experience, education } from '../data/experience'

export default function Experience() {
  return (
    <Section
      id="career"
      eyebrow="Career Path"
      title={
        <>
          Experience that <span className="gradient-text">shapes me</span>
        </>
      }
      subtitle="From freelance builds to production business applications — every project has sharpened a new skill."
    >
      <div className="career-wrap">
        <ol className="timeline">
          {experience.map((job, i) => (
            <li key={job.id}>
              <Reveal delay={i * 100} className="timeline-item">
                <span
                  className={`timeline-dot ${job.current ? 'timeline-dot-current' : ''}`}
                  aria-hidden="true"
                />
                <div className="timeline-card glass">
                  <div className="timeline-head">
                    <div className="timeline-badge" aria-hidden="true">
                      <FaBriefcase />
                    </div>
                    <div>
                      <h3 className="timeline-role">{job.role}</h3>
                      <p className="timeline-company">{job.company}</p>
                    </div>
                    <span className={`timeline-period ${job.current ? 'timeline-period-current' : ''}`}>
                      {job.current && <span className="timeline-pulse" aria-hidden="true" />}
                      {job.period}
                    </span>
                  </div>
                  <p className="timeline-desc">{job.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="education-card glass-strong">
          <div className="education-icon" aria-hidden="true">
            <FaGraduationCap />
          </div>
          <div>
            <h3 className="education-title">{education.degree}</h3>
            <p className="education-note">{education.status}</p>
          </div>
          <span className="education-badge">
            <FaCircleCheck aria-hidden="true" />
            {education.note}
          </span>
        </Reveal>
      </div>
    </Section>
  )
}