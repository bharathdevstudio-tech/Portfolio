import { useEffect, useState } from 'react'
import PageLoader from './components/PageLoader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Backdrop from './components/Fx/Backdrop'
import Scanlines from './components/Fx/Scanlines'
import Spotlight from './components/Fx/Spotlight'
import CommandPalette from './components/Fx/CommandPalette'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show the loader until the initial paint has settled.
    // No artificial delays: exit as soon as the page is ready.
    let done = false
    const finish = () => {
      if (done) return
      done = true
      // One rAF to let the first paint occur, then fade out.
      requestAnimationFrame(() => setLoading(false))
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
    }
    // Safety fallback (avoid dead frames on slow connectivity):
    const timer = setTimeout(finish, 600)
    return () => {
      window.removeEventListener('load', finish)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <PageLoader loading={loading} />

      <Backdrop />
      <Spotlight />
      <Scanlines />

      <CommandPalette />

      <div className="site" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Certificates />
          <Experience />
          <Contact />
        </main>

        <Footer />
      </div>

      <ScrollProgress />
    </>
  )
}

export default App