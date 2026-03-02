import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sign-in", "/debates/new"],
    },
    sitemap: "https://stanzo-gules.vercel.app/sitemap.xml",
  }
}
