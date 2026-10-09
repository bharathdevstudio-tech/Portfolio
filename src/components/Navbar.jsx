import { useCallback, useEffect, useRef, useState } from 'react'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { navLinks, profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { scrollToSection } from '../lib/scroll'

const SECTION_IDS = navLinks.map((l) => l.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const burgerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on Escape and restore focus to the burger button.
  useEffect(() => {
    if (!menuOpen) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
    }
    // Redirect Tab focus within the panel when open.
    const onFocus = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        e.preventDefault()
        panelRef.current.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocus)
    }
  }, [menuOpen])

  const handleNav = useCallback(
    (e, id) => {
      e.preventDefault()
      setMenuOpen(false)
      scrollToSection(id)
    },
    []
  )

  const toggleMenu = () => setMenuOpen((open) => !open)

  return (
    <>
      <a href="#home" className="skip-link">
        Skip to content
      </a>
      <nav
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="container nav-inner">
          <a
            href="#home"
            className="nav-logo"
            onClick={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label={`${profile.name} — back to top`}
          >
            <span className="nav-logo-mark" aria-hidden="true">
              <img src="/images/logo-96.png" alt="" width="36" height="36" decoding="async" />
            </span>
            {profile.name}
          </a>

          <ul className="nav-links">
            {navLinks.map((link, i) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`nav-link ${active === link.id ? 'active' : ''}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  style={{ '--d': i * 60 }}
                  onClick={(e) => handleNav(e, link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <a
              href="#contact"
              className="btn btn-primary nav-hire"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                scrollToSection('contact')
              }}
            >
              Hire Me
            </a>
            <button
              ref={burgerRef}
              type="button"
              className="nav-burger"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              onClick={toggleMenu}
            >
              {menuOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel — controlled focus target */}
        <div
          id="mobile-nav-menu"
          ref={panelRef}
          className={`nav-menu ${menuOpen ? 'open' : 'closed'}`}
          role="menu"
          aria-label="Mobile navigation"
          tabIndex={-1}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              role="menuitem"
              className={`nav-link ${active === link.id ? 'active' : ''}`}
              aria-current={active === link.id ? 'true' : undefined}
              onClick={(e) => handleNav(e, link.id)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            role="menuitem"
            className="btn btn-primary nav-hire"
            onClick={(e) => handleNav(e, 'contact')}
          >
            Hire Me
          </a>
        </div>
      </nav>
    </>
  )
}