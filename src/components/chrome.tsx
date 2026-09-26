import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, MapPin, ChevronDown, Calendar, Star, ArrowRight, Check, Sparkles } from 'lucide-react';
import { treatments, subServices, centers, openCenters, googleRating } from '../data/content';
import { sendBookingConfirmation, type SendResult } from '../lib/bookingEmail';
import { slugify } from '../data/content';

type BookingState = {
  open: boolean;
  openBooking: (preset?: { treatment?: string; center?: string }) => void;
  closeBooking: () => void;
  preset: { treatment?: string; center?: string };
};

const BookingCtx = createContext<BookingState>({ open: false, openBooking: () => {}, closeBooking: () => {}, preset: {} });
export const useBooking = () => useContext(BookingCtx);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<{ treatment?: string; center?: string }>({});
  const openBooking = (p?: { treatment?: string; center?: string }) => { setPreset(p ?? {}); setOpen(true); };
  const closeBooking = () => setOpen(false);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open ]);
  return <BookingCtx.Provider value={{ open, openBooking, closeBooking, preset }}>{children}<BookingModal /></BookingCtx.Provider>;
}

const steps = ['Location', 'Service', 'Date & Time', 'Your Details'];

function BookingModal() {
  const { open, closeBooking, preset } = useBooking();
  const [step, setStep] = useState(0);
  const [treatmentId, setTreatmentId] = useState('');
  const [centerId, setCenterId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<SendResult | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (open) {
      setStep(0); setDone(null); setErr(''); setEmailResult(null); setSending(false);
      // Never preselect a branch that isn't trading yet, even if a caller
      // passes one — it isn't in the location list to be corrected.
      const requested = centers.find(c => c.id === preset.center);
      const target = requested && !requested.openingSoon ? requested : openCenters[0];
      const targetId = target.id;
      // Default to something this branch actually offers, otherwise the modal
      // would open already out of scope. An explicit preset still wins, and is
      // then caught by the out-of-scope guard.
      setTreatmentId(preset.treatment ?? (target?.services?.length ? target.services[0] : treatments[0].id));
      setCenterId(targetId);
      const d = new Date(); d.setDate(d.getDate() + 1);
      setDate(d.toISOString().slice(0, 10));
      setTime('10:30 AM');
    }
  }, [open]);

  const dates = useMemo(() => {
    const out: string[] = [];
    const d = new Date();
    for (let i = 1; i <= 14; i++) { const c = new Date(d); c.setDate(d.getDate() + i); out.push(c.toISOString().slice(0, 10)); }
    return out;
  }, []);
  const times = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'];

  const fmtDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const center = centers.find(c => c.id === centerId);

  // A branch may narrow what it offers (e.g. the Chhaya mini branch). When it
  // does, list those services instead of the main ones. Both shapes are
  // normalized to one option list so the rest of the modal is unchanged.
  const branchLimited = Boolean(center?.services?.length);
  const serviceOptions = useMemo(() => {
    const ids = center?.services;
    if (!ids?.length) {
      return treatments.map(t => ({ id: t.id, name: t.name, image: t.image, category: t.category, duration: t.duration, downtime: t.downtime }));
    }
    return ids.flatMap(id => {
      const s = subServices.find(x => x.id === id);
      if (!s) return [];
      const parent = treatments.find(t => t.id === s.parentId);
      return [{ id: s.id, name: s.name, image: s.image, category: parent?.name ?? s.parentId, duration: s.duration, downtime: 'None' }];
    });
  }, [center?.services]);

  // The branch is chosen first, so this list only ever contains services that
  // branch actually offers. Anything arriving from outside it (a preset from a
  // Dermatology page, or a branch switched mid-flow) resolves to the first real
  // option rather than being surfaced as an error.
  const activeService = serviceOptions.find(o => o.id === treatmentId) ?? serviceOptions[0];

  const confirm = async () => {
    // Silent safety net: never write a service the branch doesn't offer. The
    // list is already branch-filtered, so this should be unreachable.
    if (branchLimited && !center?.services?.includes(activeService?.id ?? '')) return;
    if (!name.trim() || !phone.trim()) { setErr('Please add your name and mobile number so we can confirm.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Please enter a valid email for your confirmation.'); return; }
    const code = 'HH-' + Math.random().toString(36).slice(2, 7).toUpperCase();

    setSending(true);
    // Record the booking first — a failed email must never lose it.
    try {
      const prev = JSON.parse(localStorage.getItem('healthy-home-bookings') ?? '[]');
      prev.push({ code, treatmentId: activeService?.id ?? '', centerId, date, time, name, phone, email, notes, created: Date.now() });
      localStorage.setItem('healthy-home-bookings', JSON.stringify(prev));
    } catch {}

    const result: SendResult = await sendBookingConfirmation({
      to_email: email.trim(),
      reply_to: center?.email ?? import.meta.env.VITE_EMAILJS_REPLY_TO ?? 'admin@healthyhome.com.np',
      client_name: name.trim(),
      booking_code: code,
      service_name: activeService?.name ?? '',
      branch_name: center?.name ?? '',
      branch_address: center?.locationLine ?? `${center?.address}, ${center?.city}`,
      branch_phone: center?.phone ?? '',
      date_time: `${fmtDate(date)} at ${time}`,
      client_phone: phone.trim(),
      client_notes: notes.trim(),
    });

    setSending(false);
    setEmailResult(result);
    setErr(''); setDone(code);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={closeBooking} />
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="relative w-full max-w-3xl bg-cream rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
            <div className="bg-white text-ink border-b border-linen px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-golddark">Consultation</p>
                <h3 className="font-display text-2xl">Book Your Visit</h3>
              </div>
              <button onClick={closeBooking} className="w-9 h-9 rounded-full border border-linen flex items-center justify-center hover:bg-sand"><X size={16} /></button>
            </div>
            {done ? (
              <div className="p-8 text-center overflow-y-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 text-golddark flex items-center justify-center"><Check size={28} /></div>
                <h4 className="font-display text-3xl mt-4">You're booked, {name.split(' ')[0]}!</h4>
                {emailResult === 'sent' ? (
                  <p className="text-mocha mt-2 text-sm">Confirmation <span className="font-semibold text-ink">{done}</span> — we've emailed these details to {email}.</p>
                ) : emailResult === 'failed' ? (
                  <p className="text-mocha mt-2 text-sm">Confirmation <span className="font-semibold text-ink">{done}</span> — your booking is saved, but the confirmation email failed to send. Please call {center?.phone ?? '01-5335763'} and we'll confirm by phone.</p>
                ) : (
                  <p className="text-mocha mt-2 text-sm">Confirmation <span className="font-semibold text-ink">{done}</span> — your booking is saved. Email confirmation is not set up on this site yet, so please call {center?.phone ?? '01-5335763'} to confirm.</p>
                )}
                <div className="mt-5 bg-white rounded-2xl border border-linen p-5 text-left text-sm grid sm:grid-cols-2 gap-3">
                  <div><p className="text-[11px] uppercase tracking-widest text-stone2">Service</p><p className="font-medium">{activeService?.name}</p></div>
                  <div><p className="text-[11px] uppercase tracking-widest text-stone2">Location</p><p className="font-medium">{center?.name} — {center?.city}</p></div>
                  <div><p className="text-[11px] uppercase tracking-widest text-stone2">When</p><p className="font-medium">{fmtDate(date)} at {time}</p></div>
                  <div><p className="text-[11px] uppercase tracking-widest text-stone2">Arrival</p><p className="font-medium">15 min early · Free parking</p></div>
                </div>
                <button onClick={closeBooking} className="mt-6 bg-gold text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#00747B]">Done</button>
              </div>
            ) : (
              <>
                <div className="px-6 pt-5 flex gap-2 shrink-0">
                  {steps.map((s, i) => (
                    <button key={s} onClick={() => i < step && setStep(i)} className="flex-1 text-left">
                      <div className={`h-1 rounded-full ${i <= step ? 'bg-gold' : 'bg-linen'}`} />
                      <p className={`mt-1.5 text-[10px] sm:text-[11px] uppercase tracking-widest ${i === step ? 'text-ink font-semibold' : 'text-stone2'}`}>{i + 1}. {s}</p>
                    </button>
                  ))}
                </div>
                <div className="p-6 overflow-y-auto grow">
                  {step === 0 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {openCenters.map(c => (
                        <button key={c.id} onClick={() => setCenterId(c.id)} className={`text-left rounded-2xl border p-4 transition ${centerId === c.id ? 'border-gold bg-white shadow-md' : 'border-linen bg-white/60 hover:border-gold/50'}`}>
                          <span className="flex items-center gap-1.5 font-medium text-sm"><MapPin size={14} className="text-gold" /> {c.name}{c.flagship && <span className="text-[10px] bg-gold text-white px-2 py-0.5 rounded-full ml-1">FLAGSHIP</span>}</span>
                          <span className="block text-xs text-stone2 mt-1">{c.locationLine ?? `${c.address}, ${c.city}, ${c.state}`}</span>
                          {c.rating || c.phone ? <span className="flex items-center gap-1 text-xs mt-1.5 text-mocha">{c.rating ? <><Star size={12} className="fill-gold text-gold" /> {c.rating} ({c.reviews?.toLocaleString()} Google reviews)</> : null}{c.rating && c.phone ? ' · ' : ''}{c.phone ?? ''}</span> : null}
                          <span className={`block text-[11px] mt-1.5 ${c.services?.length ? 'text-golddark' : 'text-stone2'}`}>
                            {c.services?.length
                              ? `Only ${c.services.map(id => subServices.find(s => s.id === id)?.name).filter(Boolean).join(' · ')}`
                              : 'All services available'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {step === 1 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {serviceOptions.map(o => (
                        <button key={o.id} onClick={() => setTreatmentId(o.id)} className={`text-left rounded-2xl border p-4 flex gap-3 transition ${activeService?.id === o.id ? 'border-gold bg-white shadow-md' : 'border-linen bg-white/60 hover:border-gold/50'}`}>
                          <img src={o.image} alt={o.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          <span>
                            <span className="block font-medium text-sm">{o.name}</span>
                            <span className="block text-xs text-stone2 mt-0.5">{o.category}</span>
                          </span>
                          {activeService?.id === o.id && <Check size={16} className="ml-auto text-gold shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone2 mb-2">Pick a day</p>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {dates.map(d => (
                          <button key={d} onClick={() => setDate(d)} className={`shrink-0 w-[74px] rounded-2xl border py-2.5 text-center transition ${date === d ? 'border-gold bg-gold text-white' : 'border-linen bg-white'}`}>
                            <span className="block text-[10px] uppercase tracking-widest opacity-70">{new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="block font-display text-xl leading-tight">{new Date(d + 'T12:00:00').getDate()}</span>
                            <span className="block text-[10px] opacity-70">{new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs uppercase tracking-widest text-stone2 mt-4 mb-2">Pick a time</p>
                      <div className="flex flex-wrap gap-2">
                        {times.map(t => (
                          <button key={t} onClick={() => setTime(t)} className={`px-4 py-2 rounded-full border text-sm transition ${time === t ? 'bg-gold text-white border-gold' : 'bg-white border-linen hover:border-gold/60'}`}>{t}</button>
                        ))}
                      </div>
                      <div className="mt-4 bg-sand rounded-2xl p-4 text-sm flex gap-2 items-start"><Calendar size={16} className="text-golddark mt-0.5 shrink-0" /><p>Arrive 15 minutes early. Consultation included — {activeService?.duration} service, {activeService?.downtime.toLowerCase()} downtime.</p></div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name *" className="bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold" />
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number *" className="bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold" />
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="sm:col-span-2 bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold" />
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Goals, event dates, questions (optional)" rows={3} className="sm:col-span-2 bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold" />
                      {err && <p className="sm:col-span-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{err}</p>}
                      <div className="sm:col-span-2 bg-white border border-linen rounded-2xl p-4 text-sm flex justify-between"><span className="text-stone2">Summary</span><span className="text-right font-medium">{activeService?.name}<br /><span className="font-normal text-stone2">{center?.city} · {fmtDate(date)} · {time}</span></span></div>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-linen flex justify-between shrink-0 bg-white/60">
                  <button onClick={() => step === 0 ? closeBooking() : setStep(step - 1)} className="text-sm uppercase tracking-widest text-mocha hover:text-ink px-2">{step === 0 ? 'Cancel' : '← Back'}</button>
                  {step < 3
                    ? <button onClick={() => setStep(step + 1)} className="bg-gold text-white text-sm uppercase tracking-widest px-7 py-3 rounded-full hover:bg-[#00747B] flex items-center gap-2">Continue <ArrowRight size={15} /></button>
                    : <button onClick={confirm} disabled={sending} className="bg-gold text-white text-sm uppercase tracking-widest px-7 py-3 rounded-full hover:bg-[#00747B] flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait">{sending ? 'Sending…' : <><Sparkles size={15} /> Confirm Booking</>}</button>}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TopBar() {
  return (
    <div className="bg-white text-mocha text-[11px] sm:text-xs tracking-wide border-b border-linen">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
        <p className="flex items-center justify-center gap-2 text-center"><Sparkles size={13} className="text-gold shrink-0" /><span><span className="text-golddark font-semibold">Dashain &amp; Tihar Specials Offer:</span> Get up to 50% off on all services</span></p>
      </div>
    </div>
  );
}

const serviceLinks = [
  {
    label: 'Weight Management', id: 'weight-management', image: '/images/site/svc-weight-management.jpg',
    subs: ['BCA Testing', 'Weight Loss', 'CoolSculpting', 'Breast Reduction', 'Body Shaping', 'Weight Gain', 'Weight Loss Home Package'],
  },
  {
    label: 'Dermatology', id: 'dermatology', image: '/images/site/svc-dermatology.jpg',
    subs: ['HydraFacial Treatment', 'Laser Hair Removal', 'Skin Tightening', 'Face Lifting', 'Breast Tightening', 'Stretch Mark Removal', 'Chemical Peeling', 'Derma Consultation'],
  },
  {
    label: 'Lab Tests', id: 'lab-tests', image: '/images/site/svc-lab-tests.jpg',
    subs: ['Whole Body Lab Test'],
  },
];

/** Shortcuts shown as pills under the columns. All point at real pages. */
const quickLinks = [
  { label: 'Weight Loss', parent: 'weight-management' },
  { label: 'Body Shaping', parent: 'weight-management' },
  { label: 'BCA Testing', parent: 'weight-management' },
  { label: 'Skin Tightening', parent: 'dermatology' },
  { label: 'Laser Hair Removal', parent: 'dermatology' },
  { label: 'Chemical Peeling', parent: 'dermatology' },
  { label: 'Derma Consultation', parent: 'dermatology' },
  { label: 'Lab Tests', parent: 'lab-tests' },
];

export const serviceUrl = (id: string) => `/services/${id}`;
export const subServiceUrl = (parentId: string, name: string) => `/services/${parentId}/${slugify(name)}`;

/* Desktop nav hover: a teal rule that wipes in from the left, replacing the
   old black-to-teal text colour swap. Applied to a wrapper that hugs the text
   itself, not to padded flex items, so the rule always sits just under the
   label rather than under the item's full box. */
const navUnderline =
  'relative inline-block after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[1.5px] after:bg-[#007C83] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100';

export function Navbar() {
  const [mobile, setMobile] = useState(false);
<<<<<<< HEAD
  /* The mobile drawer nests the three main services inside a single SERVICES
     dropdown, so it needs two levels of state: whether that group is open, and
     which of its categories is expanded. Each holds a single value (not a Set)
     so both behave as accordions and the drawer stays short. */
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSubs, setOpenSubs] = useState<string | null>(null);
=======
>>>>>>> 400c92d48d38acec7b58ac33bf9abdc739442a70
  const [drop, setDrop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();
  const navigate = useNavigate();

<<<<<<< HEAD
  /** Close the drawer and reset the accordions, so it reopens fully collapsed. */
  const closeMenu = () => {
    setMobile(false);
    setOpenGroup(null);
    setOpenSubs(null);
  };

  /** Opening a category reveals the SERVICES group it lives inside. */
  const toggleSubs = (id: string) => {
    setOpenSubs((cur) => (cur === id ? null : id));
    setOpenGroup('services');
  };

=======
>>>>>>> 400c92d48d38acec7b58ac33bf9abdc739442a70
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Liquid glass effect based on scroll
  const glassIntensity = scrolled ? 1 : 0;

  // The dropdown is a wide panel anchored to the header, so the pointer has to
  // cross from the trigger into it. A short close delay keeps it open for that
  // gap instead of vanishing the moment the trigger loses hover.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openDrop = () => {
    clearTimeout(closeTimer.current);
    setDrop(true);
  };
  const closeDrop = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDrop(false), 140);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <header className="sticky top-0 z-[60] transition-all duration-500" style={{
      backdropFilter: `blur(${20 + glassIntensity * 40}px)`,
      WebkitBackdropFilter: `blur(${20 + glassIntensity * 40}px)`,
      backgroundColor: `rgba(255, 255, 255, ${0.15 + glassIntensity * 0.25})`,
      borderBottom: `1px solid rgba(215, 229, 230, ${0.1 + glassIntensity * 0.3})`,
      boxShadow: `0 1px 3px rgba(0,0,0,0.02), 0 ${4 + glassIntensity * 16}px ${24 + glassIntensity * 32}px rgba(7, 25, 27, ${glassIntensity * 0.15})`,
      backgroundImage: scrolled ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.02) 100%)' : 'none',
    }}>
      {/* Nav width budget. The side cells are 1fr, so every pixel spent on the
          centre logo or the grid gap is a pixel the nav gaps cannot have.
          Trimming the logo padding (px-3) and the grid gap (gap-4) hands ~40px
          back to the two navs, which is what pays for gap-7 at every width.
          2xl widens the row to 1400 so the largest screens take gap-8. */}
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 h-[76px] hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left Navigation - Services, Location, Franchise, Special.
            Same type and rhythm as the right nav. This cell holds the longer
            labels, and since the row is `grid-cols-[1fr_auto_1fr]` it sets the
            ceiling on how much room the right nav gets at 1024. */}
        <nav className="flex items-center justify-end gap-7 2xl:gap-8 text-[12px] tracking-[0.07em] uppercase font-medium">
          <div className="relative" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
            <button onClick={() => navigate('/services')} className="flex items-center gap-1 py-5">
              <span className={navUnderline}>SERVICES</span>
              <ChevronDown size={13} />
            </button>
          </div>
          <Link to="/locations" className={navUnderline}>LOCATION</Link>
          <Link to="/franchise" className={navUnderline}>FRANCHISE</Link>
          <Link to="/specials" className="flex items-center gap-1">
            <span className={navUnderline}>SPECIAL</span>
            <span className="text-[9px] bg-gold text-white px-1.5 py-0.5 rounded-full tracking-normal">-20%</span>
          </Link>
        </nav>

        {/* Center Logo */}
        {/* px-3, not the original px-8. The glyph is only 64px wide, so this
            still leaves 28px of clear space to the nav on either side, but
            hands 40px back to the two nav cells - which is what pays for
            gap-7. px-6 was tried and measured 0px slack at 1280. */}
        <Link to="/" className="flex items-center justify-center shrink-0 px-3">
          <img src="/uploads/healthy-home-logo.png" alt="Healthy Home logo" className="h-12 w-auto object-contain" />
        </Link>

        {/* Right Navigation - All caps, in one line.
            gap-7 (28px) at lg-xl, stepping to gap-8 (32px) once the row
            widens at 2xl. Tracking stays 0.07em - widening the gaps is what
            makes the nav feel airy, so the letter-spacing is kept. */}
        <nav className="flex items-center gap-7 2xl:gap-8 text-[12px] tracking-[0.07em] uppercase font-medium">
          <Link to="/about" className={navUnderline}>ABOUT US</Link>
          <Link to="/career" className={navUnderline}>CAREER</Link>
          <Link to="/wellness-store" className={navUnderline}>WELLNESS STORE</Link>
          <Link to="/wellness-hub" className={navUnderline}>WELLNESS HUB</Link>
          {/* No ml-*, and tight px: at 1280 the right cell has only a few px of
              slack, and this pill is ~21% of it. */}
          <button onClick={() => openBooking()} className="hidden xl:flex items-center gap-1.5 bg-gold text-white text-[11px] tracking-[0.12em] uppercase px-2.5 py-2.5 rounded-full hover:bg-[#00747B] transition shadow-md shadow-[#00919A]/25"><Calendar size={13} /> Book Now</button>
        </nav>
      </div>

      {/* Services mega-menu. Anchored to the header (not the button) and centred
          on the viewport, so a wide panel can never run off either edge. */}
      <AnimatePresence>
        {drop && (
          <motion.div
            onMouseEnter={openDrop}
            onMouseLeave={closeDrop}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 top-full w-[900px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-linen p-6 hidden lg:block"
          >
            <div className="grid grid-cols-3 gap-7">
              {serviceLinks.map((s) => (
                <div key={s.id}>
                  <Link to={serviceUrl(s.id)} className="block group">
                    <img
                      src={s.image}
                      alt={s.label}
                      className="w-full h-[74px] object-cover rounded-xl mb-3.5"
                    />
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-golddark font-semibold group-hover:text-gold transition">
                        {s.label}
                      </span>
                      <ArrowRight size={13} className="text-gold opacity-0 group-hover:opacity-100 transition shrink-0" />
                    </span>
                  </Link>
                  <div className="mt-2.5">
                    {s.subs.map((sub) => (
                      <Link
                        key={sub}
                        to={subServiceUrl(s.id, sub)}
                        className="block py-2 text-[13px] text-mocha hover:text-[#007C83] transition leading-snug"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-linen">
              <p className="text-[11px] tracking-[0.2em] uppercase text-golddark font-semibold mb-3">Popular Treatments</p>
              <div className="flex flex-wrap gap-2.5">
                {quickLinks.map((q) => (
                  <Link
                    key={q.label}
                    to={subServiceUrl(q.parent, q.label)}
                    className="rounded-full border border-linen px-3.5 py-1.5 text-[12px] text-mocha hover:border-gold hover:text-[#007C83] transition"
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-linen grid grid-cols-2 gap-3">
              <Link to="/wellness-hub#skin" className="border border-gold/50 text-golddark text-center rounded-xl py-2.5 text-[11px] tracking-widest uppercase hover:bg-gold hover:text-white hover:border-gold transition">Try the Free Skin Quiz</Link>
              <Link to="/services" className="bg-gold text-white text-center rounded-xl py-2.5 text-[11px] tracking-widest uppercase hover:bg-[#00747B] transition">View All Services</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile / tablet bar: logo left, menu right */}
      <div className="max-w-7xl mx-auto px-4 h-[68px] flex lg:hidden items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/uploads/healthy-home-logo.png" alt="Healthy Home logo" className="h-11 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => openBooking()} className="hidden sm:flex items-center gap-2 bg-gold text-white text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full hover:bg-[#00747B] transition shadow-md shadow-[#00919A]/25"><Calendar size={14} /> Book Now</button>
          <button onClick={() => setMobile(!mobile)} aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full border border-linen">{mobile ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
<<<<<<< HEAD
      {/* The drawer body is capped and internally scrollable: expanding a
          category can make it taller than a phone screen, and the header is
          sticky, so an uncapped drawer would pin a header that fills the whole
          viewport. overscroll-contain stops the inner scroll from chaining to
          the page. */}
      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-linen bg-cream">
            <div className="max-h-[calc(100svh-80px)] overflow-y-auto overscroll-contain">
            {/* The three main services live inside a single SERVICES dropdown.
                Each level is conditionally rendered rather than wrapped in a
                nested AnimatePresence: a nested height animation inside the
                drawer (which itself animates height) left the exiting subtree
                mounted forever, so links accumulated and the drawer got stuck
                at height 0. A CSS entrance keeps the motion without the
                bookkeeping, and unmounts collapsed links so they leave the
                tab order. */}
            <div className="px-5 py-4 grid gap-1 text-sm">
              <button
                onClick={() => { setOpenGroup(openGroup === 'services' ? null : 'services'); setOpenSubs(null); }}
                aria-expanded={openGroup === 'services'}
                className="w-full py-2.5 min-h-[44px] flex items-center gap-2 border-b border-linen text-left font-medium uppercase tracking-widest text-xs"
              >
                <span className="grow">SERVICES</span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-stone2 transition-transform duration-300 ${openGroup === 'services' ? 'rotate-180' : ''}`}
                />
              </button>

              {openGroup === 'services' && (
                <div className="pb-1 hh-drop-in">
                  {serviceLinks.map(s => {
                    const open = openSubs === s.id;
                    return (
                      <div key={s.id}>
                        <button
                          onClick={() => toggleSubs(s.id)}
                          aria-expanded={open}
                          className="w-full py-2 min-h-[44px] flex items-center gap-2 pl-3 text-left text-ink font-medium uppercase tracking-widest text-xs"
                        >
                          <span className="grow">{s.label}</span>
                          <ChevronDown
                            size={15}
                            className={`shrink-0 text-stone2 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {open && (
                          <div className="pb-1 hh-drop-in">
                            {s.subs.map(sub => (
                              <Link
                                key={sub}
                                to={subServiceUrl(s.id, sub)}
                                onClick={closeMenu}
                                className="py-2.5 pl-7 min-h-[44px] flex items-center text-mocha text-[13px]"
                              >
                                — {sub}
                              </Link>
                            ))}
                            <Link
                              to={serviceUrl(s.id)}
                              onClick={closeMenu}
                              className="py-2.5 pl-7 min-h-[44px] flex items-center gap-1.5 text-golddark text-[11px] tracking-[0.15em] uppercase font-medium"
                            >
                              All {s.label} <ArrowRight size={13} />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <Link
                    to="/services"
                    onClick={closeMenu}
                    className="py-2.5 pl-3 min-h-[44px] flex items-center gap-1.5 text-golddark text-[11px] tracking-[0.15em] uppercase font-medium"
                  >
                    All Services <ArrowRight size={13} />
                  </Link>
                </div>
              )}

              <Link to="/locations" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">LOCATION</Link>
              <Link to="/franchise" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">FRANCHISE</Link>
              <Link to="/specials" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">SPECIAL</Link>
              <Link to="/about" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">ABOUT US</Link>
              <Link to="/career" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">CAREER</Link>
              <Link to="/wellness-store" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">WELLNESS STORE</Link>
              <Link to="/wellness-hub" onClick={closeMenu} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">WELLNESS HUB</Link>
              <button onClick={() => { closeMenu(); openBooking(); }} className="mt-2 bg-gold text-white rounded-full py-3 min-h-[44px] text-xs tracking-widest uppercase hover:bg-[#00747B]">Book Consultation</button>
            </div>
=======
      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-linen bg-cream">
            <div className="px-5 py-4 grid gap-1 text-sm">
              <Link to="/services" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center border-b border-linen font-medium uppercase tracking-widest text-xs">SERVICES</Link>
              {serviceLinks.map(s => (
                <div key={s.id}>
                  <Link to={serviceUrl(s.id)} onClick={() => setMobile(false)} className="py-2 min-h-[44px] flex items-center text-ink font-medium uppercase tracking-widest text-xs">{s.label}</Link>
                  {s.subs.map(sub => <Link key={sub} to={subServiceUrl(s.id, sub)} onClick={() => setMobile(false)} className="py-2.5 pl-3 min-h-[44px] flex items-center text-mocha text-[13px]">— {sub}</Link>)}
                </div>
              ))}
              <Link to="/locations" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">LOCATION</Link>
              <Link to="/franchise" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">FRANCHISE</Link>
              <Link to="/specials" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">SPECIAL</Link>
              <Link to="/about" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">ABOUT US</Link>
              <Link to="/career" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">CAREER</Link>
              <Link to="/wellness-store" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">WELLNESS STORE</Link>
              <Link to="/wellness-hub" onClick={() => setMobile(false)} className="py-2.5 min-h-[44px] flex items-center font-medium uppercase tracking-widest text-xs">WELLNESS HUB</Link>
              <button onClick={() => { setMobile(false); openBooking(); }} className="mt-2 bg-gold text-white rounded-full py-3 text-xs tracking-widest uppercase hover:bg-[#00747B]">Book Consultation</button>
>>>>>>> 400c92d48d38acec7b58ac33bf9abdc739442a70
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const { openBooking } = useBooking();
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  return (
    <footer className="bg-espresso text-white mt-0">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/uploads/healthy-home-logo.png" alt="Healthy Home logo" className="h-12 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-mist text-sm mt-4 leading-relaxed max-w-xs">Healthy Home — Weight Management, Dermatology and Lab Tests across 6 Nepal branch.</p>
            <div className="flex items-center gap-1.5 mt-4 text-sm"><Star size={15} className="fill-gold text-gold" /><Star size={15} className="fill-gold text-gold" /><Star size={15} className="fill-gold text-gold" /><Star size={15} className="fill-gold text-gold" /><Star size={15} className="fill-gold text-gold" /><span className="text-mist ml-1">{googleRating.average} · {googleRating.total.toLocaleString()} Google reviews</span></div>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-goldlight mb-4">Services</p>
            <div className="grid gap-1 sm:gap-2.5 text-sm text-mist">
              <Link to="/services/weight-management" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Weight Management</Link>
              <Link to="/services/dermatology" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Dermatology</Link>
              <Link to="/services/lab-tests" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Lab Tests</Link>
              <Link to="/wellness-hub#skin" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">✦ Skin Quiz</Link>
              <Link to="/services" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">View all →</Link>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-goldlight mb-4">Company</p>
            <div className="grid gap-1 sm:gap-2.5 text-sm text-mist">
              <Link to="/locations" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Location</Link>
              <Link to="/franchise" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Franchise</Link>
              <Link to="/specials" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Special</Link>
              <Link to="/about" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">About Us</Link>
              <Link to="/career" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Career</Link>
              <Link to="/wellness-store" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Wellness Store</Link>
              <Link to="/wellness-hub" className="hover:text-[#007C83] inline-flex items-center min-h-[40px] sm:min-h-0">Wellness Hub</Link>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-goldlight mb-4">Get Rs 1,500 Off Your First Visit</p>
            <p className="text-sm text-mist">Join the list for exclusive offers + event invites.</p>
            {ok ? <p className="mt-3 bg-gold/20 border border-gold/40 rounded-xl px-4 py-3 text-sm text-goldlight">Welcome! Code <b>WELCOME1500</b> is yours — show it at check-in.</p> : (
              <form onSubmit={e => { e.preventDefault(); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setOk(true); }} className="mt-3 flex gap-2">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="flex-1 bg-white/5 border border-white/15 text-white rounded-full px-4 py-2.5 text-sm placeholder:text-mist/60 focus:border-goldlight" />
                <button className="bg-gold hover:bg-[#00747B] text-white rounded-full px-5 text-xs tracking-widest uppercase">Join</button>
              </form>
            )}
            <button onClick={() => openBooking()} className="mt-4 w-full border border-goldlight/50 text-goldlight rounded-full py-3 text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition">Book Consultation</button>
          </div>
        </div>
        <div className="gold-line my-8 opacity-40" />
        <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs text-mist/70">
          <p>© 2026 Healthy Home. All rights reserved.</p>
          <p className="flex gap-4"><span>Privacy</span><span>Terms</span><span>Accessibility</span><span>HIPAA Notice</span></p>
        </div>
      </div>
    </footer>
  );
}