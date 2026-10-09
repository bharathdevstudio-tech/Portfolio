// Smooth-scroll helper shared by Navbar, Hero and the command palette.
const NAV_OFFSET = 68

// Offscreen sections defer their rendering (content-visibility) so the first
// paint stays cheap. That makes a not-yet-rendered target's offset approximate,
// so before measuring a destination we turn deferral off once. Reading
// getBoundingClientRect then forces an exact layout, and the flag stays on for
// the session (users who navigate have already scrolled the page anyway).
function revealSections() {
  document.documentElement.classList.add('cv-off')
}

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  revealSections()
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
