import type { ClientProductDetail } from "@/lib/client-products";

export const northlineClimateDetail: ClientProductDetail = {
  disclaimer:
    "Fictional production concept for the Leadcraft portfolio. Replace phone routing, service-area data, review proof, certifications, and financing details with approved client materials before any live use.",
  heroStats: [
    { label: "Primary path", value: "Call now and request service" },
    { label: "Buyer split", value: "Repair, replace, maintain" },
    { label: "Proof policy", value: "Placeholder only until approved" },
  ],
  northline: {
    conceptLabel: "Fictional Production Concept",
    hero: {
      eyebrow: "Northline Climate Co.",
      headline:
        "Emergency repairs, system replacements, and maintenance routed with clarity before the homeowner starts hunting for reassurance.",
      body:
        "This concept is built for urgent repair buyers, install comparison shoppers, and homeowners judging trust in seconds on mobile. The first screen keeps the call path obvious, the service request path clean, and the estimate lane calm enough to support higher-ticket replacements.",
      actions: [
        { label: "Call Now", href: "#call-lane" },
        { label: "Request Service", href: "#request-service" },
        { label: "Request Estimate", href: "#estimate-lane" },
      ],
      supportNote:
        "Concept Build only. Replace the phone number, request flow, dispatch promises, coverage claims, and financing disclosures with approved client details before any live use.",
      markers: [
        "Urgent repair buyers see the next step immediately.",
        "Install shoppers get a calmer estimate lane.",
        "Maintenance and IAQ stay secondary until core intent is clear.",
      ],
    },
    launchNote:
      "Northline is presented as a fictional premium local HVAC operator. The structure is built to feel real, but every proof lane stays placeholder-only until a real business approves the details.",
    scenarioSelector: [
      {
        label: "Urgent Repair",
        title: "The house is not cooling or heating right now.",
        summary:
          "Lead with the call lane, keep symptoms visible, and reduce friction before the homeowner compares three other sites.",
      },
      {
        label: "System Replacement",
        title: "The current system is aging and the buyer is comparison shopping.",
        summary:
          "Slow the page down slightly, frame estimate confidence, and make financing feel like support instead of pressure.",
      },
      {
        label: "Maintenance Plan",
        title: "The buyer is not in breakdown mode but still wants a cleaner next step.",
        summary:
          "Show membership and IAQ after the main repair and install routes are already clear.",
      },
    ],
    serviceLanes: [
      {
        label: "Repairs",
        title: "AC and furnace repair stay direct.",
        description:
          "The repair lane is written for homeowners who need an answer fast. It emphasizes clear symptoms, calm dispatch framing, and obvious contact paths.",
        bullets: [
          "Call-first hierarchy for urgent breakdown traffic",
          "Symptom framing for no-cool and no-heat calls",
          "Service request flow that does not bury the next step",
        ],
      },
      {
        label: "Installs",
        title: "Replacement and estimate decisions get breathing room.",
        description:
          "Install shoppers need confidence, not panic language. The concept separates replacement planning from breakdown messaging so the estimate lane feels more credible.",
        bullets: [
          "Estimate request separated from emergency routing",
          "Financing introduced as support, not bait",
          "System replacement positioned as a planning decision",
        ],
      },
      {
        label: "Maintenance",
        title: "Membership and IAQ support retention without hijacking the page.",
        description:
          "Maintenance plans and indoor air quality remain visible as secondary offers, but they do not compete with repair urgency or replacement intent.",
        bullets: [
          "Membership interest kept secondary to core conversions",
          "Indoor air quality framed as an upsell, not the headline",
          "Cleaner homepage hierarchy during high-intent visits",
        ],
      },
    ],
    emergencyModule: {
      eyebrow: "Emergency Response",
      title: "The emergency lane feels controlled, not theatrical.",
      body:
        "Urgent HVAC buyers are already under pressure. The concept keeps the language serious and operational: call now, request service, explain the issue, and move toward the right dispatch or scheduling step.",
      bullets: [
        "Call and request-service actions stay visible on mobile",
        "Repair urgency is acknowledged without fake response-time claims",
        "After-hours framing stays placeholder-only until approved",
      ],
      supportText:
        "Replace this module with the real dispatch window, service radius, after-hours rules, and phone routing once the operator approves the exact process.",
    },
    financingModule: {
      eyebrow: "Install Confidence",
      title: "Replacement buyers need confidence, scope clarity, and honest financing language.",
      body:
        "Northline’s install lane is intentionally calmer. It gives estimate-ready homeowners a steadier path to compare options, ask about financing, and understand replacement planning without mixing that conversation into the emergency lane.",
      confidencePoints: [
        "Estimate requests stay distinct from same-day repair traffic",
        "Financing interest is acknowledged without sample payment claims",
        "System replacement is framed as a long-term decision, not a scare tactic",
      ],
      placeholder:
        "Add actual financing partner details, disclosures, and approved lender language here.",
    },
    trustPlaceholders: [
      {
        title: "Insert approved review proof here",
        detail:
          "Use verified reviews or approved screenshots only after the real client signs off on exact proof placement.",
      },
      {
        title: "Replace with real certifications",
        detail:
          "EPA, manufacturer, or local licensing credentials belong here only when the exact approved badges and numbers are confirmed.",
      },
      {
        title: "Add actual financing partner details",
        detail:
          "Do not imply lenders, terms, payment examples, or special offers until the business approves the exact language.",
      },
    ],
    coverageModule: {
      eyebrow: "Coverage",
      title: "Service-area language stays useful without pretending the map is already approved.",
      body:
        "Coverage should answer a practical question quickly: do you serve my area, and how does emergency or replacement scheduling change outside the core zone?",
      zones: [
        {
          label: "Core Area",
          title: "Primary service footprint",
          detail:
            "Use this card for the real city and nearby neighborhoods once approved service-area language is available.",
        },
        {
          label: "Extended Reach",
          title: "Estimate and replacement overflow",
          detail:
            "A quieter lane for installs or non-emergency service outside the core zone.",
        },
        {
          label: "After Hours",
          title: "Emergency routing note",
          detail:
            "Reserve for real after-hours or weekend policy details instead of implying 24/7 coverage.",
        },
      ],
      note:
        "Every coverage claim on a real deployment should map to the actual dispatch policy, not a marketing guess.",
    },
    deepDive: {
      eyebrow: "AC Repair Detail",
      title: "AC repair copy should help a homeowner decide, not just repeat the service name.",
      summary:
        "This section demonstrates how Northline could handle a dedicated AC repair page: symptom-aware, mobile-first, and direct about the next action without fake diagnostics or made-up promises.",
      symptoms: [
        "Warm air at the vents even though the system is running",
        "Short cycling, frozen lines, or weak airflow during heavy heat",
        "Loud startup, unexplained shutdowns, or rising comfort complaints",
      ],
      process: [
        "Confirm the symptom and whether the issue feels urgent",
        "Route the homeowner toward a call or service request without forcing a full read",
        "Use approved proof, real service-area details, and real repair process language in the live build",
      ],
      note:
        "No fake same-day guarantee, no invented parts inventory claim, and no fake review quote should appear here.",
    },
    faqs: [
      {
        question: "Is Northline Climate Co. a real HVAC company?",
        answer:
          "No. This route is a fictional production concept built inside the Leadcraft portfolio. It is intentionally labeled as a Concept Build and Fictional Production Concept throughout.",
      },
      {
        question: "Why split repairs, installs, and maintenance so early?",
        answer:
          "Because the buyer mindset is different in each case. Urgent repair traffic needs immediate direction, while replacement shoppers need calmer comparison framing and clearer estimate language.",
      },
      {
        question: "Why are the trust blocks placeholders?",
        answer:
          "Because real reviews, certifications, financing partners, and service-area claims must be approved. The concept shows placement and hierarchy without inventing proof.",
      },
      {
        question: "Why keep the mobile CTA so strong?",
        answer:
          "Most urgent HVAC buyers are deciding quickly on a phone. The concept keeps call and request-service actions visible without letting the page collapse into noise.",
      },
    ],
    finalCta: {
      title: "The concept ends with a decisive request path, not vague contractor filler.",
      body:
        "Northline Climate Co. is designed to show how a premium local HVAC company could present emergency repair, replacement planning, maintenance plans, and trust placeholders in one coherent system.",
      primary: {
        label: "Return To Call Lane",
        href: "#call-lane",
      },
      secondary: {
        label: "Jump To Request Service",
        href: "#request-service",
      },
      footnote:
        "All proof, certifications, lender information, and coverage claims remain fictional placeholders until replaced with approved business material.",
    },
  },
  gallery: {
    title: "An HVAC visual system built around urgency, confidence, and clean mobile structure.",
    summary:
      "The concept gallery shows how repair urgency, replacement clarity, and membership positioning can live in one system without turning into a generic contractor collage.",
    note:
      "Concept-only visual placeholders. Replace with approved photography, team proof, and real service imagery before launch.",
    categories: [
      {
        id: "all",
        label: "All views",
        description: "Browse the full HVAC concept mix across repair, install, and membership sections.",
      },
      {
        id: "repair",
        label: "Repair",
        description: "No-cool and no-heat call flow, symptom framing, and urgent CTA structure.",
      },
      {
        id: "install",
        label: "Install",
        description: "Calmer replacement, estimate, and financing-ready presentation.",
      },
      {
        id: "maintenance",
        label: "Maintenance",
        description: "Plan interest and retention-oriented framing without homepage clutter.",
      },
    ],
    items: [
      {
        id: "northline-1",
        categoryId: "repair",
        eyebrow: "Emergency lane",
        title: "Call-first mobile hero",
        description:
          "A hero composition designed to route urgent homeowners toward the next step in seconds.",
        mediaLabel: "Concept frame",
        layout: "wide",
        tone: "sandstone",
      },
      {
        id: "northline-2",
        categoryId: "install",
        eyebrow: "Install confidence",
        title: "Replacement and financing rail",
        description:
          "A cleaner presentation for estimate-ready buyers who need confidence more than copy volume.",
        mediaLabel: "Module",
        layout: "portrait",
        tone: "charcoal",
      },
      {
        id: "northline-3",
        categoryId: "maintenance",
        eyebrow: "Retention path",
        title: "Membership teaser and IAQ upsell",
        description:
          "Secondary offers held in reserve so the main repair and install lanes stay dominant.",
        mediaLabel: "Teaser",
        layout: "square",
        tone: "clay",
      },
    ],
  },
  categoryModules: [
    {
      eyebrow: "Repair",
      title: "Repair pages stay urgent and direct.",
      description:
        "AC repair and furnace repair are treated as clear first-intent paths, with symptom framing and visible service CTAs.",
      points: [
        "Urgent service CTA visible above the fold",
        "Symptom-based framing for no-cool and no-heat calls",
        "Proof slots reserved for real reviews and credentials only",
      ],
    },
    {
      eyebrow: "Install",
      title: "Replacement gets a calmer lane.",
      description:
        "System replacement and estimate requests get separated from urgent repair traffic so higher-ticket work feels more credible.",
      points: [
        "Estimate path separated from emergency call flow",
        "Financing framed as support, not pressure",
        "System-fit discussion held in a quieter visual lane",
      ],
    },
    {
      eyebrow: "Maintenance",
      title: "Plan interest stays secondary.",
      description:
        "Maintenance plans and indoor air quality stay visible but never compete with the main repair and install journey.",
      points: [
        "Membership framing for retention and repeat business",
        "Indoor air quality positioned as a secondary upsell",
        "Homepage hierarchy preserved under pressure",
      ],
    },
  ],
  spotlight: {
    eyebrow: "Hero Focus",
    title: "The hero has to look engineered, not overloaded.",
    description:
      "Northline’s visual system uses blueprint grid texture, brass heat, off-white type, and clear service lanes to feel sharp without feeling loud.",
    bullets: [
      "Asymmetrical hero with a call-first hierarchy",
      "Mechanical display typography with cleaner body copy",
      "Restrained motion instead of gimmicky floating effects",
    ],
    stats: [
      { label: "Style", value: "Industrial-premium" },
      { label: "CTA logic", value: "Urgent first, install second" },
      { label: "Mobile bias", value: "Phone-screen clarity first" },
    ],
    note:
      "This concept intentionally avoids fake response-time claims, fake financing offers, and fake local proof.",
  },
  process: {
    title: "Three moves from first impression to request.",
    summary:
      "The process is simple: route the urgency, clarify the category, and then move the homeowner toward the right request path.",
    steps: [
      {
        title: "Route the immediate need",
        description:
          "Make the call path and request-service action obvious before the homeowner starts comparing details.",
      },
      {
        title: "Split the buyer type",
        description:
          "Repair, replacement, and membership buyers get different language because they arrive with different urgency levels.",
      },
      {
        title: "Reserve proof for what is real",
        description:
          "Reviews, certifications, financing partner details, and coverage claims are held until they are verified.",
      },
    ],
  },
  seasonalServices: {
    title: "Secondary services support the main lead flow instead of competing with it.",
    summary:
      "The concept keeps maintenance and IAQ offers present, but they stay behind urgent repairs and higher-ticket replacement routes.",
    services: [
      {
        season: "All year",
        title: "Maintenance plans",
        description:
          "Membership framing built for retention and repeat business without hijacking emergency or estimate traffic.",
      },
      {
        season: "Summer / winter",
        title: "Indoor air quality",
        description:
          "A secondary comfort upgrade lane that can be layered in once the primary service need is clear.",
      },
      {
        season: "Shoulder season",
        title: "System tune-up messaging",
        description:
          "Soft demand support for homeowners who are not in immediate breakdown mode.",
      },
    ],
  },
  trustPlaceholders: {
    title: "Trust placeholders",
    summary:
      "Every trust block is clearly labeled so the concept feels honest while still showing where real proof would live in a production deployment.",
    items: [
      {
        label: "Proof",
        title: "Insert approved review proof here",
        description:
          "Use verified reviews or approved screenshots only after the client confirms exact proof placement.",
        note: "No fake star ratings, counts, or fabricated customer quotes.",
      },
      {
        label: "Credentials",
        title: "Replace with real certifications",
        description:
          "EPA, manufacturer, or local licensing badges should only appear once the exact approved credentials are confirmed.",
        note: "No implied certifications or badges that the client has not approved.",
      },
      {
        label: "Financing",
        title: "Add actual financing partner details",
        description:
          "Lender names, payment examples, and term disclosures belong here only when the real partner and language are approved.",
        note: "No sample monthly payments or partner claims without real disclosures.",
      },
    ],
  },
  faq: [
    {
      question: "Is Northline Climate Co. a real client?",
      answer:
        "No. This page is a fictional production concept built for the Leadcraft portfolio. It exists to show design, structure, and CTA strategy for a premium HVAC site.",
    },
    {
      question: "Why keep the emergency CTA so prominent?",
      answer:
        "Urgent repair buyers decide quickly, especially on mobile. The concept keeps the call path visible without making the page feel chaotic.",
    },
    {
      question: "Why separate repairs, installs, and maintenance so early?",
      answer:
        "Those buyers arrive with different urgency levels and trust questions. Splitting them early reduces friction and makes the next step clearer.",
    },
    {
      question: "Why are the proof blocks placeholders?",
      answer:
        "Because real proof must be approved. Reviews, certifications, financing partners, and coverage claims should never be invented for a live or portfolio-facing build.",
    },
  ],
  finalCta: {
    eyebrow: "Final CTA",
    title: "A premium HVAC site can feel decisive without sounding exaggerated.",
    body:
      "Northline Climate Co. shows the kind of homepage and service structure Leadcraft would build for a serious local HVAC operator: sharper on mobile, clearer under pressure, and cleaner about what still needs real proof before launch.",
    primaryLabel: "Back To Service Request Flow",
    primaryHref: "#request-service",
    secondaryLabel: "Review Emergency Module",
    secondaryHref: "#call-lane",
  },
};

