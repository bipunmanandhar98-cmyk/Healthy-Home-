import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Store, Rocket, TrendingUp, Handshake, Lightbulb,
  Target, Package, Megaphone, UserCheck, GraduationCap, BarChart2, ShieldCheck,
  Stethoscope, Quote, Check, ChevronDown, MapPin, Phone, Mail, ArrowRight, Clock, Send
} from 'lucide-react';
import { SectionHead, CtaBanner } from '../components/shared';
import { IMG } from '../data/images';
import {
  sendFranchiseInquiry, franchiseEmailConfigured, FRANCHISE_INBOX,
  type FranchiseInquiry, type SendResult,
} from '../lib/franchiseEmail';

/* Form field styling. Kept local rather than shared so this page has no
   dependency on the careers form's internals; the classes are identical so the
   two forms look like one brand. */
const fieldClass =
  'w-full bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold transition';
const labelClass = 'block text-sm font-medium text-ink mb-1.5';
const reqClass = 'text-red-600';

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

/**
 * Investment bands offered on the inquiry form, lowest to highest.
 *
 * Investment is quoted in NPR even for enquirers outside Nepal, because the
 * franchise fee, fit-out and equipment are all priced by us in rupees.
 *
 * NOTE: these no longer mirror the figures from the removed "Three Formats"
 * cards (which were Rs. 35–50 L, 75 L – 1.2 Cr and 1.5–2.5 Cr). The bands below
 * are the current guidance. If a lower tier is ever offered again, add it here
 * in order — the select renders the array as-is.
 */
const INVESTMENT_BANDS = [
  'Rs. 2 – 3 Crore',
  'Rs. 3 – 4 Crore',
  'Rs. 4 – 5 Crore',
  'Rs. 5 Crore & above',
  'Still deciding — need guidance',
];

/**
 * Dialling codes for the phone number field's country picker.
 *
 * Kept as one pipe-delimited string of "🇳🇵 Nepal +977" rows rather than an array
 * of objects, because ~200 entries written as objects is several screens of
 * noise for a list that only changes when a country changes its code. Row
 * format: flag emoji, country name, dial code last — so the parser can key off
 * the final space. To add or fix a country, edit its row; nothing else changes.
 *
 * Nepal and India lead the list because they are where most enquirers are, and
 * Nepal is the default selection on the form.
 */
