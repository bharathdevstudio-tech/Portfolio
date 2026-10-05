import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { LuArrowDown, LuDownload } from 'react-icons/lu';
import HeroBackdrop from './HeroBackdrop';
import Reveal from './Reveal';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

const heroTagline = 'Turning ideas into real-world software.';
const developerName = 'Bharath E';
const professions = ['Software Developer', 'VB.NET Developer', 'React Frontend Developer', 'Application Support Engineer'];

const WordReveal = ({ text, delay = 0, isReducedMotion = false }) => {
  if (isReducedMotion) {
    return <span>{text}</span>;
  }

  return (
    <span className="hero-greet-line" aria-label={text}>
      {text.split(' ').map((word, index) => (
        <span className="word-mask" aria-hidden="true" key={`${word}-${index}`}>
          <span className="hero-word" style={{ animationDelay: `${delay + index * 90}ms` }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

const TypeWriter = ({ words, isReducedMotion = false }) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isReducedMotion) {
      setCurrentText(words[0]);
      return;
    }

    const currentWord = words[currentRoleIndex];
    const complete = currentText === currentWord;
    const empty = currentText === '';

    if (complete && !isDeleting) {
      const pauseTimer = window.setTimeout(() => setIsDeleting(true), 1600);
      return () => window.clearTimeout(pauseTimer);
    }

    if (empty && isDeleting) {
      setIsDeleting(false);
      setCurrentRoleIndex((previousIndex) => (previousIndex + 1) % words.length);
      return;
    }

    const operation = isDeleting ? 'backward' : 'forward';
    const currentLength = currentText.length;
    const typeSpeed = isDeleting ? 42 : 84;
    const pauseAfterDelete = isDeleting && currentRoleIndex === words.length - 1 ? 500 : 0;
    const timer = window.setTimeout(() => {
      const nextLength = operation === 'backward' ? currentLength - 1 : currentLength + 1;
      setCurrentText(currentWord.slice(0, nextLength));
      if (operation === 'forward' && nextLength === currentWord.length) {
        window.setTimeout(() => setIsDeleting(true), 1600);
      }
      if (operation === 'backward' && nextLength === 0) {
        window.setTimeout(() => setIsDeleting(false), pauseAfterDelete);
      }
    }, typeSpeed);

    return () => window.clearTimeout(timer);
  }, [currentRoleIndex, currentText, isDeleting, isReducedMotion, words]);

  if (isReducedMotion) {
    return <span className="hero-role-text">Software Developer</span>;
  }

  return (
    <span className="hero-role-text">
      {currentText}
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
};

const downloadResume = () => {
  const resumeUrl = profile.resumeUrl;
  if (!resumeUrl) {
    return;
  }

  const resumeLink = document.createElement('a');
  resumeLink.href = resumeUrl;
  resumeLink.download = resumeUrl.split('/').pop() || 'Bharath-E-Resume.pdf';
  document.body.appendChild(resumeLink);
  resumeLink.click();
  resumeLink.remove();
};

function Hero() {
  const isReducedMotion = useReducedMotion();
  const socialLinks = [
    { href: profile.socials.linkedin, label: 'LinkedIn', icon: FaLinkedinIn },
    { href: profile.socials.github, label: 'GitHub', icon: FaGithub },
    { href: profile.socials.x, label: 'X', icon: FaXTwitter },
  ].filter((social) => social.href);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="home" className="hero" aria-label="Hero">
      <HeroBackdrop />
      <div className="hero-inner">
        <Reveal className="hero-copy" delay={100}>
          <div className="hero-greet">
            <WordReveal text={profile.greeting} delay={200} isReducedMotion={isReducedMotion} />
            <span className="hero-greet-accent" aria-hidden="true" />
          </div>
          <h1 className="hero-title">
            <span className="hero-title-name">{developerName}</span>
            <span className="hero-role">
              <TypeWriter words={professions} isReducedMotion={isReducedMotion} />
            </span>
          </h1>
          <p className="hero-desc">
            {heroTagline}
            <br />
            Building modern, efficient, and user-friendly applications.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" type="button" onClick={() => scrollToSection('work')}>
              View My Work
              <LuArrowDown className="btn-arrow" size={18} strokeWidth={2.3} aria-hidden="true" />
            </button>
            <button className="btn btn-ghost" type="button" onClick={downloadResume}>
              <LuDownload size={17} strokeWidth={2.1} aria-hidden="true" />
              Download Resume
            </button>
          </div>
          <div className="hero-socials" aria-label="Social links">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a key={label} className="hero-social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="hero-portrait-wrap" delay={260} as="div">
          <div className="hero-portrait">
            <img
              className="hero-portrait-img"
              src={profile.image}
              alt={`${profile.name} — ${profile.role}`}
              width="420"
              height="420"
              loading="eager"
              decoding="async"
            />
            <span className="hero-portrait-ring" aria-hidden="true" />
            <span className="hero-portrait-glow" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;
