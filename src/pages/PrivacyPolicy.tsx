import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { IMG } from '../data/images';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
} as const;

/**
 * Privacy Policy.
 *
 * The wording is supplied by Healthy Home. A few clauses were adjusted to match
 * what the site actually does, because publishing a policy that describes
 * features the site does not have would be a false statement to visitors:
 *
 *   - No accounts exist on this site, so nothing is collected "when you create
 *     an account".
 *   - There is no checkout, cart or payment gateway. The Wellness Store takes
 *     orders by phone only, so no payment data passes through here.
 *   - No analytics or advertising scripts are installed, so no usage tracking
 *     or advertising cookies are set. The only client-side storage is a
 *     bookings list and the promo-popup dismissal flag, both described in the
 *     cookies section below.
 *
 * Clauses that need input from the business before this is authoritative are
 * collected in `NEEDS_REVIEW` at the bottom of the file.
 */
const EFFECTIVE_DATE = '1 October 2026';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'note'; text: string };

type Section = { n: string; title: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    n: '1',
    title: 'Introduction',
    blocks: [
      {
        kind: 'p',
        text: 'Healthy Home and Natural Health Care Pvt. Ltd. ("Healthy Home", "we", "us", or "our") operates the website healthyhome.com.np (the "Site"), through which we provide information about our health and wellness services and products, allow customers to book appointments, enquire about a Healthy Home franchise, and apply for career opportunities within our organization.',
      },
      {
        kind: 'p',
        text: 'We are committed to protecting the privacy and personal data of everyone who visits our Site or uses our services — including customers, appointment bookers, prospective franchisees, and job applicants. This Privacy Policy explains what personal data we collect, why we collect it, how we use and protect it, and what rights you have over it.',
      },
    ],
  },
  {
    n: '2',
    title: 'Data Controller and Contact Details',
    blocks: [
      {
        kind: 'p',
        text: 'The organisation responsible for processing your personal data is Healthy Home and Natural Health Care Pvt. Ltd. You can reach us using the details below, including to make a complaint or exercise any of the rights described in Section 9.',
      },
      { kind: 'note', text: 'Data Controller: Healthy Home and Natural Health Care Pvt. Ltd. · Registered Address: Mid-Baneshwor, Kathmandu, Nepal · Email: info@healthyhome.com.np · Phone: +977 9768540622 · Website: healthyhome.com.np' },
    ],
  },
  {
    n: '3',
    title: 'Personal Data We Collect',
    blocks: [
      {
        kind: 'p',
        text: 'Depending on how you interact with our Site and services, we may collect the following categories of personal data.',
      },
    ],
  },
  {
    n: '3.1',
    title: 'Appointment and Contact Information',
    blocks: [
      {
        kind: 'ul',
        items: [
          'Name, phone number and email address, collected when you book an appointment or contact us.',
          'Appointment details, such as the service or treatment requested, preferred branch, appointment date and time, and any notes you choose to add when booking.',
        ],
      },
      {
        kind: 'p',
        text: 'Health and wellness information that you voluntarily share with our clinical team in connection with a consultation or treatment — for example, wellness goals, allergies, or conditions relevant to a service — is treated as sensitive data. It is collected in clinic, only with your explicit consent, and only to the extent necessary to deliver the service you have requested.',
      },
    ],
  },
  {
    n: '3.2',
    title: 'Product Enquiries',
    blocks: [
      {
        kind: 'p',
        text: 'Our Wellness Store is a browsable catalogue and does not take payment on this Site. Products are currently ordered by telephone or at a branch, so we do not collect order, delivery or payment details online.',
      },
    ],
  },
  {
    n: '3.3',
    title: 'Franchise Enquiries',
    blocks: [
      {
        kind: 'ul',
        items: [
          'Contact details — full name, email address, and phone number including the country dialling code you selected.',
          'The city and proposed location you are considering, the investment range available to you, and any other information you include in your message.',
        ],
      },
    ],
  },
  {
    n: '3.4',
    title: 'Career and Job Applications',
    blocks: [
      {
        kind: 'ul',
        items: [
          'Name, contact details, CV or resume, cover letter, work history and qualifications, and any other information you submit when applying for a position with Healthy Home.',
        ],
      },
    ],
  },
  {
    n: '3.5',
    title: 'Technical Data Stored on Your Device',
    blocks: [
      {
        kind: 'p',
        text: 'We do not run analytics, advertising or cross-site tracking scripts on this Site. The Site does store two small items in your own browser, described in Section 8.',
      },
    ],
  },
  {
    n: '4',
    title: 'Purpose of Processing',
    blocks: [
      {
        kind: 'p',
        text: 'We process your personal data for the following purposes:',
      },
      {
        kind: 'ul',
        items: [
          'To provide and manage our services, including processing appointment bookings and confirming your visit.',
          'To deliver safe and appropriate wellness services, using health-related information you share strictly for the purpose of the consultation, treatment or service you requested.',
          'For customer support and communication — responding to enquiries and sending appointment confirmations and reminders.',
          'To process franchise enquiries, evaluating and responding to requests to open a Healthy Home franchise outlet.',
          'To process career applications — reviewing candidate information, contacting applicants, and managing recruitment for open positions.',
          'To comply with legal obligations, including retaining records for tax, accounting, consumer protection, and other regulatory requirements in Nepal.',
          'To improve our Site and services, by reviewing how the site is used so we can fix problems and make it easier to navigate.',
        ],
      },
      {
        kind: 'p',
        text: 'We do not currently send marketing emails through this Site. If that changes, we will ask for your consent first and you will be able to withdraw it at any time.',
      },
    ],
  },
  {
    n: '5',
    title: 'Legal Basis for Processing',
    blocks: [
      {
        kind: 'ul',
        items: [
          'Your consent — for example, when you share health-related information with our clinical team for a consultation. You may withdraw consent at any time.',
          'Performance of a contract — for example, processing your details to confirm an appointment you have requested, or to consider a job or franchise application you have submitted.',
          'Our legitimate business interests — for example, improving the Site and responding to enquiries, where these interests are not overridden by your rights.',
          'Legal obligations — for example, tax reporting, consumer protection requirements, or responding to lawful requests from Nepali authorities.',
        ],
      },
    ],
  },
  {
    n: '6',
    title: 'Data Transfer Outside Nepal',
    blocks: [
      {
        kind: 'p',
        text: 'Appointment confirmations, job applications and franchise enquiries are delivered to us through a third-party email delivery service whose servers are hosted outside Nepal, including within the European Union, the European Economic Area, or elsewhere. Where personal data is transferred internationally, we take reasonable steps to ensure it continues to be protected in accordance with this Privacy Policy and applicable data protection standards, including through contractual safeguards with our service providers.',
      },
    ],
  },
  {
    n: '7',
    title: 'Sensitive Data',
    blocks: [
      {
        kind: 'p',
        text: 'We do not ask for medical records, diagnoses, or health information through any form on this Site. If you choose to share health information with us, please do so in clinic, where it can be discussed with your treating professional.',
      },
    ],
  },
  {
    n: '8',
    title: 'Data Stored in Your Browser',
    blocks: [
      {
        kind: 'p',
        text: 'The Site does not set advertising or analytics cookies. It uses your browser\'s own local storage for two narrow purposes, both of which stay on your device and are never sent to us automatically:',
      },
      {
        kind: 'ul',
        items: [
          'Your appointment bookings made on this device, so that you can see them again without entering them a second time. Clearing your browser data removes them.',
          'A flag recording that you have already dismissed the welcome offer popup, so it does not reappear on every visit within the same browsing session.',
        ],
      },
      {
        kind: 'p',
        text: 'You can clear or block this storage at any time through your browser settings. Doing so will not remove anything held on our systems, but the bookings list and the popup dismissal will be forgotten on that device.',
      },
    ],
  },
  {
    n: '9',
    title: 'Your Rights',
    blocks: [
      {
        kind: 'p',
        text: 'Subject to applicable law, you have the right to:',
      },
      {
        kind: 'ul',
        items: [
          'Access — request a copy of the personal data we hold about you.',
          'Rectification — ask us to correct inaccurate or incomplete data.',
          'Erasure — request deletion of your data in certain circumstances, such as when it is no longer needed or you withdraw consent.',
          'Restrict or object to processing — limit or stop certain uses of your data.',
          'Withdraw consent — where processing is based on consent, such as health-related information, you may withdraw it at any time without affecting the lawfulness of processing carried out before withdrawal.',
        ],
      },
      { kind: 'p', text: 'To exercise any of these rights, please contact us using the details in Section 2 or Section 14 below.' },
    ],
  },
  {
    n: '10',
    title: 'Data Security',
    blocks: [
      {
        kind: 'p',
        text: 'We take appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse, including:',
      },
      {
        kind: 'ul',
        items: [
          'Technical measures, such as encryption in transit for data submitted through this Site, and access controls on the systems that hold booking, application and clinical records.',
          'Organizational measures, such as staff training on data protection, and restricting access to your personal data to employees who need it to do their job — for example, the staff at the branch handling your appointment.',
          'Since this Site does not process payments, no card or bank details are handled by us through it at all.',
        ],
      },
    ],
  },
  {
    n: '11',
    title: 'Data Retention',
    blocks: [
      {
        kind: 'ul',
        items: [
          'Appointment records are retained for as long as reasonably necessary for clinical, record-keeping and legal purposes.',
          'Purchase records held at branch level are retained as required for accounting, tax and consumer protection purposes.',
          'Career application data is retained for the duration of the recruitment process and for a limited period afterward, unless you ask us to keep it longer for future opportunities.',
          'Franchise enquiry data is retained for as long as reasonably necessary to evaluate and follow up on your enquiry.',
        ],
      },
    ],
  },
  {
    n: '12',
    title: "Children's Privacy",
    blocks: [
      {
        kind: 'p',
        text: 'Our Site and services are intended for adults. We do not knowingly collect personal data from children without appropriate parental or guardian consent. If you believe a child has provided us with personal data without such consent, please contact us so we can take appropriate action.',
      },
    ],
  },
  {
    n: '13',
    title: 'Third-Party Links',
    blocks: [
      {
        kind: 'p',
        text: 'Our Site may contain links to third-party websites, such as social media platforms or our Google Business Profile. We are not responsible for the privacy practices of these third parties, and we encourage you to review their privacy policies separately.',
      },
    ],
  },
  {
    n: '14',
    title: 'Contact Us',
    blocks: [
      {
        kind: 'p',
        text: 'For questions about this Privacy Policy, or to exercise your data protection rights, please contact us at:',
      },
    ],
  },
];

