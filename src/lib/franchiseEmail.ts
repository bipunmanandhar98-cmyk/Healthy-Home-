import { postToApi, type SendResult } from './api';

/**
 * Franchise enquiry emails via Resend, through /api/send.
 *
 * The recipient is chosen server-side from RESEND_TO_EMAIL. `FRANCHISE_INBOX`
 * is kept because the form renders it in its own fallback copy and its contact
 * panel, so removing it would have meant editing the page.
 *
 * Configure with Resend on Vercel (never in the browser):
 *   RESEND_API_KEY, RESEND_TO_EMAIL, RESEND_FROM
 *
 * `franchiseEmailConfigured` is retained for compatibility. Configuration moved
 * server-side so the browser cannot know; the API's own 'not-configured'
 * response is what drives the honest fallback copy.
 */
export const FRANCHISE_INBOX = 'franchise@healthyhome.com.np';

export const franchiseEmailConfigured = true;

export type { SendResult };

/**
 * Field names are unchanged from the EmailJS version so the calling form keeps
 * the same shape. `reply_to` carries the enquirer's own address, so replying to
 * the notification reaches them.
 */
export type FranchiseInquiry = {
  to_email: string;
  reply_to: string;
  enquirer_name: string;
  enquirer_email: string;
  /** Dial code and local number joined, e.g. "+977 9812345678". */
  enquirer_phone: string;
  /** Just the dialling code, e.g. "+977", so the desk can route by country. */
  enquirer_phone_country: string;
  enquirer_location: string;
  enquirer_city: string;
  investment_range: string;
  enquirer_notes: string;
};

/**
 * Sends the enquiry to the franchise desk. Never throws - a failed email must
 * not leave the enquirer thinking they are still mid-submit.
 */
export async function sendFranchiseInquiry(details: FranchiseInquiry): Promise<SendResult> {
  return postToApi({
    kind: 'franchise',
    enquirer_name: details.enquirer_name,
    enquirer_email: details.enquirer_email,
    enquirer_phone: details.enquirer_phone,
    enquirer_phone_country: details.enquirer_phone_country,
    enquirer_location: details.enquirer_location,
    enquirer_city: details.enquirer_city,
    investment_range: details.investment_range,
    enquirer_notes: details.enquirer_notes,
  });
}