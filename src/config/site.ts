/**
 * SITE CONFIGURATION
 * ==================
 * Central config file for the entire site.
 * Update this file to rebrand/reconfigure the template.
 */

export const siteConfig = {
  // ─── Company Info ───────────────────────────────────
  companyName: "Club Asset Management",
  companyTagline: "Strategic Acquisitions. Enduring Value.",
  companyDescription:
    "Club Asset Management is a private acquisition firm specializing in acquiring and operating established businesses across select industries.",
  foundedYear: 2018,

  // ─── Contact ────────────────────────────────────────
  contact: {
    email: "acquisitions@clubassetmanagement.com",
    phone: "+1 (212) 555-0184",
    address: {
      street: "One Vanderbilt Avenue, Suite 4500",
      city: "New York",
      state: "NY",
      zip: "10017",
      country: "United States",
    },
  },

  // ─── SEO Defaults ───────────────────────────────────
  seo: {
    defaultTitle: "Club Asset Management | Strategic Acquisitions & Investments",
    titleTemplate: "%s | Club Asset Management",
    defaultDescription:
      "Club Asset Management acquires and operates established businesses with strong fundamentals. We provide permanent capital solutions for owners seeking a trusted, long-term partner.",
    siteUrl: "https://clubassetmanagement.com",
    ogImage: "/og-image.jpg",
    twitterHandle: "@clubassetmgmt",
  },

  // ─── Navigation ─────────────────────────────────────
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Acquisition Criteria", href: "/criteria" },
    { label: "Contact", href: "/contact" },
  ],

  // ─── Footer Navigation ─────────────────────────────
  footerLinks: {
    company: [
      { label: "About", href: "/about" },
      { label: "Acquisition Criteria", href: "/criteria" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "#" },
      { label: "Disclosures", href: "#" },
    ],
  },

  // ─── Social Links ──────────────────────────────────
  socialLinks: [
    { platform: "LinkedIn", href: "https://linkedin.com/company/clubassetmanagement", icon: "linkedin" },
    { platform: "Twitter", href: "https://twitter.com/clubassetmgmt", icon: "twitter" },
  ],

  // ─── Design Tokens ─────────────────────────────────
  colors: {
    primary: "#0A1628",       // Deep navy
    secondary: "#1B3A5C",     // Rich blue
    accent: "#C5A55A",        // Gold
    accentHover: "#D4B86A",   // Light gold
    surface: "#FFFFFF",       // White
    surfaceAlt: "#F7F8FA",    // Light gray
    text: "#1A1A2E",          // Near black
    textMuted: "#6B7280",     // Gray
    textLight: "#9CA3AF",     // Light gray
    border: "#E5E7EB",        // Border gray
    success: "#10B981",       // Green
  },

  // ─── Acquisition Criteria ──────────────────────────
  acquisitionCriteria: {
    revenue: "$2M – $50M",
    ebitda: "$500K – $10M",
    industries: [
      "Business Services",
      "Healthcare Services",
      "Industrial & Manufacturing",
      "Technology-Enabled Services",
      "Consumer Services",
      "Distribution & Logistics",
    ],
    geographies: "United States & Canada",
    dealTypes: [
      "Full Acquisitions",
      "Majority Recapitalizations",
      "Management Buyouts",
      "Succession & Retirement Transitions",
    ],
  },

  // ─── Stats / Social Proof ──────────────────────────
  stats: [
    { value: "$500M+", label: "Capital Deployed" },
    { value: "35+", label: "Businesses Acquired" },
    { value: "2,800+", label: "Employees Across Portfolio" },
    { value: "98%", label: "Founder Satisfaction" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
