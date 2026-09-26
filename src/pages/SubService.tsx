import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, ShieldCheck, Sparkles, ArrowRight, ChevronRight, Calendar } from 'lucide-react';
import { treatments, getSubServices, findSubBySlug, slugify } from '../data/content';
import { useBooking } from '../components/chrome';
import { TreatmentCard, CtaBanner } from '../components/shared';

export default function SubService() {
  const { id, subId } = useParams();
  const parent = treatments.find(x => x.id === id);
  const sub = parent && subId ? findSubBySlug(parent.id, subId) : undefined;
  const t = parent;
  const { openBooking } = useBooking();
  const [tab, setTabLocal] = [0, (_: number) => {}] as unknown as [number, (n: number) => void];
  void tab; void setTabLocal;
  if (!t || !sub) return <Navigate to="/services" replace />;

  const siblings = getSubServices(t.id).filter(s => s.id !== sub.id);
  const others = treatments.filter(x => x.id !== t.id);

  return (
    <div>
      {/* Breadcrumbs: Home → Services → Main Service → Sub-Service */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-xs text-stone2 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-ink inline-flex items-center min-h-[36px]">Home</Link><ChevronRight size={12} />
        <Link to="/services" className="hover:text-ink inline-flex items-center min-h-[36px]">Services</Link><ChevronRight size={12} />
        <Link to={`/services/${t.id}`} className="hover:text-ink inline-flex items-center min-h-[36px]">{t.name}</Link><ChevronRight size={12} />
        <span className="text-golddark font-medium">{sub.name}</span>
      </div>

      {/* Service overview hero */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-14 grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative rounded-[2rem] overflow-hidden">
            <img src={sub.image} alt={sub.name} className="w-full h-[380px] sm:h-[460px] object-cover" />
            <span className="absolute top-4 left-4 bg-gold text-white text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-full">Part of {t.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[[<Clock key="c" size={16} />, sub.duration, 'Duration'], [<ShieldCheck key="s" size={16} />, 'None', 'Downtime'], [<Sparkles key="g" size={16} />, t.results, 'Program']].map(([icon, v, l], i) => (
              <div key={i} className="bg-white border border-linen rounded-2xl p-4 text-center">
                <div className="text-gold mx-auto w-fit">{icon}</div>
                <p className="font-semibold text-sm mt-1.5">{v}</p>
                <p className="text-[11px] text-stone2 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link to={`/services/${t.id}`} className="inline-flex items-center gap-1.5 min-h-[40px] text-[11px] tracking-[0.25em] uppercase text-golddark hover:underline underline-offset-4">
            Branched under {t.name}
          </Link>
          <h1 className="font-display text-5xl mt-2 leading-tight">{sub.name}</h1>
          <p className="font-display italic text-xl text-mocha mt-1">{t.tagline}</p>

          {/* What the treatment/test is */}
          <h2 className="font-display text-2xl mt-6">What is {sub.name}?</h2>
          <p className="text-mocha leading-relaxed mt-2">{sub.overview}</p>

          <div className="bg-sand rounded-2xl p-5 mt-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Consultation · No prices — consult first</p>
              <p className="text-xs text-stone2 mt-0.5">Personalized quote in Nepalese Rupees (Rs.) at your visit</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openBooking({ treatment: t.id })} className="bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.18em] uppercase hover:bg-[#00747B] flex items-center gap-2 shadow-lg shadow-[#00919A]/25"><Calendar size={14} /> Book Appointment</button>
            </div>
          </div>

          {/* Benefits */}
          <h2 className="font-display text-2xl mt-7">Benefits</h2>
          <ul className="grid gap-2.5 mt-3">
            {sub.benefits.map(b => (
              <li key={b} className="flex items-start gap-2.5 text-sm bg-white border border-linen rounded-2xl px-4 py-3">
                <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-golddark" /></span>
                {b}
              </li>
            ))}
          </ul>

          {/* Who it is suitable for */}
          <h2 className="font-display text-2xl mt-7">Who is it suitable for?</h2>
          <ul className="grid gap-2.5 mt-3">
            {sub.suitableFor.map(b => (
              <li key={b} className="flex items-start gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-golddark" /></span>
                {b}
              </li>
            ))}
          </ul>

          {/* Process / how it works */}
          <h2 className="font-display text-2xl mt-7">Process — how it works</h2>
          <ol className="grid gap-3 mt-3">
            {sub.process.map((p, i) => (
              <li key={p.title} className="flex gap-4 bg-white border border-linen rounded-2xl p-5">
                <span className="font-display text-3xl text-gold shrink-0">{i + 1}</span>
                <span><b className="text-ink">{p.title}</b><br /><span className="text-sm text-mocha">{p.desc}</span></span>
              </li>
            ))}
          </ol>

          {/* Expected results */}
          <h2 className="font-display text-2xl mt-7">Expected results</h2>
          <p className="text-mocha leading-relaxed mt-2 text-[15px]">{sub.expectedResults}</p>

          {/* FAQs */}
          <h2 className="font-display text-2xl mt-7">FAQs</h2>
          <div className="grid gap-3 mt-3">
            {sub.faqs.map(f => (
              <div key={f.q} className="bg-white border border-linen rounded-2xl px-5 py-4"><p className="font-medium text-ink">{f.q}</p><p className="text-sm mt-1 text-mocha">{f.a}</p></div>
            ))}
          </div>

          {/* Call-to-action */}
          <div className="flex flex-wrap gap-3 mt-7">
            <button onClick={() => openBooking({ treatment: t.id })} className="bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.18em] uppercase hover:bg-[#00747B] flex items-center gap-2 shadow-lg shadow-[#00919A]/25"><Calendar size={14} /> Request Consultation</button>
            <Link to={`/services/${t.id}`} className="border border-ink/20 px-6 py-3 rounded-full text-xs tracking-[0.18em] uppercase hover:bg-gold hover:text-white hover:border-gold transition inline-flex items-center gap-2">Back to {t.name}</Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            {['Consultation', 'Easy payment plans', 'Member rewards', 'Free parking'].map(x => <span key={x} className="text-[11px] bg-white border border-linen rounded-full px-3 py-1.5 text-mocha">{x}</span>)}
          </div>
        </motion.div>
      </section>

      {/* Related services (siblings branched from same main service) */}
      {siblings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl sm:text-4xl">More in {t.name}</h2>
            <Link to={`/services/${t.id}`} className="text-xs tracking-widest uppercase text-golddark hidden sm:flex items-center gap-1">View main service <ArrowRight size={13} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {siblings.map(s => (
              <Link key={s.id} to={`/services/${t.id}/${slugify(s.name)}`} className="group bg-white border border-linen rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col">
                <div className="h-36 overflow-hidden relative">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                  <span className="absolute top-3 left-3 bg-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">{t.name}</span>
                </div>
                <div className="p-5 flex flex-col grow">
                  <p className="font-display text-xl leading-tight group-hover:text-[#007C83]">{s.name}</p>
                  <p className="text-sm text-mocha mt-1.5 grow">{s.description}</p>
                  <p className="text-[11px] text-stone2 mt-3 flex items-center gap-1"><Clock size={12} /> {s.duration}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-medium text-golddark">View Details <ArrowRight size={13} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">Explore other main services</h2>
          <Link to="/services" className="text-xs tracking-widest uppercase text-golddark hidden sm:flex items-center gap-1">All services <ArrowRight size={13} /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">{others.map(r => <TreatmentCard key={r.id} t={r} />)}</div>
      </section>
      <CtaBanner />
    </div>
  );
}