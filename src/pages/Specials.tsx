import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, Clock, Sparkles, ArrowRight, CalendarDays } from 'lucide-react';
import { treatments } from '../data/content';
import { useBooking } from '../components/chrome';
import { SectionHead, CtaBanner } from '../components/shared';

const specials = [
  { code: 'WEIGHT20', title: '20% Off Weight Management', desc: 'BCA testing + guided coaching with a personalized plan and progress tracking.', ends: 'Ends Sep 30, 2026', tag: 'Most Claimed', treatment: 'weight-management' },
  { code: 'DERMA499', title: 'Dermatology Skin Refresh', desc: 'HydraFacial, skin tightening or chemical peeling with a derma consult. Zero downtime.', ends: 'New clients only', tag: 'Limited Slots', treatment: 'dermatology' },
  { code: 'LASER1500', title: 'Rs 1,500 Off Laser Hair Removal', desc: 'Dermatology laser sessions with a personalized skin plan.', ends: 'Ends Sep 30, 2026', tag: 'Fan Favorite', treatment: 'dermatology' },
  { code: 'LAB25', title: '25% Off Whole Body Lab Test', desc: 'Full lab panel plus a results review with our care team.', ends: 'While slots last', tag: 'Know Your Numbers', treatment: 'lab-tests' },
  { code: 'BCA15', title: '15% Off BCA Testing', desc: 'Body composition analysis. Perfect start to any weight program.', ends: 'Monthly refresh', tag: 'Start Here', treatment: 'weight-management' },
  { code: 'ASSESS1500', title: 'Rs 1,500 Off Body/Fat Assessment', desc: 'Body composition + obesity testing with a personalized weight-management plan.', ends: 'Ongoing', tag: 'Start Here', treatment: 'weight-management' },
];

const events = [
  { date: 'SEP 18', title: 'Healthy Weight Kickoff — Thapathali', desc: 'Live body/fat assessment demos, wellness tea tasting, raffle for a free screening. RSVP free.', spot: '42 spots left' },
  { date: 'SEP 25', title: 'Aesthetic & Skin Masterclass — Baneshwor', desc: 'Watch our specialists demo skin services live. Attendees get Rs 13,500 service credit.', spot: '18 spots left' },
  { date: 'OCT 02', title: 'Wellness Open House — Pokhara', desc: 'Weight-loss + screening Q&A with our clinicians, free body-comp scans, product discounts.', spot: '60 spots left' },
];

export default function Specials() {
  const { openBooking } = useBooking();
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [rsvp, setRsvp] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div>
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Specials & Events</p>
          <h1 className="font-display text-5xl sm:text-6xl mt-3">Save on your <em className="gold-text not-italic">healthy start</em></h1>
          <p className="text-mocha mt-4 max-w-xl mx-auto">Copy a code, show it at check-in or mention it when booking. Stack with member rewards.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specials.map((s, i) => {
            const t = treatments.find(x => x.id === s.treatment);
            return (
              <motion.div key={s.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="bg-white border border-linen rounded-3xl overflow-hidden hover:shadow-xl transition flex flex-col">
                {t && <div className="h-36 overflow-hidden relative"><img loading="lazy" decoding="async" src={t.image} alt={s.title} className="w-full h-full object-cover" /><span className="absolute top-3 left-3 bg-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full shadow">{s.tag}</span></div>}
                <div className="p-6 flex flex-col grow">
                  <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
                  <p className="text-sm text-mocha mt-2 grow">{s.desc}</p>
                  <p className="text-[11px] text-stone2 mt-2 flex items-center gap-1"><Clock size={12} /> {s.ends}</p>
                  <button onClick={() => copy(s.code)} className="mt-4 border-2 border-dashed border-gold/60 bg-sand/60 rounded-2xl py-3 flex items-center justify-center gap-2 font-mono tracking-[0.2em] text-sm hover:bg-sand transition">
                    {copied === s.code ? <><Check size={15} className="text-green-700" /> COPIED!</> : <><Tag size={14} className="text-golddark" /> {s.code} <Copy size={13} className="text-stone2" /></>}
                  </button>
                  <button onClick={() => openBooking({ treatment: s.treatment })} className="mt-3 bg-gold text-white rounded-full py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-[#00747B]">Claim This Offer</button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
          <div>
            <SectionHead center={false} eyebrow="You're Invited" title={<>Wellness <em className="gold-text not-italic">events</em> near you</>} sub="Demos, masterclasses and open houses with exclusive night-of pricing." />
            <form onSubmit={e => { e.preventDefault(); setRsvp(email); }} className="mt-5 flex gap-2">
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Email for invites" className="flex-1 bg-white border border-linen rounded-full px-5 py-3 text-sm focus:border-gold" />
              <button className="bg-gold hover:bg-[#00747B] text-white rounded-full px-6 text-xs tracking-widest uppercase">Get Invites</button>
            </form>
            {rsvp && <p className="mt-3 text-sm bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3">You're in! Invites will land at {rsvp}.</p>}
          </div>
          <div className="grid gap-3">
            {events.map(e => (
              <div key={e.title} className="bg-white border border-linen rounded-2xl p-5 flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl bg-gold text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-[#00919A]/25"><span className="text-[10px] tracking-widest opacity-90">{e.date.split(' ')[0]}</span><span className="font-display text-2xl leading-none">{e.date.split(' ')[1]}</span></div>
                <div className="grow"><p className="font-medium">{e.title}</p><p className="text-sm text-mocha">{e.desc}</p><p className="text-[11px] text-golddark mt-1 flex items-center gap-1"><Sparkles size={11} /> {e.spot}</p></div>
                <button onClick={() => openBooking()} className="shrink-0 border border-ink/20 rounded-full px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-gold hover:text-white hover:border-gold transition hidden sm:block">RSVP</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-sand rounded-3xl p-8 text-center">
          <p className="flex items-center justify-center gap-2 text-golddark text-xs tracking-[0.25em] uppercase"><CalendarDays size={15} /> Refer a friend</p>
          <h3 className="font-display text-3xl mt-2">Give Rs 1,500, Get Rs 13,500 — unlimited</h3>
          <p className="text-sm text-mocha mt-1">Share your code after any visit. Credits stack with everything.</p>
          <button onClick={() => openBooking()} className="mt-4 inline-flex items-center gap-2 bg-gold text-white px-7 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-[#00747B] shadow-lg shadow-[#00919A]/25">Book & Get Your Code <ArrowRight size={14} /></button>
        </div>
      </div>
      <CtaBanner />
    </div>
  );
}