import emailjs from '@emailjs/browser';

/**
 * Franchise inquiry emails via EmailJS.
 *
 * Reuses the same Email Service and Public Key as the booking and careers
 * emails, but points at a *separate* template: the franchise desk fields are
 * nothing like the booking or application ones, and you would not want a
 * franchise lead rendered through a booking receipt.
 *
 * Configure in `.env` at the project root alongside the other three:
 *   VITE_EMAILJS_FRANCHISE_TEMPLATE_ID=template_xxxxxxx
 *   (VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_PUBLIC_KEY are shared)
 *
 * Until that id is set, `franchiseEmailConfigured` is false and the form tells
 * the enquirer to write to franchise@healthyhome.com.np instead of claiming the
 * inquiry was sent.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_FRANCHISE_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

/** Where a franchise lead is sent. Shown to the enquirer as the fallback. */
export const FRANCHISE_INBOX = 'franchise@healthyhome.com.np';

export const franchiseEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export type SendResult = 'sent' | 'not-configured' | 'failed';

/**
 * Field names double as the EmailJS merge fields the template must declare.
 * `reply_to` is set to the enquirer's own address so a direct reply from the
 * franchise desk reaches them.
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
 * Sends the inquiry to the franchise desk. Uses `send` rather than `sendForm`
 * because there is no file to attach, so the values can be sent as typed.
 *
 * Never throws — the caller decides how to surface a failure, and a failed
 * email must not leave the enquirer thinking they are still mid-submit.
 */
export async function sendFranchiseInquiry(details: FranchiseInquiry): Promise<SendResult> {
  if (!franchiseEmailConfigured) return 'not-configured';
  try {
    await emailjs.send(SERVICE_ID as string, TEMPLATE_ID as string, details, { publicKey: PUBLIC_KEY as string });
    return 'sent';
  } catch (e) {
    console.error('[franchise] inquiry email failed', e);
    return 'failed';
  }
}
