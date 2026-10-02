import { postToApi, type SendResult } from './api';

/**
 * Booking emails via Resend, through the serverless function at /api/send.
 *
 * The old version emailed the confirmation straight from the browser using the
 * visitor's submitted address as the recipient, which meant the clinic never
 * received a copy at all. Delivery is now two independent sends handled on the
 * server: the clinic first, then the customer's own confirmation. The clinic
 * copy is what decides the returned state, so a failure on the customer's copy
 * cannot stop the business from getting the booking.
 *
 * Configure on Vercel (never in the browser):
 *   RESEND_API_KEY, RESEND_TO_EMAIL, RESEND_FROM
 *
 * `emailConfigured` is retained because it was part of this module's public
 * shape. Configuration is now server-side, so the browser genuinely cannot know
 * whether the API is set up - the value is always true and the API's own
 * 'not-configured' response is what drives the honest fallback copy.
 */
export const emailConfigured = true;

export type BookingEmail = {
  /** Retained for compatibility. The recipient is chosen server-side now. */
  to_email: string;
  reply_to: string;
  client_name: string;
  booking_code: string;
  service_name: string;
  branch_name: string;
  branch_address: string;
  branch_phone: string;
  date_time: string;
  client_phone: string;
  client_notes: string;
};

export type { SendResult };

/**
 * Sends the booking. Never throws - a failed email must not lose the booking,
 * and the caller decides how to surface a failure.
 */
export async function sendBookingConfirmation(details: BookingEmail): Promise<SendResult> {
  return postToApi({
    kind: 'booking',
    // `client_email` is what the customer copy is addressed to. `to_email` was
    // the visitor's address under EmailJS; it is carried across rather than
    // dropped so no caller needs to change shape.
    client_email: details.to_email,
    reply_to: details.reply_to,
    client_name: details.client_name,
    booking_code: details.booking_code,
    service_name: details.service_name,
    branch_name: details.branch_name,
    branch_address: details.branch_address,
    branch_phone: details.branch_phone,
    date_time: details.date_time,
    client_phone: details.client_phone,
    client_notes: details.client_notes,
  });
}