import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Store, Rocket, TrendingUp, Handshake, Lightbulb,
  Target, Package, Megaphone, UserCheck, GraduationCap, BarChart2, ShieldCheck,
  Stethoscope, Quote, Check, ChevronDown, MapPin, Phone, Mail, ArrowRight, Clock
} from 'lucide-react';
import { useBooking } from '../components/chrome';
import { SectionHead, CtaBanner } from '../components/shared';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
} as const;

/* ---------------------------------- data ---------------------------------- */

const stats = [
  { value: '6', label: 'Branch Running', icon: Store },
  { value: '20+', label: 'Years in Wellness', icon: Clock },
  { value: '60K+', label: 'Clients Served', icon: UserCheck },
  { value: '94%', label: 'Client Retention', icon: TrendingUp },
];

const pillars = [
  {
    icon: Stethoscope,
    t: 'Physician-Led Model',
    s: 'Every franchise centre runs the same MD-directed clinical protocol as our flagship stores. You never have to invent care standards — they are already written, trained and audited.',
  },
  {
    icon: Package,
    t: 'Turn-Key Setup',
    s: 'Site selection, interiors, equipment, licensing and staffing are handled end-to-end by our central team. You arrive to a centre that is ready to take bookings.',
  },
  {
    icon: Megaphone,
    t: 'National Marketing',
    s: 'You inherit a brand clients already trust. Central handles digital ads, social, SEO, PR and launch campaigns across every territory.',
  },
  {
    icon: GraduationCap,
    t: 'Academy & Training',
    s: '100+ hours of clinical and service training before you open, then continuous certification for your entire team — delivered at our Thapathali academy.',
  },
  {
    icon: BarChart2,
    t: 'Live Business Dashboard',
    s: 'Real-time revenue, utilisation, rebooking and unit economics in one place. Monthly reviews with a regional manager who has opened branches before you.',
  },
  {
    icon: ShieldCheck,
    t: 'Quality Assurance',
    s: 'Mystery-client audits, clinical outcome reviews and client NPS tracking. The Healthy Home name is protected — consistently — because the standard is non-negotiable.',
  },
];

type Format = {
  id: string;
  name: string;
  tagline: string;
  investment: string;
  area: string;
  setup: string;
  royalty: string;
  best: string;
  includes: string[];
  featured?: boolean;
};

const formats: Format[] = [
  {
    id: 'express',
    name: 'Express Centre',
    tagline: 'Fastest route to an owned Healthy Home.',
    investment: 'Rs. 35–50 Lakh',
    area: '900–1,400 sq ft',
    setup: '5–7 months',
    royalty: '6% of net revenue',
    best: 'First-time franchisees and tier-2 cities',
    includes: [
      '1 treatment room + consultation room',
      'Body composition analysis (BCA) + BMI station',
      'Core services: weight management, skin care, lab collection',
      '2 treatment beds, sterilisation and consultation setup',
      'Central booking and CRM system',
      'Owner-operates, with a trained clinical assistant',
    ],
  },
  {
    id: 'signature',
    name: 'Signature Centre',
    tagline: 'Our full-service flagship format. Most chosen.',
    investment: 'Rs. 75 Lakh – 1.2 Crore',
    area: '2,000–3,000 sq ft',
    setup: '8–10 months',
    royalty: '5% of net revenue',
    best: 'Established operators in metro areas',
    featured: true,
    includes: [
      'Everything in Express, plus 4–6 treatment rooms',
      'Dedicated dermatology suite with laser & device capability',
      'In-house phlebotomy and lab sample collection',
      'Full sub-service catalogue: weight, skin, hair, aesthetics',
      'Membership programme desk and retail product wall',
      'Dedicated centre manager plus a trained clinical team of 5+',
    ],
  },
  {
    id: 'flagship',
    name: 'Flagship Destination',
    tagline: 'Regional landmark and training hub.',
    investment: 'Rs. 1.5–2.5 Crore',
    area: '4,000–6,000 sq ft',
    setup: '12–15 months',
    royalty: '4% of net revenue',
    best: 'High-footfall metro and regional hubs',
    includes: [
      'Everything in Signature, plus dedicated procedure theatre',
      'Advanced body-shaping and CoolSculpting suite',
      'Full diagnostics: in-house lab, BCA, ECG, nutrition clinic',
      'Dedicated wellness café and retail lounge',
      'Regional staff training and certification centre',
      'Large-format rebrand, signage and launch programme',
    ],
  },
];

