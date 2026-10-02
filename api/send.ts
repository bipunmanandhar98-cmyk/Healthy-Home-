import { Resend } from 'resend';

/**
 * Resend endpoint for every public form on the site: bookings, job
 * applications and franchise enquiries.
 *
 * This is the ONLY place RESEND_API_KEY is read. The browser never sees it:
 * the key is not prefixed VITE_ or NEXT_PUBLIC_, and `vite.config.ts` only
 * inlines env vars carrying those prefixes into the client bundle.
 *
 * Design notes worth keeping:
 *
 * - Client-side validation is a convenience, not a control. Every field is
 *   re-validated here, including the CV, because anyone can POST to this
 *   endpoint directly with curl.
 * - Booking is delivered on two independent channels: the clinic and the
 *   customer. They are sent separately and reported separately, so a failure
 *   on the customer copy can never stop the clinic from receiving the
 *   booking. That ordering is the whole point of the booking flow.
 * - Every value that reaches an email body is HTML-escaped first. These are
 *   unauthenticated public inputs; without escaping, anyone could inject
 *   markup into a message that lands in your inbox.
 * - Rate limiting is per serverless instance and therefore best-effort. It
 *   blunts casual abuse but is not a hard guarantee at scale.
 */

const API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.RESEND_TO_EMAIL;
/** Must be a sender on a domain verified in Resend, or sends are rejected. */
const FROM = process.env.RESEND_FROM;

/** Mirrors MAX_RESUME_BYTES in src/lib/applicationEmail.ts. */
const MAX_RESUME_BYTES = 2 * 1024 * 1024;
const RESUME_EXTS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg'];

const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Per-instance limiter. Reset when the instance is recycled. */
const hits = new Map<string, number[]>();

type Result = { ok: boolean; status: number; body: unknown };

type Res = {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => Res;
  json: (body: unknown) => void;
  end: () => void;
};

type Req = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

function fail(res: Res, status: number, error: string, extra: Record<string, unknown> = {}) {
  return res.status(status).json({ error, ...extra });
}

/* ------------------------------------------------------------------ helpers */

/** Anything sent into an email body goes through this. */
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Trims, then hard-caps length so one field cannot flood the message. */
function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map cannot grow without bound on a long-lived
  // instance.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

