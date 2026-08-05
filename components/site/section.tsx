import * as React from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-3",
        className,
      )}
    >
      <span className="rule-gold" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.06} className="mt-6">
        <h2
          className={cn(
            "text-title max-w-[19ch] font-normal text-ink",
            align === "center" && "mx-auto max-w-[22ch]",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lede ? (
        <Reveal delay={0.12} className="mt-7">
          <p
            className={cn(
              "text-lede max-w-[54ch] text-ink-2",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  tone = "canvas",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "canvas" | "sand" | "navy";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-28 md:py-36 lg:py-44",
        tone === "sand" && "grain bg-surface-2",
        tone === "navy" && "grain bg-navy text-on-navy",
        className,
      )}
    >
      {children}
    </section>
  );
}
