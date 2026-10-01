import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Check, Info, Calendar, ArrowRight, RotateCcw,
  Mars, Venus, User, Minus, Plus, Activity,
} from 'lucide-react';
import { BMI_BANDS, BMI_MIN, BMI_MAX, bandForBmi } from '../data/bmiBands';
import { treatments, getSubServices } from '../data/content';
import { useBooking } from './chrome';

type Unit = 'metric' | 'imperial';
type Sex = 'male' | 'female' | 'unspecified';

/* ------------------------------------------------------------------ helpers */

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: BMI_BANDS[0]!.color, headline: 'Your BMI is below the healthy range.', desc: 'A guided, nourishing weight-gain plan alongside a full health baseline is the right starting point.' };
  if (bmi < 25) return { label: 'Healthy Range', color: BMI_BANDS[1]!.color, headline: 'Your BMI falls within the healthy range.', desc: 'Maintaining a balanced diet and active lifestyle can help you stay on track.' };
  if (bmi < 30) return { label: 'Overweight', color: BMI_BANDS[2]!.color, headline: 'Your BMI is above the healthy range.', desc: 'A structured weight-loss plan with baseline screening is the sensible next step.' };
  if (bmi < 40) return { label: 'Obese', color: BMI_BANDS[3]!.color, headline: 'Your BMI is well above the healthy range.', desc: 'Start with assessment, lab screening and clinician-guided management rather than a diet alone.' };
  return { label: 'Severely Obese', color: BMI_BANDS[4]!.color, headline: 'Your BMI is very well above the healthy range.', desc: 'Please book a consultation so we can plan clinician-led support around you.' };
}

function servicesForBmi(bmi: number) {
  if (bmi < 18.5) return ['weight-management', 'lab-tests', 'dermatology'];
  if (bmi < 25) return ['lab-tests', 'dermatology', 'weight-management'];
  return ['weight-management', 'lab-tests', 'dermatology'];
}

/* ------------------------------------------------------------- result parts */

/**
 * Circular progress ring. The arc length is the BMI's position on the scale,
 * so it grows as the reading rises — it reads as a meter filling, and the arc
 * colour tells you which band it landed in before you read the number.
 */
