/**
 * Hotspots for hero-fg (4096×1600). Tuned on 1024×400 layout.
 */
export const VIEW = { w: 4096, h: 1600 };

const SX = 4096 / 1024;
const SY = 1600 / 400;

function circ(cx, cy, r) {
  return {
    cx: Math.round(cx * SX),
    cy: Math.round(cy * SY),
    r: Math.round(r * ((SX + SY) / 2)),
  };
}

export const spots = [
  {
    id: "services",
    label: "Our Services",
    href: "services",
    ...circ(308, 198, 70),
  },
  {
    id: "cafe",
    label: "Hill Café",
    href: "cafe",
    optional: true,
    ...circ(100, 300, 95),
  },
  {
    id: "contact",
    label: "Contact Us",
    href: "contact",
    ...circ(720, 410, 88),
  },
  {
    id: "about",
    label: "About Us",
    href: "about",
    ...circ(512, 88, 72),
  },
];

/** Copy from Hillfolk Inc. 10-slide deck */
export const placeholders = {
  services: {
    eyebrow: "Services",
    title: "What we do",
    lead: "Built around what each brief actually needs.",
    layout: "services",
    services: [
      { title: "Brand Strategy", items: "Identity. Naming. Positioning." },
      { title: "Creative Campaign", items: "Ideas. Concepts. Design." },
      {
        title: "Content and Production",
        items: "Film. Photography. Copy. Social Content. Editorials.",
      },
      {
        title: "Digital and Growth",
        items: "Web. SEO. Performance Ads. Socials. Analytics.",
      },
      {
        title: "Experiences",
        items: "Activations. Events. Brand Experiences.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Come up to the Hills.",
    lead: "The perspective is different here.",
    layout: "contact",
    contacts: [
      {
        label: "Email",
        value: "hello@hillfolkinc.com",
        href: "mailto:hello@hillfolkinc.com",
      },
      { label: "Phone", value: "+91 00000 00000", href: "tel:+910000000000" },
      {
        label: "Web",
        value: "www.hillfolkinc.com",
        href: "https://www.hillfolkinc.com",
      },
    ],
  },
  cafe: {
    eyebrow: "Hill Café",
    title: "Great ideas aren’t found in boardrooms.",
    lead: "They are found in fresh air, honest conversations and the freedom to imagine.",
    layout: "cafe",
  },
};
