import { useReveal } from '../hooks/useReveal'

// Wraps children in a scroll-reveal container.
// `delay` in ms. Honors prefers-reduced-motion.
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', idleClass = 'reveal', style, ...rest }) {
  const [ref, revealed] = useReveal({ delay })
  return (
    <Tag
      ref={ref}
      className={`${idleClass} ${revealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={{ '--d': delay, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}