// Command palette (Ctrl/Cmd+K) — quick navigation, effect toggles, links.
// Lightweight, dependency-free, keyboard-first (listbox semantics).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaGithub, FaLinkedinIn, FaEnvelope, FaPhone, FaDownload } from 'react-icons/fa6'
import { navLinks, profile } from '../../data/profile'
import { scrollToSection, scrollToTop } from '../../lib/scroll'
import { EFFECTS, EFFECT_LABELS, getEffectEnabled, setEffectEnabled } from '../../lib/effects'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function findNext(list, current, direction) {
  const n = list.length
  if (n === 0) return -1
  if (current === -1) return direction > 0 ? 0 : n - 1
  return (current + (direction > 0 ? 1 : -1) + n) % n
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const lastFocused = useRef(null)
  const reduced = useReducedMotion()

  const actions = useMemo(() => {
    const nav = navLinks.map((link) => ({
      id: `nav-${link.id}`,
      label: link.label,
      hint: 'Jump to section',
      icon: 'nav',
      run: () => {
        if (link.id === 'home') scrollToTop()
        else scrollToSection(link.id)
        setOpen(false)
      },
    }))

    const effects = Object.values(EFFECTS).map((key) => ({
      id: `fx-${key}`,
      label: `${EFFECT_LABELS[key]}: ${getEffectEnabled(key) ? 'On' : 'Off'}`,
      hint: 'Toggle visual effect',
      icon: 'fx',
      run: () => {
        setEffectEnabled(key, !getEffectEnabled(key))
      },
    }))

    const links = [
      { id: 'github', label: 'GitHub', hint: 'github.com/bharathdevstudio-tech', icon: 'github', href: profile.socials.github },
      { id: 'linkedin', label: 'LinkedIn', hint: 'linkedin.com/in/bharath-soft', icon: 'linkedin', href: profile.socials.linkedin },
      { id: 'mail', label: 'Email', hint: profile.email, icon: 'mail', href: `mailto:${profile.email}` },
      { id: 'call', label: 'Call', hint: profile.phone, icon: 'phone', href: profile.phoneHref },
    ].map((l) => ({
      ...l,
      run: () => {
        window.open(l.href, l.href.startsWith('mailto') || l.href.startsWith('tel') ? '_self' : '_blank', 'noopener,noreferrer')
        setOpen(false)
      },
    }))

    return [
      ...nav,
      ...effects,
      ...links,
      {
        id: 'resume',
        label: 'Download Resume',
        hint: 'Placeholder until a PDF is added',
        icon: 'download',
        run: () => {
          setOpen(false)
          if (profile.resumeUrl) {
            window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer')
            return
          }
          const blob = new Blob([`Resume — ${profile.name}\nRole: ${profile.role}\n\n${profile.tagline}\n`], { type: 'text/plain;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'Bharath-E-Resume.txt'
          a.click()
          setTimeout(() => URL.revokeObjectURL(url), 2000)
        },
      },
    ]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions
    return actions.filter((a) => `${a.label} ${a.hint}`.toLowerCase().includes(q))
  }, [actions, query])

  useEffect(() => {
    if (highlight >= filtered.length) setHighlight(0)
  }, [filtered.length, highlight])

  const openPalette = useCallback(() => {
    lastFocused.current = document.activeElement
    setQuery('')
    setHighlight(0)
    setOpen(true)
  }, [])

  const closePalette = useCallback(
    (restoreFocus = true) => {
      setOpen(false)
      if (restoreFocus && lastFocused.current && typeof lastFocused.current.focus === 'function') {
        lastFocused.current.focus()
      }
    },
    []
  )

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) closePalette(false)
        else openPalette()
        return
      }
      if (!open || e.ctrlKey || e.metaKey || e.altKey) return
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          closePalette()
          break
        case 'ArrowDown':
          e.preventDefault()
          setHighlight((h) => findNext(filtered, h, 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlight((h) => findNext(filtered, h, -1))
          break
        case 'Enter': {
          e.preventDefault()
          const item = filtered[Math.min(highlight, filtered.length - 1)]
          if (item) item.run()
          break
        }
        default:
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, filtered, highlight, openPalette, closePalette])

  // Focus the input when the panel opens; trap focus on Tab.
  useEffect(() => {
    if (!open) return undefined
    const t = setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 20)
    const trap = (e) => {
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll('[tabindex="0"], input')
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const lastEl = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', trap)
    }
  }, [open, reduced])

  useEffect(() => {
    const el = panelRef.current?.querySelector('[data-highlight="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlight])

  if (!open) return null

  return (
    <div className="palette-overlay" onMouseDown={() => closePalette()}>
      <div
        className="palette"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="palette-input-row">
          <svg viewBox="0 0 24 24" className="palette-search-icon" aria-hidden="true" width="18" height="18">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-5-5"
            />
          </svg>
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Search or jump to…"
            aria-label="Search sections, effects and links"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[highlight] && filtered[highlight].length >= 0 ? `palette-opt-${highlight}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setHighlight(0)
            }}
          />
          <kbd className="palette-kbd">esc</kbd>
        </div>

        {filtered.length === 0 ? (
          <p className="palette-empty">No results for “{query}”</p>
        ) : (
          <ul className="palette-list" id="palette-list" role="listbox">
            {filtered.map((item, i) => (
              <li
                key={item.id}
                id={`palette-opt-${i}`}
                role="option"
                aria-selected={i === highlight}
                data-highlight={i === highlight}
                className={`palette-opt ${i === highlight ? 'palette-opt-highlight' : ''}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  item.run()
                }}
              >
                <span className={`palette-opt-icon palette-opt-${item.icon}`} aria-hidden="true">
                  {item.icon === 'nav' ? '→' : null}
                  {item.icon === 'fx' ? '◉' : null}
                  {item.icon === 'github' ? <FaGithub size="0.9em" /> : null}
                  {item.icon === 'linkedin' ? <FaLinkedinIn size="0.85em" /> : null}
                  {item.icon === 'mail' ? <FaEnvelope size="0.9em" /> : null}
                  {item.icon === 'phone' ? <FaPhone size="0.85em" /> : null}
                  {item.icon === 'download' ? <FaDownload size="0.85em" /> : null}
                </span>
                <span className="palette-opt-label">{item.label}</span>
                {item.hint ? <span className="palette-opt-hint">{item.hint}</span> : null}
              </li>
            ))}
          </ul>
        )}

        <p className="palette-footer">Enter to select · ↑↓ to navigate · Esc to close</p>
      </div>
    </div>
  )
}