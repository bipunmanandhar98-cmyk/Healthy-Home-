import emailjs from '@emailjs/browser';

/**
 * Booking confirmation email via EmailJS.
 *
 * Configure with a .env file at the project root:
 *   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *   VITE_EMAILJS_PUBLIC_KEY=your_public_key
 *   VITE_EMAILJS_REPLY_TO=bookings@healthyhome.com.np   (optional)
 *
 * Until those are set, emailConfigured is false and the UI says so rather than
 * claiming a message was sent.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const REPLY_TO = import.meta.env.VITE_EMAILJS_REPLY_TO as string | undefined;

export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export type BookingEmail = {
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

export type SendResult = 'sent' | 'not-configured' | 'failed';

/**
 * Sends the confirmation to the client. Never throws — a failed email must not
 * lose the booking, and the caller decides how to surface it.
 */
export async function sendBookingConfirmation(details: BookingEmail): Promise<SendResult> {
  if (!emailConfigured) return 'not-configured';
  try {
    await emailjs.send(SERVICE_ID as string, TEMPLATE_ID as string, details, { publicKey: PUBLIC_KEY as string });
    return 'sent';
  } catch (e) {
    console.error('[booking] confirmation email failed', e);
    return 'failed';
  }
}
