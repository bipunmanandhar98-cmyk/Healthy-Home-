import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calculator, Sparkles, Ruler, ScanFace } from 'lucide-react';
import BmiCalculator from '../components/BmiCalculator';
import SkinQuiz from '../components/SkinQuiz';
import { CtaBanner, SectionHead } from '../components/shared';

const TOOLS = [
  { id: 'bmi', label: 'BMI Check', icon: Calculator, blurb: 'Body Mass Index in seconds, mapped to the right service.' },
  { id: 'skin', label: 'Skin Quiz', icon: Sparkles, blurb: 'Four questions route you to your matched Dermatology page.' },
];

export default function WellnessHub() {
  const { hash } = useLocation();
  const [active, setActive] = useState(hash.replace('#', '') || 'bmi');

  /* Deep links from the old /bmi-calculator and /skin-quiz routes land here with
     a hash, so the active tool has to follow it. Adjusting state during render
     rather than in an effect keeps the highlight correct on the very first
     frame of that navigation. `lastHash` records what we have already reacted to,
     which is what stops this firing again on unrelated re-renders. */
  const toolId = hash.replace('#', '');
  const isTool = Boolean(toolId) && TOOLS.some(t => t.id === toolId);
  const [lastHash, setLastHash] = useState(hash);
  if (hash !== lastHash) {
    setLastHash(hash);
    if (isTool) setActive(toolId);
  }

  // Deep links from the old /bmi-calculator and /skin-quiz routes land here.
  // The page reflows as images load and whileInView sections mount, so a single
  // scroll can compute a stale offset. Retry until the target is really in view.
  useEffect(() => {
    const id = hash.replace('#', '');
    if (!id || !TOOLS.some(t => t.id === id)) return;

    let cancelled = false;
    const scrollToTarget = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const inView = () => {
      const el = document.getElementById(id);
      if (!el) return true;
      const r = el.getBoundingClientRect();
      return r.top > -100 && r.top < window.innerHeight * 0.8;
    };

    scrollToTarget();
    const timers = [
      setTimeout(scrollToTarget, 250),
      setTimeout(scrollToTarget, 700),
      setTimeout(scrollToTarget, 1400),
      // Give up quietly if something still moved; never fight the user.
      setTimeout(() => { if (!inView()) scrollToTarget(); }, 2400),
    ];
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [hash]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 pt-6 text-xs text-stone2 flex items-center gap-1.5">
        <Link to="/" className="hover:text-ink inline-flex items-center min-h-[36px]">Home</Link>
        <span className="text-stone2">›</span>
        <span className="text-ink font-medium">Wellness Hub</span>
      </div>

      <section className="bg-white text-ink border-b border-linen relative overflow-hidden mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-14 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Free Health Tools</p>
          <h1 className="font-display text-[44px] sm:text-[56px] mt-3">Wellness <em className="gold-text not-italic">Hub</em></h1>
          <p className="text-mocha mt-4 max-w-2xl mx-auto">
            Two free self-checks to help you start in the right place. No sign-up, and neither one
            replaces a consultation.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {TOOLS.map(t => {
              const Icon = t.icon;
              const on = active === t.id;
              return (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  onClick={() => setActive(t.id)}
                  className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium transition ${
                    on ? 'bg-gold text-white shadow-md shadow-[#00919A]/25' : 'bg-white border border-linen text-ink hover:border-gold'
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* BMI */}
      <section id="bmi" className="max-w-7xl mx-auto px-4 py-14 lg:py-16 scroll-mt-24">
        <SectionHead
          eyebrow="Weight"
          title={<>Check your BMI, <em className="gold-text not-italic">meet your match</em></>}
          sub="Our calculator maps your BMI to the right Healthy Home service — then books your consultation in one tap."
        />
        <div className="mt-8"><BmiCalculator /></div>
        <div className="mt-12">
          <SectionHead
            eyebrow="How We Use It"
            title={<>BMI → <em className="gold-text not-italic">right service</em></>}
            sub="Underweight clients start with nourishing weight-gain plans and lab baselines. Healthy-range clients maintain with screening and skin care. Overweight and obese clients start with assessment, labs and guided weight management."
          />
        </div>
      </section>

      {/* Skin quiz */}
      <section className="bg-sand/60 border-y border-linen">
        <div id="skin" className="max-w-7xl mx-auto px-4 py-14 lg:py-16 scroll-mt-24">
          <SectionHead
            eyebrow="Dermatology"
            title={<>Not sure where to start? <em className="gold-text not-italic">Take the skin quiz</em></>}
            sub="Four questions route you to the right Dermatology sub-service — HydraFacial, Laser Hair Removal, Skin Tightening, Face Lifting, Chemical Peeling or Derma Consultation."
          />
          <div className="mt-8"><SkinQuiz /></div>
          <div className="mt-12">
            <SectionHead
              eyebrow="How It Fits"
              title={<>Services → Dermatology → <em className="gold-text not-italic">your match</em></>}
              sub="Results link straight into the service structure — every recommendation opens its own detail page with overview, benefits, suitability, process, results, FAQs and booking."
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 gap-5">
          {TOOLS.map(t => {
            const Icon = t.icon;
            return (
              <div key={t.id} className="bg-white border border-linen rounded-3xl p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gold/12 text-golddark flex items-center justify-center shrink-0">
                  <Icon size={19} />
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {t.id === 'bmi' ? <Ruler size={14} className="text-gold" /> : <ScanFace size={14} className="text-gold" />}
                    {t.label}
                  </p>
                  <p className="text-sm text-mocha mt-1.5 leading-relaxed">{t.blurb}</p>
                  <a href={`#${t.id}`} onClick={() => setActive(t.id)} className="inline-flex items-center min-h-[40px] mt-2 text-[11px] tracking-[0.18em] uppercase text-golddark font-medium hover:underline">
                    Start {t.label}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-stone2 text-center mt-8 max-w-2xl mx-auto">
          These tools are guidance only and are not a diagnosis. A consultation confirms the right plan for you.
        </p>
      </div>

      <CtaBanner />
    </div>
  );
}
