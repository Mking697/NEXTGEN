"use client";

import { Marquee, MarqueeContent, MarqueeEdge, MarqueeItem } from "@/components/ui/marquee";

/**
 * The "Built for" audience chips, upgraded from a static wrapped list to an
 * infinite marquee (21st.dev — diceui/marquee). Pauses on hover so a visitor
 * who actually wants to read a chip can, and autoFill keeps it seamless at
 * any viewport width instead of leaving a gap on wide screens.
 */
export function AudienceMarquee({ items }: { items: string[] }) {
  return (
    <Marquee side="left" speed={28} pauseOnHover autoFill gap="0.75rem" className="py-1">
      <MarqueeContent>
        {items.map((a) => (
          <MarqueeItem key={a} asChild>
            <span className="inline-flex rounded-full border bg-card px-[18px] py-2.5 text-[0.89rem] font-semibold text-muted-foreground">
              {a}
            </span>
          </MarqueeItem>
        ))}
      </MarqueeContent>
      <MarqueeEdge side="left" size="sm" />
      <MarqueeEdge side="right" size="sm" />
    </Marquee>
  );
}
