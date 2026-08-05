import type { Metadata } from "next";

import { site } from "@/lib/site";
import { DEFAULT_VARIANT, VARIANTS } from "@/lib/variants";

const target = `${VARIANTS[DEFAULT_VARIANT].path}/`;

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  // Point crawlers straight at the variant so the hop costs nothing in search.
  alternates: { canonical: target },
  robots: { index: false, follow: true },
  other: { refresh: `0; url=${target}` },
};

/**
 * `/` redirects to the active variant.
 *
 * On a static host there is no server to answer with a 307, so this is done
 * the only way that works everywhere: a meta refresh, a script for instant
 * navigation, and a real link so the page is never a dead end without JS.
 * Flip the destination by changing DEFAULT_VARIANT in lib/variants.ts.
 *
 * If a true server-side 301 is ever wanted, add a Cloudflare redirect rule
 * for `korium.co/` → `korium.co/a/` — see README.
 */
export default function RootRedirect() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(target)});`,
        }}
      />
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-[0.9375rem] text-ink-2">
          Redirecionando para{" "}
          <a
            href={target}
            className="text-ink underline decoration-[rgb(var(--gold))] decoration-1 underline-offset-4"
          >
            {site.domain}
          </a>
          .
        </p>
      </main>
    </>
  );
}
