export default function ChatBubble({ message, index }) {
  const isVisitor = message.sender === 'visitor'

  return (
    <li
      className={`about-message about-message--${message.sender} about-message--${message.tone || 'default'}${message.instant ? ' about-message--immediate' : ''}`}
      style={{ '--message-index': index }}
    >
      <div className="about-bubble">
        <p>{message.text}</p>
      </div>
      {message.time && <span className="about-message-time">{message.time}</span>}
      {isVisitor && <span className="sr-only">Your message</span>}
    </li>
  )
}
