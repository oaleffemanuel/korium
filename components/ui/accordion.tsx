"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-line", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-start justify-between gap-6 py-7 text-left",
        "text-lg leading-snug tracking-[-0.02em] text-ink transition-colors duration-300",
        "hover:text-[rgb(var(--gold))] md:text-[1.3125rem]",
        className,
      )}
      {...props}
    >
      <span className="max-w-[46ch]">{children}</span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line",
          "text-ink-3 transition-all duration-500 ease-[var(--ease-out-expo)]",
          "group-hover:border-[rgb(var(--gold)/0.5)] group-hover:text-[rgb(var(--gold))]",
          "group-data-[state=open]:rotate-45 group-data-[state=open]:border-[rgb(var(--gold)/0.5)] group-data-[state=open]:text-[rgb(var(--gold))]",
        )}
      >
        <Plus className="size-4" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:accordion-up data-[state=open]:accordion-down"
    {...props}
  >
    <div
      className={cn(
        "max-w-[62ch] pb-8 pr-12 text-[1.0625rem] leading-relaxed text-ink-2",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
