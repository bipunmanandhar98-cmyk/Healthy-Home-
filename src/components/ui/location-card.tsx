import * as React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MapPin, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * shadcn-style location card: photo, name, and a Directions button whose label
 * slides away for an arrow on hover.
 *
 * Three deliberate deviations from the version this was copied from, each a bug
 * that only shows up once the card is used more than once or on real data:
 *
 * 1. The heading id is generated per instance. The original hardcoded
 *    id="location-title", so with a grid of these every card's
 *    aria-labelledby resolved to the first card in the page and the other five
 *    announced the wrong name. Duplicate ids are also invalid HTML.
 *
 * 2. `border` became `border-border`. A bare `border` utility takes its colour
 *    from currentColor, so the cards came out with near-black borders while the
 *    rest of the site uses linen. Naming the token is also what the shadcn
 *    convention expects.
 *
 * 3. The image is optional and falls back to a branded tile. A branch with no
 *    photo otherwise renders a broken-image glyph, which is worse than not
 *    having a photo at all. `onError` covers the other case: a URL that 404s.
 *
 * forwardRef is kept from the original even though React 19 (this project runs
 * 19.2) deprecates it in favour of `ref` as a plain prop. It is not an error and
 * it keeps the public API byte-identical to the shadcn component, so a caller
 * written against that version needs no change.
 *
 * `onBook` is optional and additive: pass it and a booking button appears below
 * the title row. Without it the card renders exactly as designed. It exists
 * because this card is used in a section where booking is the main conversion,
 * and a Directions-only card would quietly drop that action.
 */
export interface LocationCardProps {
  /** Omit or leave empty to show the branded initials tile instead. */
  imageUrl?: string;
  location: string;
  country: string;
  href: string;
  /** Called on the booking button. Omit for a Directions-only card. */
  onBook?: () => void;
  bookLabel?: string;
  /** Overrides the letters shown on the fallback tile. Derived from `location` if absent. */
  initials?: string;
  className?: string;
}

const LocationCard = React.forwardRef<HTMLDivElement, LocationCardProps>(function LocationCard(
  { imageUrl, location, country, href, onBook, bookLabel = 'Book Here', initials, className },
  ref,
) {
  const controls = useAnimation();
  const iconControls = useAnimation();
  const headingId = React.useId();

  // Animation variants for the main card container
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -5, transition: { type: 'spring' as const, stiffness: 400, damping: 10 } },
  };

  // Animation variants for the button's text
  const textVariants = {
    initial: { opacity: 1 },
    hover: { opacity: 0, transition: { duration: 0.1 } },
  };

  // Animation variants for the icon
  const iconVariants = {
    initial: { x: 0 },
    hover: { x: 50, transition: { type: 'spring' as const, stiffness: 300, damping: 15 } },
  };

  const [imgFailed, setImgFailed] = React.useState(false);
  const showImage = Boolean(imageUrl) && !imgFailed;

  return (
    <motion.div
      ref={ref}
      className={cn(
        'w-full max-w-xs overflow-hidden rounded-2xl border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      animate={controls}
      onHoverStart={() => {
        controls.start('hover');
        iconControls.start('hover');
      }}
      onHoverEnd={() => {
        controls.start('initial');
        iconControls.start('initial');
      }}
      // Accessibility: Announce the component as a group
      role="group"
      aria-labelledby={headingId}
    >
      {/* Image Section */}
      {showImage ? (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={`${location} branch`}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className="aspect-[4/3] bg-gradient-to-br from-muted to-border grid place-items-center"
          aria-hidden="true"
        >
          <span className="flex flex-col items-center gap-2 text-muted-foreground">
            <MapPin size={30} />
            <span className="font-display text-3xl leading-none">
              {(initials ?? location)
                .replace(/^(Healthy Home|House)\s+/i, '')
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]!.toUpperCase())
                .join('')}
            </span>
          </span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3
              id={headingId}
              title={location}
              className="font-semibold text-card-foreground truncate"
            >
              {location}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{country}</p>
          </div>

          {/* Animated Button */}
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-10 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label={`Get directions to ${location}`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span variants={textVariants} animate={controls} className="absolute">
              Directions
            </motion.span>
            <motion.span variants={iconVariants} animate={iconControls} className="absolute left-4">
              <Send size={16} />
            </motion.span>
          </motion.a>
        </div>

        {/*
          Booking gets its own row instead of sharing the line with the title.

          Side by side, the fixed 128px Directions link left the branch name
          under ~12px of width — "Baneshwor" shrank to a sliver at every
          breakpoint — and at the 2-column `sm` breakpoint the row overflowed and
          the link escaped the card's padding. Stacking keeps the designed
          title/Directions pair intact and gives booking the full width, which
          also makes it a 44px-tall tap target rather than 40.

          Directions is outlined rather than solid because this card now carries
          two buttons; both filled with --color-primary they read as one
          ambiguous control. Outlined makes booking the single solid primary
          action. --color-primary on --color-card is the same 5.13:1 the palette
          audit checked, so the outline label still passes AA.
        */}
        {onBook ? (
          <button
            type="button"
            onClick={onBook}
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground"
          >
            {bookLabel}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
});

LocationCard.displayName = 'LocationCard';

export { LocationCard };