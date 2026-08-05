"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

import { externalLinkProps, whatsappLink } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/** WhatsApp glyph, drawn to match Lucide's 24px grid and stroke weight. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12.04 3a8.93 8.93 0 0 0-7.6 13.62L3.2 21l4.5-1.18A8.93 8.93 0 1 0 12.04 3Z" />
      <path d="M9.2 8.4c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 2.8 2.4c.3.1.4 0 .6-.1l.5-.6c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5a1.8 1.8 0 0 1-1.3 1.7c-.5.1-1.2.2-3.4-.7a9.5 9.5 0 0 1-4-3.7c-.7-1.2-.7-2.2-.6-2.7a2 2 0 0 1 .4-.9Z" />
    </svg>
  );
}

/**
 * Appears once the hero is behind you, so it never competes with the first
 * impression. Navy body, warm-white glyph, gold ring on hover.
 */
export function WhatsAppFab() {
  const [pastHero, setPastHero] = React.useState(false);
  const [ctaInView, setCtaInView] = React.useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setPastHero(value > 700);
  });

  // Step aside while the final CTA is on screen — two identical asks at once
  // reads as pressure, which is the opposite of what this page sells.
  React.useEffect(() => {
    const target = document.getElementById("contato");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCtaInView(entry.isIntersecting),
      { rootMargin: "-20% 0px -10% 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !ctaInView;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8"
        >
          <a
            href={whatsappLink("default")}
            {...externalLinkProps}
            aria-label="Falar com a Korium pelo WhatsApp — abre em uma nova aba"
            className={[
              "group/fab shadow-lift relative flex items-center gap-0 overflow-hidden rounded-full",
              "bg-navy py-3.5 pl-3.5 pr-3.5 text-on-navy",
              "border border-[rgb(var(--on-navy)/0.12)]",
              "transition-[padding,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
              "hover:border-[rgb(var(--gold)/0.55)] hover:pr-6 hover:shadow-[var(--shadow-deep)]",
              "focus-visible:border-[rgb(var(--gold)/0.55)] focus-visible:pr-6",
            ].join(" ")}
          >
            {/* Gold wash that breathes in behind the glyph on hover */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[rgb(var(--gold))] opacity-0 transition-opacity duration-500 group-hover/fab:opacity-[0.12] group-focus-visible/fab:opacity-[0.12]"
            />

            <WhatsAppGlyph className="relative size-6 shrink-0 transition-colors duration-500 group-hover/fab:text-[rgb(var(--gold-bright))]" />

            {/* Label unfurls from zero width — no layout shift when idle */}
            <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-[0.9375rem] tracking-[-0.01em] opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/fab:max-w-[14rem] group-hover/fab:pl-3 group-hover/fab:opacity-100 group-focus-visible/fab:max-w-[14rem] group-focus-visible/fab:pl-3 group-focus-visible/fab:opacity-100">
              Falar com a Korium
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
