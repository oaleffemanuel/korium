/**
 * Landing page variants.
 *
 * Each variant is a real route (`/a`, `/b`) with its own composition file in
 * components/variants. Adding an experiment means adding an entry here, a
 * composition file, and a route folder — nothing else in the app changes.
 *
 * Switching which variant `/` points at is a one-line change to
 * DEFAULT_VARIANT: next.config.ts reads it to build the redirect, and
 * sitemap/robots follow from the same registry.
 */

export const VARIANTS = {
  a: {
    id: "a",
    path: "/a",
    name: "Versão A",
    /** One line on what this variant is testing. */
    positioning: "Emoção primeiro — a promessa é parar de cobrar o contador.",
    status: "live",
    /** Only the live variant is indexed; the rest are duplicate content. */
    indexable: true,
  },
  b: {
    id: "b",
    path: "/b",
    name: "Versão B",
    positioning:
      "Objetiva — a contabilidade em si vem primeiro. Ainda não implementada.",
    status: "reserved",
    indexable: false,
  },
} as const;

export type VariantId = keyof typeof VARIANTS;

export const VARIANT_IDS = Object.keys(VARIANTS) as VariantId[];

/** The variant served at `/`. Change this to flip the experiment. */
export const DEFAULT_VARIANT: VariantId = "a";

export const indexableVariants = () =>
  VARIANT_IDS.filter((id) => VARIANTS[id].indexable);
