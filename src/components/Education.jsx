import { FaGraduationCap } from 'react-icons/fa6'
import Section from './Section'
import Reveal from './Reveal'
import { educationHeading, educationList } from '../data/education'

const ICONS = {
  graduation: <FaGraduationCap />,
}

export default function Education() {
  return (
    <Section id="education" bare labelledBy="education-heading">
      <div className="education-bg" aria-hidden="true">
        <span className="career-glow career-glow-1" />
        <span className="career-glow career-glow-2" />
        <span className="career-grid-lines" />
      </div>

      <div className="container education-layout">
        <Reveal className="education-intro" as="header">
          <p className="section-eyebrow">Education</p>
          <h2 className="education-heading" id="education-heading">
            {educationHeading.titleLead}{' '}
            <span className="career-heading-accent">{educationHeading.titleAccent}</span>
          </h2>
          <p className="education-subtitle">{educationHeading.subtitle}</p>
        </Reveal>

        <div className="education-grid">
          {educationList.map((item, i) => (
            <Reveal key={item.id} delay={i * 110} className="career-card">
              <span className="career-card-date">{item.date}</span>

              <div className="career-card-head">
                <span className="career-card-icon" aria-hidden="true">
                  {ICONS[item.icon] ?? ICONS.graduation}
                </span>

                <div className="career-card-titles">
                  <h3 className="career-card-role">{item.degree}</h3>
                  <p className="career-card-company">{item.institution}</p>
                </div>
              </div>

              {item.desc && <p className="career-card-desc">{item.desc}</p>}

              {item.skills?.length > 0 && (
                <div className="career-card-skills">
                  {item.skills.map((skill) => (
                    <span className="career-chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
