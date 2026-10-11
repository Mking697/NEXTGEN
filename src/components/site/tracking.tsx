"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackCall, trackWhatsApp } from "@/lib/track";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * The IDs are typed by an admin and end up inside an inline <script>, so they
 * are stripped to the characters real IDs use — digits for Meta, G-… for GA4,
 * AW-… for Google Ads. Nothing here can close the script tag.
 */
const clean = (v?: string) => (v ?? "").trim().replace(/[^A-Za-z0-9_-]/g, "");

export function Tracking({
  metaPixelId, ga4Id, googleAdsId,
}: { metaPixelId?: string; ga4Id?: string; googleAdsId?: string }) {
  const pixel = clean(metaPixelId);
  const gtagIds = [clean(ga4Id), clean(googleAdsId)].filter(Boolean);
  const gtagKey = gtagIds.join(",");
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    // Both snippets record a page view as they load, and an App Router
    // navigation never reloads the page. Without this, every page after the
    // one a visitor landed on would be invisible in reporting — and firing on
    // the first render as well would count the landing page twice.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
    for (const id of gtagKey.split(",").filter(Boolean)) {
      window.gtag?.("config", id, { page_path: pathname });
    }
  }, [pathname, gtagKey]);

  // Site-wide click delegation: every tel:/wa.me link counts as a conversion
  // signal, not just the ones with a dedicated handler. This is a capture
  // listener on document so it still fires even if a link is added later
  // (e.g. inside a dynamically rendered card) and doesn't need per-button
  // wiring across ~90 call sites.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackCall();
      else if (href.includes("wa.me") || href.includes("whatsapp.com")) trackWhatsApp();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      {pixel && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixel}');fbq('track','PageView');
          `}</Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1" width="1" alt="" style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {gtagIds.length > 0 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">{`
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
${gtagIds.map((id) => `gtag('config','${id}');`).join("\n")}
          `}</Script>
        </>
      )}
    </>
  );
}
