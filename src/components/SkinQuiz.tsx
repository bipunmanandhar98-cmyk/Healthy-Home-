import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, Check, Calendar, FlaskConical } from 'lucide-react';
import { treatments, subServices, slugify, centers } from '../data/content';
import { useBooking } from './booking';

type Answers = {
  skinType?: string;
  concern?: string;
  sensitivity?: string;
  goal?: string;
};

const STEPS = ['Skin type', 'Top concern', 'Sensitivity', 'Your goal'] as const;

const SKIN_TYPES = [
  { id: 'oily', label: 'Oily', desc: 'Shiny T-zone, visible pores' },
  { id: 'dry', label: 'Dry', desc: 'Tight, flaky or rough' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
  { id: 'normal', label: 'Normal / Balanced', desc: 'Few imperfections' },
  { id: 'sensitive', label: 'Sensitive-prone', desc: 'Redness, reacts easily' },
];

const CONCERNS = [
  { id: 'acne', label: 'Acne / Breakouts', desc: 'Pimples, blackheads, congestion' },
  { id: 'pigmentation', label: 'Dark spots / Pigmentation', desc: 'Melasma, sun spots, uneven tone' },
  { id: 'aging', label: 'Fine lines / Sagging', desc: 'Wrinkles, laxity, dullness' },
  { id: 'hair', label: 'Unwanted hair', desc: 'Face or body hair' },
  { id: 'scars', label: 'Scars / Stretch marks', desc: 'Acne scars, texture, marks' },
  { id: 'dullness', label: 'Dullness / Rough texture', desc: 'Tired-looking, uneven skin' },
];

const SENSITIVITIES = [
  { id: 'very', label: 'Very sensitive', desc: 'Avoid strong actives / peels' },
  { id: 'somewhat', label: 'Somewhat sensitive', desc: 'Gentle approach preferred' },
  { id: 'not', label: 'Not sensitive', desc: 'Tolerates stronger treatments' },
];

const GOALS = [
  { id: 'glow', label: 'Instant glow', desc: 'Event-ready radiance, fast' },
  { id: 'correction', label: 'Correct a concern', desc: 'Target spots, scars, hair' },
  { id: 'lifting', label: 'Firming / lifting', desc: 'Tighter, lifted look' },
  { id: 'plan', label: 'Full skin plan', desc: 'Expert roadmap first' },
];

function scoreSubServices(a: Answers) {
  const scored = subServices
    .filter(s => s.parentId === 'dermatology')
    .map(s => {
      let score = 0;
      const id = s.id;
      // concern mapping
      if (a.concern === 'acne' && ['hydrafacial-treatment', 'chemical-peeling', 'derma-consultation'].includes(id)) score += 3;
      if (a.concern === 'pigmentation' && ['chemical-peeling', 'hydrafacial-treatment', 'derma-consultation'].includes(id)) score += 3;
      if (a.concern === 'aging' && ['skin-tightening', 'face-lifting', 'hydrafacial-treatment', 'chemical-peeling'].includes(id)) score += 3;
      if (a.concern === 'hair' && ['laser-hair-removal', 'derma-consultation'].includes(id)) score += 4;
      if (a.concern === 'scars' && ['chemical-peeling', 'skin-tightening', 'derma-consultation', 'non-invasive-aesthetic'].includes(id)) score += 3;
      if (a.concern === 'dullness' && ['hydrafacial-treatment', 'chemical-peeling', 'skin-improvement'].includes(id)) score += 3;
      // sensitivity mapping
      if (a.sensitivity === 'very' && ['hydrafacial-treatment', 'derma-consultation', 'skin-care-procedures', 'skin-improvement'].includes(id)) score += 2;
      if (a.sensitivity === 'very' && ['chemical-peeling', 'laser-hair-removal'].includes(id)) score -= 1;
      if (a.sensitivity === 'not' && ['chemical-peeling', 'laser-hair-removal', 'skin-tightening', 'face-lifting'].includes(id)) score += 1;
      // skin type mapping
      if (a.skinType === 'oily' && ['hydrafacial-treatment', 'chemical-peeling'].includes(id)) score += 1;
      if (a.skinType === 'dry' && ['hydrafacial-treatment', 'skin-improvement'].includes(id)) score += 1;
      if (a.skinType === 'sensitive' && ['hydrafacial-treatment', 'derma-consultation'].includes(id)) score += 2;
      // goal mapping
      if (a.goal === 'glow' && ['hydrafacial-treatment', 'skin-improvement'].includes(id)) score += 2;
      if (a.goal === 'correction' && ['chemical-peeling', 'laser-hair-removal', 'skin-tightening'].includes(id)) score += 2;
      if (a.goal === 'lifting' && ['face-lifting', 'skin-tightening', 'breast-tightening'].includes(id)) score += 2;
      if (a.goal === 'plan' && ['derma-consultation'].includes(id)) score += 4;
      return { s, score };
    })
    .sort((x, y) => y.score - x.score);
  // Always include derma consultation as safety net in top 3 if missing
  const top = scored.slice(0, 3).map(x => x.s);
  if (!top.find(s => s.id === 'derma-consultation')) {
    top[2] = subServices.find(s => s.id === 'derma-consultation')!;
  }
  return top;
}

function relatedMainsFor(subIds: string[]) {
  const hasSkin = subIds.some(id => ['chemical-peeling', 'hydrafacial-treatment', 'skin-tightening', 'face-lifting'].includes(id));
  const out = ['dermatology'];
  if (hasSkin) out.push('weight-management');
  out.push('lab-tests');
  return [...new Set(out)].map(id => treatments.find(t => t.id === id)!).filter(Boolean);
}

export default function SkinQuiz({ compact = false }: { compact?: boolean }) {
  const { openBooking } = useBooking();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const results = useMemo(() => (done ? scoreSubServices(answers) : []), [done, answers]);
  const related = useMemo(() => (done ? relatedMainsFor(results.map(r => r.id)) : []), [done, results]);

  const pick = (key: keyof Answers, id: string) => {
    const next = { ...answers, [key]: id };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const optionBtn =
    'w-full text-left bg-white border border-linen rounded-2xl px-5 py-4 hover:border-gold hover:shadow-md transition flex items-center justify-between gap-3 group';

  const renderOptions = () => {
    if (step === 0)
      return SKIN_TYPES.map(o => (
        <button key={o.id} onClick={() => pick('skinType', o.id)} className={optionBtn}>
          <span><span className="block font-medium">{o.label}</span><span className="block text-xs text-stone2 mt-0.5">{o.desc}</span></span>
          <ArrowRight size={15} className="text-gold opacity-0 group-hover:opacity-100 shrink-0" />
        </button>
      ));
    if (step === 1)
      return CONCERNS.map(o => (
        <button key={o.id} onClick={() => pick('concern', o.id)} className={optionBtn}>
          <span><span className="block font-medium">{o.label}</span><span className="block text-xs text-stone2 mt-0.5">{o.desc}</span></span>
          <ArrowRight size={15} className="text-gold opacity-0 group-hover:opacity-100 shrink-0" />
        </button>
      ));
    if (step === 2)
      return SENSITIVITIES.map(o => (
        <button key={o.id} onClick={() => pick('sensitivity', o.id)} className={optionBtn}>
          <span><span className="block font-medium">{o.label}</span><span className="block text-xs text-stone2 mt-0.5">{o.desc}</span></span>
          <ArrowRight size={15} className="text-gold opacity-0 group-hover:opacity-100 shrink-0" />
        </button>
      ));
    return GOALS.map(o => (
      <button key={o.id} onClick={() => pick('goal', o.id)} className={optionBtn}>
        <span><span className="block font-medium">{o.label}</span><span className="block text-xs text-stone2 mt-0.5">{o.desc}</span></span>
        <ArrowRight size={15} className="text-gold opacity-0 group-hover:opacity-100 shrink-0" />
      </button>
    ));
  };

  return (
    <div className={compact ? '' : 'max-w-7xl mx-auto px-4'}>
      <div className="bg-white border border-linen rounded-3xl overflow-hidden shadow-xl">
        <div className="grid lg:grid-cols-[1fr_1.2fr]">
          {/* Left intro panel */}
          <div className="bg-espresso text-white p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 texture-grain opacity-20" />
            <div className="relative">
              <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight flex items-center gap-2"><Sparkles size={14} /> Free Skin Quiz</p>
              <h3 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">Find your skin match in <em className="text-goldlight not-italic">60 seconds</em></h3>
              <p className="text-mist text-sm mt-2">Answer 4 quick questions — we route you to the right Dermatology sub-service page: HydraFacial, Laser Hair Removal, Tightening, Peeling, Derma Consultation & more.</p>
              <div className="flex gap-2 mt-5">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div className={`h-1 rounded-full ${done || i < step ? 'bg-goldlight' : i === step ? 'bg-gold' : 'bg-white/15'}`} />
                    <p className={`mt-1.5 text-[10px] uppercase tracking-widest ${i === step && !done ? 'text-white font-semibold' : 'text-mist/70'}`}>{i + 1}. {s}</p>
                  </div>
                ))}
              </div>
              {done && (
                <button onClick={reset} className="mt-5 inline-flex items-center gap-2 min-h-[40px] text-[11px] tracking-[0.2em] uppercase text-goldlight hover:text-white transition"><RotateCcw size={13} /> Retake quiz</button>
              )}
            </div>
          </div>

          {/* Right interactive panel */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key={'step-' + step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-golddark">Question {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                  <h4 className="font-display text-2xl sm:text-3xl mt-1">
                    {step === 0 && 'How would you describe your skin?'}
                    {step === 1 && 'What is your top skin concern?'}
                    {step === 2 && 'How sensitive is your skin?'}
                    {step === 3 && 'What is your main goal?'}
                  </h4>
                  <div className="grid gap-2.5 mt-5">{renderOptions()}</div>
                  <div className="flex justify-between mt-5">
                    <button disabled={step === 0} onClick={() => setStep(step - 1)} className="text-xs tracking-[0.2em] uppercase text-mocha hover:text-ink disabled:opacity-30 flex items-center gap-1.5 min-h-[40px] -ml-1 pl-1"><ArrowLeft size={13} /> Back</button>
                    <span className="text-[11px] text-stone2">{step + 1} / {STEPS.length}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-golddark">Your matches · Dermatology</p>
                  <h4 className="font-display text-2xl sm:text-3xl mt-1">Your personalized skin plan</h4>
                  <div className="grid gap-2.5 mt-5">
                    {results.map((s, i) => (
                      <div key={s.id} className={`rounded-2xl border p-4 flex gap-3 items-center ${i === 0 ? 'bg-sand border-gold/50' : 'bg-white border-linen'}`}>
                        <img src={s.image} alt={s.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                        <div className="min-w-0 grow">
                          <p className="text-[10px] tracking-[0.2em] uppercase text-golddark">{i === 0 ? '★ Best match' : `Match #${i + 1}`} · Dermatology</p>
                          <p className="font-medium leading-snug mt-0.5">{s.name}</p>
                          <p className="text-xs text-stone2 mt-0.5 line-clamp-1">{s.description}</p>
                        </div>
                        <Link to={`/services/dermatology/${slugify(s.name)}`} className="shrink-0 bg-gold hover:bg-[#00747B] text-white rounded-full px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition">Open</Link>
                      </div>
                    ))}
                  </div>
                  <div className="bg-cream/70 border border-linen rounded-2xl p-4 mt-4">
                    <p className="text-[11px] tracking-[0.25em] uppercase text-golddark flex items-center gap-1.5"><FlaskConical size={13} /> Also consider</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {related.map(t => (
                        <Link key={t.id} to={`/services/${t.id}`} className="text-[11px] bg-white hover:bg-gold hover:text-white border border-linen hover:border-gold rounded-full px-3 py-1.5 transition">{t.name}</Link>
                      ))}
                      <span className="text-[11px] text-stone2 px-1 py-1.5">· {centers.length} branch · Rs. 5,000/yr membership</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
                    <button onClick={() => openBooking({ treatment: 'dermatology' })} className="flex-1 bg-gold hover:bg-[#00747B] text-white rounded-full py-3 text-xs tracking-[0.2em] uppercase font-medium transition flex items-center justify-center gap-2"><Calendar size={14} /> Book Derma Consult</button>
                    <button onClick={reset} className="flex-1 border border-ink/20 rounded-full py-3 text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition flex items-center justify-center gap-2"><RotateCcw size={13} /> Retake Quiz</button>
                  </div>
                  <p className="text-[11px] text-stone2 mt-3 flex items-start gap-1.5"><Check size={12} className="mt-0.5 shrink-0 text-gold" /> Quiz is guidance only — your Derma Consultation + BCA review confirms the final plan.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkinQuizTeaser() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white border border-linen rounded-3xl p-8 sm:p-10 grid md:grid-cols-2 gap-6 items-center shadow-xl">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-golddark flex items-center gap-2"><Sparkles size={14} /> Free Skin Quiz</p>
          <h3 className="font-display text-3xl sm:text-4xl mt-2">Which skin service is right for you?</h3>
          <p className="text-mocha text-sm mt-2">Answer 4 questions, land on your matched Dermatology detail page.</p>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-end gap-3">
          <Link to="/wellness-hub#skin" className="bg-gold hover:bg-[#00747B] text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition text-center inline-flex items-center justify-center gap-2"><Sparkles size={14} /> Start Skin Quiz</Link>
        </div>
      </div>
    </div>
  );
}