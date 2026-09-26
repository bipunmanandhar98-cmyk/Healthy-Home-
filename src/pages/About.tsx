import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, HeartHandshake, Microscope, ArrowRight, Quote } from 'lucide-react';
import { useBooking } from '../components/chrome';
import { SectionHead, CtaBanner } from '../components/shared';
import { googleRating } from '../data/content';

const team = [
  { name: 'Dr. Daniel Taheri, MD', role: 'Medical Director · Weight & Wellness', img: '/images/site/team-1.jpg', note: '20+ yrs · 50k+ consultations' },
  { name: 'Sarah Mitchell, NP-C', role: 'Lead Weight-Loss Clinician', img: '/images/site/team-2.jpg', note: 'Obesity care & nutrition' },
  { name: 'Jessica Alvarez, RN', role: 'Lead Aesthetic Specialist', img: '/images/site/team-3.jpg', note: '8 yrs · skin & wellness care' },
  { name: 'Dr. Priya Nair, MD', role: 'Wellness & Screening Physician', img: '/images/site/team-4.jpg', note: 'Screening + lifestyle medicine' },
];

const values = [
  { icon: HeartHandshake, t: 'Clients first, always', s: 'Honest recommendations — we talk 1 in 5 clients OUT of services they don\u2019t need.' },
  { icon: Microscope, t: 'Screening before selling', s: 'Body/fat assessments and labs first, so every plan matches your real numbers.' },
  { icon: Award, t: 'Mastery is mandatory', s: '100+ academy hours, ongoing clinical training, and supervised care for every specialist.' },
];

export default function About() {
  const { openBooking } = useBooking();
  return (
    <div>
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img loading="lazy" decoding="async" src="/images/site/bg-about.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Our Story · Est. 2005</p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 leading-tight">Healthy habits start <em className="gold-text not-italic">at home.</em></h1>
            <p className="text-mocha mt-5 leading-relaxed max-w-lg">What began as a single flagship studio in 2005 is now a trusted wellness destination — 6 branch, 200+ clinicians, coaches and aestheticians, 50K+ services — still family-run, still focused on natural, lasting results.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => openBooking()} className="bg-gold hover:bg-[#00747B] text-white px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase shadow-lg shadow-[#00919A]/25">Meet Us In Person</button>
              <Link to="/locations" className="border border-ink/25 text-ink px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-sand">Find a Branch</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[['2005', 'Serving Nepal'], ['50K+', 'Sessions Received'], ['200+', 'Licensed providers'], ['6', 'Nepal branch'], [`${googleRating.average}★`, 'Google rating'], ['20+', 'Years of glow']].map(([n, l]) => (
              <div key={l} className="bg-white border border-linen shadow-sm rounded-2xl p-5"><p className="font-display text-3xl gold-text font-semibold">{n}</p><p className="text-[11px] tracking-widest uppercase text-stone2 mt-1">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHead eyebrow="What We Stand For" title={<>Three promises, <em className="gold-text not-italic">kept daily</em></>} />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {values.map((v, i) => (
            <motion.div key={v.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-linen rounded-3xl p-7 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 flex items-center justify-center"><v.icon size={22} className="text-golddark" /></div>
              <p className="font-display text-2xl mt-4">{v.t}</p>
              <p className="text-sm text-mocha mt-2 leading-relaxed">{v.s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-sand/60 border-y border-linen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <SectionHead eyebrow="Leadership & Experts" title="Hands you can trust" sub="A few of the 200+ clinicians, coaches and aestheticians behind your results." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {team.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-3xl overflow-hidden border border-linen group">
                <div className="h-64 overflow-hidden"><img loading="lazy" decoding="async" src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /></div>
                <div className="p-5"><p className="font-display text-xl">{m.name}</p><p className="text-xs text-golddark tracking-wide uppercase mt-0.5">{m.role}</p><p className="text-xs text-stone2 mt-1">{m.note}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Quote size={32} className="text-gold mx-auto" />
        <p className="font-display text-3xl sm:text-4xl leading-snug mt-4 italic">"We don't chase extremes or quick fixes. We build healthy routines — so you feel at home in your body, every day."</p>
        <p className="text-xs tracking-[0.25em] uppercase text-stone2 mt-5">— Founding Philosophy, Healthy Home Care Board</p>
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={() => openBooking()} className="bg-gold text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-[#00747B] shadow-lg shadow-[#00919A]/25">Book Consultation</button>
          <Link to="/services" className="border border-ink/20 px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition inline-flex items-center gap-2">Services <ArrowRight size={14} /></Link>
        </div>
      </section>
      <CtaBanner />
    </div>
  );
}