export const summitShieldRoofingDetail: ClientProductDetail = {
  disclaimer:
    "Fictional production concept for the Leadcraft portfolio. Replace credentials, warranty language, reviews, and service-area claims with approved business proof.",
  heroStats: [
    { label: "Buyer mindset", value: "Storm concern and trust screening" },
    { label: "Primary CTA", value: "Inspection request first" },
    { label: "Proof policy", value: "Placeholder only until approved" },
  ],
  gallery: {
    title: "The gallery strip sells quality without relying on fake numbers.",
    summary:
      "The visual goal is controlled drama: stronger material contrast, cleaner framing, and project-story cues that feel established without pretending there is already a verified case-study library.",
    note:
      "In a real build, this area would be populated with approved job photography, captions, and category filters supplied by the roofing company.",
    categories: [
      {
        id: "all",
        label: "All views",
        description: "Browse inspection, replacement, and storm-response concept frames.",
      },
    ],
    items: [
      {
        id: "summit-1",
        categoryId: "all",
        eyebrow: "Storm-response exterior",
        title: "Before-and-after framing without fake performance claims",
        description:
          "Designed to sell trust through composition, materials, and restraint instead of invented job counts.",
        mediaLabel: "Concept frame",
        layout: "wide",
        tone: "sandstone",
      },
      {
        id: "summit-2",
        categoryId: "all",
        eyebrow: "Inspection sequence",
        title: "Inspection-led storytelling for skeptical homeowners",
        description:
          "A calmer visual progression that explains the path from concern to inspection to decision.",
        mediaLabel: "Module",
        layout: "portrait",
        tone: "charcoal",
      },
      {
        id: "summit-3",
        categoryId: "all",
        eyebrow: "Replacement detail",
        title: "Premium project presentation for higher-ticket work",
        description:
          "Shows where approved imagery and captions would support replacement trust in a real deployment.",
        mediaLabel: "Concept",
        layout: "square",
        tone: "clay",
      },
    ],
  },
  categoryModules: [
    {
      eyebrow: "Inspection first",
      title: "Storm concern is routed into a calmer inspection decision.",
      description:
        "The page answers the immediate homeowner question first: should someone inspect this before I make a bigger replacement decision?",
      points: [
        "Inspection path precedes replacement framing",
        "Insurance language stays restrained and factual",
        "Storm cues feel premium rather than spammy",
      ],
    },
    {
      eyebrow: "Replacement",
      title: "Higher-ticket roofing work gets its own premium structure.",
      description:
        "Replacement framing is separated enough to feel deliberate before the buyer ever requests a call.",
      points: [
        "Material and warranty language reserved for approved proof",
        "Inspection outcome and replacement choice stay distinct",
        "Exterior package work can be grouped without muddying the CTA path",
      ],
    },
  ],
  spotlight: {
    eyebrow: "Authority",
    title: "The concept earns trust through order, not through fake storm claims.",
    description:
      "Summit Shield uses stronger geometry, amber restraint, and inspection-led copy to feel credible without implying fake claim success or fake partnership status.",
    bullets: [
      "Inspection-first CTA for skeptical homeowners",
      "Sharper premium framing for replacement work",
      "Trust placeholders held until the client approves real proof",
    ],
    stats: [
      { label: "Tone", value: "Storm-ready and controlled" },
      { label: "Primary decision", value: "Inspect first" },
      { label: "Proof mode", value: "Placeholder only" },
    ],
    note:
      "The live build would replace every proof placeholder with approved credentials, reviews, warranty terms, and process copy.",
  },
  process: {
    title: "Inspection first. Replacement second.",
    summary:
      "The process creates a calmer sequence from storm concern to inspection to project planning without slipping into fake urgency or fake claim promises.",
    steps: [
      {
        title: "Inspect the damage",
        description:
          "Give the homeowner a credible diagnostic next step before they make a bigger roofing decision.",
      },
      {
        title: "Clarify the scope",
        description:
          "Move from inspection findings into approved project language once the situation is clear.",
      },
      {
        title: "Present the project cleanly",
        description:
          "Replacement and exterior work are framed with enough confidence to support a higher-ticket decision.",
      },
    ],
  },
  seasonalServices: {
    title: "Support services stay visible without overwhelming the inspection path.",
    summary:
      "Gutters, siding, and ancillary exterior work can support the sale, but they should not crowd out the primary inspection CTA.",
    services: [
      {
        season: "Storm season",
        title: "Inspection lane",
        description:
          "The first-intent path for weather damage and fast homeowner questions.",
      },
      {
        season: "All year",
        title: "Replacement planning",
        description:
          "A steadier lane for material, scope, and long-term project fit.",
      },
      {
        season: "Project support",
        title: "Exterior package add-ons",
        description:
          "Secondary services like gutters and siding held within the same authority system.",
      },
    ],
  },
  trustPlaceholders: {
    title: "Trust blocks are clearly marked until real proof exists.",
    summary:
      "This keeps the concept persuasive without crossing into invented claims. The placeholders show where verified business proof would live in a real production build.",
    items: [
      {
        label: "Proof block",
        title: "Insert approved review proof here",
        description:
          "Use for verified review excerpts, screenshots, or a review feed once the business approves exact proof placement.",
        note: "No fake star ratings, inspection counts, or customer quotes.",
      },
      {
        label: "Credentials",
        title: "Replace with real certifications",
        description:
          "Keep certifications, license displays, and manufacturer badges out until the exact credentials are verified.",
        note: "No implied manufacturer status or installer tier without proof.",
      },
      {
        label: "Warranty",
        title: "Add approved warranty language",
        description:
          "Warranty claims should only appear after the business approves exact manufacturer and workmanship terms.",
        note: "No fake lifetime claims or coverage promises.",
      },
      {
        label: "Insurance",
        title: "Use real process language only",
        description:
          "No fake insurance partnerships, guaranteed approvals, or made-up claim outcomes belong in the live build.",
        note: "Keep the tone calm, factual, and operationally true.",
      },
    ],
  },
  faq: [
    {
      question: "Is this a real roofing company page?",
      answer:
        "No. It is a fictional production concept inside the Leadcraft portfolio and is labeled as such throughout the experience.",
    },
    {
      question: "Why does the page lead with inspection instead of replacement?",
      answer:
        "Because skeptical homeowners usually need a calmer diagnostic step first. The concept is built around that trust sequence.",
    },
    {
      question: "Why are proof blocks placeholders?",
      answer:
        "Because approved reviews, credentials, and warranty terms must be real. They should never be invented for a concept or live build.",
    },
  ],
  finalCta: {
    eyebrow: "Final CTA",
    title: "The concept ends with a decisive next-step lane, not generic contact clutter.",
    body:
      "These actions demonstrate the intended roofing CTA hierarchy. If you want this level of authority and clarity for your own company, the real next move is a Leadcraft strategy call.",
    primaryLabel: "Book Inspection",
    primaryHref: "#book-inspection",
    secondaryLabel: "Review Replacement Lane",
    secondaryHref: "#replacement-planning",
  },
};

