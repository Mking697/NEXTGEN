import type { SiteSettings, Product, Service } from "./types";

/**
 * Seed content. The site reads Supabase when it is configured and falls back
 * to these, so the pages render correctly before the database exists and the
 * admin has something real to edit on day one.
 */
export const defaultSettings: SiteSettings = {
  brand: {
    name: "Essor Automations",
    tagline: "Business Automation, Built & Delivered",
    url: "https://essorautomations.com",
  },
  contact: {
    phone: "+91 93114 32603",
    phone2: "+91 90272 02796",
    whatsapp: "919311432603",
    email: "manojtiwari8428@gmail.com",
    address: "India",
    hours: "Mon – Sat, 10:00 AM – 7:00 PM IST",
  },
  social: {},
  hero: {
    pill: "7 products built in-house",
    title_lead: "Ready-made software for your",
    title_accent: "shop, clinic or agency",
    title_tail: "— plus the ads to grow it",
    subtitle:
      "We build business software, and we run the campaigns that fill it with customers. Five of our products are already live and running real businesses today.",
    cta_primary: "Book a Free Demo",
    cta_whatsapp: "Message us on WhatsApp",
  },
  trust: [
    { value: "32", label: "Businesses served" },
    { value: "7", label: "Products built in-house" },
    { value: "5", label: "Live in production today" },
  ],
  audiences: [
    "Medical stores & pharmacies",
    "Clinics & healthcare",
    "Marketing agencies",
    "Retail & distribution",
    "Service businesses",
    "Manufacturing & trading",
  ],
  cta: {
    title: "Not sure which one you need?",
    subtitle:
      "Send us one message describing your business. You will get a straight answer, not a pitch.",
  },
  faq: [
    {
      q: "Why are there no prices on the site?",
      a: "Because scope changes the number, and a price that turns out to be wrong helps nobody. Send one WhatsApp message describing your shop or clinic and you get a fixed quote the same day — no call required unless you want one.",
    },
    {
      q: "Is the demo really free?",
      a: "Yes. The demo and the first consultation cost nothing. We look at how you work today and tell you which product or service will actually help.",
    },
    {
      q: "How long does setup take?",
      a: "Because the product already exists, a normal setup takes two to seven days including data import and team training. Heavier customisation takes longer, and we give you a real timeline before anything starts.",
    },
    {
      q: "Can it be customised for my business?",
      a: "Yes. Fields, workflows, invoice formats and reports are configured around how you work. Larger custom modules are quoted separately.",
    },
    {
      q: "Where is my data stored, and is it safe?",
      a: "On secure cloud servers with regular backups. Access is role-based, so each staff member sees only their own work. You can export your full data at any time.",
    },
    {
      q: "Do you handle ads as well as software?",
      a: "Yes. We run Meta and Google Ads, build landing pages, set up WhatsApp automation and handle SEO. You can take the software, the marketing, or both.",
    },
    {
      q: "Do I get support after setup?",
      a: "Yes — direct support on WhatsApp and phone, plus regular updates. We monitor uptime on the products that are live.",
    },
    {
      q: "When are the CRM and ERP launching?",
      a: "Essor CRM and PRO ERP are still in development. The early access list is open, which gets you first access and launch pricing.",
    },
  ],
  seo: {
    title:
      "Essor Automations — Business Software & Digital Marketing for Indian Businesses",
    description:
      "Ready-to-use business automation software plus Meta and Google Ads management, WhatsApp automation, landing pages and SEO. Five products live in production. Book a free demo.",
  },
  tracking: {},
};

