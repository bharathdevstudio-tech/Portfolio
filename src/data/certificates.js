// Certificates data — edit here to update the Certificates section.
// pdfUrl points to a local file in /public/certificates (or any hosted link).
// The preview image is the same PDF rendered to PNG (page 1).
// Bump PREVIEW_VERSION whenever a preview PNG is regenerated so browsers,
// which cache by URL, pick up the new image.
const PREVIEW_VERSION = 1

const withPreview = (cert) => ({
  ...cert,
  image: cert.pdfUrl
    ? `${cert.pdfUrl.replace(/\.pdf$/, '.png')}?v=${PREVIEW_VERSION}`
    : null,
})

export const certificates = [
  {
    id: 1,
    title: 'Career Essentials in Generative AI',
    organization: 'Microsoft & LinkedIn',
    date: '2026',
    credentialUrl: 'https://www.linkedin.com/learning/certificates/ai-generative-2026',
    pdfUrl: '/certificates/generative-ai.pdf',
    placeholderPalette: ['#8b5cf6', '#38bdf8'],
  },
  {
    id: 2,
    title: 'Effective Leadership',
    organization: 'HP LIFE \u2013 HP Foundation',
    date: '2026',
    credentialUrl: 'https://www.linkedin.com/learning/certificates/effective-leadership-2026',
    pdfUrl: '/certificates/effective-leadership.pdf',
    placeholderPalette: ['#38bdf8', '#22d3ee'],
  },
  {
    id: 3,
    title: 'Strategic Planning in the AI Age',
    organization: 'HP LIFE \u2013 HP Foundation',
    date: '2026',
    credentialUrl: '',
    pdfUrl: '/certificates/strategic-planning-ai.pdf',
    placeholderPalette: ['#a855f7', '#06b6d4'],
  },
].map(withPreview)