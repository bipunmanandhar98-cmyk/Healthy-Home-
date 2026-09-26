import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRight, Check, Sparkles, Info, Ruler, Weight, ChevronDown, Calendar } from 'lucide-react';
import { treatments, getSubServices, slugify } from '../data/content';
import { useBooking } from './chrome';
import { SectionHead } from './shared';

type Unit = 'metric' | 'imperial';

export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#E8A13D', desc: 'Below the healthy range. Focus on nourishing weight gain and a full health baseline.' };
  if (bmi < 25) return { label: 'Healthy', color: '#00919A', desc: 'Within the healthy range. Maintain with screening, skin care and balanced habits.' };
  if (bmi < 30) return { label: 'Overweight', color: '#E8793D', desc: 'Above the healthy range. A guided weight-loss plan plus screening is ideal.' };
  return { label: 'Obese', color: '#D64545', desc: 'Well above the healthy range. Start with assessment, labs and clinician-guided management.' };
}

export function servicesForBmi(bmi: number) {
  if (bmi < 18.5) return ['weight-management', 'lab-tests', 'dermatology'];
  if (bmi < 25) return ['lab-tests', 'dermatology', 'weight-management'];
  return ['weight-management', 'lab-tests', 'dermatology'];
}

export default function BmiCalculator({ compact = false }: { compact?: boolean }) {
  const { openBooking } = useBooking();
  const [unit, setUnit] = useState<Unit>('metric');
  const [heightCm, setHeightCm] = useState('165');
  const [weightKg, setWeightKg] = useState('68');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('5');
  const [weightLb, setWeightLb] = useState('150');
  const [showResult, setShowResult] = useState(false);

  const bmi = useMemo(() => {
    if (unit === 'metric') {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weightKg);
      if (!h || h <= 0 || !w || w <= 0) return null;
      return w / (h * h);
    }
    const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn);
    const w = parseFloat(weightLb);
    if (!totalIn || totalIn <= 0 || !w || w <= 0) return null;
    return (w / (totalIn * totalIn)) * 703;
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const rounded = bmi != null ? Math.round(bmi * 10) / 10 : null;
  const cat = rounded != null ? bmiCategory(rounded) : null;
  const suggested = rounded != null ? servicesForBmi(rounded).map(id => treatments.find(t => t.id === id)!).filter(Boolean) : [];
  const pos = rounded != null ? Math.min(100, Math.max(0, ((rounded - 14) / (40 - 14)) * 100)) : 0;

  const inputCls = 'w-full bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold text-ink';
  const labelCls = 'text-[11px] tracking-[0.2em] uppercase text-stone2 mb-1.5 block';

  return (
    <div className={compact ? '' : 'max-w-7xl mx-auto px-4'}>
      <div className={`bg-white border border-linen rounded-3xl overflow-hidden shadow-xl ${compact ? '' : ''}`}>
        <div className="grid lg:grid-cols-2">
          {/* Left: inputs */}
          <div className="p-6 sm:p-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-golddark flex items-center gap-2"><Calculator size={14} /> Free BMI Check</p>
            <h3 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">Know your BMI,<br />find your <em className="gold-text not-italic">right service</em></h3>
            <p className="text-sm text-mocha mt-2">Enter height & weight — we calculate your BMI and recommend the Healthy Home services that fit.</p>

            <div className="inline-flex items-center bg-cream border border-linen rounded-full p-1 mt-5 text-sm">
              <button onClick={() => { setUnit('metric'); setShowResult(false); }} className={`px-5 min-h-[40px] inline-flex items-center rounded-full transition ${unit === 'metric' ? 'bg-gold text-white' : 'text-mocha'}`}>cm / kg</button>
              <button onClick={() => { setUnit('imperial'); setShowResult(false); }} className={`px-5 min-h-[40px] inline-flex items-center rounded-full transition ${unit === 'imperial' ? 'bg-gold text-white' : 'text-mocha'}`}>ft / lb</button>
            </div>

            {unit === 'metric' ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className={labelCls}>Height (cm)</label>
                  <input value={heightCm} onChange={e => { setHeightCm(e.target.value); setShowResult(false); }} inputMode="decimal" placeholder="e.g. 165" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Weight (kg)</label>
                  <input value={weightKg} onChange={e => { setWeightKg(e.target.value); setShowResult(false); }} inputMode="decimal" placeholder="e.g. 68" className={inputCls} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div>
                  <label className={labelCls}>Feet</label>
                  <input value={heightFt} onChange={e => { setHeightFt(e.target.value); setShowResult(false); }} inputMode="numeric" placeholder="5" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Inches</label>
                  <input value={heightIn} onChange={e => { setHeightIn(e.target.value); setShowResult(false); }} inputMode="decimal" placeholder="5" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Weight (lb)</label>
                  <input value={weightLb} onChange={e => { setWeightLb(e.target.value); setShowResult(false); }} inputMode="decimal" placeholder="150" className={inputCls} />
                </div>
              </div>
            )}

            <button
              onClick={() => setShowResult(true)}
              disabled={rounded == null}
              className="mt-5 w-full bg-gold hover:bg-[#00747B] disabled:opacity-40 text-white rounded-full py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition shadow-lg shadow-[#00919A]/25 flex items-center justify-center gap-2"
            >
              <Calculator size={15} /> Calculate My BMI
            </button>
            <p className="text-[11px] text-stone2 mt-3 flex items-start gap-1.5"><Info size={12} className="mt-0.5 shrink-0" /> BMI is a screening guide, not a diagnosis. Your consultation includes BCA testing for a full picture.</p>
          </div>

          {/* Right: result + suggestions */}
          <div className="bg-espresso text-white p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 texture-grain opacity-20" />
            <div className="relative">
              {!showResult || rounded == null || !cat ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Ruler size={26} className="text-goldlight" />
                  </div>
                  <p className="font-display text-3xl mt-4">Your result appears here</p>
                  <p className="text-mist text-sm mt-2 max-w-xs mx-auto">Enter your height and weight, then tap Calculate to see your BMI and matched Healthy Home services.</p>
                  <div className="flex justify-center gap-4 mt-5 text-[11px] text-mist">
                    <span className="flex items-center gap-1.5"><Weight size={12} className="text-goldlight" /> Weight Management</span>
                    <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-goldlight" /> Dermatology</span>
                    <span className="flex items-center gap-1.5"><Check size={12} className="text-goldlight" /> Lab Tests</span>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={rounded + unit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight">Your BMI Result</p>
                    <div className="flex items-end gap-3 mt-1">
                      <p className="font-display text-6xl leading-none">{rounded}</p>
                      <span className="mb-1.5 text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full" style={{ backgroundColor: `${cat.color}22`, color: cat.color, border: `1px solid ${cat.color}55` }}>{cat.label}</span>
                    </div>
                    {/* gauge */}
                    <div className="mt-4">
                      <div className="h-2.5 rounded-full overflow-hidden flex">
                        <span className="h-full" style={{ width: '17.3%', background: '#E8A13D' }} />
                        <span className="h-full" style={{ width: '25%', background: '#00919A' }} />
                        <span className="h-full" style={{ width: '19.2%', background: '#E8793D' }} />
                        <span className="h-full" style={{ width: '38.5%', background: '#D64545' }} />
                      </div>
                      <div className="relative h-5">
                        <span className="absolute top-0 w-0.5 h-2 bg-white rounded" style={{ left: `calc(${pos}% - 1px)` }} />
                        <span className="absolute top-2 -translate-x-1/2 text-[10px] text-mist whitespace-nowrap" style={{ left: `${pos}%` }}>you</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-mist/80 mt-0.5"><span>14</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
                    </div>
                    <p className="text-mist text-sm mt-3 leading-relaxed">{cat.desc}</p>

                    <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight mt-6">Suggested services for you</p>
                    <div className="grid gap-2.5 mt-3">
                      {suggested.map((t, i) => {
                        const subs = getSubServices(t.id);
                        return (
                          <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex gap-3 items-center">
                            <img src={t.image} alt={t.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                            <div className="min-w-0 grow">
                              <p className="text-[10px] tracking-[0.2em] uppercase text-goldlight">#{i + 1} Recommended · {t.name}</p>
                              <p className="font-medium text-[15px] leading-snug mt-0.5">{i === 0 ? t.tagline : subs[0]?.name ?? t.tagline}</p>
                              <p className="text-xs text-mist/90 mt-0.5 line-clamp-1">{i === 0 ? `${subs.length} sub-services available` : subs[1]?.name ?? subs[0]?.description ?? ''}</p>
                            </div>
                            <Link to={`/services/${t.id}`} className="shrink-0 bg-gold hover:bg-[#00747B] text-white rounded-full px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition">Open</Link>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => openBooking({ treatment: suggested[0]?.id })} className="mt-5 w-full border border-goldlight/50 text-goldlight rounded-full py-3 text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition flex items-center justify-center gap-2"><Calendar size={14} /> Book Consult for BMI {rounded}</button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BmiTeaser() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-espresso text-white rounded-3xl p-8 sm:p-10 grid md:grid-cols-2 gap-6 items-center relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-20" />
        <div className="relative">
          <p className="text-[11px] tracking-[0.3em] uppercase text-goldlight flex items-center gap-2"><Calculator size={14} /> Free BMI Calculator</p>
          <h3 className="font-display text-3xl sm:text-4xl mt-2">What does your BMI say about your next step?</h3>
          <p className="text-mist text-sm mt-2">Calculate in 10 seconds and get matched to Weight Management, Dermatology or Lab Tests.</p>
        </div>
        <div className="relative flex flex-col sm:flex-row md:justify-end gap-3">
          <Link to="/wellness-hub#bmi" className="bg-gold hover:bg-[#00747B] text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition text-center inline-flex items-center justify-center gap-2"><Calculator size={14} /> Try BMI Calculator</Link>
        </div>
      </div>
    </div>
  );
}
