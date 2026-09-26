import { FaGithub, FaLinkedinIn, FaHeart } from 'react-icons/fa6'
import { profile } from '../data/profile'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-copy">
          © {year} {profile.name}. Crafted with <span className="footer-heart" aria-hidden="true"><FaHeart size="0.85em" /></span> using React, Vite &amp; a little stardust.
        </p>
        <nav className="footer-links" aria-label="Footer social links">
          {profile.socials.github && (
            <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <FaGithub size="1.1rem" />
            </a>
          )}
          {profile.socials.linkedin && (
            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <FaLinkedinIn size="1.1rem" />
            </a>
          )}
        </nav>
      </div>
    </footer>
  )
}