import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = siteUrl(s.brand.url);

  return {
    metadataBase: new URL(base),
    title: { default: s.seo.title, template: `%s | ${s.brand.name}` },
    description: s.seo.description,
    applicationName: s.brand.name,
    openGraph: {
      type: "website",
      siteName: s.brand.name,
      title: s.seo.title,
      description: s.seo.description,
      url: base,
      images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: s.brand.name }],
    },
    twitter: { card: "summary_large_image", title: s.seo.title, description: s.seo.description },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      ],
      apple: "/apple-touch-icon.png",
    },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-dvh font-sans">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
