import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { team } from '../data/content';
import TeamAvatar from './TeamAvatar';

/* Leadership carousel for the landing page.
 *
 * A centred "featured tile" strip: the selected clinician is shown larger and at
 * full strength, its neighbours sit shorter and faded, and the row runs off both
 * edges of the page. Everything below — name, role, controls — is centred.
 *
 * The selected tile is always the visual centre of the row rather than merely
 * being the widest thing in it, which is why there are half-width spacers at each
 * end of the track. Without them the row would fit inside a wide screen, there
 * would be nothing to scroll, and the selected tile could never reach the middle.
 *
 * Selection is shown by size and opacity alone, deliberately. An earlier version
 * drew a ring around the selected thumbnail, but that ring is a box-shadow spread
 * painting outside the tile, and this strip is a scroll container — which clips
 * vertically too, since setting overflow-x promotes overflow-y to auto. The ring
 * lost its top and bottom edges. Enlarging and un-fading the tile needs no space
 * outside the tile, so there is nothing to clip.
 *
 * The transition is a blur plus a small rise. Both are suppressed under
 * prefers-reduced-motion, where the change becomes a plain cross-fade.
 *
 * Reads the same `team` array as the card grid on /about, so the two pages cannot
 * drift apart. `note` is the same short credential line the About cards show;
 * these are named, identifiable clinicians, so no longer write-up is invented.
 */

/** Neighbour tile vs selected tile. The aspect ratio turns the width step into a
 *  height step, and `items-end` keeps them all on one baseline. */
const W_ACTIVE = 'w-[200px] sm:w-[250px]';
const W_REST = 'w-[118px] sm:w-[140px]';

export default function TeamCarousel() {
  const [index, setIndex] = useState(0);
  const active = team[index]!;
  const stripRef = useRef<HTMLDivElement>(null);

  const reduce = useReducedMotion() ?? false;
  const fade = { opacity: 0 };

  // Wrap around, so the arrows never dead-end on the first or last person.
  const step = (d: number) => setIndex(v => (v + d + team.length) % team.length);

  /* Bring the selected tile to the middle. Measured from the two bounding rects
     rather than offsetLeft: the strip is not position:relative, so a child's
     offsetLeft resolves against a further ancestor and comes back far too small,
     which silently collapses this calculation. Assigning scrollLeft rather than
     calling scrollTo() is the form that reliably takes effect; the smooth
     animation comes from the `scroll-smooth` class. */
  useEffect(() => {
    const strip = stripRef.current;
    const tile = strip?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!strip || !tile) return;
    const max = strip.scrollWidth - strip.clientWidth;
    if (max <= 0) return;
    const stripBox = strip.getBoundingClientRect();
    const tileBox = tile.getBoundingClientRect();
    const offsetWithinStrip = strip.scrollLeft + (tileBox.left - stripBox.left);
    const left = offsetWithinStrip - (strip.clientWidth - tileBox.width) / 2;
    strip.scrollLeft = Math.min(max, Math.max(0, left));
  }, [index]);

  return (
    <div>
      {/* The strip is deliberately outside any max-width container so the row
          bleeds off both edges of the page. */}
      <div
        ref={stripRef}
        className="flex items-end gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth px-2"
      >
        {/* Half-width spacers: they give the scroll somewhere to go so the first
            and last tiles can still reach the centre. Purely for scrolling, so
            they are hidden from assistive tech. */}
        <span aria-hidden="true" className="shrink-0 w-1/2" />
        {team.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${m.name}`}
            aria-current={i === index}
            /* Suppress the focus that mousedown would otherwise place on the
               tile. Focusing one scrolls it into view, and this site sets
               `html { scroll-behavior: smooth }`, so the browser's scroll was
               animated — the whole page glided a little on every click, which
               read as a bounce. The click still selects; keyboard users are
               unaffected because Tab still focuses and :focus-visible still
               draws the ring. */
            onMouseDown={(e) => e.preventDefault()}
            /* Only opacity animates. The width step is instant: animating it made
               the row's content width change for the duration of the transition
               while the strip was also scrolling to re-centre, and those two
               fighting each other is the other half of the wobble. */
            className={`shrink-0 overflow-hidden rounded-xl transition-opacity duration-500 ease-out ${
              i === index ? W_ACTIVE : `${W_REST} opacity-45 hover:opacity-75`
            }`}
          >
            <TeamAvatar
              m={m}
              decorative
              initialsClass="text-2xl sm:text-3xl"
              className="w-full aspect-[4/5] object-cover"
            />
          </button>
        ))}
        <span aria-hidden="true" className="shrink-0 w-1/2" />
      </div>

      {/* Name, role and credential line, centred under the row */}
      <div className="mt-9 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduce ? fade : { opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? fade : { opacity: 0, y: -14, filter: 'blur(8px)' }}
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display italic text-4xl sm:text-5xl leading-tight">{active.name}</p>
            <p className="text-golddark text-sm mt-2">{active.role}</p>
            {active.note && <p className="text-mocha italic text-sm mt-2">{active.note}</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls, centred */}
      <div className="flex items-center justify-center gap-5 mt-8">
        <div className="flex items-center gap-2">
          {team.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${active.name === m.name ? 'Currently showing' : 'Show'} ${m.name}`}
              aria-current={i === index}
              className={`rounded-full transition-all ${
                i === index ? 'w-6 h-2.5 bg-ink' : 'w-2.5 h-2.5 bg-linen hover:bg-stone2'
              }`}
            />
          ))}
        </div>

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

      {/* Announced to screen readers as the person changes, since nothing else on
          the page moves when the arrows are used. */}
      <p className="sr-only" aria-live="polite">
        {active.name}, {active.role}
      </p>
    </div>
  );
}