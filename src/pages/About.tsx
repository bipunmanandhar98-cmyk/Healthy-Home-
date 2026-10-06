import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, HeartHandshake, Microscope, ArrowRight, Quote } from 'lucide-react';
import { useBooking } from '../components/booking';
import { SectionHead, CtaBanner } from '../components/shared';
import TeamAvatar from '../components/TeamAvatar';
import { googleRating, team } from '../data/content';
import { IMG } from '../data/images';

const values = [
  { icon: HeartHandshake, t: 'Clients first, always', s: 'Honest recommendations — we talk 1 in 5 clients OUT of services they don\u2019t need.' },
  { icon: Microscope, t: 'Screening before selling', s: 'Body/fat assessments and labs first, so every plan matches your real numbers.' },
  { icon: Award, t: 'Mastery is mandatory', s: '100+ academy hours, ongoing clinical training, and supervised care for every specialist.' },
];

/* Company milestones, oldest first. Rendered as the journey timeline below, which
   alternates sides from lg up, so the order matters. Each entry also carries a
   photo, which fills the column opposite its text — swap the files in
   public/images/journey/ for the real milestone photos and update the alt. */
const journey = [
  {
    year: '2006',
    title: 'A Dream Beginning',
    body: 'Two young men, both with unparalleled ambitions and the right knowledge, decided to embark on a journey to establish Healthy Home, Nepal\u2019s first weight loss clinic. Mr Krishna forgave his plans to visit Japan and decided to contribute in Nepal. Mr Mohan had just returned from an extensive experience in the wellness industry from abroad. Both forged a charming partnership with their initial outlet in Bagbazaar.',
    img: IMG.journey.founding,
    alt: 'Healthy Home reception',
  },
  {
    year: '2008 \u2013 Present',
    title: 'A Journey of Trust and Transformation',
    body: 'Throughout this journey, we\u2019ve transformed countless lives, earning the trust of thousands through holistic care, proven results, and a strong community built on wellness and transformation. From 2008 to 2026, Healthy Home grew from a single vision into a trusted name in health and wellness. With over 50,000 satisfied customers and 6 thriving branches, Healthy Home continues to grow stronger, expanding through franchise opportunities, advanced technologies, and a renewed vision to inspire holistic wellness nationwide.',
    img: IMG.journey.growth,
    alt: 'Healthy Home reception',
  },
];

export default function About() {
  const { openBooking } = useBooking();
  return (
    <div>
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img loading="lazy" decoding="async" src={IMG.bg.about} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Our Story · Est. 2005</p>
            <h1 className="font-display text-[44px] sm:text-[56px] mt-3 leading-tight">Healthy habits start <em className="gold-text not-italic">at home.</em></h1>
            <p className="text-mocha mt-5 leading-relaxed max-w-lg">What began as a single flagship studio in 2005 is now a trusted wellness destination — 6 branches, 200+ clinicians, coaches and aestheticians, 50K+ services — still family-run, still focused on natural, lasting results.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => openBooking()} className="bg-gold hover:bg-[#00747B] text-white px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase shadow-lg shadow-[#00919A]/25">Meet Us In Person</button>
              <Link to="/locations" className="border border-ink/25 text-ink px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-sand">Find a Branch</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[['2005', 'Serving Nepal'], ['50K+', 'Sessions Received'], ['200+', 'Licensed providers'], ['6', 'Nepal branches'], [`${googleRating.average}★`, 'Google rating'], ['20+', 'Years of glow']].map(([n, l]) => (
              <div key={l} className="bg-white border border-linen shadow-sm rounded-2xl p-5"><p className="font-display text-3xl gold-text font-semibold">{n}</p><p className="text-[11px] tracking-widest uppercase text-stone2 mt-1">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR JOURNEY — timeline. Sits directly under the hero because the hero
          already opens on "what began in 2005"; this is the detail behind it. */}
      <section className="bg-cream border-y border-linen">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
          <SectionHead
            eyebrow="Our Journey"
            title={<>From one room in Bagbazaar to <em className="gold-text not-italic">six branches</em></>}
            sub="How two young men’s partnership grew into one of Nepal’s best-known wellness names."
          />

          <div className="relative mt-14 lg:mt-16">
            {/* The spine. Sits at the left on mobile, where the entries stack in a
                single column, and moves to the centre from lg up, where they
                alternate either side of it. A sibling of the list rather than a
                child: <ol> may only contain <li>. */}
            <span
              aria-hidden="true"
              className="absolute left-0 lg:left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-gradient-to-b from-gold via-gold/40 to-transparent"
            />

            {/* Spacing lives on the list, not on the entries. As padding inside an
                entry it would count towards that entry's height, and the node is
                centred on the entry — so the first node dropped 48px below its
                own text while the last, having no trailing padding, sat correctly. */}
            <ol className="space-y-14 lg:space-y-24">
              {journey.map((j, i) => {
                const onRight = i % 2 === 1;
                return (
                  <li key={j.year} className="relative lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    {/* Node on the spine, ringed in the section's own background so
                        the spine appears to pass behind it rather than through. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 lg:left-1/2 top-1.5 lg:top-1/2 h-3.5 w-3.5 -translate-x-1/2 lg:-translate-y-1/2 rounded-full bg-gold ring-[5px] ring-cream"
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className={`pl-9 lg:pl-0 ${onRight ? 'lg:col-start-2' : 'lg:col-start-1'}`}
                    >
                      <p className="font-display text-3xl sm:text-4xl gold-text leading-none">{j.year}</p>
                      <h3 className="font-display text-2xl sm:text-3xl mt-3">{j.title}</h3>
                      <p className="text-[15px] text-mocha mt-3 leading-relaxed">{j.body}</p>
                    </motion.div>

                    {/* Photo, in whichever column the text is not in. Both are
                        pinned to row 1 so they share the row and stay on the same
                        baseline as the node between them; without the explicit row
                        the second item would auto-flow onto a row of its own. */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`pl-9 lg:pl-0 mt-8 lg:mt-0 ${onRight ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2 lg:row-start-1'}`}
                    >
                      <div className="overflow-hidden rounded-3xl border border-linen bg-sand shadow-sm">
                        <img
                          src={j.img}
                          alt={j.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full aspect-[16/10] object-cover"
                        />
                      </div>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
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
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-3xl overflow-hidden border border-linen group">
                <div className="h-64 overflow-hidden"><TeamAvatar m={m} initialsClass="text-[44px]" className="w-full h-full object-cover" /></div>
                <div className="p-5"><p className="font-display text-xl">{m.name}</p><p className="text-xs text-golddark tracking-wide uppercase mt-0.5">{m.role}</p>{m.note && <p className="text-xs text-stone2 mt-1">{m.note}</p>}</div>
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