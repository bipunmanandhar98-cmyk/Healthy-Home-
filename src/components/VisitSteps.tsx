import { useState } from 'react';
import { motion } from 'framer-motion';
import { IMG } from '../data/images';
import { TrustBar } from './shared';

/**
 * "Your visit in 3 steps", rebuilt on the layout from the supplied screen
 * recording: a stacked list of large words down the left where the active one
 * turns near-black and opens a small pill beside it, and a large photograph on
 * the right that swaps with the selection.
 *
 * The reference lists seven abstract pillars. This has three real process steps
 * and keeps their original wording - "Consultation", "Personalized plan",
 * "Support + maintain" - so nothing here is invented to fill the pattern out.
 *
 * Every image is an existing Healthy Home photograph, and each is described
 * accurately: a clinician at a lab bench for the analysis step, a practitioner
 * with a clipboard for the planning step, and the Makshana tea range for the
 * maintain step, which is the one place the copy already promised products.
 *
 * Accessibility, since the reference is hover-only:
 *   - the steps are real buttons, so they are tabbable and operable by keyboard,
 *     and each activates on focus as well as hover
 *   - every description stays in the DOM whether or not it is on screen. It is
 *     hidden with an sr-only class rather than the hidden attribute, so a screen
 *     reader still announces the step's detail when tabbing to it
 *   - inactive words are #8A9292, which measures 3.18:1 on white. The reference's
 *     grey is nearer 2.6:1, which fails WCAG AA even for large text
 */

const STEPS = [
  {
    n: '01',
    title: 'Consultation',
    detail:
      'Body/fat + wellness analysis, honest recommendations and written pricing. 30-45 minutes, zero pressure.',
    image: IMG.service.wholeBodyLabTest,
    alt: 'A clinician preparing blood sample tubes at a lab bench.',
  },
  {
    n: '02',
    title: 'Personalized plan',
    detail: 'Sequenced services mapped around your goals, schedule and budget.',
    image: IMG.treatment.weightManagement,
    alt: 'A practitioner reviewing a plan on a clipboard with a client.',
  },
  {
    n: '03',
    title: 'Support + maintain',
    detail: 'Coaching, reviews and products then maintain.',
    image: IMG.service.weightLossHomePackage,
    alt: 'The Makshana wellness tea range lined up on a shelf.',
  },
];

export default function VisitSteps() {
  const [active, setActive] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
      <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-x-10 lg:gap-x-16 items-center">

        {/* Left: eyebrow and the word list. */}
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase font-medium text-golddark flex items-center gap-2">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold" />
            Effortless by Design
          </p>

          <ul className="mt-6">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group block w-full text-left py-1 sm:py-1.5"
                  >
                    {/* The words. Large, tight, and the whole reason the
                        interaction exists, so they are never hidden. */}
                    <span className="flex items-baseline gap-3 sm:gap-4">
                      {/* The words and the step numbers cannot share a colour, and neither can be
                        checked against white. This section has no card behind it,
                        so it sits directly on the cream page background rather
                        than on white, and cream is darker:

                          #8A9292  3.18 on white  2.92 on cream  fails
                          #848C8C  3.44 on white  3.16 on cream  only just clears
                          #7C8484  3.82 on white  3.51 on cream  used here

                        The words are 44px, so WCAG AA's 3:1 large-text bar is what
                        applies and 3.51 clears it with margin. The numbers are 11px,
                        which is small text needing 4.5:1, so they use mocha at
                        4.80:1 rather than this grey - which also reads better, the
                        number being the quiet element and the word the one you are
                        choosing. Measuring against white instead of cream is what
                        put a colour-contrast failure on every single run. */}
                      {/* The number cannot take #00919A, though the word can. The word is 44px, so
                            WCAG AA's 3:1 large-text bar applies and #00919A gives
                            3.54:1 on this cream ground. The number is 11px — small
                            text, which needs 4.5:1 — and the same colour measured
                            3.54:1 there, failing on every Lighthouse run. So the
                            number stays on gold-dark, #007078, at 5.37:1. Same teal
                            family, one step darker, which reads as hierarchy rather
                            than as a mismatched pair.

                            #00919A is a literal hex rather than the --color-gold
                            token, which is #007A80. #00919A is the pre-audit gold
                            and is still hardcoded in the stylesheet — the gold-text
                            gradient, gold-line, the marquee, the before/after
                            handle — so the project has not dropped it. It measures
                            3.54:1 here, clearing the bar that applies; the token
                            would give 4.77:1. Both pass, so this is a brand choice.
                            Say the word if you would rather it tracked the token. */}
                      <span
                        aria-hidden="true"
                        className={`font-mono text-[11px] tracking-[0.2em] transition-colors ${
                          on ? 'text-golddark' : 'text-mocha'
                        }`}
                      >
                        {s.n}
                      </span>
                      <span
                        className={`font-display text-[34px] sm:text-[44px] leading-[1.06] transition-colors duration-300 ${
                          on ? 'text-[#00919A]' : 'text-[#7C8484] group-hover:text-mocha'
                        }`}
                      >
                        {s.title}
                      </span>
                    </span>

                    {/* Detail. sr-only when inactive rather than removed, so it
                        stays announced to screen readers. */}
                    <span
                      className={`block text-[13.5px] leading-relaxed max-w-[46ch] transition-all duration-300 ${
                        on ? 'mt-2.5 text-mocha opacity-100' : 'sr-only opacity-0'
                      }`}
                    >
                      {s.detail}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: the photograph, swapping with the selection. */}
        <div className="relative mt-10 lg:mt-0">
          <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-2xl bg-sand">
            {STEPS.map((s, i) => (
              <motion.img
                key={s.n}
                src={s.image}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                aria-hidden={i !== active}
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.04 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <TrustBar />
      </div>
    </section>
  );
}