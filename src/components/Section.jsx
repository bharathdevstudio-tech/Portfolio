// Shared section wrapper with optional heading block.
import Reveal from './Reveal'

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  ariaLabelledby,
  bare = false,
  labelledBy,
}) {
  const titleId = ariaLabelledby || `heading-${id}`
  return (
    <section
      id={id}
      className={`section ${className}`.trim()}
      aria-labelledby={bare ? labelledBy : titleId}
    >
      {bare ? (
        children
      ) : (
        <div className="container">
          {(eyebrow || title) && (
            <Reveal className="section-head" as="header">
              {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
              {title && (
                <h2 className="section-title" id={titleId}>
                  {title}
                </h2>
              )}
              {subtitle && <p className="section-sub">{subtitle}</p>}
            </Reveal>
          )}
          {children}
        </div>
      )}
    </section>
  )
}
