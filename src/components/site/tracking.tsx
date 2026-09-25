"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
