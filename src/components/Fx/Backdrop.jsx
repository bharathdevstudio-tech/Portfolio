// Global ambient backdrop: aurora gradient blobs, a subtle grid, and grain.
// Pure CSS (classes in index.css), honors prefers-reduced-motion.
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <div className="grid-overlay" />
      <div className="grain" />
    </div>
  )
}