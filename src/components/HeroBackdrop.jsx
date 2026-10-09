// Hero-local layers only.
//
// The nebula scene itself is rendered once in Fx/Backdrop, fixed behind every
// section. The hero adds its own reading scrim (so white headline/CTA text keeps
// clean negative space on the left) and a soft celestial glow.
export default function HeroBackdrop() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-glow" />
      <div className="hero-scrim" />
    </div>
  )
}
