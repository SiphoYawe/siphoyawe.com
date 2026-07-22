/**
 * JSON-LD structured data. A server component that renders a
 * <script type="application/ld+json"> into the initial server HTML, so crawlers
 * read the schema on the first response (no client hydration required).
 */

export const SITE_URL = "https://siphoyawe.com";

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** The Person node, referenced by @id from other graph nodes. */
const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Sipho Yawe",
  alternateName: "Sipho",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.png`,
  jobTitle: "Developer Relations Engineer",
  worksFor: { "@type": "Organization", name: "LI.FI", url: "https://li.fi" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Sheffield",
  },
  sameAs: [
    "https://x.com/SiphoYawe",
    "https://github.com/SiphoYawe",
    "https://www.linkedin.com/in/sipho-yawe-669406231/",
    "https://readyscribe17.substack.com/",
  ],
  knowsAbout: [
    "DeFi",
    "Web3",
    "blockchain",
    "DevRel",
    "tokenization",
    "RWA",
    "Solidity",
  ],
  nationality: "Ugandan",
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Sipho Yawe",
  url: SITE_URL,
  inLanguage: "en-GB",
  publisher: { "@id": `${SITE_URL}/#person` },
};

/** Site-wide graph: Person + WebSite, injected once in the root layout. */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [person, website],
};