const DIAL_CODES = (
  // South Asia — most likely origins
  '🇳🇵 Nepal +977|🇮🇳 India +91|🇧🇩 Bangladesh +880|🇱🇰 Sri Lanka +94|🇵🇰 Pakistan +92|' +
  '🇧🇹 Bhutan +975|🇦🇫 Afghanistan +93|🇲🇻 Maldives +960|' +
  // Middle East
  '🇦🇪 United Arab Emirates +971|🇸🇦 Saudi Arabia +966|🇶🇦 Qatar +974|🇰🇼 Kuwait +965|' +
  '🇴🇲 Oman +968|🇧🇭 Bahrain +973|🇯🇴 Jordan +962|🇱🇧 Lebanon +961|🇮🇶 Iraq +964|' +
  '🇮🇷 Iran +98|🇸🇾 Syria +963|🇾🇪 Yemen +967|🇵🇸 Palestine +970|🇮🇱 Israel +972|' +
  // East & Southeast Asia
  '🇨🇳 China +86|🇭🇰 Hong Kong +852|🇲🇴 Macau +853|🇹🇼 Taiwan +886|🇯🇵 Japan +81|' +
  '🇰🇷 South Korea +82|🇰🇵 North Korea +850|🇲🇳 Mongolia +976|🇻🇳 Vietnam +84|🇹🇭 Thailand +66|' +
  '🇰🇭 Cambodia +855|🇱🇦 Laos +856|🇲🇲 Myanmar +95|🇲🇾 Malaysia +60|🇸🇬 Singapore +65|' +
  '🇮🇩 Indonesia +62|🇵🇭 Philippines +63|🇧🇳 Brunei +673|' +
  // Central Asia & Caucasus
  '🇰🇿 Kazakhstan +7|🇺🇿 Uzbekistan +998|🇰🇬 Kyrgyzstan +996|🇹🇯 Tajikistan +992|' +
  '🇹🇲 Turkmenistan +993|🇬🇪 Georgia +995|🇦🇲 Armenia +374|🇦🇿 Azerbaijan +994|' +
  // Europe
  '🇬🇧 United Kingdom +44|🇮🇪 Ireland +353|🇮🇸 Iceland +354|🇳🇴 Norway +47|🇸🇪 Sweden +46|' +
  '🇩🇰 Denmark +45|🇫🇮 Finland +358|🇪🇪 Estonia +372|🇱🇻 Latvia +371|🇱🇹 Lithuania +370|' +
  '🇵🇱 Poland +48|🇩🇪 Germany +49|🇳🇱 Netherlands +31|🇧🇪 Belgium +32|🇱🇺 Luxembourg +352|' +
  '🇫🇷 France +33|🇪🇸 Spain +34|🇵🇹 Portugal +351|🇮🇹 Italy +39|🇲🇹 Malta +356|' +
  '🇨🇭 Switzerland +41|🇦🇹 Austria +43|🇱🇮 Liechtenstein +423|🇲🇨 Monaco +377|' +
  '🇨🇿 Czechia +420|🇸🇰 Slovakia +421|🇭🇺 Hungary +36|🇷🇴 Romania +40|🇧🇬 Bulgaria +359|' +
  '🇬🇷 Greece +30|🇨🇾 Cyprus +357|🇹🇷 Türkiye +90|🇷🇺 Russia +7|🇺🇦 Ukraine +380|' +
  '🇧🇾 Belarus +375|🇲🇩 Moldova +373|🇷🇸 Serbia +381|🇭🇷 Croatia +385|' +
  '🇸🇮 Slovenia +386|🇧🇦 Bosnia and Herzegovina +387|🇲🇪 Montenegro +382|' +
  '🇲🇰 North Macedonia +389|🇽🇰 Kosovo +383|🇦🇱 Albania +355|🇦🇩 Andorra +376|' +
  '🇸🇲 San Marino +378|🇻🇦 Vatican City +39|🇬🇮 Gibraltar +350|' +
  // North & Central America, Caribbean
  '🇺🇸 United States +1|🇨🇦 Canada +1|🇲🇽 Mexico +52|🇧🇿 Belize +501|🇬🇹 Guatemala +502|' +
  '🇸🇻 El Salvador +503|🇭🇳 Honduras +504|🇳🇮 Nicaragua +505|🇨🇷 Costa Rica +506|' +
  '🇵🇦 Panama +507|🇨🇺 Cuba +53|🇯🇲 Jamaica +1|🇧🇸 Bahamas +1|🇧🇧 Barbados +1|' +
  '🇩🇴 Dominican Republic +1|🇹🇷 Trinidad and Tobago +1|🇬🇷 Grenada +1|🇩🇲 Dominica +1|' +
  '🇰🇳 Saint Kitts and Nevis +1|🇱🇨 Saint Lucia +1|🇻🇨 Saint Vincent and the Grenadines +1|' +
  '🇧🇲 Bermuda +1|🇭🇹 Haiti +509|' +
  // South America
  '🇧🇷 Brazil +55|🇦🇷 Argentina +54|🇨🇱 Chile +56|🇨🇴 Colombia +57|🇵🇪 Peru +51|' +
  '🇻🇪 Venezuela +58|🇪🇨 Ecuador +593|🇧🇴 Bolivia +591|🇵🇾 Paraguay +595|🇺🇾 Uruguay +598|' +
  '🇬🇾 Guyana +592|🇸🇷 Suriname +597|' +
  // Africa
  '🇿🇦 South Africa +27|🇪🇬 Egypt +20|🇲🇦 Morocco +212|🇩🇿 Algeria +213|🇹🇳 Tunisia +216|' +
  '🇱🇾 Libya +218|🇸🇩 Sudan +249|🇸🇸 South Sudan +211|🇪🇹 Ethiopia +251|🇪🇷 Eritrea +291|' +
  '🇩🇯 Djibouti +253|🇸🇴 Somalia +252|🇰🇪 Kenya +254|🇺🇬 Uganda +256|🇹🇿 Tanzania +255|' +
  '🇷🇼 Rwanda +250|🇧🇮 Burundi +257|🇨🇩 DR Congo +243|🇨🇬 Congo +242|🇦🇴 Angola +244|' +
  '🇿🇲 Zambia +260|🇲🇼 Malawi +265|🇲🇿 Mozambique +258|🇿🇼 Zimbabwe +263|🇳🇦 Namibia +264|' +
  '🇧🇼 Botswana +267|🇱🇸 Lesotho +266|🇸🇿 Eswatini +268|🇲🇷 Mauritius +230|🇲🇬 Madagascar +261|' +
  '🇲🇱 Mali +223|🇲🇷 Mauritania +222|🇳🇬 Niger +227|🇹🇳 Chad +235|🇳🇬 Nigeria +234|' +
  '🇨🇮 Côte d’Ivoire +225|🇧🇫 Burkina Faso +226|🇸🇳 Senegal +221|🇬🇲 Gambia +220|' +
  '🇬🇳 Guinea +224|🇬🇼 Guinea-Bissau +245|🇸🇱 Sierra Leone +232|🇱🇷 Liberia +231|' +
  '🇬🇭 Ghana +233|🇹🇬 Togo +228|🇧🇪 Benin +229|🇨🇲 Cameroon +237|🇨🇫 Central African Republic +236|' +
  '🇬🇦 Gabon +241|🇬🇶 Equatorial Guinea +240|🇰🇲 Comoros +269|🇨🇻 Cabo Verde +238|' +
  '🇸🇹 Sao Tome and Principe +239|' +
  // Oceania
  '🇦🇺 Australia +61|🇳🇿 New Zealand +64|🇫🇯 Fiji +679|🇵🇬 Papua New Guinea +675|' +
  '🇻🇺 Vanuatu +678|🇸🇧 Solomon Islands +677|🇼🇸 Samoa +685|🇹🇴 Tonga +676|' +
  '🇰🇮 Kiribati +686|🇹🇻 Tuvalu +688|🇳🇷 Nauru +674|🇲🇭 Marshall Islands +692|' +
  '🇫🇲 Micronesia +691|🇵🇼 Palau +680'
)
  .split('|')
  .map((row) => {
    /* A flag emoji is TWO regional-indicator code points (U+1F1E6..U+1F1FF),
       not a surrogate pair, so this has to consume two entries from the
       spread array. Taking one leaves a single letter that renders as text. */
    const chars = [...row];
    const flag = chars.splice(0, 2).join('');
    const tail = chars.join('').trim();
    const cut = tail.lastIndexOf(' ');
    return { flag, country: tail.slice(0, cut), dial: tail.slice(cut + 1) };
  });