const steps = [
  { n: '01', t: 'Enquiry & Profile', s: 'Share your interest. We send the franchise prospectus, unit economics and territory availability map within 48 hours.' },
  { n: '02', t: 'Discovery Call', s: 'A 45-minute call with our franchising director. Honest numbers, real break-even timelines, and answers to every hard question.' },
  { n: '03', t: 'Site Visit', s: 'Visit a Healthy Home centre near you. Sit in on a consultation day, meet the team, and see the operating rhythm first-hand.' },
  { n: '04', t: 'Agreement', s: 'We lock your territory, agree the fee structure and sign the franchise agreement. No hidden clauses, everything in writing.' },
  { n: '05', t: 'Build & Train', s: 'Design, licensing, equipment, installation and 100+ hours of clinical training for you and your team.' },
  { n: '06', t: 'Open & Support', s: 'Soft launch, then grand opening with central marketing push. After that, monthly reviews for as long as you hold the franchise.' },
];

const weProvide = [
  'Brand identity, signage and store design',
  'Central marketing and lead generation',
  'Clinical protocols and quality audits',
  'Recruitment and staff training academy',
  'Procurement at factory-direct pricing',
  'Insurance, licensing and compliance',
  'Revenue-share booking platform',
  '24/7 franchise support desk',
];

const youProvide = [
  'The investment capital and working capital buffer',
  'Your day-to-day operations and team leadership',
  'A compliant, welcoming centre that upholds the standard',
  'Honest local marketing and client relationships',
  'Timely reporting through the business dashboard',
  'A commitment to continuous clinical learning',
];

const faqList = [
  {
    q: 'Who can become a Healthy Home franchisee?',
    a: 'Any legally eligible individual, partnership or company with the required capital and a genuine commitment to clinical quality. We do not discriminate on the basis of religion, caste, gender or background — but we do insist on verified business capability and a clean track record. Both first-time entrepreneurs and experienced multi-brand operators have succeeded with us.',
  },
  {
    q: 'What is the total investment required?',
    a: 'Investment ranges from Rs. 35 Lakh for an Express Centre to Rs. 2.5 Crore for a Flagship Destination. This covers the franchise fee, interiors, equipment, initial inventory, licensing and pre-opening training. We recommend keeping an additional 3–4 months of operating capital as a working-capital buffer, which is not included in the figure.',
  },
  {
    q: 'Is there a franchise fee and ongoing royalty?',
    a: 'Yes. A one-time franchise fee is charged on signing, with a structured payment plan available. The ongoing royalty is a percentage of monthly net revenue and decreases with format size — 6% for Express, 5% for Signature and 4% for Flagship. Marketing contributions are bundled into the royalty; there is no separate ad-levy.',
  },
  {
    q: 'Do I need a healthcare or medical background?',
    a: 'No. A medical degree is not required to hold a franchise — we hire and train the clinical staff, including the treating physician. You do need business aptitude and a hands-on leadership style. Many of our most successful partners came from hospitality, retail or healthcare administration rather than medicine.',
  },
  {
    q: 'What territory will I get?',
    a: 'Territories are assigned by geography and are exclusive. Once your agreement is signed, the area is ring-fenced — no second Healthy Home centre is approved within your catchment. We will also map a realistic radius around your chosen site using our existing centre data and footfall analysis.',
  },
  {
    q: 'How long before my centre breaks even?',
    a: 'Signature and Flagship branches typically reach monthly break-even between month 9 and month 18, depending on location, format and how early the branch opens. We will walk you through a conservative financial projection using your specific site data during the discovery call — and we will tell you honestly if a location is not viable.',
  },
  {
    q: 'What training is provided before opening?',
    a: 'Every franchisee completes a minimum of 100 hours at the Healthy Home academy covering clinical protocols, service delivery, the booking and CRM system, sales consulting and compliance. Your clinical team completes a separate certification track. Training continues after opening through quarterly refreshers and new-service modules.',
  },
  {
    q: 'Can I sell or transfer my franchise later?',
    a: 'Franchise rights are transferable subject to our approval and a transfer fee, provided the buyer meets the same financial and quality criteria. We vet every incoming operator because the client experience and the brand name must be protected. Exit terms are spelled out clearly in the agreement from day one.',
  },
];

/* -------------------------------- component ------------------------------- */

