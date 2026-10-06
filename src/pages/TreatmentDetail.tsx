import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, ShieldCheck, Sparkles, ArrowRight, ChevronRight, Calendar } from 'lucide-react';
import { treatments, getSubServices, subServices, slugify } from '../data/content';
import { useBooking } from '../components/booking';
import { TreatmentCard, CtaBanner } from '../components/shared';
import Accordion from '../components/Accordion';
import ReadMore from '../components/ReadMore';

export default function TreatmentDetail() {
  const { id } = useParams();
  const directSub = subServices.find(x => x.id === id);
  const t = treatments.find(x => x.id === id);
  const { openBooking } = useBooking();
  const subs = t ? getSubServices(t.id) : [];
  if (directSub && !t) return <Navigate to={`/services/${directSub.parentId}/${slugify(directSub.name)}`} replace />;
  if (!t) return <Navigate to="/services" replace />;
  const related = treatments.filter(x => x.id !== t.id);

  return (
    <div>
      {/* Breadcrumbs: Home → Services → Main Service */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-xs text-stone2 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-ink inline-flex items-center min-h-[36px]">Home</Link><ChevronRight size={12} />
        <Link to="/services" className="hover:text-ink inline-flex items-center min-h-[36px]">Services</Link><ChevronRight size={12} />
        <span className="text-ink font-medium">{t.name}</span>
      </div>

      {/* Category intro */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-14 grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative rounded-[2rem] overflow-hidden">
            <img src={t.image} alt={t.name} className="w-full h-[380px] sm:h-[460px] object-cover" />
            {t.badge && <span className="absolute top-4 left-4 bg-gold text-white text-[11px] tracking-[0.15em] uppercase px-4 py-2 rounded-full">{t.badge}</span>}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[[<Clock key="c" size={16} />, t.duration, 'Typical visit'], [<ShieldCheck key="s" size={16} />, t.downtime, 'Downtime'], [<Sparkles key="g" size={16} />, `${subs.length} options`, 'Sub-services']].map(([icon, v, l], i) => (
              <div key={i} className="bg-white border border-linen rounded-2xl p-4 text-center">
                <div className="text-gold mx-auto w-fit">{icon}</div>
                <p className="font-semibold text-sm mt-1.5">{v}</p>
                <p className="text-[11px] text-stone2 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Main Service · {t.category}</p>
          <h1 className="font-display text-[44px] mt-2 leading-tight">{t.name}</h1>
          <p className="font-display italic text-xl text-mocha mt-1">{t.tagline}</p>
          <ReadMore text={t.overview} className="mt-4" />
          <div className="bg-sand rounded-2xl p-5 mt-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Consultation · No prices — consult first</p>
              <p className="text-xs text-stone2 mt-0.5">Personalized quote in Nepalese Rupees (Rs.) at your visit</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openBooking({ treatment: t.id })} className="bg-gold text-white px-6 py-3 rounded-full text-xs tracking-[0.18em] uppercase hover:bg-[#00747B] flex items-center gap-2 shadow-lg shadow-[#00919A]/25"><Calendar size={14} /> Book Consult</button>
            </div>
          </div>

          {/* Benefits, suitability, process and FAQs used to sit here as four always-open
              blocks, which made this column far taller than the image beside it and
              pushed the sub-services and FAQ sections a full screen further down.
              They are now a single accordion immediately below this grid. */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Consultation', 'Easy payment plans', 'Member rewards', 'Free parking'].map(x => <span key={x} className="text-[11px] bg-white border border-linen rounded-full px-3 py-1.5 text-mocha">{x}</span>)}
          </div>
        </motion.div>
      </section>

      {/* Detail accordion — benefits, who it suits, the process, then the FAQs that
          used to have their own section further down the page. Benefits starts open
          so the panel pattern is visible without having to click anything. */}
      <section className="max-w-4xl mx-auto px-4 pb-14">
        <Accordion
          initiallyOpen={['benefits']}
          items={[
            {
              id: 'benefits',
              title: `Why choose ${t.name}?`,
              meta: `${t.benefits.length} benefits`,
              content: (
                <ul className="grid gap-2.5">
                  {t.benefits.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-sm bg-cream/60 border border-linen rounded-2xl px-4 py-3">
                      <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-golddark" /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: 'suitable',
              title: 'Who is it suitable for?',
              content: (
                <ul className="grid gap-2.5">
                  {t.suitableFor.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-golddark" /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: 'process',
              title: 'How it works',
              meta: `${t.process.length} steps`,
              content: (
                <ol className="grid gap-3">
                  {t.process.map((p, i) => (
                    <li key={p.title} className="flex gap-4 bg-cream/60 border border-linen rounded-2xl p-5">
                      <span className="font-display text-3xl text-gold shrink-0">{i + 1}</span>
                      <span><b className="text-ink">{p.title}</b><br /><span className="text-sm text-mocha">{p.desc}</span></span>
                    </li>
                  ))}
                </ol>
              ),
            },
            {
              id: 'faqs',
              title: `${t.name} FAQs`,
              meta: `${t.faqs.length} questions`,
              content: (
                <div className="grid gap-3">
                  {t.faqs.map(f => (
                    <div key={f.q} className="bg-cream/60 border border-linen rounded-2xl px-5 py-4">
                      <p className="font-medium text-ink">{f.q}</p>
                      <p className="text-sm mt-1 text-mocha leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
        <div className="text-center mt-7">
          <button onClick={() => openBooking({ treatment: t.id })} className="bg-gold text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-[#00747B] inline-flex items-center gap-2 shadow-lg shadow-[#00919A]/25"><Calendar size={14} /> Book Consult</button>
        </div>
      </section>

      {/* Sub-Service Categories branched from this main service */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-golddark">Branched from {t.name}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-1">{t.name} sub-services</h2>
          </div>
          <span className="text-xs tracking-widest uppercase text-stone2 hidden sm:block">{subs.length} options</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {subs.map(s => (
            <Link key={s.id} to={`/services/${t.id}/${slugify(s.name)}`} className="group bg-white border border-linen rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col">
              <div className="h-36 overflow-hidden relative">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                <span className="absolute top-3 left-3 bg-gold text-white text-[11px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">{t.name}</span>
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

      {t.id === 'dermatology' && (
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="bg-espresso text-white rounded-3xl p-8 sm:p-10 grid md:grid-cols-2 gap-6 items-center relative overflow-hidden">
            <div className="absolute inset-0 texture-grain opacity-20" />
            <div className="relative">
              <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight">Free Skin Quiz</p>
              <h2 className="font-display text-3xl sm:text-4xl mt-2">Not sure which skin service fits?</h2>
              <p className="text-mist text-sm mt-2">Answer 4 questions — we route you to the right Dermatology sub-service detail page.</p>
            </div>
            <div className="relative flex flex-col sm:flex-row md:justify-end gap-3">
              <Link to="/skin-quiz" className="bg-gold hover:bg-[#00747B] text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition text-center">Start Skin Quiz</Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">Explore other main services</h2>
          <Link to="/services" className="text-xs tracking-widest uppercase text-golddark hidden sm:flex items-center gap-1">All services <ArrowRight size={13} /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">{related.map(r => <TreatmentCard key={r.id} t={r} />)}</div>
      </section>
      <CtaBanner />
    </div>
  );
}