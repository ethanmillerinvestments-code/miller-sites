import {
  fieldformOutdoorLivingDetail,
  northlineClimateDetail,
  summitShieldRoofingPortfolioDetail,
  summitShieldRoofingDetail,
} from "@/lib/client-product-details";

export type ClientProductStyle = "industrial" | "storm" | "garden";

export type ClientProductStat = {
  label: string;
  value: string;
};

export type ClientProductModule = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

export type ClientProductPageAngle = {
  title: string;
  angle: string;
};

export type ClientProductInsertion = {
  title: string;
  summary: string;
  bullets: string[];
  ctaLabel: string;
};

export type ClientProductGalleryCategory = {
  id: string;
  label: string;
  description: string;
};

export type ClientProductGalleryItem = {
  id: string;
  categoryId: string;
  eyebrow: string;
  title: string;
  description: string;
  mediaLabel: string;
  layout: "wide" | "portrait" | "square";
  tone: "sage" | "sandstone" | "bark" | "clay" | "charcoal";
};

export type ClientProductSpotlight = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  stats: ClientProductStat[];
  note: string;
};

export type ClientProductTrustPlaceholder = {
  label: string;
  title: string;
  description: string;
  note: string;
};

export type ClientProductFaq = {
  question: string;
  answer: string;
};

export type ClientProductDetail = {
  disclaimer: string;
  heroStats: ClientProductStat[];
  northline?: {
    conceptLabel: string;
    hero: {
      eyebrow: string;
      headline: string;
      body: string;
      actions: Array<{
        label: string;
        href: string;
      }>;
      supportNote: string;
      markers: string[];
    };
    launchNote: string;
    scenarioSelector: Array<{
      label: string;
      title: string;
      summary: string;
    }>;
    serviceLanes: Array<{
      label: string;
      title: string;
      description: string;
      bullets: string[];
    }>;
    emergencyModule: {
      eyebrow: string;
      title: string;
      body: string;
      bullets: string[];
      supportText: string;
    };
    financingModule: {
      eyebrow: string;
      title: string;
      body: string;
      confidencePoints: string[];
      placeholder: string;
    };
    trustPlaceholders: Array<{
      title: string;
      detail: string;
    }>;
    coverageModule: {
      eyebrow: string;
      title: string;
      body: string;
      zones: Array<{
        label: string;
        title: string;
        detail: string;
      }>;
      note: string;
    };
    deepDive: {
      eyebrow: string;
      title: string;
      summary: string;
      symptoms: string[];
      process: string[];
      note: string;
    };
    faqs: ClientProductFaq[];
    finalCta: {
      title: string;
      body: string;
      primary: {
        label: string;
        href: string;
      };
      secondary: {
        label: string;
        href: string;
      };
      footnote: string;
    };
  };
  gallery: {
    title: string;
    summary: string;
    note: string;
    categories: ClientProductGalleryCategory[];
    items: ClientProductGalleryItem[];
  };
  categoryModules: ClientProductModule[];
  spotlight: ClientProductSpotlight;
  process: {
    title: string;
    summary: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  seasonalServices: {
    title: string;
    summary: string;
    services: Array<{
      season: string;
      title: string;
      description: string;
    }>;
  };
  trustPlaceholders: {
    title: string;
    summary: string;
    items: ClientProductTrustPlaceholder[];
  };
  faq: ClientProductFaq[];
  finalCta: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    secondaryExternal?: boolean;
    footnote?: string;
  };
};

