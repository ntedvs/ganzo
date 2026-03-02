import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from "next"
import { Host_Grotesk } from "next/font/google"
import { ReactNode } from "react"
import { Navbar } from "~/components/Navbar"
import "~/styles/globals.css"
import { Providers } from "./providers"

const host = Host_Grotesk({ variable: "--font-host-grotesk", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://stanzo-gules.vercel.app"),
  title: { default: "Stanzo", template: "%s - Stanzo" },
  description:
    "Real-time debate fact-checking. Two speakers, one microphone, every claim verified against primary sources.",
  openGraph: {
    title: "Stanzo",
    description:
      "Real-time debate fact-checking. Two speakers, one microphone, every claim verified against primary sources.",
    url: "/",
    siteName: "Stanzo",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 720,
        alt: "Stanzo — Every claim, verified live",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stanzo",
    description:
      "Real-time debate fact-checking. Two speakers, one microphone, every claim verified against primary sources.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={host.variable}>
        <body className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden font-[family-name:var(--font-host-grotesk),sans-serif]">
          <Providers>
            <Navbar />
            <main className="contents">{children}</main>

            <Analytics />
            <SpeedInsights />
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
