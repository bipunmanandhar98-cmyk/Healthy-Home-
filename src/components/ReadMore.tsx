import { useState } from 'react';

/* Collapses a long paragraph behind a "Read more" toggle.
 *
 * Measured on the real data rather than guessed: the 19 service overviews run
 * from 190 to 1323 characters, median 663, and 16 of the 19 are over 340. Several
 * are 150-200 word walls sitting directly under an h1, which pushes everything
 * else off the screen.
 *
 * The cutoff is decided by character count, but the visible cut is drawn by
 * line-clamp. Those are two different jobs and were briefly conflated:
 *
 *   - Character count decides only WHETHER the toggle appears. Measuring the
 *     rendered box instead would need a ref, a resize observer and a layout
 *     pass, and state derived from that re-runs on every resize — which is how
 *     this kind of toggle ends up flickering or briefly wrong on first paint.
 *     A threshold is stable and cannot flicker.
 *   - line-clamp decides HOW MUCH is visible, because it truncates on a line
 *     boundary and adds its own ellipsis.
 *
 * An earlier version cut with a fixed max-height and covered the seam with a
 * white gradient. Two problems: the gradient was `from-white` while these pages
 * sit on the cream token, so it laid a visible white haze over the text rather
 * than fading it, and a max-height that is not a multiple of the line-height
 * slices through the middle of a line instead of ending cleanly. line-clamp
 * removes the overlay entirely and needs no magic height.
 *
 * The 320-character threshold sits in a natural gap in the data: the three main
 * treatment overviews are 190 / 264 / 305 characters and all sixteen sub-service
 * overviews are 594 to 1323. So every main description stays plain and every
 * sub-service folds, without the number being finely tuned.
 *
 * Text at or under the threshold renders untouched — no button, no clamp — so
 * short descriptions are not given a pointless control.
 */

/** Roughly four lines of body copy at the sizes these pages use. */
const THRESHOLD = 320;

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
  if (text.length <= threshold) {
    return <p className={`text-mocha leading-relaxed ${className}`}>{text}</p>;
  }

  return (
    <div className={className}>
      <p className={`text-mocha leading-relaxed ${open ? '' : 'line-clamp-4'}`}>{text}</p>
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