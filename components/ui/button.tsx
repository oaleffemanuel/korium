import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full font-medium tracking-[-0.01em]",
    "transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]",
    "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-ink text-canvas shadow-[var(--shadow-soft)]",
          "hover:shadow-[var(--shadow-lift)] hover:-translate-y-px",
        ),
        gold: cn(
          "bg-[rgb(var(--gold))] text-[rgb(var(--navy))] shadow-[var(--shadow-soft)]",
          "hover:bg-[rgb(var(--gold-bright))] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px",
        ),
        outline: cn(
          "border border-line-strong bg-transparent text-ink",
          "hover:border-[rgb(var(--gold))] hover:bg-[rgb(var(--gold)/0.06)] hover:-translate-y-px",
        ),
        ghost: "text-ink-2 hover:text-ink hover:bg-[rgb(var(--ink)/0.045)]",
        link: "h-auto rounded-none p-0 text-ink underline-offset-4 hover:text-[rgb(var(--gold))]",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-[3.25rem] px-7 text-[0.9375rem]",
        xl: "h-14 px-8 text-base",
        icon: "size-10 rounded-full p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
