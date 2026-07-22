import type { Metadata } from "next";
import { Caveat, Cinzel, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { PillNav } from "@/components/nav/pill-nav";
import { HiddenTerminal } from "@/components/terminal/hidden-terminal";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL("https://siphoyawe.com"),
  title: {
    default: "Sipho Yawe — Builder in DeFi, writer, speaker",
    template: "%s — Sipho Yawe",
  },
  description:
    "The personal corner of Sipho Yawe: building in DeFi at LI.FI, writing, and speaking. Come in, look around, say hello.",
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
    title: "Sipho Yawe — Builder in DeFi, writer, speaker",
    description:
      "The personal corner of Sipho Yawe: building in DeFi at LI.FI, writing, and speaking.",
    url: "https://siphoyawe.com",
    siteName: "Sipho Yawe",
    type: "website",
    images: [{ url: "/images/sipho-talk-2400.webp", width: 2400, height: 1600, alt: "Sipho Yawe mid-talk, gesturing" }],
  },
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
      </body>
    </html>
  );
}
