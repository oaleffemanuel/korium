import { VersionA } from "@/components/variants/version-a";

/**
 * Version B — reserved for the objective, accounting-first positioning.
 *
 * It renders Version A on purpose: the route, the registry entry and the
 * measurement setup are in place, so the experiment can start the day the
 * copy exists. When B diverges, replace the body below with its own
 * composition — nothing outside this file needs to change.
 *
 * Hypothesis and planned changes: docs/experiments.md.
 */
export function VersionB() {
  return <VersionA />;
}
