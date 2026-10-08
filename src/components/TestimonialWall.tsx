import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { testimonials } from '../data/content';

/**
 * Testimonial wall, built to a supplied reference: an eyebrow rule beside an
 * italic title on the left with a standfirst below it, and a brick grid of
 * photo tiles on the right, each carrying a name, a role and a verbatim quote
 * over the image.
 *
 * Every photo here is the reviewer's own Google Business Profile avatar, and
 * every word is their unedited review — the file at src/data/content.ts says so
 * and asks that it not be hand-edited. Nothing here is a stock stand-in, and no
 * name is attached to a face that is not theirs.
 *
 * Tiles are square with every third one at 4:5. The reference uses tall
 * portraits at irregular heights, which is what masonry wants, but all ten
 * source avatars are 200x200 squares: forcing them into tall frames would crop
 * a face to fit a shape the photo was never composed for, and upscale a 200px
 * file to roughly 400px on a retina screen. Square keeps the crop honest.
 *
 * CSS columns rather than a grid, because a grid cannot produce the reference's
 * ragged bottom edge without hardcoding per-item row spans, which would break
 * the moment the data changes. The tiles are not interactive, so column-major
 * reading order is not a problem here.
 *
 * The images carry alt="" on purpose. Each one is the same person named in the
 * caption two lines below it, so describing the photo would only make a screen
 * reader announce the name twice.
 */

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;

/** Short branch label: "Healthy Home Baneshwor" -> "Baneshwor". */
function branchName(branch: string) {
  return branch.replace(/^Healthy Home\s+/i, '');
}

export default function TestimonialWall() {
  return (
    <section className="bg-sand/60 border-y border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[0.6fr_1.4fr] gap-x-10 lg:gap-x-16 items-start">

          {/* Left: eyebrow rule, italic title, standfirst. */}
          <div className="lg:sticky lg:top-28">
            <div className="flex gap-4 sm:gap-5">
              <span aria-hidden="true" className="mt-4 h-px w-9 sm:w-12 shrink-0 bg-ink/25" />
              <h2 className="font-display italic text-[26px] sm:text-[32px] leading-[1.3] text-ink text-balance">
                Real clients, real results
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-[#414D4F] mt-5 max-w-sm">
              Verbatim from each branch&rsquo;s own Google Business Profile —
              {' '}{testimonials.length} reviews, quoted unedited.
            </p>
            <p className="text-[13px] text-[#414D4F] mt-6 flex items-center gap-1.5">
              <Star size={13} className="fill-gold text-gold" aria-hidden="true" />
              5.0 average across every branch reviewed
            </p>
          </div>

          {/* Right: the brick grid. */}
          <div className="columns-2 lg:columns-3 gap-3 lg:gap-4 mt-10 lg:mt-0">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                className="break-inside-avoid mb-3 lg:mb-4 group relative overflow-hidden rounded-2xl bg-ink"
              >
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}
                />

                {/* Scrim. Opaque enough at the bottom that the white caption
                    sits on near-black whatever the photo behind it is doing. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-3.5 lg:p-4">
                  <blockquote className="text-[12px] leading-[1.5] text-white/85 line-clamp-2">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2.5">
                    <cite className="not-italic block text-[13px] font-semibold text-white leading-tight">
                      {t.name}
                    </cite>
                    <span className="block text-[11px] text-white/70 leading-tight mt-0.5">
                      {t.treatment} &middot; {branchName(t.branch)}
                    </span>
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}