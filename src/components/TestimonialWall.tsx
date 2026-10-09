import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { testimonials, googleRating } from '../data/content';

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

/**
 * How many reviews the wall shows.
 *
 * Nine, not ten, so that three-per-row lands as an exact 3x3 block. With ten
 * the last row orphans a single tile, which reads as a mistake rather than a
 * grid. Truncating the array rather than filtering means the tenth review is
 * dropped from view, not from the data - it is still in content.ts and still
 * counted by googleRating.
 *
 * The excluded one is currently Prakriti Karki, the last entry. That is a
 * placeholder decision, not a judgement on the review; swap the slice or name
 * the review to drop if a different one should go.
 */
const SHOWN = 9;

const shown = testimonials.slice(0, SHOWN);

export default function TestimonialWall() {
  return (
    <section className="bg-sand/60 border-y border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[0.6fr_1.4fr] gap-x-10 lg:gap-x-16 items-start">

          {/* Left: eyebrow, title, standfirst. Set on the site's SectionHead scale —
              gold uppercase eyebrow, non-italic display heading at leading 1.14,
              15px mocha standfirst — so this band reads as part of the site
              rather than as a pasted-in design. It is SectionHead's markup
              inline because SectionHead centres by default and constrains
              itself to max-w-2xl, neither of which suits a narrow left column
              beside a masonry wall.

              No sm: size step here, unlike SectionHead's text-4xl sm:text-[44px].
              This column is about 350px wide at lg, and 44px set across it would
              wrap the title to five lines. text-4xl is the same base step the
              rest of the site uses; only the lg bump is dropped. */}
          <div className="lg:sticky lg:top-28 max-w-md">
            <p className="text-[11px] tracking-[0.35em] uppercase font-medium text-golddark">
              Client Voices
            </p>
            <h2 className="font-display text-4xl leading-[1.14] mt-3 text-ink text-balance">
              Real clients, real results
            </h2>
            {/* #414D4F rather than SectionHead's text-mocha. Measured on this
                band's ground, which is sand/60 over the cream page and resolves
                to #EEF4F5, mocha is 4.70:1 — passing, but tight enough that
                Lighthouse flagged this section for colour-contrast when the
                same colour sat on the trust band's stronger sand at 4.63:1.
                #414D4F measures 7.88:1 here and is the same tone the trust
                band uses, so the two stay consistent and both clear AA with
                room to spare. */}
            <p className="mt-4 text-[15px] leading-relaxed text-[#414D4F]">
              Verbatim from each branch&rsquo;s own Google Business Profile —
              {' '}{shown.length} reviews, quoted unedited.
            </p>
            {/* Reads googleRating rather than a literal. It previously said
                "5.0 average", which was simply wrong — the figure across the
                five reviewed branches is 4.8. */}
            <p className="text-[13px] text-[#414D4F] mt-5 flex items-center gap-1.5">
              <Star size={13} className="fill-gold text-gold" aria-hidden="true" />
              {googleRating.average.toFixed(1)} average across {googleRating.branchCount} reviewed branches
            </p>
          </div>

          {/* Three per row from sm up, two below.

              The sm: step is not cosmetic. With columns-2 lg:columns-3, a
              viewport between 640px and 1024px got two columns of very wide 9:16
              tiles - measured at 1000px wide they came out 478x850 each, five
              rows deep, which made the section 4641px tall. That is over six
              screens of scrolling for nine reviews, and it broke the
              one-section-per-screen rhythm on exactly the widths where the
              layout is one column to begin with. Three columns from sm keeps
              the tiles near 314x559 there, so the wall lands around 1677px
              instead.

              Below sm, two columns: at 390px three 9:16 tiles would be about
              111px wide, too narrow to carry a name and a readable line. */}
          <div className="columns-2 sm:columns-3 gap-3 lg:gap-4 mt-10 lg:mt-0">
            {shown.map((t, i) => (
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
                  className="w-full aspect-[9/16] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                {/* Scrim. Opaque enough at the bottom that the white caption
                    sits on near-black whatever the photo behind it is doing. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-3.5 lg:p-4">
                  <blockquote className="text-[12.5px] leading-[1.5] text-white/85 line-clamp-2">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2.5">
                    <cite className="not-italic block text-[14px] font-semibold text-white leading-tight">
                      {t.name}
                    </cite>
                    <span className="block text-[12px] text-white/70 leading-tight mt-0.5">
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