import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export — GitHub Pages serves files, it does not run Node.
   *
   * Consequences worth knowing before changing anything here:
   *  - `redirects()` / `rewrites()` / middleware do nothing in this mode.
   *    `/` → `/a` is handled by app/page.tsx, which emits a static redirect
   *    document. See docs and README.
   *  - Route handlers and server actions are unavailable. The site has none.
   *  - next/image needs `unoptimized`, since there is no optimizer at runtime.
   */
  output: "export",

  /**
   * Emits `out/a/index.html` instead of `out/a.html`, so `/a` and `/a/`
   * both resolve on any static host without relying on extension guessing.
   */
  trailingSlash: true,

  images: { unoptimized: true },

  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
