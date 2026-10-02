# EmailJS setup

Three things on this site send email through [EmailJS](https://www.emailjs.com):
appointment confirmations, job applications, and franchise enquiries.

**None of them are configured yet.** Until they are, the site still works — it
validates, stores and confirms — but it tells the visitor honestly that no
email was sent and points them at a phone number or inbox instead. It never
claims a message was delivered when it was not.

That applies to **booking confirmations today**, which is the site's main
conversion action. Every visitor is currently asked to phone in to confirm.

---

## 1. One-time account setup

1. Create a free account at <https://www.emailjs.com>.
2. **Add Email Service** — connect a Gmail account, or an SMTP provider.
   Note the **Service ID** it generates, e.g. `service_abc123`.
3. Copy your **Public Key** from Account → General.
4. Create the three templates below. Each needs its own template because they
   send different fields.
5. Add the four values to a `.env` file in the project root (same folder as
   `package.json`).

```
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_booking
VITE_EMAILJS_CAREERS_TEMPLATE_ID=template_careers
VITE_EMAILJS_FRANCHISE_TEMPLATE_ID=template_franchise
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjK
```

Restart the dev server afterwards — Vite reads `.env` at startup, so nothing
changes until you do.

`.env` is now in `.gitignore`, so it will not be committed. `.env.example` is
the committed template.

---

## 2. Booking confirmation

Fields the site sends: `to_email`, `reply_to`, `client_name`, `booking_code`,
`service_name`, `branch_name`, `branch_address`, `branch_phone`, `date_time`,
`client_phone`, `client_notes`.

**Subject:** `Your Healthy Home booking {{booking_code}}`

```
Hi {{client_name}},

Your {{service_name}} appointment at {{branch_name}} is confirmed.

  Date and time:  {{date_time}}
  Branch:         {{branch_name}}
  Address:        {{branch_address}}
  Phone:          {{branch_phone}}
  Reference:      {{booking_code}}

{{#if client_notes}}
What you told us:
{{client_notes}}
{{/if}}

If you need to change or cancel, call {{branch_phone}} and quote
{{booking_code}}.

— Healthy Home
```

Set **To Email** to `{{to_email}}` and **Reply To** to `{{reply_to}}` in the
template settings, so replies go straight to the visitor.

---

## 3. Job application

Fields: `to_email`, `reply_to`, `applicant_name`, `applicant_email`,
`applicant_phone`, `applicant_address`, `applicant_resume`, `job_title`,
`job_location`, `job_department`.

**Subject:** `Application — {{job_title}}`

```
New application for {{job_title}} ({{job_location}}, {{job_department}})

  Name:     {{applicant_name}}
  Email:    {{applicant_email}}
  Phone:    {{applicant_phone}}
  Address:  {{applicant_address}}

Resume attached.

— sent from healthyhome.com.np
```

Set **To Email** to `{{to_email}}` and **Reply To** to `{{reply_to}}`.

### The resume attachment

The site uploads the CV as a real attachment, not as pasted text. EmailJS only
attaches files that have an attachment slot, so in this template:

- Add a new variable, name it `applicant_resume`, and set its type to
  **Attachment**.

If you skip this the resume will arrive as an empty string. That is the single
most likely mistake in this whole setup.

---

## 4. Franchise enquiry

Fields: `to_email`, `reply_to`, `enquirer_name`, `enquirer_email`,
`enquirer_phone`, `enquirer_phone_country`, `enquirer_location`,
`enquirer_city`, `investment_range`, `enquirer_notes`.

**Subject:** `Franchise enquiry — {{enquirer_city}}`

```
New franchise enquiry.

  Name:            {{enquirer_name}}
  Email:           {{enquirer_email}}
  Phone:           {{enquirer_phone}}   ({{enquirer_phone_country}})
  City:            {{enquirer_city}}
  Investment:      {{investment_range}}
{{#if enquirer_location}}
  Proposed site:   {{enquirer_location}}
{{/if}}
{{#if enquirer_notes}}
  Their message:
{{enquirer_notes}}
{{/if}}

— sent from healthyhome.com.np
```

Set **To Email** to `{{to_email}}` and **Reply To** to `{{reply_to}}`.

---

## 5. Check it worked

Reload the site. Submit each of the three forms once with your own address and
confirm you receive all three messages.

Until the ids are set the UI says so explicitly. If a form claims success but
nothing arrives, the id in `.env` is wrong or the dev server was not restarted.

**A note on limits:** EmailJS's free tier caps around 200 emails a month. That
is fine for confirmations, but it will run out if the site gets busy. When that
happens the forms keep working and keep telling visitors to phone — but you
will stop receiving the enquiries.
