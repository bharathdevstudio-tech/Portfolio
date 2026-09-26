import { useEffect, useRef, useState } from 'react'
import {
  FaCode,
  FaDatabase,
  FaDesktop,
  FaMapMarkerAlt,
  FaPaperclip,
  FaPaperPlane,
  FaReact,
  FaSmile,
} from 'react-icons/fa'
import { profile } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import ChatBubble from './ChatBubble'
import QuickInfoCard from './QuickInfoCard'
import Reveal from './Reveal'
import Section from './Section'

const timeFormatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: '2-digit',
})

const introMessages = [
  {
    id: 'intro-1',
    sender: 'developer',
    tone: 'compact',
    text: 'Hi, I’m Bharath E — a Software Developer from Tenkasi, Tamil Nadu.',
  },
  {
    id: 'intro-2',
    sender: 'developer',
    tone: 'accent',
    text: 'I build and support business applications with VB.NET, using SQL Server to create dependable data solutions.',
    time: '10:24 AM',
  },
  {
    id: 'intro-3',
    sender: 'developer',
    tone: 'accent',
    text: 'I also create responsive web experiences with React, focused on simple interfaces that are genuinely useful.',
  },
  {
    id: 'intro-4',
    sender: 'developer',
    text: 'I enjoy supporting existing applications, solving practical problems, and learning new technology as projects evolve.',
    time: '10:25 AM',
  },
]

const quickReplies = [
  {
    label: 'Skills',
    response: 'My core skills include VB.NET, SQL Server, application support, React, JavaScript, and building reliable database-connected software.',
  },
  {
    label: 'Experience',
    response: 'I’ve worked on business applications, SQL Server solutions, application maintenance and support, automation, and React-based web projects.',
  },
  {
    label: 'Projects',
    response: 'I build database-connected business software, internal tools, responsive React web apps, and practical automation solutions.',
  },
  {
    label: 'Contact',
    response: 'Feel free to reach out through email. I’m always open to discussing interesting opportunities.',
  },
]

const coreStack = ['VB.NET', 'SQL Server', 'React', 'JavaScript', 'Application Support']

const focusCards = [
  {
    icon: FaDesktop,
    title: 'Business Applications',
    description: 'Reliable VB.NET software for practical daily workflows.',
  },
  {
    icon: FaDatabase,
    title: 'SQL Server & Data',
    description: 'Dependable database design, queries, and reporting.',
  },
  {
    icon: FaReact,
    title: 'React Web Experiences',
    description: 'Clear, responsive, and easy-to-use web interfaces.',
  },
]