export const defaultProducts: Product[] = [
  {
    slug: "chatxflow",
    name: "ChatXFlow",
    tagline: "WhatsApp & Omnichannel Chat Automation",
    category: "Marketing Automation",
    status: "live",
    url: "https://chatxflow.online",
    logo_text: "CX",
    color_from: "#25D366",
    color_to: "#0EA5E9",
    description:
      "Handle WhatsApp and every other chat channel from one shared inbox. Chatbot flows, bulk broadcasts, auto-replies and lead capture in a single place.",
    long_description:
      "ChatXFlow is built for businesses whose customers live on WhatsApp but whose teams lose leads while replying by hand. Design automated conversations in a drag-and-drop flow builder, send broadcast campaigns, and turn every chat into a trackable lead — without writing a line of code.",
    features: ["Chatbot Flow Builder", "Bulk Broadcast", "Shared Team Inbox", "Auto Reply", "Lead Capture", "Campaign Reports"],
    highlights: [
      "Every incoming chat becomes a lead automatically, so follow-ups never slip",
      "No-code flow builder — you do not need a developer to change anything",
      "Your whole team works from one shared inbox instead of one person's phone",
    ],
    price_note: "Pricing on request",
    published: true, featured: true, sort_order: 1,
  },
  {
    slug: "dawaistore",
    name: "DawaiStore",
    tagline: "Pharmacy & Medical Store Management",
    category: "Healthcare",
    status: "live",
    url: "https://dawaistore.online",
    logo_text: "DS",
    color_from: "#34D399",
    color_to: "#10B981",
    description:
      "Complete billing, inventory and expiry tracking for medical stores — with online ordering built in.",
    long_description:
      "DawaiStore is made for chemists and pharmacy chains. Batch-wise stock, expiry alerts, GST billing and customer order history all live in one dashboard. You get speed at the counter and clean records when it is time for an audit.",
    features: ["GST Billing", "Batch & Expiry Tracking", "Stock Alerts", "Supplier Management", "Online Ordering", "Sales Reports"],
    highlights: [
      "Expiry alerts before stock turns into a write-off",
      "GST-ready invoices, so filing stops being a monthly headache",
      "Counter billing fast enough that queues do not build up",
    ],
    price_note: "Pricing on request",
    published: true, featured: true, sort_order: 2,
  },
  {
    slug: "panelsuite",
    name: "PanelSuite",
    tagline: "All-in-One Service Panel Platform",
    category: "SaaS Platform",
    status: "live",
    url: "https://panelsuite.online",
    logo_text: "PS",
    color_from: "#A855F7",
    color_to: "#5B7CFF",
    description:
      "Launch your own service panel — orders, wallet, users and automated delivery all included.",
    long_description:
      "PanelSuite is for anyone running an online service business. User accounts, wallet top-ups, order queues, automated fulfilment and reseller access come ready-made. You only decide which services to offer and what to charge.",
    features: ["User & Wallet System", "Order Automation", "Reseller Access", "Payment Gateway", "Ticket Support", "Admin Analytics"],
    highlights: [
      "Skip the months it takes to build a panel from scratch",
      "Wallet and payment gateway are already integrated",
      "A reseller layer lets other people sell through you",
    ],
    price_note: "Pricing on request",
    published: true, featured: true, sort_order: 3,
  },
  {
    slug: "autolyst",
    name: "Autolyst",
    tagline: "Workflow & Task Automation",
    category: "Automation",
    status: "live",
    url: "https://autolyst.online",
    logo_text: "AU",
    color_from: "#22D3EE",
    color_to: "#34D399",
    description:
      "Automate repetitive work — connect your apps, set triggers, and give your team its time back.",
    long_description:
      "Autolyst connects the tools you already use. Something happens in one place and the next action fires automatically somewhere else — data entry, notifications, reports, follow-ups. Work that used to be done by hand every day now runs quietly in the background.",
    features: ["Trigger & Action Builder", "App Integrations", "Scheduled Jobs", "Conditional Logic", "Error Alerts", "Run History"],
    highlights: [
      "Manual data entry and copy-paste work disappears",
      "Full run history — you can see exactly what ran and when",
      "Conditions mean automations fire only when they should",
    ],
    price_note: "Pricing on request",
    published: true, featured: true, sort_order: 4,
  },
  {
    slug: "admetics",
    name: "Admetics",
    tagline: "Ad Performance & Marketing Analytics",
    category: "Analytics",
    status: "live",
    url: "https://admetics.online",
    logo_text: "AD",
    color_from: "#F87171",
    color_to: "#A855F7",
    description:
      "Every ad account in one dashboard — spend, leads, cost per lead and ROAS, in real time.",
    long_description:
      "Admetics brings clarity to marketing spend. Numbers from different platforms land in one place, cost per lead is visible campaign by campaign, and you can finally see where the money is working and where it is leaking. Client-ready reports build themselves.",
    features: ["Unified Ad Dashboard", "Cost Per Lead Tracking", "ROAS Reports", "Campaign Comparison", "Auto Report Scheduling", "Client Sharing"],
    highlights: [
      "All ad spend on one screen — no switching between platforms",
      "Cost per lead campaign by campaign, so budget moves to what works",
      "Client reports generate and send on a schedule",
    ],
    price_note: "Pricing on request",
    published: true, featured: true, sort_order: 5,
  },
  {
    slug: "essor-crm",
    name: "Essor CRM",
    tagline: "Sales CRM & Lead Pipeline",
    category: "Sales",
    status: "soon",
    logo_text: "CR",
    color_from: "#F59E0B",
    color_to: "#F87171",
    description:
      "From first enquiry to closed deal — your whole sales pipeline in one place, with follow-up reminders built in.",
    long_description:
      "Essor CRM is being built for sales teams. Every lead shows its source, stage and next action clearly. Follow-up reminders, call logs, quotation tracking and team performance all live in a single pipeline view.",
    features: ["Lead Pipeline", "Follow-up Reminders", "Call & Note Logs", "Quotation Tracking", "Team Performance", "WhatsApp & Email Sync"],
    highlights: [
      "No lead goes cold — the reminder comes to you",
      "The pipeline view shows exactly where each deal is stuck",
      "Team performance in numbers instead of gut feel",
    ],
    price_note: "Launching soon — early access open",
    published: true, featured: false, sort_order: 6,
  },
  {
    slug: "pro-erp",
    name: "PRO ERP",
    tagline: "Complete Business ERP",
    category: "ERP",
    status: "soon",
    logo_text: "PE",
    color_from: "#5B7CFF",
    color_to: "#22D3EE",
    description:
      "Inventory, accounts, purchase, sales, HR and production — your entire business on one system.",
    long_description:
      "PRO ERP is for businesses tangled in separate software and spreadsheets. From purchase to production, from payroll to balance sheet, every module talks to the others. Data lives in one place and reports come out everywhere.",
    features: ["Inventory & Warehouse", "Accounts & GST", "Purchase & Sales", "Production Planning", "HR & Payroll", "Role-based Access"],
    highlights: [
      "The spreadsheet maze ends — one single source of truth",
      "Department-level access keeps sensitive data where it belongs",
      "Real-time reports instead of waiting for month end",
    ],
    price_note: "Launching soon — early access open",
    published: true, featured: false, sort_order: 7,
  },
];

