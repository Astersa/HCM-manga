import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Oswald } from "next/font/google";
import { MANGA } from "@/lib/meta";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${MANGA.title} — Truyện tranh lịch sử`,
  description: MANGA.description,
  openGraph: {
    title: MANGA.title,
    description: MANGA.subtitle,
    type: "website",
    images: [{ url: "/manga/1-1.png", width: 1024, height: 1536 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#120e0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${oswald.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
