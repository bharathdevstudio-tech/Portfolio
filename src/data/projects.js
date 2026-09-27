// Projects data — edit here to update the Work section.
// Thumbnails are fetched live from a screenshot service; if a fetch fails the
// gradient + icon placeholder is shown instead.

const SCREENSHOT = (url) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false` +
  `&viewport.width=1280&viewport.height=720&viewport.deviceScaleFactor=1&embed=screenshot.url`

export const projects = [
  {
    id: 1,
    title: 'Blood Donation Portal',
    description:
      'A full-stack blood donation platform — React + Vite frontend with a Node.js API. Connect donors and seekers with a clean, responsive workflow.',
    tags: ['React', 'Node.js', 'Vite', 'Full-Stack'],
    liveUrl: 'https://blood-donetion.vercel.app',
    githubUrl: 'https://github.com/bharathdevstudio-tech/Blood-Donetion',
    placeholder: { gradient: 'linear-gradient(135deg,#8b5cf6,#e11d48)', icon: 'FaDroplet' },
    category: 'Full-Stack',
  },
  {
    id: 2,
    title: 'ECom-react',
    description:
      'An e-commerce storefront built with React Router + TypeScript — product listing, cart flow and a type-safe component architecture.',
    tags: ['React', 'TypeScript', 'React Router', 'Vite'],
    liveUrl: 'https://e-com-react-vbf5.vercel.app',
    githubUrl: 'https://github.com/bharathdevstudio-tech/ECom-react',
    placeholder: { gradient: 'linear-gradient(135deg,#c084fc,#7c3aed)', icon: 'FaShoppingCart' },
    category: 'Frontend',
  },
  {
    id: 3,
    title: 'Fitness',
    description:
      'A fitness hub in vanilla HTML, CSS and JavaScript — tracking workouts and progress without a single framework dependency.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Vanilla JS'],
    liveUrl: 'https://fitness-gold-two.vercel.app',
    githubUrl: 'https://github.com/bharathdevstudio-tech/fitness',
    placeholder: { gradient: 'linear-gradient(135deg,#38bdf8,#22d3ee)', icon: 'FaHeartPulse' },
    category: 'Frontend',
  },
].map((project) => ({ ...project, screenshot: project.liveUrl ? SCREENSHOT(project.liveUrl) : null }))

// Derive filter options from tags above (no duplicates, logical order).
export const projectFilters = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags)))].filter(Boolean)