export default function Franchise() {
  const { openBooking } = useBooking();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openFormat, setOpenFormat] = useState<string | null>('signature');

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-xs text-stone2 flex items-center gap-1.5">
        <Link to="/" className="hover:text-ink inline-flex items-center min-h-[36px]">Home</Link>
        <span className="text-stone2">&rsaquo;</span>
        <span className="text-ink font-medium">Franchise</span>
      </div>

      {/* Hero */}
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img loading="lazy" decoding="async" src="/images/site/bg-cta.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Franchise Opportunities</p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 leading-tight">
              Own a <em className="gold-text not-italic">Healthy Home.</em>
            </h1>
            <p className="text-mocha mt-5 leading-relaxed max-w-lg">
              Six branches. Twenty years. One standard. Bring a proven wellness brand to your city with a
              turn-key setup, a physician-led clinical model, national marketing and a territory that is
              yours alone.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button
                onClick={() => openBooking()}
                className="bg-gold hover:bg-[#00747B] text-white px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase shadow-lg shadow-[#00919A]/25 flex items-center gap-2"
              >
                Request Prospectus <ArrowRight size={15} />
              </button>
              <a
                href="#formats"
                className="border border-ink/25 text-ink px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-sand"
              >
                Explore Formats
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-xs text-mocha">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Exclusive territory</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Turn-key setup</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> 100+ training hours</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-linen shadow-sm rounded-2xl p-6 text-center">
                <div className="w-11 h-11 mx-auto rounded-xl bg-gold/15 flex items-center justify-center mb-2">
                  <s.icon size={20} className="text-golddark" />
                </div>
                <p className="font-display text-3xl gold-text font-semibold">{s.value}</p>
                <p className="text-[11px] tracking-widest uppercase text-stone2 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        {/* Why partner with us */}
        <motion.section {...fadeUp} className="py-16">
          <SectionHead
            eyebrow="Why Partner With Us"
            title={<>A proven system, <em className="gold-text not-italic">ready to run</em></>}
            sub="You are not buying a logo. You are buying a clinical standard, a service playbook and a support team that has already made the mistakes for you."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {pillars.map((p, i) => (
              <motion.div
                key={p.t}
                {...fadeUp}
                transition={{ delay: (i % 3) * 0.08 }}
                className="bg-white border border-linen rounded-3xl p-7 hover:shadow-xl transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center">
                  <p.icon size={22} className="text-golddark" />
                </div>
                <p className="font-display text-2xl mt-4">{p.t}</p>
                <p className="text-sm text-mocha mt-2 leading-relaxed">{p.s}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Store formats */}
      <section id="formats" className="bg-sand/60 border-y border-linen scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <SectionHead
            eyebrow="Three Formats"
            title={<>Choose the scale that <em className="gold-text not-italic">fits your city</em></>}
            sub="Every format runs the same clinical protocols, the same CRM and the same brand standards. What changes is size, service depth and royalty rate."
          />

          <div className="grid lg:grid-cols-3 gap-5 mt-10 items-start">
            {formats.map((f, i) => {
              const isOpen = openFormat === f.id;
              return (
                <motion.div
                  key={f.id}
                  {...fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-white rounded-3xl border overflow-hidden transition ${
                    f.featured ? 'border-gold shadow-xl lg:-mt-4 lg:mb-4' : 'border-linen hover:shadow-lg'
                  }`}
                >
                  {f.featured && (
                    <div className="bg-gold text-white text-center text-[10px] tracking-[0.25em] uppercase py-2 font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-3xl leading-tight">{f.name}</h3>
                        <p className="text-sm text-mocha mt-1">{f.tagline}</p>
                      </div>
                      <div className="w-11 h-11 rounded-2xl bg-gold/15 flex items-center justify-center shrink-0">
                        <Building2 size={20} className="text-golddark" />
                      </div>
                    </div>

                    <p className="font-display text-3xl gold-text font-semibold mt-5">{f.investment}</p>
                    <p className="text-[11px] tracking-widest uppercase text-stone2 mt-1">Total Investment</p>

                    <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                      {[
                        { l: 'Area', v: f.area },
                        { l: 'Setup', v: f.setup },
                        { l: 'Royalty', v: f.royalty },
                      ].map((m) => (
                        <div key={m.l} className="bg-cream border border-linen rounded-xl px-2 py-3">
                          <p className="text-[11px] font-medium text-ink leading-tight">{m.v}</p>
                          <p className="text-[9px] tracking-widest uppercase text-stone2 mt-1">{m.l}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setOpenFormat(isOpen ? null : f.id)}
                      className="w-full mt-5 flex items-center justify-center gap-2 border border-ink/20 rounded-full py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-gold hover:text-white hover:border-gold transition"
                    >
                      {isOpen ? 'Hide Inclusions' : "What's Included"}
                      <ChevronDown size={14} className={isOpen ? 'rotate-180 transition' : 'transition'} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-4 grid gap-2">
                            {f.includes.map((inc) => (
                              <li key={inc} className="flex items-start gap-2 text-sm text-mocha bg-cream border border-linen rounded-xl px-4 py-2.5">
                                <Check size={14} className="text-gold shrink-0 mt-0.5" />
                                {inc}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-xs text-stone2 mt-5 pt-4 border-t border-linen flex items-start gap-2">
                      <Target size={13} className="shrink-0 mt-0.5 text-gold" />
                      <span><strong className="text-ink">Best suited for:</strong> {f.best}</span>
                    </p>

                    <button
                      onClick={() => openBooking()}
                      className="w-full mt-5 bg-gold hover:bg-[#00747B] text-white rounded-full py-3 text-[11px] tracking-[0.15em] uppercase font-medium transition"
                    >
                      Enquire About {f.name}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs text-stone2 mt-8">
            Figures are indicative and exclusive of working capital. Final investment depends on city, site and fit-out.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* How it works */}
        <motion.section {...fadeUp} className="py-16">
          <SectionHead
            eyebrow="How It Works"
            title={<>From enquiry to <em className="gold-text not-italic">opening day</em></>}
            sub="Six clear stages, roughly 8–12 months depending on the format you choose."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ delay: (i % 3) * 0.08 }}
                className="relative bg-white border border-linen rounded-3xl p-7 overflow-hidden"
              >
                <span className="absolute top-4 right-6 font-display text-6xl text-sand leading-none font-semibold select-none">
                  {s.n}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-gold/15 flex items-center justify-center relative">
                  <Rocket size={19} className="text-golddark" />
                </div>
                <p className="font-display text-2xl mt-4 relative">{s.t}</p>
                <p className="text-sm text-mocha mt-2 leading-relaxed relative">{s.s}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Support split */}
        <motion.section {...fadeUp} className="pb-16">
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-espresso text-white rounded-3xl p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Handshake size={22} className="text-goldlight" />
              </div>
              <h3 className="font-display text-3xl mt-4 text-white">What Healthy Home Provides</h3>
              <p className="text-mist text-sm mt-2">The heavy lifting, so you can focus on clients.</p>
              <ul className="grid sm:grid-cols-2 gap-2.5 mt-6">
                {weProvide.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-mist bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <Check size={14} className="text-goldlight shrink-0 mt-0.5" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-linen rounded-3xl p-8 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center">
                <Lightbulb size={22} className="text-golddark" />
              </div>
              <h3 className="font-display text-3xl mt-4">What You Bring</h3>
              <p className="text-mocha text-sm mt-2">Capital, commitment and a hands-on leadership style.</p>
              <ul className="grid sm:grid-cols-2 gap-2.5 mt-6">
                {youProvide.map((y) => (
                  <li key={y} className="flex items-start gap-2 text-sm text-mocha bg-cream border border-linen rounded-xl px-4 py-3">
                    <Check size={14} className="text-gold shrink-0 mt-0.5" />
                    {y}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Testimonial */}
        <motion.section {...fadeUp} className="pb-16">
          <div className="max-w-4xl mx-auto text-center bg-white border border-linen rounded-3xl p-8 sm:p-12">
            <Quote size={30} className="text-gold mx-auto" />
            <p className="font-display text-2xl sm:text-3xl leading-snug mt-4 italic">
              "I had run two retail brands before this. Healthy Home was the only franchise where the
              playbook was this clear — and the only one where the clinical side was genuinely
              non-negotiable. We broke even in month 14."
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <img loading="lazy" decoding="async" src="/images/site/avatar-1.jpg" alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="text-left">
                <p className="font-medium text-sm">Rajan Karki</p>
                <p className="text-xs text-stone2">Signature Centre Franchisee &middot; Pokhara</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section {...fadeUp} className="pb-20">
          <SectionHead
            eyebrow="Franchise FAQ"
            title={<>Questions, <em className="gold-text not-italic">answered straight</em></>}
            sub="No sales fog. If something is not in here, ask us directly — we would rather answer it early."
          />
          <div className="max-w-3xl mx-auto mt-10 grid gap-3">
            {faqList.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="bg-white border border-linen rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-display text-lg">{f.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-gold transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-mocha leading-relaxed border-t border-linen/60 pt-4">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Contact strip */}
      <section className="border-t border-linen bg-sand/60">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid sm:grid-cols-3 gap-5">
            <a href="tel:+977015335763" className="bg-white border border-linen rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <Phone size={19} className="text-golddark" />
              </div>
              <div>
                <p className="text-[11px] tracking-widest uppercase text-stone2">Call the Franchise Desk</p>
                <p className="font-display text-xl mt-0.5">01-5335763</p>
              </div>
            </a>
            <a href="mailto:franchise@healthyhome.com.np" className="bg-white border border-linen rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <Mail size={19} className="text-golddark" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] tracking-widest uppercase text-stone2">Email</p>
                <p className="font-display text-lg mt-0.5 break-all">franchise@healthyhome.com.np</p>
              </div>
            </a>
            <div className="bg-white border border-linen rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <MapPin size={19} className="text-golddark" />
              </div>
              <div>
                <p className="text-[11px] tracking-widest uppercase text-stone2">Franchise Office</p>
                <p className="font-display text-lg mt-0.5">Thapathali, Kathmandu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
