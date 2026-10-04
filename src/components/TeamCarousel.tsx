import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { team } from '../data/content';
import TeamAvatar from './TeamAvatar';

/* Leadership carousel for the landing page.
 *
 * One clinician is featured at a time: a large portrait with their name, role and
 * a short credential line, and a strip of thumbnails to pick from. `index` is the
 * only source of truth — every control writes to it and the render reads from it,
 * so the dots, the arrows and the featured person can never disagree.
 *
 * Reads the same `team` array as the four-card grid on /about, so the two pages
 * cannot drift apart.
 *
 * The bio line is the same short `note` the About cards show. These are named,
 * identifiable clinicians, so no longer write-up is invented here: the layout
 * has room for one if the clinic confirms the copy.
 */

export default function TeamCarousel() {
  const [index, setIndex] = useState(0);
  const active = team[index]!;

  // Wrap around, so the arrows never dead-end on the first or last person.
  const step = (d: number) => setIndex(v => (v + d + team.length) % team.length);

  return (
    <div className="mt-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,290px)_minmax(0,1.05fr)] lg:items-center gap-y-7">
        {/* Thumbnails. Below the portrait on a phone, to its left on a desktop.
            Horizontally scrollable rather than wrapped, so the strip never
            reflows into two rows as the team grows. */}
        <div className="order-2 lg:order-1 flex gap-3 overflow-x-auto no-scrollbar lg:overflow-x-visible lg:justify-end">
          {team.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${m.name}`}
              aria-current={i === index}
              className={`shrink-0 w-16 sm:w-20 lg:w-[86px] overflow-hidden rounded-lg transition ${
                i === index
                  ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream'
                  : 'opacity-55 hover:opacity-90'
              }`}
            >
              <TeamAvatar
                m={m}
                decorative
                initialsClass="text-xl sm:text-2xl"
                className="w-full aspect-[4/5] object-cover"
              />
            </button>
          ))}
        </div>

        {/* Featured portrait */}
        <div className="order-1 lg:order-2 relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <TeamAvatar
                m={active}
                initialsClass="text-6xl sm:text-7xl"
                className="w-full aspect-[4/5] object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Name, role, credential line, and the controls */}
        <div className="order-3 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display italic text-3xl sm:text-4xl leading-tight">{active.name}</p>
              <p className="text-golddark mt-1.5">{active.role}</p>
              {active.note && <p className="text-mocha italic leading-relaxed mt-4">{active.note}</p>}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-5 mt-7">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {team.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${active.name === m.name ? 'Currently showing' : 'Show'} ${m.name}`}
                  aria-current={i === index}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-ink' : 'w-2.5 bg-linen hover:bg-stone2'
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous team member"
                className="w-11 h-11 rounded-full border border-linen grid place-items-center text-ink hover:border-gold hover:text-golddark transition"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next team member"
                className="w-11 h-11 rounded-full border border-linen grid place-items-center text-ink hover:border-gold hover:text-golddark transition"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* Announced to screen readers as the person changes, since nothing
              else on the page moves when the arrows are used. */}
          <p className="sr-only" aria-live="polite">
            {active.name}, {active.role}
          </p>
        </div>
      </div>
    </div>
  );
}