export default function About() {
  const [messages, setMessages] = useState(introMessages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const reducedMotion = useReducedMotion()
  const chatScrollRef = useRef(null)
  const inputRef = useRef(null)
  const responseTimerRef = useRef(null)
  const scrollFrameRef = useRef(null)
  const nextMessageIdRef = useRef(introMessages.length + 1)

  useEffect(
    () => () => {
      window.clearTimeout(responseTimerRef.current)
      window.cancelAnimationFrame(scrollFrameRef.current)
    },
    [],
  )

  const scrollChatToBottom = () => {
    const chatScroll = chatScrollRef.current
    if (!chatScroll) return

    chatScroll.scrollTo({
      top: chatScroll.scrollHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  const queueLatestMessage = () => {
    window.cancelAnimationFrame(scrollFrameRef.current)
    scrollFrameRef.current = window.requestAnimationFrame(scrollChatToBottom)
  }

  const appendExchange = (question, response) => {
    if (isTyping || !question.trim()) return

    const questionId = nextMessageIdRef.current
    nextMessageIdRef.current += 1

    setMessages((current) => [
      ...current,
      {
        id: `question-${questionId}`,
        sender: 'visitor',
        tone: 'default',
        instant: true,
        text: question.trim(),
        time: timeFormatter.format(new Date()),
      },
    ])
    setIsTyping(true)
    queueLatestMessage()

    responseTimerRef.current = window.setTimeout(() => {
      const responseId = nextMessageIdRef.current
      nextMessageIdRef.current += 1

      setMessages((current) => [
        ...current,
        {
          id: `response-${responseId}`,
          sender: 'developer',
          tone: 'accent',
          instant: true,
          text: response,
          time: timeFormatter.format(new Date()),
        },
      ])
      setIsTyping(false)
      responseTimerRef.current = null
      queueLatestMessage()
    }, reducedMotion ? 0 : 650)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const question = draft.trim()
    if (!question || isTyping) return

    const normalizedQuestion = question.toLowerCase()
    const matchedReply = quickReplies.find((reply) =>
      normalizedQuestion.includes(reply.label.toLowerCase()),
    )
    const response =
      matchedReply?.response ||
      'I’d be happy to share more. Use the quick questions above or reach out through my email.'

    setDraft('')
    appendExchange(question, response)
  }

  const addEmoji = () => {
    setDraft((current) => `${current}${current && !current.endsWith(' ') ? ' ' : ''}👋`)
    inputRef.current?.focus()
  }

  return (
    <Section
      id="about"
      className="about-section"
      eyebrow="ABOUT ME"
      title={
        <>
          Software developer with a{' '}
          <span className="gradient-text">practical mindset.</span>
        </>
      }
      subtitle="I build and support dependable business applications with VB.NET and SQL Server, plus responsive web experiences with React."
    >
      <div className="about-layout">
        <Reveal className="about-profile-panel glass-strong" delay={60}>
          <div className="about-profile-summary">
            <div className="about-profile-portrait">
              <img src={profile.image} alt={`${profile.name}, Software Developer`} />
              <span className="about-avatar-code" aria-hidden="true">
                &lt;/&gt;
              </span>
            </div>
            <div className="about-profile-identity">
              <p>Software Developer</p>
              <h3>{profile.name}</h3>
              <span className="about-location">
                <FaMapMarkerAlt aria-hidden="true" />
                Tenkasi, Tamil Nadu
              </span>
            </div>
          </div>

          <p className="about-profile-bio">
            I build and maintain business applications that teams can depend on. My work spans VB.NET development, SQL Server databases, application support, and responsive React interfaces.
          </p>

          <section className="about-profile-section" aria-labelledby="about-stack-title">
            <div className="about-label-row">
              <h4 id="about-stack-title">Core technology</h4>
              <span>Primary stack</span>
            </div>
            <ul className="about-stack-list">
              {coreStack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </section>

          <section className="about-profile-section" aria-labelledby="about-focus-title">
            <div className="about-label-row">
              <h4 id="about-focus-title">What I work with</h4>
              <span>Practical solutions</span>
            </div>
            <div className="about-focus-grid">
              {focusCards.map((card) => (
                <QuickInfoCard key={card.title} {...card} />
              ))}
            </div>
          </section>

          <div className="about-profile-footer">
            <span className="about-profile-footer-icon" aria-hidden="true">
              <FaCode />
            </span>
            <p>
              <strong>Built for real-world use.</strong>
              <span>Practical software, clear interfaces, and ongoing support.</span>
            </p>
          </div>
        </Reveal>

        <Reveal className="about-chat-wrap glass-strong" delay={140}>
          <article className="about-chat" aria-labelledby="about-chat-title">
            <header className="about-chat-header">
              <div className="about-chat-person">
                <span className="about-chat-avatar" aria-hidden="true">
                  <img src={profile.image} alt="" />
                </span>
                <div>
                  <h3 id="about-chat-title">Ask Bharath</h3>
                  <p>A quick developer conversation</p>
                </div>
              </div>
              <span className="about-chat-label">
                <FaCode aria-hidden="true" />
                Interactive
              </span>
            </header>

            <div className="about-chat-scroll" ref={chatScrollRef}>
              <div className="about-chat-day" aria-hidden="true">
                <span />
                Developer profile
                <span />
              </div>
              <ol
                className="about-messages"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="Conversation with Bharath E"
                aria-busy={isTyping}
              >
                {messages.map((message, index) => (
                  <ChatBubble key={message.id} message={message} index={index} />
                ))}
                {isTyping && (
                  <li className="about-message about-message--typing about-message--immediate" aria-label="Bharath is typing">
                    <span className="about-typing-bubble" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  </li>
                )}
              </ol>
            </div>

            <div className="about-quick-replies">
              <p className="about-quick-label">Quick questions</p>
              <div className="about-quick-buttons">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.label}
                    type="button"
                    className="about-quick-reply-button"
                    onClick={() => appendExchange(reply.label, reply.response)}
                    disabled={isTyping}
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>

            <form className="about-composer" onSubmit={handleSubmit}>
              <span className="about-composer-icon" aria-hidden="true">
                <FaPaperclip />
              </span>
              <label className="sr-only" htmlFor="about-chat-input">
                Ask Bharath about his work
              </label>
              <input
                ref={inputRef}
                id="about-chat-input"
                className="about-composer-input"
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask me about my work..."
                autoComplete="off"
              />
              <button
                type="button"
                className="about-composer-icon-button"
                onClick={addEmoji}
                aria-label="Add a greeting emoji"
              >
                <FaSmile aria-hidden="true" />
              </button>
              <button type="submit" className="about-send-button" aria-label="Send message">
                <FaPaperPlane aria-hidden="true" />
              </button>
            </form>
          </article>
        </Reveal>
      </div>
    </Section>
  )
}
