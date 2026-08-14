import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomScrollbar from '@/components/ui/CustomScrollbar';

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
    default: "Cafeteria Pulse",
    // Any route that sets its own title gets the product name appended.
    template: "%s · Cafeteria Pulse",
  },
  description:
    "Student cafeteria surveys, reports, and benchmarks for schools and districts, by the School Food & Wellness Group.",
  applicationName: "Cafeteria Pulse",
  manifest: "/fabicon/manifest.json",
  icons: {
    icon: [
      { url: "/fabicon/favicon.ico", sizes: "any" },
      { url: "/fabicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/fabicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/fabicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/fabicon/android-icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/fabicon/favicon.ico",
    apple: [
      { url: "/fabicon/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/fabicon/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/fabicon/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/fabicon/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/fabicon/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/fabicon/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/fabicon/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/fabicon/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/fabicon/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/fabicon/apple-icon-precomposed.png" },
    ],
  },
  appleWebApp: {
    title: "Cafeteria Pulse",
    capable: true,
    statusBarStyle: "default",
  },
  other: {
    "msapplication-TileColor": "#5B2DA3",
    "msapplication-TileImage": "/fabicon/ms-icon-144x144.png",
    "msapplication-config": "/fabicon/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B2DA3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-full w-full flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
