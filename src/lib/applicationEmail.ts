import { postToApi, type SendResult } from './api';

/**
 * Job applications via Resend, through the serverless function at /api/send.
 *
 * The signature is unchanged: callers still hand over the form element, and the
 * resume still travels as a real attachment rather than as text in the body.
 * The difference is that the file is read here, base64-encoded into JSON, and
 * validated again on the server - the browser's checks are a convenience for
 * the applicant, not a control, since the endpoint is directly callable.
 *
 * Validate with Resend on Vercel (never in the browser):
 *   RESEND_API_KEY, RESEND_TO_EMAIL, RESEND_FROM
 *
 * `careersEmailConfigured` is retained for compatibility. Configuration moved
 * server-side, so the browser cannot know; the API's own 'not-configured'
 * response is what drives the honest fallback copy in the form.
 */
export const careersEmailConfigured = true;

export type { SendResult };

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
 * Reads the resume out of the form and posts the application.
 *
 * The job fields are read from the form's named inputs rather than passed in,
 * so the caller stays a one-argument call exactly as it was.
 */
export async function sendJobApplication(form: HTMLFormElement): Promise<SendResult> {
  const field = (name: string) => String(new FormData(form).get(name) ?? '').trim();

  const fileInput = form.querySelector<HTMLInputElement>('input[name="applicant_resume"]');
  const file = fileInput?.files?.[0] ?? null;

  let resume: { filename: string; base64: string } | undefined;
  if (file) {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = '';
      // Chunked so a large CV cannot blow the argument limit on String.fromCharCode.
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
      }
      resume = { filename: file.name, base64: btoa(binary) };
    } catch (e) {
      console.error('[careers] could not read the resume file', e);
      return 'failed';
    }
  }

  return postToApi({
    kind: 'career',
    applicant_name: field('applicant_name'),
    applicant_email: field('applicant_email'),
    applicant_phone: field('applicant_phone'),
    applicant_address: field('applicant_address'),
    job_title: field('job_title'),
    job_location: field('job_location'),
    job_department: field('job_department'),
    resume,
  });
}