export type ClientProduct = {
  slug: string;
  company: string;
  title: string;
  industry: string;
  conceptBadge: string;
  style: ClientProductStyle;
  positioning: string;
  summary: string;
  atmosphere: string;
  palette: string[];
  theme: {
    accent: string;
    secondary: string;
    glow: string;
    panel: string;
    outline: string;
    pageFrom: string;
    pageTo: string;
    pageGlow: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  designFocus: Array<{
    label: string;
    value: string;
  }>;
  portfolioBullets: string[];
  modules: Array<{
    title: string;
    description: string;
  }>;
  pages: ClientProductPageAngle[];
  insertion: ClientProductInsertion;
  detail: ClientProductDetail;
};

export const clientProducts: ClientProduct[] = [
  {
    slug: "northline-climate",
    company: "Northline Climate Co.",
    title: "Emergency-Ready HVAC Conversion Site",
    industry: "HVAC",
    conceptBadge: "Concept Build",
    style: "industrial",
    positioning:
      "Built for local HVAC operators who need sharper emergency response positioning, stronger financing flow, and cleaner mobile CTA routing.",
    summary:
      "An industrial-premium HVAC concept with an urgent call path, seasonal service switching, and trust sections shaped for high-intent repair and install traffic.",
    atmosphere:
      "Midnight mechanical palette, blueprint undertones, and a calm-under-pressure hierarchy that feels engineered instead of templated.",
    palette: ["#dca86d", "#78b6b2", "#0c1220"],
    theme: {
      accent: "#dca86d",
      secondary: "#78b6b2",
      glow: "rgba(220, 168, 109, 0.26)",
      panel: "rgba(11, 17, 30, 0.84)",
      outline: "rgba(220, 168, 109, 0.28)",
      pageFrom: "#081018",
      pageTo: "#151014",
      pageGlow: "rgba(120, 182, 178, 0.14)",
    },
    hero: {
      eyebrow: "HVAC Concept Product",
      headline: "A service-first site system for urgent HVAC calls and cleaner install leads.",
      body:
        "This fictional production concept is designed for companies that need to look sharper on mobile, route emergency demand faster, and present repairs, installs, financing, and maintenance without turning the homepage into a wall of clutter.",
    },
    designFocus: [
      { label: "Decision flow", value: "Repair vs install vs maintenance" },
      { label: "Trust lane", value: "Emergency service, financing, proof placeholders" },
      { label: "Mobile behavior", value: "Sticky call and quote actions above the fold" },
    ],
    portfolioBullets: [
      "Shows how Leadcraft handles urgent-call CTA structure without making the site feel chaotic.",
      "Demonstrates category separation between repairs, installs, financing, and service plans.",
      "Gives the portfolio a sharper, more engineered visual language than a generic contractor demo.",
    ],
    modules: [
      {
        title: "Seasonal service split",
        description:
          "The homepage pivots heating and cooling offers without burying the urgent request path.",
      },
      {
        title: "Emergency routing",
        description:
          "A fixed mobile action lane keeps call and request-service choices visible without overwhelming the layout.",
      },
      {
        title: "Install and financing clarity",
        description:
          "Higher-ticket replacement work gets a calmer presentation with stronger framing around financing and long-term value.",
      },
    ],
    pages: [
      {
        title: "Homepage",
        angle: "Emergency-ready trust stack with fast call routing and clear category branching.",
      },
      {
        title: "AC Repair page",
        angle: "High-intent landing page built for fast contact and trust repair on mobile.",
      },
      {
        title: "Maintenance plan teaser",
        angle: "Soft upsell path that supports retention without hijacking the core lead flow.",
      },
    ],
    insertion: {
      title: "Northline Climate Co. concept",
      summary:
        "A fictional HVAC production concept showing urgent-call structure, sharper mobile trust, and financing-ready install positioning.",
      bullets: [
        "Routes emergency repair buyers toward the right next step faster",
        "Separates install shoppers from breakdown traffic on the first screen",
        "Keeps maintenance and IAQ interest secondary to core lead capture",
      ],
      ctaLabel: "View HVAC Concept",
    },
    detail: northlineClimateDetail,
  },
  {
    slug: "summit-shield-roofing",
    company: "Summit Shield Roofing",
    title: "Storm-Response Roofing Authority Site",
    industry: "Roofing",
    conceptBadge: "Concept Build",
    style: "storm",
    positioning:
      "Built for roofing companies that need stronger inspection booking, better insurance-conversation framing, and a more premium high-ticket presence.",
    summary:
      "A storm-response roofing concept with angular structure, inspection-led CTA flow, and a more authoritative way to present restoration, replacement, and exterior work.",
    atmosphere:
      "Charcoal, bone, and safety-amber tones with editorial contrast and sharp geometry that feels high-ticket rather than generic.",
    palette: ["#f0b35d", "#d7d3cb", "#111318"],
    theme: {
      accent: "#f0b35d",
      secondary: "#d7d3cb",
      glow: "rgba(240, 179, 93, 0.24)",
      panel: "rgba(17, 19, 24, 0.86)",
      outline: "rgba(240, 179, 93, 0.3)",
      pageFrom: "#0c0e14",
      pageTo: "#1a1310",
      pageGlow: "rgba(215, 211, 203, 0.08)",
    },
    hero: {
      eyebrow: "Roofing Concept Product",
      headline: "A high-ticket roofing site built around inspection requests and storm-response trust.",
      body:
        "This fictional production concept is designed for local roofers who need to look established fast, separate inspections from replacements, and handle insurance-related conversations with more authority and less clutter.",
    },
    designFocus: [
      { label: "Decision flow", value: "Inspection first, replacement second" },
      { label: "Trust lane", value: "Warranty and credential placeholders, not fake proof" },
      { label: "Sales tone", value: "Premium, decisive, storm-ready" },
    ],
    portfolioBullets: [
      "Adds a more assertive, high-ticket category to the agency’s concept portfolio.",
      "Shows how Leadcraft can frame insurance-adjacent buyer questions without spammy copy.",
      "Creates a strong before-and-after visual language without inventing case-study metrics.",
    ],
    modules: [
      {
        title: "Inspection-first CTA path",
        description:
          "The layout pushes estimate and inspection intent into a cleaner request path before replacement details deepen.",
      },
      {
        title: "Storm and insurance framing",
        description:
          "A process timeline makes claim-related questions easier to understand without making fake promises.",
      },
      {
        title: "Exterior project structure",
        description:
          "Roofing, gutters, and siding fit under one stronger authority system instead of one vague service page.",
      },
    ],
    pages: [
      {
        title: "Homepage",
        angle: "Authority-led home page with inspection path, storm cues, and premium geometry.",
      },
      {
        title: "Storm Damage Inspection page",
        angle: "Dedicated landing concept for inspections, claim questions, and fast contact.",
      },
      {
        title: "Project gallery block",
        angle: "Visually stronger project framing without fake performance numbers.",
      },
    ],
    insertion: {
      title: "Summit Shield Roofing concept",
      summary:
        "A fictional roofing production concept centered on inspection bookings, trust, and high-ticket clarity.",
      bullets: [
        "Built around storm-response lead flow",
        "Premium layout for high-ticket offers",
        "Better inspection and replacement separation",
      ],
      ctaLabel: "View Roofing Concept",
    },
    detail: summitShieldRoofingPortfolioDetail,
  },
  {
    slug: "fieldform-outdoor-living",
    company: "Fieldform Outdoor Living",
    title: "Premium Landscaping and Outdoor Living Site",
    industry: "Landscaping / Outdoor Living",
    conceptBadge: "Concept Build",
    style: "garden",
    positioning:
      "Built for landscaping teams that need a more aspirational visual presentation without losing quote clarity or project-scope control.",
    summary:
      "A premium outdoor-living concept with gallery-led storytelling, category filtering, and a calmer quote path for design, hardscape, and seasonal service conversations.",
    atmosphere:
      "Editorial, tactile, and organic, with sandstone, sage, bark, and warm charcoal accents that feel more like a design studio than a lawn-service template.",
    palette: ["#bac39b", "#d8b58a", "#232018"],
    theme: {
      accent: "#bac39b",
      secondary: "#d8b58a",
      glow: "rgba(186, 195, 155, 0.24)",
      panel: "rgba(22, 23, 17, 0.8)",
      outline: "rgba(186, 195, 155, 0.28)",
      pageFrom: "#11140f",
      pageTo: "#201a15",
      pageGlow: "rgba(216, 181, 138, 0.12)",
    },
    hero: {
      eyebrow: "Landscape Concept Product",
      headline: "A gallery-led local service site that still keeps the quote path disciplined.",
      body:
        "This fictional production concept is designed for outdoor-living and landscaping companies that need to look more premium, show more project range, and turn visual interest into real quote requests without falling into generic green-brand clichés.",
    },
    designFocus: [
      { label: "Decision flow", value: "Design, build, maintain, and quote" },
      { label: "Trust lane", value: "Process clarity, planning, and craftsmanship placeholders" },
      { label: "Visual rhythm", value: "Gallery-forward but still CTA-aware" },
    ],
    portfolioBullets: [
      "Broadens the Leadcraft portfolio with a more aspirational and editorial service category.",
      "Shows how visually driven industries can stay conversion-focused without looking cheap.",
      "Gives the site a softer, more premium contrast to the HVAC and roofing concepts.",
    ],
    modules: [
      {
        title: "Gallery-led homepage",
        description:
          "Project imagery and category chips lead the story, but the quote path stays visible and disciplined.",
      },
      {
        title: "Category-specific storytelling",
        description:
          "Outdoor living, planting, hardscape, and seasonal maintenance each get a cleaner visual role.",
      },
      {
        title: "Planning-focused trust",
        description:
          "The site frames communication, materials, and process as the trust system instead of fake luxury claims.",
      },
    ],
    pages: [
      {
        title: "Homepage",
        angle: "Editorial hero, project category rhythm, and a premium but approachable CTA path.",
      },
      {
        title: "Outdoor living page",
        angle: "A project-category concept with planning cues, gallery flow, and a scoped quote prompt.",
      },
      {
        title: "Gallery filter module",
        angle: "A portfolio-friendly browsing pattern with soft motion and clearer project categorization.",
      },
    ],
    insertion: {
      title: "Fieldform Outdoor Living",
      summary:
        "Fictional production concept for a premium landscaping and outdoor-living company with an editorial visual system and a cleaner quote path.",
      bullets: [
        "Builds visual trust through calmer hierarchy and clearer planning cues",
        "Frames project quality with category depth instead of fake luxury claims",
        "Keeps request-quote and consultation actions visible without clutter",
      ],
      ctaLabel: "View Fieldform Concept",
    },
    detail: fieldformOutdoorLivingDetail,
  },
];

export function getClientProduct(slug: string) {
  return clientProducts.find((product) => product.slug === slug);
}

export function getClientProductSlugs() {
  return clientProducts.map((product) => product.slug);
}

export function getFeaturedClientProducts() {
  const homeOrder = [
    "fieldform-outdoor-living",
    "northline-climate",
    "summit-shield-roofing",
  ];

  return homeOrder
    .map((slug) => clientProducts.find((product) => product.slug === slug))
    .filter((product): product is ClientProduct => Boolean(product));
}

export function getFeaturedClientProduct() {
  return getFeaturedClientProducts()[0] ?? clientProducts[0];
}

export { summitShieldRoofingDetail };