export const summitShieldRoofingPortfolioDetail = summitShieldRoofingDetail;

export const fieldformOutdoorLivingDetail: ClientProductDetail = {
  disclaimer:
    "Fictional production concept for the Leadcraft portfolio. Replace project photography, certifications, and process proof with approved client assets.",
  heroStats: [
    { label: "Buyer mindset", value: "Aspirational but scope-aware" },
    { label: "Primary CTA", value: "Scoped design inquiry" },
    { label: "Category focus", value: "Outdoor living and hardscape" },
  ],
  gallery: {
    title: "Gallery-led storytelling that still keeps the quote path disciplined.",
    summary:
      "The visual browsing pattern gives a premium outdoor-living business room to show range without letting the site drift into gallery-only browsing.",
    note:
      "Concept-only visuals. Replace with approved project imagery, captions, and category rules.",
    categories: [
      {
        id: "all",
        label: "All concepts",
        description: "Browse the full concept mix across outdoor-living project types.",
      },
      {
        id: "outdoor-living",
        label: "Outdoor living",
        description: "Higher-ticket living areas, patios, and feature-build concepts.",
      },
      {
        id: "hardscape",
        label: "Hardscape",
        description: "Material-forward concepts with a stronger construction tone.",
      },
    ],
    items: [
      {
        id: "fieldform-1",
        categoryId: "outdoor-living",
        tone: "sage",
        layout: "wide",
        eyebrow: "Featured concept",
        mediaLabel: "Render",
        title: "Layered patio and lounge zone",
        description:
          "A broad hero-style visual treatment for premium backyard living concepts.",
      },
      {
        id: "fieldform-2",
        categoryId: "hardscape",
        tone: "sandstone",
        layout: "portrait",
        eyebrow: "Hardscape lane",
        mediaLabel: "Mockup",
        title: "Stone, steps, and retaining detail",
        description:
          "A more material-forward project card for the structured build side of the offer.",
      },
      {
        id: "fieldform-3",
        categoryId: "outdoor-living",
        tone: "clay",
        layout: "square",
        eyebrow: "Quote path",
        mediaLabel: "Concept",
        title: "Scoped inquiry card",
        description:
          "Shows how premium projects can still keep the next step disciplined and clear.",
      },
    ],
  },
  categoryModules: [
    {
      eyebrow: "Visual trust",
      title: "Premium project presentation without fake luxury language.",
      description:
        "The concept uses editorial rhythm, larger imagery, and cleaner card systems to make outdoor-living work feel established.",
      points: [
        "Gallery-forward layout with a visible quote path",
        "Clear project-category hierarchy",
        "Proof held until the client supplies approved materials",
      ],
    },
    {
      eyebrow: "Scope clarity",
      title: "Project range is organized before the inquiry starts.",
      description:
        "Design, build, and maintenance are separated enough that the quote request arrives with better context.",
      points: [
        "Outdoor living, hardscape, and seasonal service split cleanly",
        "Aspirational visuals balanced with serious request language",
        "Future gallery and category expansion stays structured",
      ],
    },
  ],
  spotlight: {
    eyebrow: "Planning",
    title: "Project clarity is the trust system.",
    description:
      "This concept treats communication, planning, and project range as the trust engine instead of fake luxury claims.",
    bullets: [
      "Visual hierarchy that supports scoped quote requests",
      "Category separation between design, build, and maintenance",
      "Placeholder proof only until real client materials exist",
    ],
    stats: [
      { label: "Primary flow", value: "Browse then scope" },
      { label: "Visual mode", value: "Editorial and tactile" },
      { label: "Proof mode", value: "Placeholder only" },
    ],
    note:
      "Replace with approved gallery imagery, process proof, and service-area language in a real build.",
  },
  process: {
    title: "A calmer project path from first browse to scoped inquiry.",
    summary:
      "The process treatment keeps project quality central while still making the quote path obvious and serious.",
    steps: [
      {
        title: "Browse project range",
        description:
          "The homeowner sees category range without losing the path to a scoped conversation.",
      },
      {
        title: "Filter the service fit",
        description:
          "Design, hardscape, and maintenance are separated so the inquiry starts with better context.",
      },
      {
        title: "Move to scope",
        description:
          "The final CTA stays grounded in actual next-step clarity rather than vague inspiration language.",
      },
    ],
  },
  seasonalServices: {
    title: "Secondary services stay visible without competing with the core project offer.",
    summary:
      "Maintenance and seasonal work can support retention, but the design keeps the premium project conversation primary.",
    services: [
      {
        season: "Shoulder season",
        title: "Seasonal refresh",
        description:
          "Secondary seasonal service framing that supports repeat work without hijacking higher-ticket pages.",
      },
      {
        season: "Growing season",
        title: "Garden care",
        description:
          "A softer service lane for lighter recurring work within the same brand system.",
      },
      {
        season: "Year-round",
        title: "Outdoor upkeep",
        description:
          "Keeps maintenance relevant while preserving a stronger premium project tone.",
      },
    ],
  },
  trustPlaceholders: {
    title: "Trust placeholders",
    summary:
      "Approved reviews, project proof, and planning credentials should be inserted only when they are real and verified.",
    items: [
      {
        label: "Proof",
        title: "Insert approved review proof here",
        description:
          "Use verified reviews or project commentary only after the client approves the exact material.",
        note: "No fabricated testimonials, project counts, or before-and-after claims.",
      },
      {
        label: "Credentials",
        title: "Replace with real certifications",
        description:
          "Only show professional affiliations or certifications that are real and client-approved.",
        note: "No invented design awards or association memberships.",
      },
    ],
  },
  faq: [
    {
      question: "Is this a real landscaping client build?",
      answer:
        "No. It is a fictional production concept built to demonstrate how Leadcraft would approach a premium landscaping or outdoor-living website.",
    },
  ],
  finalCta: {
    eyebrow: "Final CTA",
    title: "Premium visual work still needs a disciplined next step.",
    body:
      "This concept is designed to show how Leadcraft can balance aspiration, project quality, and quote clarity for outdoor-living companies.",
    primaryHref: "/contact",
    primaryLabel: "Request A Site Teardown",
    secondaryHref: "/#package-finder",
    secondaryLabel: "Find My Price",
    secondaryExternal: false,
  },
};
