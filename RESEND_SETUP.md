# Resend setup

All three public forms — booking confirmations, job applications and franchise
enquiries — post to a single Vercel serverless function, `api/send.ts`, which
calls [Resend](https://resend.com).

Nothing mail-related runs in the browser any more. The visitor's copy of the
site contains no API key and no public key.

---

## 1. One-time setup in Resend

1. Create an account at <https://resend.com> and generate an **API Key**.
2. **Verify a sending domain.** Resend -> Domains -> Add Domain, then
   `healthyhome.com.np` (or a subdomain such as `mail.healthyhome.com.np`).
   Resend gives you DNS records; add them at your DNS provider and wait for
   verification.

   This step is not optional. Without a verified domain, Resend rejects every
   send and the forms will report a failure. `onboarding@resend.dev` works for
   sending to your own address only, and is not a substitute for the real
   domain.

## 2. Environment variables on Vercel

Add these under **Project -> Settings -> Environment Variables**, for Production
(and Preview if you want to test there):

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_TO_EMAIL` | The address that receives everything, e.g. `test.healthyhome@gmail.com` |
| `RESEND_FROM` | A sender on the verified domain, e.g. `Healthy Home <no-reply@healthyhome.com.np>` |

None of these carry a `VITE_` or `NEXT_PUBLIC_` prefix, which is deliberate:
`vite.config.ts` only inlines env vars carrying those prefixes into the client
bundle, so this is what keeps them off the browser. `.env.example` documents the
same three names and the reasoning.

Then **redeploy** — Vercel injects env vars at build time, so an existing
deployment will keep using the old values.

## 3. How booking delivery works

Booking is the one flow with two recipients, and they are deliberately
independent:

1. **The clinic**, at `RESEND_TO_EMAIL`. This send is what decides whether the
   form reports success.
2. **The customer**, at the address they typed.

If the customer's copy fails, the clinic still has the booking and the form
still reports success. If the clinic copy fails, the form reports a failure
rather than implying the booking was received.

Under EmailJS this was not the case — the confirmation went only to the
customer, so the clinic had no server-side copy of a booking at all.

## 4. Job applications and CVs

The CV is read in the browser, base64-encoded into the JSON payload and sent as
a real attachment. Two limits apply:

- Client-side: `pdf`, `doc`, `docx`, `jpg`, `jpeg`, and **2MB** — enforced before
  the file is read, so an oversize file is never loaded into memory.
- Server-side: the same extension list and the same 2MB ceiling are re-checked
  in `api/send.ts`. The browser checks are a convenience for the applicant, not
  a control, because the endpoint is directly callable.

Vercel's request body limit is 4.5MB. A 2MB CV becomes roughly 2.7MB once
base64-encoded, which fits, but it is the reason the ceiling is 2MB and not
higher.

## 5. Rate limiting

`api/send.ts` allows 6 submissions per IP per 10 minutes. This is an in-memory
counter scoped to a single serverless instance, so it blunts casual abuse but
is **not** a hard guarantee — Vercel may serve several instances at once, each
with its own counter. If you expect sustained abuse, put a real limit in front
of the function (Vercel WAF, Cloudflare, or a shared store such as Upstash).

## 6. Local development

`npm run dev` serves only the Vite app. It has **no** `/api/send`, so submitting
a form locally will report a failure. That is correct behaviour, not a bug: the
client cannot tell the difference between "no server" and "server refused", so
it reports the honest thing.

To exercise the function on your machine, run the Vercel CLI instead, which
serves the app and the function together:

```
npm i -g vercel
vercel dev
```

Then add the three variables to a local `.env.local` (already gitignored):

```
RESEND_API_KEY=re_...
RESEND_TO_EMAIL=test.healthyhome@gmail.com
RESEND_FROM=Healthy Home <no-reply@healthyhome.com.np>
```

## 7. Checking it works on Vercel

1. Submit each of the three forms once from the deployed site.
2. Confirm you receive all of them at `RESEND_TO_EMAIL`.
3. For booking, confirm the customer copy arrives too.
4. For a job application, confirm the CV arrives **as an attachment**. If the
   message arrives with no attachment, the file field did not survive the trip.

In Resend, every message must show as **Delivered**. `Rejected` almost always
means an unverified sending domain.

If a form reports success but nothing arrives, check the function log in
Vercel first — the API logs the Resend error server-side, and the browser is
never told the detail on purpose.