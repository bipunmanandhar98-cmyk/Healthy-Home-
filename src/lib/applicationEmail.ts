import emailjs from '@emailjs/browser';

/**
 * Job application emails via EmailJS.
 *
 * Reuses the same EmailJS account as the booking confirmation but points at a
 * *separate* template, because a careers template needs its own merge fields
 * (including an attachment slot for the resume) and you would not want an
 * application rendered through the booking template.
 *
 * Configure alongside the booking vars in `.env`:
 *   VITE_EMAILJS_CAREERS_TEMPLATE_ID=template_xxxxxxx
 *   (VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_PUBLIC_KEY are shared)
 *
 * Until the careers template id is set, `careersEmailConfigured` is false and
 * the UI says the application was not sent rather than claiming it was.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CAREERS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export const careersEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export type SendResult = 'sent' | 'not-configured' | 'failed';

/** Resume ceiling enforced before the file is ever read, matching the form copy. */
export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

export const RESUME_ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg';
const RESUME_EXTS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg'];

/** Returns an error message, or null when the file is acceptable. */
export function validateResume(file: File | null): string | null {
  if (!file) return 'Please attach your resume.';
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!RESUME_EXTS.includes(ext)) return 'Resume must be a PDF, DOCX or JPG file.';
  if (file.size > MAX_RESUME_BYTES) {
    return `Resume is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 2MB.`;
  }
  return null;
}

/**
 * Sends the application. Uses `sendForm` rather than `send` so the resume
 * input is uploaded as an attachment instead of being flattened into a text
 * field. Never throws — the caller decides how to surface a failure.
 */
export async function sendJobApplication(form: HTMLFormElement): Promise<SendResult> {
  if (!careersEmailConfigured) return 'not-configured';
  try {
    await emailjs.sendForm(SERVICE_ID as string, TEMPLATE_ID as string, form, { publicKey: PUBLIC_KEY as string });
    return 'sent';
  } catch (e) {
    console.error('[careers] application email failed', e);
    return 'failed';
  }
}
