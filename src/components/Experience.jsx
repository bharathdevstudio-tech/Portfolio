import {
  FaCode,
  FaBuilding,
  FaScrewdriverWrench,
  FaGraduationCap,
  FaLinkedinIn,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6'
import Section from './Section'
import Reveal from './Reveal'
import { careerProfile, careerHeading, careerTimeline } from '../data/experience'

const ICONS = {
  code: <FaCode />,
  building: <FaBuilding />,
  settings: <FaScrewdriverWrench />,
  graduation: <FaGraduationCap />,
}

export default function Experience() {
  return (
    <Section id="career" bare labelledBy="career-heading">
      <div className="career-bg" aria-hidden="true">
        <span className="career-glow career-glow-1" />
        <span className="career-glow career-glow-2" />
        <span className="career-grid-lines" />
      </div>

      <div className="container career-layout">
        {/* ---------- Left: profile panel ---------- */}
        <Reveal className="career-profile" delay={0}>
          <div className="career-profile-card">
            <span className="career-monogram" aria-hidden="true">
              {careerProfile.monogram}
            </span>

            <h3 className="career-profile-name">{careerProfile.name}</h3>
            <p className="career-profile-title">{careerProfile.title}</p>
            <p className="career-profile-desc">{careerProfile.description}</p>

            <div className="career-profile-skills">
              {careerProfile.skills.map((skill) => (
                <span className="career-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>

            <a
              className="career-linkedin"
              href={careerProfile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn aria-hidden="true" />
              {careerProfile.linkedinLabel}
              <FaArrowUpRightFromSquare className="career-linkedin-icon" aria-hidden="true" />
            </a>

            <a
              className="career-profile-url"
              href={careerProfile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {careerProfile.linkedinUrl}
            </a>
          </div>
        </Reveal>

        {/* ---------- Right: timeline ---------- */}
        <div className="career-main">
          <Reveal className="career-intro" delay={60}>
            <h2 className="career-heading" id="career-heading">
              {careerHeading.titleLead}{' '}
              <span className="career-heading-accent">{careerHeading.titleAccent}</span>
            </h2>
            <p className="career-subtitle">{careerHeading.subtitle}</p>
          </Reveal>

          <ol className="career-timeline">
            {careerTimeline.map((item, i) => (
              <li key={item.id} className="career-item">
                <span className="career-node" aria-hidden="true">
                  <span className="career-node-inner" />
                </span>

                <Reveal delay={i * 110} className="career-card">
                  <span className="career-card-date">{item.date}</span>

                  <div className="career-card-head">
                    <span className="career-card-icon" aria-hidden="true">
                      {ICONS[item.icon]}
                    </span>

                    <div className="career-card-titles">
                      <h3 className="career-card-role">{item.role}</h3>
                      <p className="career-card-company">{item.company}</p>
                    </div>
                  </div>

                  {item.type && <p className="career-card-type">{item.type}</p>}

                  <p className="career-card-desc">{item.desc}</p>

                  <div className="career-card-skills">
                    {item.skills.map((skill) => (
                      <span className="career-chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}