"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Wordmark } from "@/components/site/logo";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "O problema", href: "#dor" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Serviços", href: "#servicos" },
  { label: "O que está incluído", href: "#incluido" },
  { label: "Perguntas", href: "#perguntas" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Lock the page while the mobile sheet is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-canvas"
      >
        Ir para o conteúdo
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)]",
          scrolled
            ? "border-b border-line bg-[rgb(var(--canvas)/0.72)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-k">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-500 ease-[var(--ease-out-expo)]",
              scrolled ? "h-16" : "h-20 md:h-24",
            )}
          >
            <a
              href="#top"
              className="rounded-md transition-opacity duration-300 hover:opacity-70"
              aria-label="Korium — início"
            >
              <Wordmark />
            </a>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[0.875rem] text-ink-2",
                    "transition-colors duration-300 hover:text-ink",
                    "after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2",
                    "after:bg-[rgb(var(--gold))] after:transition-all after:duration-500 after:ease-[var(--ease-out-expo)]",
                    "hover:after:w-[calc(100%-2rem)]",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <WhatsAppCta size="sm" className="hidden sm:inline-flex">
                Falar com a Korium
              </WhatsAppCta>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                aria-expanded={open}
                className="grid size-10 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-[rgb(var(--ink)/0.05)] lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-canvas px-6 pt-28 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Menu móvel">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.06 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-line py-6 text-3xl tracking-[-0.03em] text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <WhatsAppCta
                size="lg"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Falar com a Korium
              </WhatsAppCta>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
