import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  externalLinkProps,
  whatsappLink,
  type WhatsAppContext,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type WhatsAppCtaProps = Pick<ButtonProps, "variant" | "size" | "className"> & {
  /** Which prefilled message to open WhatsApp with. */
  context?: WhatsAppContext;
  children: React.ReactNode;
  /** Trailing glyph. Defaults to the outbound arrow. */
  icon?: React.ReactNode;
  /** Overrides the announced label when the visible text needs context. */
  label?: string;
  /** Fires alongside navigation — used to dismiss the mobile sheet. */
  onClick?: () => void;
};

/**
 * Every conversion on this page goes through here, so the link target,
 * prefilled message, external-link attributes and announced label stay
 * identical no matter which section the CTA sits in.
 */
export function WhatsAppCta({
  context = "default",
  children,
  icon,
  label,
  onClick,
  variant = "primary",
  size = "lg",
  className,
}: WhatsAppCtaProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={whatsappLink(context)}
        onClick={onClick}
        {...externalLinkProps}
        aria-label={
          label ??
          (typeof children === "string"
            ? `${children} — abre o WhatsApp em uma nova aba`
            : undefined)
        }
      >
        {children}
        {icon ?? (
          <ArrowUpRight
            className={cn(
              "transition-transform duration-500 ease-[var(--ease-out-expo)]",
              "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
            )}
            aria-hidden
          />
        )}
      </a>
    </Button>
  );
}
