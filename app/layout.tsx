import type { Metadata, Viewport } from "next";
import { Caveat, Cinzel, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { PillNav } from "@/components/nav/pill-nav";
import { HiddenTerminal } from "@/components/terminal/hidden-terminal";
import { JsonLd, siteJsonLd } from "@/components/seo/json-ld";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  // Sans-serif fallback so nothing (esp. the preloader, which paints first)
  // ever flashes the browser default serif during font swap.
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

/** GA4 measurement ID (public). Loaded only in production so local dev and
 * preview traffic never lands in the analytics property. */
const GA_ID = "G-0TT8KPC3R9";

const TITLE = "Sipho Yawe | Builder in Web3, Writer, Speaker";
const DESCRIPTION =
  "The personal corner of Sipho Yawe: building in DeFi at LI.FI, writing, and speaking. Come in, look around, say hello.";

export const metadata: Metadata = {
  metadataBase: new URL("https://siphoyawe.com"),
  title: {
    default: TITLE,
    template: "%s | Sipho Yawe",
  },
  description: DESCRIPTION,
  applicationName: "Sipho Yawe",
  authors: [{ name: "Sipho Yawe", url: "https://siphoyawe.com" }],
  creator: "Sipho Yawe",
  publisher: "Sipho Yawe",
  category: "technology",
  keywords: [
    "Sipho Yawe",
    "DeFi",
    "DevRel",
    "LI.FI",
    "Web3",
    "blockchain",
    "tokenization",
    "RWA",
    "Solidity",
    "crosschain",
    "Uganda",
    "Sheffield",
    "developer relations",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: TITLE,
    description:
      "The personal corner of Sipho Yawe: building in DeFi at LI.FI, writing, and speaking.",
    url: "https://siphoyawe.com",
    siteName: "Sipho Yawe",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@SiphoYawe",
    site: "@SiphoYawe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${satoshi.variable} ${dmSans.variable} ${cinzel.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-ink">
        <JsonLd data={siteJsonLd} />
        <ThemeProvider>
          <LocaleProvider>
            <a
              href="#main-content"
              className="sr-only z-[110] rounded-full bg-sable px-4 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
            >
              Skip to content
            </a>
            <PillNav />
            {children}
            <HiddenTerminal />
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics (gtag.js) */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
