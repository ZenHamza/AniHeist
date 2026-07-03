import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AniHeist - Watch Anime Online Free",
    template: "%s | AniHeist",
  },
  description:
    "Stream anime in HD quality with English subtitles. Track your watch history, build your watchlist, discover new anime, ad-free experience.",
  keywords: [
    "anime",
    "streaming",
    "watch anime",
    "free anime",
    "HD anime",
    "subbed anime",
    "AniHeist",
  ],
  metadataBase: new URL("https://aniheist.com"),
  openGraph: {
    title: "AniHeist - Watch Anime Online Free",
    description: "Stream anime in HD quality with English subtitles.",
    url: "https://aniheist.com",
    siteName: "AniHeist",
    images: [
      {
        url: "https://aniheist.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniHeist - Watch Anime Online Free",
    images: ["https://aniheist.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PN045E6DYT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PN045E6DYT');`}
        </Script>
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
