import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Star, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import type { Treatment } from '../data/content';
import { getSubServices, slugify, googleRating } from '../data/content';
import { useBooking } from './booking';
import { IMG } from '../data/images';

export function Stars({ n = 5, size = 13 }: { n?: number; size?: number }) {
  return <span className="inline-flex gap-0.5">{Array.from({ length: n }).map((_, i) => <Star key={i} size={size} className="fill-gold text-gold" />)}</span>;
}

export function CountUp({ to, duration = 1.8, suffix = '' }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {val.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub, center = true, light = false }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-2xl`}>
      <p className={`text-[11px] tracking-[0.35em] uppercase font-medium ${light ? 'text-goldlight' : 'text-golddark'}`}>{eyebrow}</p>
      {/* leading-[1.14], not the 1.05 this was set to. 1.05 was correct for the
          Cormorant Garamond serif these headings used to be set in, but the
          display face is now Century Gothic Pro / Montserrat — a geometric sans
          with a large x-height and tall ascenders. At 48px, 1.05 leaves descenders
          in a wrapped heading touching the ascenders of the line below. Section
          titles are the most-wrapped headings on the site, so this one value
          governs nearly all of them. */}
      <h2 className={`font-display text-4xl sm:text-[44px] mt-3 leading-[1.14] ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {sub && <p className={`mt-4 text-[15px] leading-relaxed ${light ? 'text-mist' : 'text-mocha'}`}>{sub}</p>}
    </div>
  );
}

export function TreatmentCard({ t, showSubs = false }: { t: Treatment; showSubs?: boolean }) {
  const { openBooking } = useBooking();
  const subs = getSubServices(t.id);
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-linen hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link to={`/services/${t.id}`} className="relative h-52 overflow-hidden block">
        <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        {t.badge && <span className="absolute top-3 left-3 bg-gold text-white text-[11px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full font-medium">{t.badge}</span>}
        <span className="absolute bottom-3 left-4 text-cream text-[11px] tracking-[0.2em] uppercase">{t.category}</span>
      </Link>
      <div className="p-5 flex flex-col grow">
        <Link to={`/services/${t.id}`} className="font-display text-[22px] leading-tight min-h-[40px] inline-flex items-center hover:text-[#007C83]">{t.name}</Link>
        <p className="text-[13px] text-mocha italic font-display text-[16px]">{t.tagline}</p>
        <div className="flex items-center mt-3 pt-3 border-t border-linen">
          <span className="text-[11px] text-stone2 flex items-center gap-1"><Clock size={12} /> {t.duration}</span>
          <span className="ml-auto text-[11px] font-medium text-golddark">{subs.length} sub-services</span>
        </div>
        {showSubs && subs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {subs.map(s => (
              <Link key={s.id} to={`/services/${t.id}/${slugify(s.name)}`} className="text-[11px] bg-sand hover:bg-gold hover:text-white border border-linen hover:border-gold rounded-full px-3 py-1.5 transition">{s.name}</Link>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <Link to={`/services/${t.id}`} className="flex-1 text-center border border-ink/20 rounded-full py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-gold hover:text-white hover:border-gold transition">Learn More</Link>
          <button onClick={() => openBooking({ treatment: t.id })} className="flex-1 bg-gold text-white rounded-full py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#00747B] transition">Book Consult</button>
        </div>
      </div>
    </div>
  );
}

export function TrustBar() {
  const items = [
    { icon: ShieldCheck, t: 'Physician-Led', s: 'MD-directed care at every branch' },
    { icon: Star, t: `${googleRating.average} Google Rating`, s: `${googleRating.total.toLocaleString()} reviews across ${googleRating.branchCount} branches` },
    { icon: Clock, t: 'Consultations', s: 'No-pressure service mapping' },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-3 max-w-5xl mx-auto">
      {items.map(i => (
        <div key={i.t} className="flex items-center gap-3 bg-white/70 border border-linen rounded-2xl px-5 py-4">
          <i.icon size={22} className="text-gold shrink-0" />
          <div><p className="font-medium text-sm">{i.t}</p><p className="text-xs text-stone2">{i.s}</p></div>
        </div>
      ))}
    </div>
  );
}

export function CtaBanner() {
  const { openBooking } = useBooking();
  return (
    <section className="relative overflow-hidden bg-espresso text-white">
      <img src={IMG.bg.cta} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/90 to-espresso/60" />
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-goldlight">Limited Availability</p>
          <h2 className="font-display text-4xl sm:text-[44px] mt-3 leading-tight text-white">Your healthy start begins with a <em className="text-goldlight not-italic font-semibold">consultation</em></h2>
          <p className="text-mist mt-4 max-w-md">Body/fat assessment, honest pricing, custom service plan — 30 minutes, zero pressure, Rs 1,500 off your first service when you book today.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => openBooking()} className="bg-gold hover:bg-[#00747B] text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-2">Claim Rs 1,500 Off <ArrowRight size={15} /></button>
            <a href="tel:+977015335763" className="border border-white/25 text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-white/10">Call 01-5335763</a>
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-3 text-sm">
          {[[`${googleRating.total.toLocaleString()}`, 'Google reviews'], ['6', 'Nepal locations'], [`${googleRating.average}★`, 'Google rating'], ['20+', 'Years of expertise']].map(([n, l]) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur"><p className="font-display text-4xl text-goldlight font-semibold">{n}</p><p className="text-mist text-xs tracking-widest uppercase mt-1">{l}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}