export default function QuickInfoCard({ icon: Icon, title, description }) {
  return (
    <article className="about-quick-card">
      <span className="about-quick-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="about-quick-copy">
        <h4 className="about-quick-title">{title}</h4>
        <span className="about-quick-description">{description}</span>
      </span>
    </article>
  )
}
