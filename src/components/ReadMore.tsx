import { useState } from 'react';

/* Collapses a long paragraph behind a "Read more" toggle.
 *
 * Measured on the real data rather than guessed: the 19 service overviews run
 * from 190 to 1323 characters, median 663, and 16 of the 19 are over 340. Several
 * are 150-200 word walls sitting directly under an h1, which pushes everything
 * else off the screen.
 *
 * The cut is by character count, not by measuring the rendered box. That is a
 * deliberate trade: measuring needs a ref, a resize observer and a layout pass,
 * and any state derived from that re-runs on every resize — which is how the
 * toggle ends up flickering between states, or briefly wrong on first paint.
 * A character threshold is stable, needs no measurement, and cannot flicker.
 * The cost is that the exact cut sits a little differently at each viewport
 * width, which is invisible in practice because the fade covers the seam.
 *
 * Text at or under the threshold renders untouched — no button, no fade — so
 * short descriptions are not given a pointless control. */

/** Roughly four lines of body copy at the sizes these pages use. */
const THRESHOLD = 320;

function clamp(text: string, limit: number) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  // Prefer a word boundary, but only if it is not so early that a whole sentence
  // is dropped — otherwise a hard cut reads better than a stub.
  const sp = cut.lastIndexOf(' ');
  return (sp > limit * 0.6 ? cut.slice(0, sp) : cut).trimEnd();
}

export default function ReadMore({
  text,
  threshold = THRESHOLD,
  className = '',
}: {
  text: string;
  threshold?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const long = text.length > threshold;
  if (!long) return <p className={`text-mocha leading-relaxed ${className}`}>{text}</p>;

  const shown = open ? text : clamp(text, threshold);

  return (
    <div className={className}>
      <div className="relative">
        <p className={`text-mocha leading-relaxed ${open ? '' : 'max-h-[9.5rem] overflow-hidden'}`}>
          {shown}
        </p>
        {!open && (
          // Fade over the last line so the text looks cut rather than truncated.
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/85 to-transparent" />
        )}
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium text-golddark hover:text-[#00747B] transition-colors min-h-[36px]"
      >
        {open ? 'Read less' : 'Read more'}
        <span aria-hidden="true" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
    </div>
  );
}