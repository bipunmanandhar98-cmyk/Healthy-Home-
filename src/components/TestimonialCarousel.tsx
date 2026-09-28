import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Quote, Star, ExternalLink } from 'lucide-react';
import { testimonials, centers, type Testimonial } from '../data/content';

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
}

const CLAMP = 'line-clamp-5';

function Card({ t, i }: { t: Testimonial; i: number }) {
  const branch = centers.find(c => c.id === t.branchId);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [expanded, setExpanded] = useState(false);
  /* Whether this review is long enough to be cut off. Measured rather than
     guessed from character count, because the clamp point moves with the card
     width and the same review fits on a desktop and overflows on a phone. */
  const [clamped, setClamped] = useState(false);

  /* These are real Google reviews, several of them long, and the old card
     clamped them to 5 lines with no way to read the rest. The toggle reveals
     the full text, but only appears when something is actually hidden. */
  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const measure = () => {
      // Compare against the CLAMPED height in both states. Once expanded the
      // clamp class is gone, so measuring as-is would report no overflow and
      // the "Read less" control would vanish the moment it was used.
      const had = el.classList.contains(CLAMP);
      el.classList.add(CLAMP);
      const overflows = el.scrollHeight > el.clientHeight + 1;
      el.classList.toggle(CLAMP, had);
      setClamped(overflows);
    };

    measure();
    // The clamp point shifts with the viewport, so re-measure on resize.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [t.text]);

  return (
    <figure
      data-card
      className="snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[31%] bg-white rounded-3xl border border-linen p-6 flex flex-col h-full"
      aria-roledescription="slide"
      aria-label={`Review ${i + 1} of ${testimonials.length}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star
              key={s}
              size={13}
              aria-hidden="true"
              className={s < t.rating ? 'fill-gold text-gold' : 'text-linen fill-linen'}
            />
          ))}
        </div>
        <Quote size={18} className="text-gold/25 shrink-0" aria-hidden="true" />
      </div>

      <blockquote
        ref={quoteRef}
        className={`text-sm text-mocha leading-relaxed grow mt-3 ${expanded ? '' : CLAMP}`}
      >
        {t.text}
      </blockquote>

      {clamped && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          className="self-start -mt-1 mb-1 inline-flex items-center gap-1 min-h-[32px] text-[11px] font-medium text-golddark hover:text-ink transition"
        >
          {expanded ? 'Read less' : 'Read more'}
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      <figcaption className="flex items-center gap-3 mt-5 pt-4 border-t border-linen">
        <span
          className="w-11 h-11 rounded-full bg-gold/15 text-golddark grid place-items-center text-sm font-semibold shrink-0"
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{t.name}</p>
          <p className="text-xs text-stone2 truncate">{t.treatment} · {t.date}</p>
        </div>
      </figcaption>

      {branch?.mapUrl && (
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-1.5 sm:mt-3 -mb-1 inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-[11px] text-stone2 hover:text-golddark transition self-start"
        >
          <ExternalLink size={11} aria-hidden="true" />
          {t.branch} on Google
        </a>
      )}
    </figure>
  );
}

export default function TestimonialCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // `index` is the source of truth. Deriving it from live scroll positions while a
  // smooth scroll is still running made rapid clicks under-advance.
  const indexRef = useRef(0);
  const animating = useRef(false);
  const settle = useRef<number | undefined>(undefined);

  const cards = useCallback(() => {
    const el = track.current;
    return el ? [...el.querySelectorAll<HTMLElement>('[data-card]')] : [];
  }, []);

  /** Scroll so card `i` sits at the start of the track's padding box. */
  const goTo = useCallback((i: number) => {
    const el = track.current;
    const list = cards();
    if (!el || !list.length) return;
    const target = Math.min(list.length - 1, Math.max(0, i));
    const pad = list[0]!.offsetLeft; // the track's own px-4
    const max = el.scrollWidth - el.clientWidth;
    const left = Math.min(max, Math.max(0, list[target]!.offsetLeft - pad));

    animating.current = true;
    indexRef.current = target;
    setIndex(target);
    el.scrollTo({ left, behavior: 'smooth' });

    setAtStart(left <= 24);
    setAtEnd(max <= 4 || left >= max - 4);

    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => { animating.current = false; }, 500);
  }, [cards]);

  // Manual scrolling (touch swipe, trackpad) keeps the counter honest.
  const onScroll = useCallback(() => {
    if (animating.current) return;
    const el = track.current;
    const list = cards();
    if (!el || !list.length) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 24);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 4);

    const edge = el.getBoundingClientRect().left;
    let best = 0;
    let bestDist = Infinity;
    list.forEach((c, k) => {
      const d = Math.abs(c.getBoundingClientRect().left - edge);
      if (d < bestDist) { bestDist = d; best = k; }
    });
    indexRef.current = best;
    setIndex(best);
  }, [cards]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(settle.current);
    };
  }, [onScroll]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mt-2">
        <p className="text-xs text-stone2" aria-live="polite">
          {index + 1} of {testimonials.length} · real Google reviews
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => goTo(indexRef.current - 1)}
            disabled={atStart}
            aria-label="Previous reviews"
            className="w-11 h-11 rounded-full border border-linen grid place-items-center text-ink hover:border-gold hover:text-golddark transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            onClick={() => goTo(indexRef.current + 1)}
            disabled={atEnd}
            aria-label="Next reviews"
            className="w-11 h-11 rounded-full border border-linen grid place-items-center text-ink hover:border-gold hover:text-golddark transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 mt-5 -mx-4 px-4 no-scrollbar"
      >
        {testimonials.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} i={i} />
        ))}
      </div>

      <p className="text-[11px] text-stone2 mt-4 leading-relaxed">
        Reviews quoted from each branch's Google Business Profile and linked to the source. Names and
        wording are the reviewers' own.
      </p>
    </div>
  );
}
