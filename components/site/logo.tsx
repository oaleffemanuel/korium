import { cn } from "@/lib/utils";

/** The Korium mark — a single K. Gold rides only the ascending arm. */
export function KMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-8", className)}
    >
      <path
        d="M10.5 5.5V26.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M23.5 5.5L12.6 16.1"
        stroke="rgb(var(--gold))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M15.9 15.1L24 26.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <KMark className={cn("size-[26px] text-ink", markClassName)} />
      <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
        Korium
      </span>
    </span>
  );
}
