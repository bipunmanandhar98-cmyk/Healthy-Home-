import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ArrowRight, ChevronDown, LayoutGrid } from 'lucide-react';
import { treatments, getSubServices, slugify } from '../data/content';
import { SectionHead, TreatmentCard } from '../components/shared';
import { IMG } from '../data/images';

export default function Services() {
  const [q, setQ] = useState('');
  const [openMain, setOpenMain] = useState<string[]>(treatments.map(t => t.id));
  const ql = q.trim().toLowerCase();
  const mains = treatments.filter(t =>
    ql === '' || (t.name + ' ' + t.tagline + ' ' + t.description + ' ' + getSubServices(t.id).map(s => s.name).join(' ')).toLowerCase().includes(ql)
  );
  const totalSubs = treatments.reduce((n, t) => n + getSubServices(t.id).length, 0);
  const toggle = (id: string) =>
    setOpenMain(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  return (
    <div>
      {/* Breadcrumbs: Home → Services */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-xs text-stone2 flex items-center gap-1.5">
        <Link to="/" className="hover:text-ink inline-flex items-center min-h-[36px]">Home</Link>
        <span className="text-stone2">›</span>
        <span className="text-ink font-medium">Services</span>
      </div>
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img src={IMG.bg.services} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-16 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Services Menu</p>
          <h1 className="font-display text-5xl sm:text-6xl mt-3">Every service, <em className="gold-text not-italic">one roof</em></h1>
          <p className="text-mocha mt-4 max-w-xl mx-auto">Three main services — Weight Management (7 sub-services), Dermatology (8 sub-services) and Lab Tests (Whole Body Lab Test). Expand a main service to preview its sub-services, or open its dedicated page.</p>
          <div className="max-w-md mx-auto mt-6 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search main or sub-services (e.g. BCA, hydra, lab...)" className="w-full bg-white border border-linen shadow-sm rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-stone2 focus:border-gold" />
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setOpenMain(treatments.map(t => t.id))} className="text-[11px] tracking-[0.15em] uppercase border border-linen bg-white rounded-full px-4 min-h-[40px] inline-flex items-center hover:border-gold">Expand all</button>
            <button onClick={() => setOpenMain([])} className="text-[11px] tracking-[0.15em] uppercase border border-linen bg-white rounded-full px-4 min-h-[40px] inline-flex items-center hover:border-gold">Collapse all</button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-center text-sm text-stone2 mt-2">{treatments.length} main services · {totalSubs} sub-services</p>

        {/* Nested Accordion Service Menu: Main Service → Sub-Services */}
        <div className="grid gap-5 mt-8">
          {mains.map((t, i) => {
            const subs = getSubServices(t.id).filter(s =>
              ql === '' || (s.name + ' ' + s.description).toLowerCase().includes(ql) || t.name.toLowerCase().includes(ql)
            );
            const open = openMain.includes(t.id) || ql !== '';
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }} className="bg-white border border-linen rounded-3xl overflow-hidden hover:shadow-2xl transition">
                {/* Accordion header = main service row */}
                <button onClick={() => toggle(t.id)} aria-expanded={open} className="w-full grid md:grid-cols-[220px_1fr_auto] gap-4 items-center text-left p-4 sm:p-5">
                  <span className="relative h-32 md:h-28 rounded-2xl overflow-hidden block shrink-0">
                    <img src={t.image} alt={t.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                    {t.badge && <span className="absolute top-2 left-2 bg-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full">{t.badge}</span>}
                    <span className="absolute bottom-2 left-2.5 text-cream text-[10px] tracking-[0.2em] uppercase">{subs.length} sub-services</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] tracking-[0.3em] uppercase text-golddark">Main Service {String(i + 1).padStart(2, '0')}</span>
                    <span className="block font-display text-2xl sm:text-3xl leading-tight mt-0.5">{t.name}</span>
                    <span className="block text-sm text-mocha italic mt-0.5">{t.tagline}</span>
                    <span className="hidden md:flex items-center gap-1.5 text-[11px] text-stone2 mt-1.5"><Clock size={12} /> {t.duration} · No prices — consult first</span>
                  </span>
                  <span className="flex md:flex-col items-center gap-2 justify-self-end">
                    <Link to={`/services/${t.id}`} onClick={e => e.stopPropagation()} className="bg-gold text-white rounded-full px-5 min-h-[40px] text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#00747B] transition inline-flex items-center gap-2">Open Page <ArrowRight size={13} /></Link>
                    <span className={`w-9 h-9 rounded-full border border-linen flex items-center justify-center transition ${open ? 'bg-sand' : 'bg-white'}`}>
                      <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </span>
                  </span>
                </button>

                {/* Accordion body = nested sub-service links */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                      <div className="px-4 sm:px-5 pb-5">
                        <div className="border-t border-linen pt-4">
                          <p className="text-[11px] tracking-[0.25em] uppercase text-stone2 flex items-center gap-1.5"><LayoutGrid size={13} className="text-gold" /> Sub-services under {t.name}</p>
                          {subs.length === 0 ? (
                            <p className="text-sm text-mocha mt-3">No sub-services match "{q}".</p>
                          ) : (
                            <div className="grid sm:grid-cols-2 gap-2.5 mt-3">
                              {subs.map(s => (
                                <Link key={s.id} to={`/services/${t.id}/${slugify(s.name)}`} className="group flex gap-3 items-center bg-cream/60 hover:bg-sand border border-linen hover:border-gold rounded-2xl p-3 transition">
                                  <img src={s.image} alt={s.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                                  <span className="min-w-0 grow">
                                    <span className="block font-medium text-[14px] leading-snug group-hover:text-[#007C83]">{s.name}</span>
                                    <span className="block text-xs text-stone2 mt-0.5 line-clamp-1">{s.description}</span>
                                  </span>
                                  <ArrowRight size={14} className="text-gold shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-mocha mt-4 leading-relaxed line-clamp-2">{t.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {mains.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-3xl">No matches for "{q}"</p>
            <p className="text-mocha text-sm mt-2">Try "weight", "derma", "hydra", "laser" or "lab" — or book a consult and we'll match you.</p>
          </div>
        )}

        <div className="mt-12">
          <SectionHead eyebrow="All Sub-Services" title={<>Browse every <em className="gold-text not-italic">sub-service</em></>} sub="Each card links to its own dedicated detail page, branched under its main service." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {treatments.flatMap(t => getSubServices(t.id).map(s => ({ t, s })))
              .filter(({ t, s }) => ql === '' || (s.name + ' ' + s.description + ' ' + t.name).toLowerCase().includes(ql))
              .map(({ t, s }) => (
                <Link key={s.id} to={`/services/${t.id}/${slugify(s.name)}`} className="group bg-white border border-linen rounded-3xl p-5 hover:shadow-xl hover:-translate-y-0.5 transition flex gap-4">
                  <img src={s.image} alt={s.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" loading="lazy" />
                  <span>
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-golddark">{t.name}</span>
                    <span className="block font-medium group-hover:text-[#007C83] mt-0.5">{s.name}</span>
                    <span className="block text-xs text-stone2 mt-1 line-clamp-2">{s.description}</span>
                  </span>
                </Link>
              ))}
          </div>
        </div>

        <div className="mt-12 bg-espresso text-white rounded-3xl p-8 sm:p-10 grid md:grid-cols-2 gap-6 items-center relative overflow-hidden">
          <div className="absolute inset-0 texture-grain opacity-20" />
          <div className="relative">
            <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight">Free Skin Quiz · Dermatology</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-2">Which skin service is right for you?</h2>
            <p className="text-mist text-sm mt-2">Four questions route you to the right sub-service page — HydraFacial, Laser, Tightening, Peeling or Derma Consultation.</p>
          </div>
          <div className="relative flex flex-col sm:flex-row md:justify-end gap-3">
            <Link to="/skin-quiz" className="bg-gold hover:bg-[#00747B] text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition text-center">Start Skin Quiz</Link>
            <Link to="/services/dermatology" className="border border-white/25 text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition text-center">Open Dermatology</Link>
          </div>
        </div>

        <div className="mt-8 bg-sand rounded-3xl p-8 text-center">
          <SectionHead eyebrow="Not sure where to start?" title={<>Take the <em className="gold-text not-italic">concern quiz</em></>} sub="Answer 4 quick questions and we'll recommend your starter plan." />
          <Link to="/services/weight-management" className="inline-block mt-5 bg-gold text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-[#00747B] shadow-lg shadow-[#00919A]/25">Start With Bestsellers</Link>
        </div>
      </div>
    </div>
  );
}

// Re-export for Home page card grid
export { TreatmentCard };