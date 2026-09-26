// Projects data — edit here to update the Work section.
// Real shipped projects, matching the live site. Gradient + icon act as thumbnails.

export const projects = [
  {
    id: 1,
    title: 'Blood Donation Portal',
    description:
      'A full-stack blood donation platform \u2014 React + Vite frontend with a Node.js API. Connect donors and seekers with a clean, responsive workflow.',
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
      'An e-commerce storefront built with React Router + TypeScript \u2014 product listing, cart flow and a type-safe component architecture.',
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
      'A fitness hub in vanilla HTML, CSS and JavaScript \u2014 tracking workouts and progress without a single framework dependency.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Vanilla JS'],
    liveUrl: 'https://fitness-gold-two.vercel.app',
    githubUrl: 'https://github.com/bharathdevstudio-tech/fitness',
    placeholder: { gradient: 'linear-gradient(135deg,#38bdf8,#22d3ee)', icon: 'FaHeartPulse' },
    category: 'Frontend',
  },
]

// Derive filter options from tags above (no duplicates, logical order).
export const projectFilters = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags)))].filter(Boolean)