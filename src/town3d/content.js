export const aboutCopy = {
  kicker: 'About',
  title: 'We are Hillfolk',
  lead: 'Creativity from the hills.',
  studio: {
    heading: 'Studio',
    bullets: [
      'A core team of creatives',
      'Backed by a growing team of specialists',
      'From across the North-East',
    ],
    note: 'We don’t believe in one size-fits-all teams. We build the right team for every brief.',
  },
  why: {
    heading: 'Why Hillfolk?',
    pull: 'Because where you look from changes what you see.',
  },
  tag: 'Creativity, from the hills.',
}

export const servicesCopy = {
  kicker: 'Services',
  title: 'What we do',
  lead: 'Strategy, story, craft, and growth — built around the brief.',
  pillars: [
    { title: 'Brand Strategy', text: 'Identity. Naming. Positioning.' },
    { title: 'Creative Campaign', text: 'Ideas. Concepts. Design.' },
    { title: 'Content & Production', text: 'Film. Photography. Copy. Social. Editorials.' },
    { title: 'Digital & Growth', text: 'Web. SEO. Performance. Socials. Analytics.' },
    { title: 'Experiences', text: 'Activations. Events. Brand Experiences.' },
  ],
}

export const cafeCopy = {
  kicker: 'Hill Café',
  title: 'Fresh air & honest conversation',
  lead: 'Good ideas. Better brands.',
  quote:
    'Great ideas aren’t found in boardrooms. They are found in fresh air, honest conversations and the freedom to imagine.',
}

export const contactCopy = {
  kicker: 'Contact',
  title: 'Come up to the Hills.',
  lead: 'The perspective is different here.',
  contacts: [
    { kind: 'Email', value: 'hello@hillfolkinc.com', href: 'mailto:hello@hillfolkinc.com' },
    { kind: 'Phone', value: '+91 00000 00000', href: 'tel:+910000000000' },
    { kind: 'Web', value: 'www.hillfolkinc.com', href: 'https://www.hillfolkinc.com' },
  ],
}

export const places = [
  {
    id: 'about',
    label: 'About Us',
    blurb: 'Who we are, how we work, and why the hills.',
    position: [-3.4, 0, -2.6],
    size: [3.2, 3.4, 3.0],
    color: '#6b8f71',
    roof: '#3d4f3a',
    accent: '#e85d2c',
    enterable: true,
    radius: 3.8,
    kind: 'studio',
  },
  {
    id: 'services',
    label: 'Our Services',
    blurb: 'Strategy, story, craft, and growth.',
    position: [3.6, 0, -2.2],
    size: [3.8, 3.6, 3.4],
    color: '#8a7355',
    roof: '#5c4a38',
    accent: '#c9a66b',
    enterable: true,
    radius: 4.0,
    kind: 'billboard',
  },
  {
    id: 'cafe',
    label: 'Hill Café',
    blurb: 'Fresh air and honest conversation.',
    position: [-6.6, 0, 2.0],
    size: [3.2, 2.8, 3.0],
    color: '#c4a574',
    roof: '#7a5c3a',
    accent: '#d4783a',
    enterable: true,
    radius: 3.6,
    kind: 'cafe',
  },
  {
    id: 'contact',
    label: 'Contact Us',
    blurb: 'Come up to the hills. Say hello.',
    position: [6.4, 0, 2.4],
    size: [3.4, 3.2, 3.2],
    color: '#7d8b99',
    roof: '#3f4a55',
    accent: '#4f6f56',
    enterable: true,
    radius: 3.7,
    kind: 'post',
  },
]

export const buildings = places
