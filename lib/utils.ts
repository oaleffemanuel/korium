import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The custom type scale (`text-display`, `text-title`, `text-lede`) lives in the
 * same `text-*` namespace as colors. Without this, tailwind-merge reads them as
 * color utilities and a later `text-ink` silently drops the font size.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "title", "lede"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