/** The three sidebar steps shown next to the form. Mirrors the copy in `steps`. */
const inquirySteps = [
  {
    n: '01',
    t: 'We reply within 48 hours',
    s: 'The prospectus, unit economics and a territory availability map for your city.',
  },
  {
    n: '02',
    t: 'A 45-minute discovery call',
    s: 'With our franchising director. Honest numbers, real break-even timelines.',
  },
  {
    n: '03',
    t: 'An honest go / no-go',
    s: 'We review your proposed site and tell you plainly if it will not work.',
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
    a: 'Investment starts at around Rs. 2 Crore, with a larger regional centre sitting at the upper end of that scale. This covers the franchise fee, interiors, equipment, initial inventory, licensing and pre-opening training. We recommend keeping an additional 3-4 months of operating capital as a working-capital buffer, which is not included in the figure.',
  },
  {
    q: 'Is there a franchise fee and ongoing royalty?',
    a: 'Yes. A one-time franchise fee is charged on signing, with a structured payment plan available. The ongoing royalty is a percentage of monthly net revenue and decreases with the size of the centre you open - 6% for a smaller centre, 5% for a mid-size centre and 4% for a large regional one. Marketing contributions are bundled into the royalty; there is no separate ad-levy.',
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
    a: 'Larger branches typically reach monthly break-even between month 9 and month 18, depending on location, the size of the centre and how early it opens. We will walk you through a conservative financial projection using your specific site data during the discovery call - and we will tell you honestly if a location is not viable.',
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  /* Inquiry form. `submitted` is kept separately from the inputs so the
     confirmation panel can show a summary of what was actually received, and so
     the values survive the form being reset. */
  const [submitted, setSubmitted] = useState<FranchiseInquiry | null>(null);
  const [inquiryErr, setInquiryErr] = useState('');
  const [sending, setSending] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<SendResult | null>(null);
  /* The picker shows only a flag, so this mirrors the chosen dialling code's
     country name in the hint below the field. Without it the flag is the only
     clue about which country was selected. */
  const [dialCode, setDialCode] = useState('+977');
  const selectedCountry = DIAL_CODES.find((d) => d.dial === dialCode)?.country ?? 'your country';

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    /* The phone is assembled from the dial code picker plus the typed number so
       the franchise desk receives one dialable string. The picker is never
       empty because it is seeded with Nepal and has no blank option. */
    const dial = String(data.get('enquirer_dial_code') ?? '').trim();
    const local = String(data.get('enquirer_phone') ?? '').trim();
    const phone = `${dial} ${local}`.trim();

    const inquiry: FranchiseInquiry = {
      to_email: FRANCHISE_INBOX,
      reply_to: String(data.get('enquirer_email') ?? '').trim(),
      enquirer_name: String(data.get('enquirer_name') ?? '').trim(),
      enquirer_email: String(data.get('enquirer_email') ?? '').trim(),
      enquirer_phone: phone,
      enquirer_phone_country: dial,
      enquirer_location: String(data.get('enquirer_location') ?? '').trim(),
      enquirer_city: String(data.get('enquirer_city') ?? '').trim(),
      investment_range: String(data.get('investment_range') ?? '').trim(),
      enquirer_notes: String(data.get('enquirer_notes') ?? '').trim(),
    };

    /* Only the fields marked required on the form are enforced, so the
       validation list and the visible asterisks cannot drift apart. */
    if (!inquiry.enquirer_name || !inquiry.enquirer_email) {
      setInquiryErr('Please fill in your full name and email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inquiry.enquirer_email)) {
      setInquiryErr('That email address does not look right.');
      return;
    }
    if (!local) {
      setInquiryErr('Please enter your phone number so we can call you back.');
      return;
    }
    if (!/^[\d\s()+-]{6,20}$/.test(local)) {
      setInquiryErr('Please enter a valid phone number — digits only.');
      return;
    }
    if (!inquiry.enquirer_city || !inquiry.investment_range) {
      setInquiryErr('Please enter a city and pick an investment range.');
      return;
    }

    setInquiryErr('');
    setSending(true);
    const outcome = await sendFranchiseInquiry(inquiry);
    setSending(false);
    setSubmitted(inquiry);
    setInquiryResult(outcome);
    form.reset();
  };

  /* Starting a second inquiry clears the first one's result, otherwise the
     confirmation panel would still be showing while a blank form sits under it. */
  const startNewInquiry = () => {
    setSubmitted(null);
    setInquiryResult(null);
    setInquiryErr('');
  };

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
        <img loading="lazy" decoding="async" src={IMG.bg.ctaFranchise} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Franchise Opportunities</p>
            <h1 className="font-display text-[44px] sm:text-[56px] mt-3 leading-tight">
              Own a <em className="gold-text not-italic">Healthy Home.</em>
            </h1>
            <p className="text-mocha mt-5 leading-relaxed max-w-lg">
              Six branches. Twenty years. One standard. Bring a proven wellness brand to your city with a
              turn-key setup, a physician-led clinical model, national marketing and a territory that is
              yours alone.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="#inquiry"
                className="bg-gold hover:bg-[#00747B] text-white px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase shadow-lg shadow-[#00919A]/25 flex items-center gap-2"
              >
                Submit Inquiry <ArrowRight size={15} />
              </a>
              <a
                href="#how-it-works"
                className="border border-ink/25 text-ink px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-sand"
              >
                How It Works
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

      {/* Franchise inquiry — replaced the former "Three Formats" comparison */}
      <section id="inquiry" className="bg-sand/60 border-y border-linen scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <SectionHead
            eyebrow="Franchise Inquiry"
            title={<>Tell us about <em className="gold-text not-italic">your city</em></>}
            sub="Share a few details and our franchising director will come back to you within 48 hours with the prospectus, unit economics and territory availability. No sales fog, and we will tell you honestly if a location is not viable."
          />

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-6 mt-10 items-start">
            {/* Form / confirmation */}
            <div className="lg:col-span-2 bg-white border border-linen rounded-3xl p-7 sm:p-9 shadow-sm">
              {inquiryResult && submitted ? (
                /* Confirmation panel. The three outcomes are worded differently on
                   purpose: only 'sent' claims the inquiry reached us, and the
                   other two both point at the inbox so the lead is never lost. */
                <div className="text-center py-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      inquiryResult === 'sent' ? 'bg-gold/15 text-golddark' : 'bg-sand text-stone2'
                    }`}
                  >
                    {inquiryResult === 'sent' ? <Check size={28} /> : <Mail size={26} />}
                  </div>

                  <h3 className="font-display text-3xl mt-4">
                    {inquiryResult === 'sent'
                      ? `Thank you, ${submitted.enquirer_name.split(' ')[0]}`
                      : 'Your details are ready'}
                  </h3>

                  {inquiryResult === 'sent' ? (
                    <p className="text-mocha mt-2 text-sm max-w-md mx-auto">
                      Your inquiry has reached our franchise desk. We reply within 48 hours, and
                      we will email you at <span className="font-semibold text-ink">{submitted.enquirer_email}</span>.
                    </p>
                  ) : (
                    <p className="text-mocha mt-2 text-sm max-w-md mx-auto">
                      {inquiryResult === 'failed'
                        ? 'Something went wrong sending your inquiry, so we have not received it yet.'
                        : 'Sending inquiries from this site is not switched on yet, so nothing was emailed.'}{' '}
                      Please email{' '}
                      <a href={`mailto:${FRANCHISE_INBOX}`} className="text-golddark underline">{FRANCHISE_INBOX}</a>{' '}
                      with the details below and we will pick it up from there.
                    </p>
                  )}

                  {/* Always echo the submission, so the summary doubles as a
                      copy-paste source when the email did not go out. */}
                  <dl className="mt-6 bg-cream border border-linen rounded-2xl p-5 text-left text-sm grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      { l: 'Full name', v: submitted.enquirer_name },
                      { l: 'Email', v: submitted.enquirer_email },
                      { l: 'Phone', v: submitted.enquirer_phone },
                      { l: 'City', v: submitted.enquirer_city },
                      { l: 'Investment available', v: submitted.investment_range },
                      ...(submitted.enquirer_location ? [{ l: 'Proposed location', v: submitted.enquirer_location }] : []),
                      ...(submitted.enquirer_notes ? [{ l: 'Notes', v: submitted.enquirer_notes }] : []),
                    ].map((row) => (
                      <div key={row.l}>
                        <dt className="text-[11px] uppercase tracking-widest text-stone2">{row.l}</dt>
                        <dd className="font-medium text-ink break-words">{row.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={startNewInquiry}
                      className="bg-gold hover:bg-[#00747B] text-white px-8 py-3 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition"
                    >
                      Send Another Inquiry
                    </button>
                    <a
                      href="#inquiry"
                      className="border border-ink/20 text-ink px-8 py-3 rounded-full text-xs tracking-[0.15em] uppercase hover:bg-sand transition"
                    >
                      Back to Form
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquiry} noValidate>
                  <div className="flex items-start gap-4 mb-7 pb-6 border-b border-linen">
                    <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center shrink-0">
                      <Building2 size={22} className="text-golddark" />
                    </div>
                    <div>
                      <p className="font-display text-2xl">Franchise inquiry form</p>
                      <p className="text-sm text-mocha mt-1">
                        Fields marked <span className={reqClass}>*</span> are required. We only use
                        these details to respond to your inquiry.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inq-name" className={labelClass}>
                        Full Name<span className={reqClass}>*</span>
                      </label>
                      <input
                        id="inq-name" name="enquirer_name" type="text" autoComplete="name"
                        placeholder="Your full name" className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="inq-email" className={labelClass}>
                        Email Address<span className={reqClass}>*</span>
                      </label>
                      <input
                        id="inq-email" name="enquirer_email" type="email" autoComplete="email"
                        placeholder="you@example.com" className={fieldClass}
                      />
                    </div>

                    {/* Phone with its own country-code picker. The two controls
                        read as one field: a flex row sharing one rounded border,
                        split by a divider, so it does not look like a stray
                        dropdown next to a text box.

                        Each option is flag + full country name, no dialling code
                        — the code is implied by the flag and confirmed by the
                        number that gets emailed, so printing it in the label only
                        crowded the control. The code stays on each option's
                        `title` and accessible name. */}
                    <div>
                      <label htmlFor="inq-phone" className={labelClass}>
                        Phone Number<span className={reqClass}>*</span>
                      </label>
                      <div className="flex items-stretch border border-linen rounded-xl overflow-hidden focus-within:border-gold transition bg-white">
                        <select
                          name="enquirer_dial_code"
                          value={dialCode}
                          onChange={(e) => setDialCode(e.target.value)}
                          aria-label="Country dialling code"
                          title="Country dialling code"
                          /* Width follows the selected name so a long one like
                             "Bosnia and Herzegovina" is not clipped, while
                             "Fiji" does not leave a gap. A native select cannot
                             size itself to its value, so it is set from the
                             measured length. */
                          style={{ width: `${Math.min(15.5, Math.max(7, selectedCountry.length * 0.46 + 2.4))}rem` }}
                          className="shrink-0 border-r border-linen bg-cream pl-3 pr-2 py-3 text-sm cursor-pointer appearance-none focus:outline-none"
                        >
                          {DIAL_CODES.map((d) => (
                            <option
                              key={`${d.dial}-${d.country}`}
                              value={d.dial}
                              title={`${d.country} (${d.dial})`}
                              aria-label={`${d.country} ${d.dial}`}
                            >
                              {d.flag} {d.country}
                            </option>
                          ))}
                        </select>
                        <input
                          id="inq-phone" name="enquirer_phone" type="tel" autoComplete="tel-national"
                          placeholder="9812345678"
                          className="min-w-0 flex-1 px-4 py-3 text-sm focus:outline-none"
                        />
                      </div>
                      <p className="text-xs text-stone2 mt-1.5">
                        Calling from <span className="font-medium text-ink">{selectedCountry}</span>. Change country from the list above.
                      </p>
                    </div>

                    <div className="relative">
                      <label htmlFor="inq-investment" className={labelClass}>
                        Investment Available<span className={reqClass}>*</span>
                      </label>
                      <select
                        id="inq-investment" name="investment_range" defaultValue=""
                        className={`${fieldClass} appearance-none pr-10 cursor-pointer`}
                      >
                        <option value="" disabled>Select a range</option>
                        {INVESTMENT_BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 bottom-3.5 text-stone2 pointer-events-none" />
                    </div>

                    <div>
                      <label htmlFor="inq-city" className={labelClass}>
                        City<span className={reqClass}>*</span>
                      </label>
                      <input
                        id="inq-city" name="enquirer_city" type="text" autoComplete="address-level2"
                        placeholder="City you want to open in" className={fieldClass}
                      />
                      <p className="text-xs text-stone2 mt-1.5">
                        The city where you would like to run a Healthy Home.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="inq-location" className={labelClass}>
                        Proposed Location
                      </label>
                      <input
                        id="inq-location" name="enquirer_location" type="text"
                        placeholder="Area, landmark or street you have in mind (optional)"
                        className={fieldClass}
                      />
                      <p className="text-xs text-stone2 mt-1.5">
                        A specific address is not needed. An area or landmark is enough for a first look.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="inq-notes" className={labelClass}>
                        Anything Else?
                      </label>
                      <textarea
                        id="inq-notes" name="enquirer_notes" rows={4}
                        placeholder="Tell us about your experience, your timeline, or questions you want answered on the call (optional)"
                        className={`${fieldClass} resize-y`}
                      />
                    </div>
                  </div>

                  {inquiryErr && (
                    <p
                      role="alert"
                      className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                    >
                      {inquiryErr}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      type="submit"
                      disabled={sending}
                      className="bg-gold hover:bg-[#00747B] text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase font-medium shadow-lg shadow-[#00919A]/25 flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-wait disabled:hover:bg-gold"
                    >
                      {sending ? 'Sending…' : <><Send size={15} /> Submit Inquiry</>}
                    </button>
                    <p className="text-xs text-stone2">
                      We reply within 48 hours.
                      {!franchiseEmailConfigured && ' Prefer to write directly? Use the links below.'}
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* What happens next */}
            <div className="grid gap-5">
              <div className="bg-espresso text-white rounded-3xl p-7">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Target size={20} className="text-goldlight" />
                </div>
                <h3 className="font-display text-2xl mt-4 text-white">What Happens Next</h3>
                <ol className="grid gap-4 mt-5">
                  {inquirySteps.map((s) => (
                    <li key={s.n} className="flex gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 text-goldlight text-[11px] font-medium flex items-center justify-center">
                        {s.n}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{s.t}</p>
                        <p className="text-xs text-mist mt-0.5 leading-relaxed">{s.s}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white border border-linen rounded-3xl p-7">
                <div className="w-11 h-11 rounded-2xl bg-gold/15 flex items-center justify-center">
                  <Handshake size={20} className="text-golddark" />
                </div>
                <h3 className="font-display text-2xl mt-4">Prefer to talk first?</h3>
                <p className="text-sm text-mocha mt-1.5">Reach the franchise desk directly, weekdays 9am–6pm.</p>
                <div className="grid gap-2.5 mt-5">
                  <a
                    href="tel:+977015335763"
                    className="flex items-center gap-3 text-sm text-mocha bg-cream border border-linen rounded-xl px-4 py-3 hover:border-gold transition"
                  >
                    <Phone size={15} className="text-golddark shrink-0" /> 01-5335763
                  </a>
                  <a
                    href={`mailto:${FRANCHISE_INBOX}`}
                    className="flex items-center gap-3 text-sm text-mocha bg-cream border border-linen rounded-xl px-4 py-3 hover:border-gold transition min-w-0"
                  >
                    <Mail size={15} className="text-golddark shrink-0" />
                    <span className="break-all">{FRANCHISE_INBOX}</span>
                  </a>
                </div>
              </div>

              <p className="text-xs text-stone2 leading-relaxed px-1">
                Investment ranges are indicative and exclude working capital. Final figures depend
                on city, site and fit-out, and are confirmed in writing before any agreement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* How it works */}
        <motion.section {...fadeUp} id="how-it-works" className="py-16 scroll-mt-24">
          <SectionHead
            eyebrow="How It Works"
            title={<>From enquiry to <em className="gold-text not-italic">opening day</em></>}
            sub="Six clear stages, roughly 8–12 months depending on the size of the centre you open."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ delay: (i % 3) * 0.08 }}
                className="relative bg-white border border-linen rounded-3xl p-7 overflow-hidden"
              >
                <span className="absolute top-4 right-6 font-display text-[56px] text-sand leading-none font-semibold select-none">
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
              <img loading="lazy" decoding="async" src={IMG.franchise.reviewAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="text-left">
                <p className="font-medium text-sm">Rajan Karki</p>
                <p className="text-xs text-stone2">Franchisee &middot; Pokhara</p>
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