function clientIp(req: Req): string {
  const fwd = req.headers?.['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw ?? '').split(',')[0]?.trim() || 'unknown';
}

/** Renders the same rows as a table, escaped. Blank values are dropped. */
function rowsHtml(pairs: [string, string][]): string {
  const cells = pairs
    .filter(([, v]) => v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#667477;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:6px 0;color:#172326;font-size:14px">${esc(v).replace(/\n/g, '<br/>')}</td></tr>`
    )
    .join('');
  return `<table style="border-collapse:collapse;margin:0">${cells}</table>`;
}

function emailHtml(heading: string, intro: string, table: string, footer?: string): string {
  return (
    `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;` +
    `max-width:640px;margin:0 auto;color:#172326">` +
    `<h1 style="font-size:22px;margin:0 0 6px">${esc(heading)}</h1>` +
    `<p style="color:#667477;font-size:14px;margin:0 0 18px">${esc(intro)}</p>` +
    `<div style="border:1px solid #D7E5E6;border-radius:12px;padding:16px 18px">${table}</div>` +
    (footer ? `<p style="color:#85999B;font-size:12px;margin:18px 0 0">${esc(footer)}</p>` : '') +
    `</div>`
  );
}

type SendArgs = {
  to: string;
  /** `reply_to` on Resend's payload is spelled with an underscore. */
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** Resend wants `{ filename, content }` with base64 content. */
  attachments?: { filename: string; content: string }[];
};

async function send(resend: Resend, args: SendArgs): Promise<boolean> {
  try {
    const r = await resend.emails.send({
      to: args.to,
      from: FROM as string,
      subject: args.subject,
      html: args.html,
      text: args.text,
      ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      ...(args.attachments ? { attachments: args.attachments } : {}),
    });
    if (r.error) {
      console.error('[api/send] resend rejected:', r.error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[api/send] resend threw:', e);
    return false;
  }
}

/* ------------------------------------------------------------------ handlers */

async function handleBooking(resend: Resend, b: Record<string, unknown>): Promise<Result> {
  const name = str(b.client_name, 120);
  const email = str(b.client_email, 254);
  const phone = str(b.client_phone, 40);
  const code = str(b.booking_code, 24);
  if (!name || !isEmail(email) || !phone) {
    return { ok: false, status: 400, body: { error: 'invalid', message: 'Name, a valid email and a phone number are required.' } };
  }

  const service = str(b.service_name, 120);
  const branch = str(b.branch_name, 120);
  const address = str(b.branch_address, 200);
  const branchPhone = str(b.branch_phone, 40);
  const when = str(b.date_time, 80);
  const notes = str(b.client_notes, 2000);

  const pairs: [string, string][] = [
    ['Booking code', code],
    ['Client', name],
    ['Phone', phone],
    ['Email', email],
    ['Service', service],
    ['Branch', branch],
    ['Branch address', address],
    ['Branch phone', branchPhone],
    ['Date & time', when],
    ['Notes', notes],
  ];
  const table = rowsHtml(pairs);

  // Channel 1: the clinic. This must not depend on anything else succeeding.
  const clinicOk = await send(resend, {
    to: TO_EMAIL as string,
    replyTo: email,
    subject: `New booking ${code} - ${name} - ${branch || 'branch not set'}`,
    html: emailHtml('New booking received', 'Submitted from healthyhome.com.np', table),
    text: ['New booking received', ...pairs.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join('\n'),
  });

  if (!clinicOk) {
    return { ok: false, status: 502, body: { error: 'resend-failed', message: 'The clinic copy could not be sent.' } };
  }

  // Channel 2: the customer's own confirmation. Best effort by design - the
  // booking is already safely with the clinic by this point.
  let customerOk = false;
  try {
    customerOk = await send(resend, {
      to: email,
      subject: `Your Healthy Home booking ${code}`,
      html: emailHtml(
        `You're booked, ${name.split(' ')[0]}!`,
        'Here are the details of your appointment.',
        rowsHtml([
          ['Reference', code],
          ['Service', service],
          ['Branch', branch],
          ['Address', address],
          ['Phone', branchPhone],
          ['Date & time', when],
          ...(notes ? ([['Your notes', notes]] as [string, string][]) : []),
        ]),
        'If you need to change or cancel, call the branch and quote your reference.'
      ),
      text: [
        `You're booked, ${name.split(' ')[0]}!`,
        `Reference: ${code}`,
        service && `Service: ${service}`,
        branch && `Branch: ${branch}`,
        address && `Address: ${address}`,
        branchPhone && `Phone: ${branchPhone}`,
        when && `Date & time: ${when}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  } catch (e) {
    console.error('[api/send] customer confirmation failed (booking still delivered):', e);
  }

  return {
    ok: true,
    status: 200,
    body: { ok: true, clinic: 'sent', customer: customerOk ? 'sent' : 'failed' },
  };
}

async function handleCareer(resend: Resend, b: Record<string, unknown>): Promise<Result> {
  const name = str(b.applicant_name, 120);
  const email = str(b.applicant_email, 254);
  const phone = str(b.applicant_phone, 40);
  const address = str(b.applicant_address, 300);
  const jobTitle = str(b.job_title, 160);
  if (!name || !isEmail(email) || !phone || !address) {
    return { ok: false, status: 400, body: { error: 'invalid', message: 'Name, a valid email, phone number and address are required.' } };
  }

  const location = str(b.job_location, 120);
  const department = str(b.job_department, 120);

  // The CV is re-validated here. The browser's checks are trivially bypassed by
  // posting directly to this endpoint.
  const resume = (b.resume ?? null) as { filename?: unknown; contentType?: unknown; base64?: unknown } | null;
  let attachments: { filename: string; content: string }[] | undefined;

  if (resume && typeof resume === 'object' && resume.base64) {
    const filename = str(resume.filename, 120);
    const b64 = typeof resume.base64 === 'string' ? resume.base64 : '';
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (!RESUME_EXTS.includes(ext)) {
      return { ok: false, status: 400, body: { error: 'invalid', field: 'resume', message: 'Resume must be a PDF, DOC, DOCX or JPG file.' } };
    }
    if (!b64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(b64.slice(0, 256))) {
      return { ok: false, status: 400, body: { error: 'invalid', field: 'resume', message: 'Resume could not be read.' } };
    }
    // ~4 base64 chars per 3 bytes, so this catches oversize before decoding.
    if ((b64.length * 3) / 4 > MAX_RESUME_BYTES * 1.05) {
      return { ok: false, status: 413, body: { error: 'too-large', field: 'resume', message: 'Resume must be 2MB or smaller.' } };
    }
    let bytes: Buffer;
    try {
      bytes = Buffer.from(b64, 'base64');
    } catch {
      return { ok: false, status: 400, body: { error: 'invalid', field: 'resume', message: 'Resume could not be decoded.' } };
    }
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_RESUME_BYTES) {
      return { ok: false, status: 413, body: { error: 'too-large', field: 'resume', message: 'Resume must be 2MB or smaller.' } };
    }
    attachments = [{ filename, content: bytes.toString('base64') }];
  }

  const pairs: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Address', address],
    ['Role', jobTitle],
    ['Location', location],
    ['Department', department],
    ['CV', attachments ? attachments[0]!.filename : 'not attached'],
  ];

  const ok = await send(resend, {
    to: TO_EMAIL as string,
    replyTo: email,
    subject: `Application - ${jobTitle || 'career enquiry'} - ${name}`,
    html: emailHtml('New job application', 'Submitted from healthyhome.com.np', rowsHtml(pairs)),
    text: ['New job application', ...pairs.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join('\n'),
    attachments,
  });

  if (!ok) {
    return { ok: false, status: 502, body: { error: 'resend-failed', message: 'The application could not be emailed.' } };
  }
  return { ok: true, status: 200, body: { ok: true, cv: attachments ? 'attached' : 'missing' } };
}

async function handleFranchise(resend: Resend, b: Record<string, unknown>): Promise<Result> {
  const name = str(b.enquirer_name, 120);
  const email = str(b.enquirer_email, 254);
  const phone = str(b.enquirer_phone, 40);
  const city = str(b.enquirer_city, 120);
  const investment = str(b.investment_range, 80);
  if (!name || !isEmail(email) || !phone) {
    return { ok: false, status: 400, body: { error: 'invalid', message: 'Name, a valid email and a phone number are required.' } };
  }
  if (!city || !investment) {
    return { ok: false, status: 400, body: { error: 'invalid', message: 'A city and an investment range are required.' } };
  }

  const dial = str(b.enquirer_phone_country, 12);
  const proposed = str(b.enquirer_location, 200);
  const notes = str(b.enquirer_notes, 4000);

  const pairs: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Dial code', dial],
    ['City', city],
    ['Proposed location', proposed],
    ['Investment available', investment],
    ['Message', notes],
  ];

  const ok = await send(resend, {
    to: TO_EMAIL as string,
    replyTo: email,
    subject: `Franchise enquiry - ${city} - ${name}`,
    html: emailHtml('New franchise enquiry', 'Submitted from healthyhome.com.np', rowsHtml(pairs)),
    text: ['New franchise enquiry', ...pairs.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join('\n'),
  });

  if (!ok) {
    return { ok: false, status: 502, body: { error: 'resend-failed', message: 'The enquiry could not be emailed.' } };
  }
  return { ok: true, status: 200, body: { ok: true } };
}

/* ------------------------------------------------------------------- routing */

export default async function handler(req: Req, res: Res) {
  // Vercel sets CORS on its own; only the method gate matters here.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'method');
  }

  if (!API_KEY) {
    console.error('[api/send] RESEND_API_KEY is not set on the server');
    return fail(res, 503, 'not-configured');
  }
  if (!TO_EMAIL) {
    console.error('[api/send] RESEND_TO_EMAIL is not set on the server');
    return fail(res, 503, 'not-configured');
  }
  if (!FROM) {
    console.error('[api/send] RESEND_FROM is not set on the server');
    return fail(res, 503, 'not-configured');
  }

  if (rateLimited(clientIp(req))) {
    return fail(res, 429, 'rate-limited', { message: 'Too many submissions. Please try again shortly.' });
  }

  let payload: Record<string, unknown>;
  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('not an object');
    payload = raw as Record<string, unknown>;
  } catch {
    return fail(res, 400, 'invalid', { message: 'Request body must be a JSON object.' });
  }

  const resend = new Resend(API_KEY);
  let result: Result;
  try {
    switch (payload.kind) {
      case 'booking':
        result = await handleBooking(resend, payload);
        break;
      case 'career':
        result = await handleCareer(resend, payload);
        break;
      case 'franchise':
        result = await handleFranchise(resend, payload);
        break;
      default:
        return fail(res, 400, 'invalid', { message: 'Unknown form kind.' });
    }
  } catch (e) {
    console.error('[api/send] handler threw:', e);
    return fail(res, 500, 'server-error');
  }

  return res.status(result.status).json(result.body);
}