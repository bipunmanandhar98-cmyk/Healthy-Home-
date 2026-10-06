import { motion } from 'framer-motion';
import { Check, Crown, Gift, Percent, CalendarDays, Sparkles, ArrowRight, BadgeCheck, Star } from 'lucide-react';
import { useBooking } from '../components/booking';
import { SectionHead } from '../components/shared';
import { IMG } from '../data/images';

const benefits = [
  { icon: Star, title: '10 Bonus Points', desc: '+ Skin Consultation on joining' },
  { icon: Percent, title: '20% OFF on All Services', desc: 'On full payment, all year long' },
  { icon: BadgeCheck, title: '30% OFF on 1 Annual Package', desc: 'On full payment — your biggest saving' },
  { icon: Gift, title: 'Birthday Month Gift', desc: '1 Deluxe Hydrafacial / 1 Tea Package' },
  { icon: Check, title: '1 BCA Test', desc: 'Body composition analysis included' },
  { icon: CalendarDays, title: 'Early Access to Offers', desc: 'Shop every offer 3 days prior' },
  { icon: Sparkles, title: 'Offers Extended +3 Days', desc: 'Extra 3 days beyond public end dates' },
  { icon: Gift, title: '1 Seasonal Wellness Gift', desc: 'Curated gift every season' },
  { icon: Percent, title: '10% OFF Healthy Home Products', desc: 'Wellness teas & nutrition range' },
  { icon: Percent, title: '5% OFF Skin Care Products', desc: 'Skin-care range, all year' },
];

export default function Membership() {
  const { openBooking } = useBooking();
  return (
    <div>
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img loading="lazy" decoding="async" src={IMG.bg.membership} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Healthy Home Membership</p>
          <h1 className="font-display text-[44px] sm:text-[56px] mt-3">One card. <em className="gold-text not-italic">A year of wellness.</em></h1>
          <p className="text-mocha mt-4 max-w-xl mx-auto">Membership fee Rs. 5,000 per year — unlock member-only discounts, gifts, bonus points and early access across Weight Management, Dermatology and Lab Tests.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-white rounded-3xl border-2 border-gold p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl overflow-hidden">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-gold text-white text-[11px] tracking-[0.2em] uppercase px-5 py-1.5 rounded-b-2xl flex items-center gap-1.5"><Crown size={11} /> Healthy Home Membership</span>
          <p className="text-[11px] tracking-[0.3em] uppercase text-golddark mt-4">Annual Membership</p>
          <p className="font-display text-[56px] mt-2">Rs. 5,000<span className="text-xl text-stone2 font-body">/year</span></p>
          <p className="text-sm text-mocha italic mt-1">Valid 12 months from activation · All 6 Nepal branches</p>
          <button onClick={() => openBooking()} className="mt-6 bg-gold hover:bg-[#00747B] text-white rounded-full px-10 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition shadow-lg shadow-[#00919A]/25">Become a Member</button>
        </motion.div>

        <div className="mt-12">
          <SectionHead eyebrow="Membership Benefits" title={<>Everything your <em className="gold-text not-italic">Rs. 5,000</em> unlocks</>} sub="Ten benefits across services, products, gifts and early access — valid all year." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {benefits.slice(0, 9).map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} className="bg-white border border-linen rounded-3xl p-6 text-center hover:shadow-xl transition">
                <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 flex items-center justify-center"><b.icon size={22} className="text-golddark" /></div>
                <p className="font-medium mt-3">{b.title}</p>
                <p className="text-sm text-mocha mt-1">{b.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 bg-white border border-linen rounded-3xl p-6 text-center hover:shadow-xl transition max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 flex items-center justify-center"><Percent size={22} className="text-golddark" /></div>
            <p className="font-medium mt-3">{benefits[9].title}</p>
            <p className="text-sm text-mocha mt-1">{benefits[9].desc}</p>
          </motion.div>
        </div>

        <div className="mt-10 bg-espresso text-white rounded-3xl p-8 sm:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight">Membership Fee</p>
            <h3 className="font-display text-4xl mt-2">Rs. 5,000 <span className="text-xl text-mist">per year</span></h3>
            <p className="text-mist text-sm mt-2">Join at any branch or book a consult — activation is instant and valid for 12 months.</p>
          </div>
          <div className="flex flex-col sm:flex-row md:justify-end gap-3">
            <button onClick={() => openBooking()} className="bg-gold hover:bg-[#00747B] text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition">Become a Member</button>
            <button onClick={() => openBooking()} className="border border-white/25 text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition inline-flex items-center justify-center gap-2">Book Consult <ArrowRight size={14} /></button>
          </div>
        </div>

        <p className="text-center mt-8"><button onClick={() => openBooking()} className="inline-flex items-center gap-2 min-h-[44px] text-xs tracking-[0.2em] uppercase text-golddark underline underline-offset-8">Book a tour + consult <ArrowRight size={14} /></button></p>
      </div>
    </div>
  );
}