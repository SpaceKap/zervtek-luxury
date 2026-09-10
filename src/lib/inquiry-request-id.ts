/** Stable client request id for enquiry idempotency + retry. */
export function createInquiryRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}