function BmiRing({ bmi, color }: { bmi: number; color: string }) {
  const R = 54;
  const CIRC = 2 * Math.PI * R;
  const filled = Math.min(1, Math.max(0, (bmi - BMI_MIN) / (BMI_MAX - BMI_MIN)));
  return (
    <svg viewBox="0 0 128 128" className="w-full h-full" aria-hidden="true">
      <circle cx={64} cy={64} r={R} fill="none" stroke="#E7DFD3" strokeWidth={11} />
      <motion.circle
        cx={64} cy={64} r={R} fill="none"
        stroke={color} strokeWidth={11} strokeLinecap="round"
        /* Start the arc at 12 o'clock rather than 3, so the sweep matches the
           left-to-right reading of the bar beside it. */
        transform="rotate(-90 64 64)"
        initial={false}
        animate={{ strokeDasharray: `${(CIRC * filled).toFixed(2)} ${CIRC.toFixed(2)}` }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      />
    </svg>
  );
}

/**
 * Horizontal band bar. Segment widths are proportional to the BMI range each
 * band covers, and the marker sits at the reading, so the bar and the dial
 * agree by construction.
 */
function BmiBar({ bmi, color }: { bmi: number; color: string }) {
  const span = BMI_MAX - BMI_MIN;
  const markerPct = Math.min(100, Math.max(0, ((bmi - BMI_MIN) / span) * 100));
  return (
    <div>
      {/* Band names, sized to their own segment so they never overlap. */}
      <div className="flex gap-0.5 mb-1.5">
        {BMI_BANDS.map((b, i) => {
          const w = ((i === BMI_BANDS.length - 1 ? BMI_MAX : BMI_BANDS[i + 1]!.from) - b.from) / span * 100;
          return (
            <div key={b.key} style={{ width: `${w}%` }} className="text-center min-w-0">
              <span
                className="block truncate"
                style={{
                  fontSize: w < 11 ? 8 : w < 16 ? 9 : 10,
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  color: b.color,
                }}
              >
                {b.label.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative h-2.5 rounded-full overflow-hidden flex">
        {BMI_BANDS.map((b, i) => {
          const w = ((i === BMI_BANDS.length - 1 ? BMI_MAX : BMI_BANDS[i + 1]!.from) - b.from) / span * 100;
          return <span key={b.key} style={{ width: `${w}%`, background: b.color }} />;
        })}
      </div>

      {/* Marker on the bar. Drawn on its own row so it is never clipped by the
          bar's own rounded overflow. */}
      <div className="relative h-5">
        <span
          className="absolute top-0 w-1 h-3 rounded-full ring-2 ring-white shadow"
          style={{ left: `calc(${markerPct}% - 2px)`, background: '#14100E' }}
        />
        <span
          className="absolute top-3 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap text-ink"
          style={{ left: `${markerPct}%` }}
        >
          {bmi.toFixed(1)}
        </span>
      </div>

      {/* Cut-off scale. Each label is nudged so it sits at its own boundary
          rather than being centred in a fixed column. */}
      <div className="relative h-4 text-[9px] text-stone2">
        {BMI_BANDS.slice(1).map((b) => {
          const pct = ((b.from - BMI_MIN) / span) * 100;
          return (
            <span
              key={b.key}
              className="absolute -translate-x-1/2"
              style={{ left: `${Math.min(96, Math.max(4, pct))}%` }}
            >
              {b.from}
            </span>
          );
        })}
      </div>

      <p className="sr-only">
        BMI {bmi.toFixed(1)} — {bandForBmi(bmi)?.label ?? 'outside the shown range'}
      </p>
      <span className="sr-only" style={{ color }}>{color}</span>
    </div>
  );
}

/* --------------------------------------------------------------- component */

export default function BmiCalculator({ compact = false }: { compact?: boolean }) {
  const { openBooking } = useBooking();
  const [step, setStep] = useState<1 | 2>(1);

  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState(27);
  const [unit, setUnit] = useState<Unit>('metric');
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [heightFt, setHeightFt] = useState("5'8\"");
  const [weightLb, setWeightLb] = useState('154');
  const [err, setErr] = useState('');

  const bmi = useMemo(() => {
    if (unit === 'metric') {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weightKg);
      if (!h || h <= 0 || !w || w <= 0) return null;
      return w / (h * h);
    }
    // Accept 5'8", 5'8 and 5 8 — people type feet and inches several ways.
    const ft = parseFloat(heightFt);
    const inchMatch = heightFt.match(/['’\s]+([\d.]+)/);
    const inches = inchMatch ? parseFloat(inchMatch[1]) : 0;
    const totalIn = ft * 12 + inches;
    const w = parseFloat(weightLb);
    if (!totalIn || totalIn <= 0 || !w || w <= 0) return null;
    return (w / (totalIn * totalIn)) * 703;
  }, [unit, heightCm, weightKg, heightFt, weightLb]);

  const rounded = bmi != null ? Math.round(bmi * 10) / 10 : null;
  const cat = rounded != null ? bmiCategory(rounded) : null;
  const suggested = rounded != null ? servicesForBmi(rounded).map((id) => treatments.find((t) => t.id === id)!).filter(Boolean) : [];

  /* Adult BMI cut-offs do not apply to children, who are measured against
     age- and sex-specific percentiles instead. Rather than print a number that
     would be wrong for a 14-year-old, say so. */
  const isChild = age > 0 && age < 18;

  const labelCls = 'block text-[11px] tracking-[0.2em] uppercase text-stone2 mb-1.5 font-medium';

  const submit = () => {
    if (bmi == null) {
      setErr(
        unit === 'metric'
          ? 'Please enter a valid height in cm and weight in kg.'
          : "Please enter a valid height (like 5'8\") and weight in lb.",
      );
      return;
    }
    setErr('');
    setStep(2);
  };

  const reset = () => {
    setStep(1);
    setErr('');
  };

  const sexOptions: { key: Sex; label: string; icon: typeof User }[] = [
    { key: 'male', label: 'Male', icon: Mars },
    { key: 'female', label: 'Female', icon: Venus },
    { key: 'unspecified', label: 'Prefer not to say', icon: User },
  ];

  return (
    <div className={compact ? '' : 'max-w-7xl mx-auto px-4'}>
      <div className="bg-white border border-linen rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 sm:p-9">

          {/* ── Step 1 ─────────────────────────────────────────────── */}
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[11px] tracking-[0.3em] uppercase text-golddark font-semibold">
                  Step 1 of 2
                </p>
                <h3 className="font-display text-3xl sm:text-4xl mt-1.5 leading-tight">
                  Tell us about <em className="gold-text not-italic">yourself</em>
                </h3>
                <p className="text-sm text-mocha mt-1.5">This helps us calculate your BMI accurately.</p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {/* Sex — collected for context, see the note in the result. */}
                  <fieldset className="sm:col-span-2">
                    <legend className={labelCls}>Sex</legend>
                    <div className="flex flex-wrap gap-2.5">
                      {sexOptions.map((o) => {
                        const active = sex === o.key;
                        return (
                          <button
                            key={o.key}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSex(o.key)}
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm min-h-[44px] border transition ${
                              active
                                ? 'bg-[#00919A] border-[#00919A] text-white font-medium'
                                : 'bg-white border-linen text-mocha hover:border-[#00919A]'
                            }`}
                          >
                            <o.icon size={15} className={active ? 'text-white' : 'text-stone2'} />
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Age — +/- stepper, matching the reference rather than a
                      free-text box, so it cannot be left empty or absurd. */}
                  <div>
                    <label htmlFor="bmi-age" className={labelCls}>Age</label>
                    <div className="flex items-center border border-linen rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setAge((a) => Math.max(1, a - 1))}
                        aria-label="Decrease age"
                        className="px-4 py-3 text-stone2 hover:text-ink hover:bg-cream transition min-h-[48px]"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        id="bmi-age"
                        type="number"
                        inputMode="numeric"
                        value={age}
                        min={1}
                        max={120}
                        onChange={(e) => setAge(Math.min(120, Math.max(1, Number(e.target.value) || 1)))}
                        className="flex-1 min-w-0 text-center text-lg font-medium py-3 focus:outline-none bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setAge((a) => Math.min(120, a + 1))}
                        aria-label="Increase age"
                        className="px-4 py-3 text-stone2 hover:text-ink hover:bg-cream transition min-h-[48px]"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label htmlFor="bmi-height" className={labelCls}>Height</label>
                    {unit === 'metric' ? (
                      <div className="flex items-center border border-linen rounded-xl overflow-hidden bg-white focus-within:border-gold transition">
                        <input
                          id="bmi-height" type="number" inputMode="decimal" min={50} max={260}
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className="flex-1 min-w-0 px-4 py-3 text-sm focus:outline-none bg-transparent"
                        />
                        <span className="px-4 py-3 text-sm text-stone2 border-l border-linen">cm</span>
                      </div>
                    ) : (
                      <div className="flex items-center border border-linen rounded-xl overflow-hidden bg-white focus-within:border-gold transition">
                        <input
                          id="bmi-height" value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          placeholder="5'8&quot;"
                          className="flex-1 min-w-0 px-4 py-3 text-sm focus:outline-none bg-transparent"
                        />
                        <span className="px-4 py-3 text-sm text-stone2 border-l border-linen">ft / in</span>
                      </div>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label htmlFor="bmi-weight" className={labelCls}>Weight</label>
                    <div className="flex items-center border border-linen rounded-xl overflow-hidden bg-white focus-within:border-gold transition">
                      <input
                        id="bmi-weight" type="number" inputMode="decimal"
                        min={20} max={400}
                        value={unit === 'metric' ? weightKg : weightLb}
                        onChange={(e) => (unit === 'metric' ? setWeightKg(e.target.value) : setWeightLb(e.target.value))}
                        className="flex-1 min-w-0 px-4 py-3 text-sm focus:outline-none bg-transparent"
                      />
                      <span className="px-4 py-3 text-sm text-stone2 border-l border-linen">
                        {unit === 'metric' ? 'kg' : 'lb'}
                      </span>
                    </div>
                  </div>

                  {/* Unit toggle sits beside Weight, which is where the reference puts it —
                        and it stops Height being alone in its grid row and
                        stretching to the full column width. */}
                  <div className="flex items-end">
                    <div className="inline-flex items-center bg-cream border border-linen rounded-full p-1 text-xs">
                      {(['metric', 'imperial'] as Unit[]).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUnit(u)}
                          aria-pressed={unit === u}
                          className={`px-5 min-h-[48px] inline-flex items-center rounded-full transition ${
                            unit === u ? 'bg-[#00919A] text-white font-medium' : 'text-mocha'
                          }`}
                        >
                          {u === 'metric' ? 'CM / KG' : 'FT-IN / LBS'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {err && (
                  <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {err}
                  </p>
                )}

                <button
                  onClick={submit}
                  className="mt-6 w-full bg-[#00919A] hover:bg-[#00747B] text-white rounded-xl py-4 text-sm tracking-[0.12em] uppercase font-medium transition flex items-center justify-center gap-2 min-h-[52px]"
                >
                  <Calculator size={16} /> Calculate My BMI <ArrowRight size={16} />
                </button>

                <p className="text-[11px] text-stone2 mt-4 flex items-start gap-1.5">
                  <Info size={12} className="mt-0.5 shrink-0" />
                  BMI is a screening guide, not a diagnosis. It does not account for muscle mass,
                  frame or body composition — your consultation includes BCA testing for the full picture.
                </p>
              </motion.div>
            ) : (
              /* ── Step 2 ─────────────────────────────────────────── */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-golddark font-semibold">
                      Step 2 of 2
                    </p>
                    <h3 className="font-display text-3xl sm:text-4xl mt-1.5 leading-tight">Your BMI Result</h3>
                    <p className="text-sm text-mocha mt-1.5">Here's what your numbers mean.</p>
                  </div>
                  <button
                    onClick={reset}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs text-mocha hover:text-ink border border-linen rounded-full px-4 py-2 min-h-[40px] transition"
                  >
                    <RotateCcw size={13} /> Edit
                  </button>
                </div>

                {rounded != null && cat && (
                  <>
                    <div className="mt-7 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
                      {/* Ring + number */}
                      <div className="flex items-center gap-5">
                        {/* The status pill sits BELOW the ring rather than inside it. Inside, a
                            label as long as "HEALTHY RANGE" is wider than the
                            ring's inner diameter and overhangs the stroke. */}
                        <div className="shrink-0 flex flex-col items-center">
                          <div className="relative w-[140px] h-[140px]">
                            <BmiRing bmi={rounded} color={cat.color} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <span className="text-[10px] tracking-[0.15em] uppercase text-stone2">Your BMI</span>
                              <span className="font-display text-4xl leading-none mt-0.5">{rounded.toFixed(1)}</span>
                            </div>
                          </div>
                          <span
                            className="mt-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded-full whitespace-nowrap"
                            style={{ background: `${cat.color}22`, color: cat.color }}
                          >
                            {cat.label}
                          </span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="min-w-0">
                        <BmiBar bmi={rounded} color={cat.color} />
                      </div>
                    </div>

                    {/* Verdict */}
                    <div
                      className="mt-7 rounded-2xl border p-5 flex gap-3.5"
                      style={{ background: `${cat.color}0D`, borderColor: `${cat.color}33` }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: cat.color }}
                      >
                        {cat.label === 'Healthy Range'
                          ? <Check size={17} className="text-white" />
                          : <Info size={17} className="text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{cat.headline}</p>
                        <p className="text-sm text-mocha mt-1 leading-relaxed">{cat.desc}</p>
                        <p className="text-xs text-stone2 mt-2">
                          Calculated from {unit === 'metric' ? `${heightCm} cm and ${weightKg} kg` : `${heightFt} and ${weightLb} lb`}.
                        </p>
                      </div>
                    </div>

                    {isChild && (
                      <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 leading-relaxed">
                        These adult ranges don't apply below 18 — children are assessed against
                        age- and sex-specific growth percentiles instead. Treat this number as
                        indicative only and speak to a clinician.
                      </p>
                    )}

                    {/* Suggestions — kept, because the page copy promises the
                        calculator maps a BMI to a service. */}
                    <div className="mt-8 pt-7 border-t border-linen">
                      <p className="text-[11px] tracking-[0.3em] uppercase text-golddark font-semibold">
                        Suggested services for you
                      </p>
                      <div className="grid gap-2.5 mt-4">
                        {suggested.map((t, i) => {
                          const subs = getSubServices(t.id);
                          return (
                            <div key={t.id} className="border border-linen rounded-2xl p-3.5 flex gap-3 items-center hover:shadow-md transition">
                              <img src={t.image} alt={t.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                              <div className="min-w-0 grow">
                                <p className="text-[10px] tracking-[0.2em] uppercase text-golddark">
                                  #{i + 1} Recommended · {t.name}
                                </p>
                                <p className="font-medium text-[15px] leading-snug mt-0.5">
                                  {i === 0 ? t.tagline : subs[0]?.name ?? t.tagline}
                                </p>
                                <p className="text-xs text-stone2 mt-0.5 line-clamp-1">
                                  {i === 0 ? `${subs.length} sub-services available` : subs[1]?.name ?? subs[0]?.description ?? ''}
                                </p>
                              </div>
                              <Link
                                to={`/services/${t.id}`}
                                className="shrink-0 bg-[#00919A] hover:bg-[#00747B] text-white rounded-full px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition"
                              >
                                Open
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => openBooking({ treatment: suggested[0]?.id })}
                        className="mt-5 w-full border border-[#00919A] text-[#00747B] hover:bg-[#00919A] hover:text-white rounded-xl py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition flex items-center justify-center gap-2 min-h-[48px]"
                      >
                        <Calendar size={14} /> Book Consult for BMI {rounded}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
          <Link to="/wellness-hub#bmi" className="bg-gold hover:bg-[#00747B] text-white rounded-full px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition text-center inline-flex items-center justify-center gap-2"><Activity size={14} /> Try BMI Calculator</Link>
        </div>
      </div>
    </div>
  );
}
