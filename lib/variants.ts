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
    status: "ready",
    /** Only the default variant is indexed; the rest are duplicate content. */
    indexable: false,
  },
  b: {
    id: "b",
    path: "/b",
    name: "Versão B",
    positioning:
      "Objetiva — página de serviço. O que fazemos, para quem e como começar.",
    status: "live",
    indexable: true,
  },
} as const;

export type VariantId = keyof typeof VARIANTS;

export const VARIANT_IDS = Object.keys(VARIANTS) as VariantId[];

/** The variant served at `/`. Change this to flip the experiment. */
export const DEFAULT_VARIANT: VariantId = "b";

export const indexableVariants = () =>
  VARIANT_IDS.filter((id) => VARIANTS[id].indexable);
