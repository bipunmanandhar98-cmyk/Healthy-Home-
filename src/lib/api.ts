/**
 * Shared transport for the three form submissions.
 *
 * Everything now goes through the Vercel serverless function at /api/send
 * rather than EmailJS from the browser. The consequence is that the browser no
 * longer holds any mail credentials: there is no API key and no public key in
 * the client bundle at all.
 *
 * `SendResult` is unchanged from the EmailJS era so the calling forms and their
 * success/error UI are untouched.
 */

export type SendResult = 'sent' | 'not-configured' | 'failed';

const ENDPOINT = '/api/send';

/**
 * POSTs to the API and maps the response onto the three existing states.
 *
 * Never throws. The forms treat a rejected email as a display problem, not a
 * reason to lose the submission, so a network or server fault has to resolve to
 * 'failed' rather than an exception that would surface as a crash.
 */
export async function postToApi(payload: Record<string, unknown>): Promise<SendResult> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Offline, DNS failure, or the function not deployed. Indistinguishable
    // from here, and all we can honestly report is that nothing was sent.
    return 'failed';
  }

  // The API answering with HTML instead of JSON means the SPA fallback rewrite
  // swallowed /api. That is a deployment misconfiguration, not a form problem,
  // and it must not be reported as a successful send.
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    console.error('[api] expected JSON from /api/send, got:', contentType || 'no content-type');
    return 'failed';
  }

  let body: { error?: string } = {};
  try {
    body = (await res.json()) as { error?: string };
  } catch {
    return 'failed';
  }

  if (res.ok) return 'sent';
  // The server has no credentials, so it could not have sent anything. This is
  // the same state the EmailJS version reported, and the forms already have
  // honest copy for it.
  if (res.status === 503 || body.error === 'not-configured') return 'not-configured';
  return 'failed';
}