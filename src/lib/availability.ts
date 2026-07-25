import type { AvailabilityResult } from "@/lib/vehicle-constants";

export type AvailabilityTransitionInput = {
  currentStatus: string;
  consecutiveUnavailableChecks: number;
  statusBeforeUnavailable: string | null;
  result: AvailabilityResult;
};

export type AvailabilityTransitionResult = {
  consecutiveUnavailableChecks: number;
  nextStatus: string;
  statusBeforeUnavailable: string | null;
};

/**
 * Pure rules for Hermes availability checks.
 * UNAVAILABLE hides only after 2 consecutive explicit unavailable results.
 * UNKNOWN never changes status or counter.
 */
export function applyAvailabilityResult(
  input: AvailabilityTransitionInput,
): AvailabilityTransitionResult {
  let consecutive = input.consecutiveUnavailableChecks;
  let nextStatus = input.currentStatus;
  let statusBeforeUnavailable = input.statusBeforeUnavailable;

  if (input.result === "AVAILABLE") {
    consecutive = 0;
  } else if (input.result === "UNAVAILABLE") {
    consecutive += 1;
    if (
      consecutive >= 2 &&
      !["UNAVAILABLE", "ARCHIVED", "SOLD"].includes(input.currentStatus)
    ) {
      statusBeforeUnavailable = input.currentStatus;
      nextStatus = "UNAVAILABLE";
    }
  }

  return {
    consecutiveUnavailableChecks: consecutive,
    nextStatus,
    statusBeforeUnavailable,
  };
}