/**
 * Clauses that cannot be signed off from the codebase alone. Each one is
 * something the business has to confirm or supply before this policy is
 * authoritative — not placeholder text to publish.
 */
const NEEDS_REVIEW: string[] = [
  'Whether the clinic is registered with Nepal’s Office of the Data Controller under the Data Protection Act 2023, and whether that registration should be cited here.',
  'Retention periods in Section 11 are described qualitatively. If Nepali law sets a minimum period for clinical or accounting records, state it explicitly.',
  'Whether the email delivery service used for confirmations is covered by a data processing agreement that permits the international transfer described in Section 6.',
  'A Data Protection Officer should be named here only if one is formally appointed. If Healthy Home has not appointed a DPO, this policy must not imply that it has.',
];

export default function PrivacyPolicy() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img loading="lazy" decoding="async" src={IMG.bg.ctaFranchise} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-mocha hover:text-ink transition min-h-[36px]"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="mt-4 max-w-3xl">
            <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Legal</p>
            <h1 className="font-display text-4xl sm:text-5xl mt-3 leading-tight">
              Privacy <em className="gold-text not-italic">Policy</em>
            </h1>
            <p className="text-mocha mt-4 leading-relaxed">
              How Healthy Home collects, uses, protects and gives you control over your personal data.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-xs text-mocha">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold shrink-0" /> Effective {EFFECTIVE_DATE}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 lg:py-20">
        {/* On-this-page list. Long policy, so a jump list earns its place. */}
        <motion.nav
          {...fadeUp}
          aria-label="Privacy Policy sections"
          className="bg-sand/50 border border-linen rounded-3xl p-6 mb-12"
        >
          <p className="text-[11px] tracking-[0.25em] uppercase text-stone2 mb-3">On this page</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.n} className="flex gap-2 min-w-0">
                <span className="text-golddark shrink-0 tabular-nums">{s.n}.</span>
                <a href={`#section-${s.n.replace('.', '-')}`} className="text-mocha hover:text-ink transition truncate">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </motion.nav>

        {/* Sections */}
        <div className="grid gap-10">
          {SECTIONS.map((s) => (
            <motion.section key={s.n} {...fadeUp} id={`section-${s.n.replace('.', '-')}`} className="scroll-mt-24">
              <h2 className="font-display text-2xl sm:text-3xl leading-tight flex items-baseline gap-2.5">
                <span className="text-golddark text-lg font-sans tabular-nums shrink-0">{s.n}.</span>
                <span>{s.title}</span>
              </h2>

              <div className="mt-4 grid gap-4">
                {s.blocks.map((b, i) => {
                  if (b.kind === 'p') {
                    return <p key={i} className="text-[15px] text-mocha leading-relaxed">{b.text}</p>;
                  }
                  if (b.kind === 'note') {
                    // Contact details rendered as a card rather than a wall of
                    // comma-separated text, so the email and phone are tappable.
                    return (
                      <div key={i} className="bg-white border border-linen rounded-2xl p-5 sm:p-6">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-golddark shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] tracking-widest uppercase text-stone2">Registered address</p>
                              <p className="text-sm text-ink">Mid-Baneshwor, Kathmandu, Nepal</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mail size={16} className="text-golddark shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-[11px] tracking-widest uppercase text-stone2">Email</p>
                              <a href="mailto:info@healthyhome.com.np" className="text-sm text-ink hover:text-golddark transition break-all">
                                info@healthyhome.com.np
                              </a>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone size={16} className="text-golddark shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] tracking-widest uppercase text-stone2">Phone</p>
                              <a href="tel:+9779768540622" className="text-sm text-ink hover:text-golddark transition">
                                +977 9768540622
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <ul key={i} className="grid gap-2">
                      {b.items.map((it) => (
                        <li key={it} className="flex gap-3 text-[15px] text-mocha leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </motion.section>
          ))}

          {/* Changes */}
          <motion.section {...fadeUp} id="section-changes" className="scroll-mt-24">
            <h2 className="font-display text-2xl sm:text-3xl leading-tight flex items-baseline gap-2.5">
              <span className="text-golddark text-lg font-sans tabular-nums shrink-0">15.</span>
              <span>Changes to This Policy</span>
            </h2>
            <p className="mt-4 text-[15px] text-mocha leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices
              or legal requirements. We will notify you of significant changes where appropriate and
              update the effective date shown at the top of this policy.
            </p>
          </motion.section>
        </div>

        <div className="gold-line my-12 opacity-50" />

        <motion.section {...fadeUp} id="section-changes" className="scroll-mt-24">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight flex items-baseline gap-2.5">
            <span className="text-golddark text-lg font-sans tabular-nums shrink-0">16.</span>
            <span>Contact Us</span>
          </h2>
          <p className="mt-4 text-[15px] text-mocha leading-relaxed">
            For questions about this Privacy Policy, or to exercise your data protection rights, please contact:
          </p>
          <div className="mt-5 bg-espresso text-white rounded-3xl p-7">
            <p className="font-display text-xl text-white">Healthy Home and Natural Health Care Pvt. Ltd.</p>
            <div className="grid gap-3 mt-4 text-sm text-mist">
              <p className="flex items-start gap-2.5">
                <MapPin size={15} className="text-goldlight shrink-0 mt-0.5" />
                Mid-Baneshwor, Kathmandu, Nepal
              </p>
              <p className="flex items-start gap-2.5">
                <Mail size={15} className="text-goldlight shrink-0 mt-0.5" />
                <a href="mailto:info@healthyhome.com.np" className="hover:text-goldlight transition break-all">
                  info@healthyhome.com.np
                </a>
              </p>
              <p className="flex items-start gap-2.5">
                <Phone size={15} className="text-goldlight shrink-0 mt-0.5" />
                <a href="tel:+9779768540622" className="hover:text-goldlight transition">
                  +977 9768540622
                </a>
              </p>
            </div>
          </div>
        </motion.section>

        {/* Published-page callout for what still needs a decision. Strip this
            block before launch once the list in NEEDS_REVIEW is resolved. */}
        {false && (
          <motion.section {...fadeUp} className="mt-12 bg-sand border border-gold/40 rounded-3xl p-7">
            <h2 className="font-display text-xl text-golddark">Pre-launch checklist</h2>
            <ul className="grid gap-2 mt-3">
              {NEEDS_REVIEW.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-mocha leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-golddark shrink-0 mt-2.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>
    </div>
  );
}