export const defaultServices: Service[] = [
  {
    slug: "meta-ads-management",
    name: "Meta Ads Management",
    tagline: "Facebook & Instagram ads that bring enquiries, not just likes",
    category: "Paid Advertising",
    icon: "target",
    color_from: "#C60000", color_to: "#A30000",
    description:
      "End-to-end Facebook and Instagram advertising — from audience research and creative production to daily optimisation and honest reporting.",
    long_description:
      "Most businesses do not lose money on ads because the platform is bad. They lose it because the offer is unclear, the targeting is lazy, and nobody checks the numbers after the campaign goes live. We handle all three. You get a proper account structure, creatives built for your audience, and a weekly report that shows exactly what each rupee bought.",
    deliverables: ["Ad account and Business Manager setup", "Pixel and conversion tracking installation", "Audience research and targeting strategy", "Ad creative design and copywriting", "Campaign launch and daily optimisation", "Weekly report with cost per lead"],
    outcomes: [
      "Every enquiry is tracked back to the campaign that produced it",
      "Creative is tested systematically instead of changed on a hunch",
      "You always know your cost per lead, not just your ad spend",
    ],
    price_note: "Monthly retainer + ad spend. Quoted after a free audit.",
    published: true, featured: true, sort_order: 1,
  },
  {
    slug: "google-ads-management",
    name: "Google Ads Management",
    tagline: "Catch customers at the exact moment they are searching",
    category: "Paid Advertising",
    icon: "chart",
    color_from: "#A30000", color_to: "#C60000",
    description:
      "Search, Performance Max and YouTube campaigns built around high-intent keywords — with wasted spend cut out through disciplined negative keyword work.",
    long_description:
      "Google Ads is the highest-intent traffic you can buy. It is also the easiest place to burn a budget on irrelevant clicks. We build tight campaign structures, run search term reviews every week, and keep the negative keyword list growing so your budget stays on the searches that actually convert.",
    deliverables: ["Keyword research and competitor analysis", "Search, Shopping and Performance Max setup", "Conversion and call tracking", "Ad copy and extensions", "Weekly search term review", "Landing page recommendations"],
    outcomes: [
      "Budget goes to buying-intent searches, not window shoppers",
      "Calls and form fills are tracked as real conversions",
      "Wasted spend shrinks month over month",
    ],
    price_note: "Monthly retainer + ad spend. Quoted after a free audit.",
    published: true, featured: true, sort_order: 2,
  },
  {
    slug: "whatsapp-marketing-setup",
    name: "WhatsApp Marketing & Automation",
    tagline: "Turn your busiest channel into a system that never drops a lead",
    category: "Marketing Automation",
    icon: "chat",
    color_from: "#25D366", color_to: "#0EA5E9",
    description:
      "WhatsApp Business API setup, chatbot flows, broadcast campaigns and a shared team inbox — powered by our own ChatXFlow platform.",
    long_description:
      "Your customers already message you on WhatsApp. The problem is that replies get missed, follow-ups never happen, and nobody knows how many enquiries turned into sales. We set up the API, build the automated flows, train your team on the shared inbox, and connect it all so every chat becomes a trackable lead.",
    deliverables: ["WhatsApp Business API and number verification", "Chatbot and auto-reply flow design", "Broadcast setup and template approval", "Shared team inbox with agent routing", "CRM and lead capture integration", "Team training and handover"],
    outcomes: [
      "Instant replies even outside business hours",
      "Every conversation is logged and assigned to someone",
      "Follow-ups happen automatically instead of being forgotten",
    ],
    price_note: "One-time setup + monthly platform fee",
    published: true, featured: true, sort_order: 3,
  },
  {
    slug: "landing-page-development",
    name: "Landing Pages & Websites",
    tagline: "Fast, conversion-focused pages built to receive paid traffic",
    category: "Web Development",
    icon: "zap",
    color_from: "#C60000", color_to: "#F80000",
    description:
      "High-converting landing pages and business websites — fast-loading, mobile-first, and wired for conversion tracking from day one.",
    long_description:
      "Sending paid traffic to a slow, generic website is the most common way to waste an ad budget. We build pages designed for one job: turn a visitor who has never heard of you into an enquiry. Clear promise above the fold, proof, and a single obvious next step — loading in under two seconds on an average phone.",
    deliverables: ["Conversion-focused structure and copywriting", "Custom design matched to your brand", "Mobile-first responsive build", "Pixel, GA4 and conversion events", "Core Web Vitals optimisation", "Hosting setup and go-live support"],
    outcomes: [
      "Ad traffic lands on a page built to convert, not just to exist",
      "Every form fill and call fires a tracked conversion event",
      "Pages load fast enough that people do not bounce first",
    ],
    price_note: "Fixed project price. Quoted after scoping.",
    published: true, featured: true, sort_order: 4,
  },
  {
    slug: "creative-design",
    name: "Ad Creative & Branding",
    tagline: "The creative decides whether your ad gets scrolled past",
    category: "Creative",
    icon: "sliders",
    color_from: "#F80000", color_to: "#A30000",
    description:
      "Scroll-stopping static and video ad creative, plus the brand basics — logo, colours and templates — that make everything look like one company.",
    long_description:
      "Targeting gets you in front of the right person. Creative decides whether they stop. We produce ad variations built to be tested against each other, in the formats each placement actually needs, so you learn what works instead of guessing.",
    deliverables: ["Static creative in all placement sizes", "Short-form video and reel editing", "Ad copy variations for testing", "Logo and brand identity basics", "Reusable social media templates", "Monthly creative refresh"],
    outcomes: [
      "Multiple angles tested instead of one guess",
      "Creative fatigue is caught before results drop",
      "Every asset looks like it came from the same company",
    ],
    price_note: "Per-project or bundled with an ads retainer",
    published: true, featured: false, sort_order: 5,
  },
  {
    slug: "seo-and-content",
    name: "SEO & Content",
    tagline: "Traffic that keeps coming after you stop paying for it",
    category: "Organic Growth",
    icon: "refresh",
    color_from: "#0B7A43", color_to: "#34D399",
    description:
      "Technical SEO, local search and content that builds a traffic source you own — so you are not dependent on ad spend forever.",
    long_description:
      "Paid ads stop the day you stop paying. SEO compounds. We fix the technical foundation, build out your Google Business Profile for local searches, and publish content that answers what your customers actually type into Google. It is slower than ads, which is exactly why it is worth starting now.",
    deliverables: ["Technical SEO audit and fixes", "Keyword research and content plan", "On-page optimisation", "Google Business Profile and local SEO", "Content writing and publishing", "Monthly ranking and traffic report"],
    outcomes: [
      "A traffic source that does not switch off with your budget",
      "Local searches near your business start finding you",
      "Content that answers real customer questions",
    ],
    price_note: "Monthly retainer, minimum 6 months",
    published: true, featured: false, sort_order: 6,
  },
  {
    slug: "custom-software-development",
    name: "Custom Software Development",
    tagline: "When nothing off the shelf fits how you actually work",
    category: "Development",
    icon: "tool",
    color_from: "#8A5200", color_to: "#C60000",
    description:
      "Custom web applications, dashboards, integrations and automations — built by the same team that built and runs our own products.",
    long_description:
      "Sometimes your process is genuinely different and forcing it into standard software costs more than it saves. We build custom systems on the same foundations as our own live products, so you get something proven rather than an experiment. And we tell you honestly when one of our existing products would do the job cheaper.",
    deliverables: ["Requirement mapping and technical scoping", "Custom web application development", "Third-party API and payment integrations", "Reporting dashboards", "Deployment, hosting and monitoring", "Ongoing maintenance and support"],
    outcomes: [
      "Software that matches your process instead of the other way round",
      "One source of truth instead of scattered spreadsheets",
      "A team that stays available after go-live",
    ],
    price_note: "Fixed price per milestone, after scoping",
    published: true, featured: false, sort_order: 7,
  },
];
