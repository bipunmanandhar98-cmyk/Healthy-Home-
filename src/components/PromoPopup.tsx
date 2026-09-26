import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/** Change this if you swap the creative. */
const IMAGE = '/images/site/popup.jpeg';
const ALT = 'Hydrafacial special offer — 5 sessions at Rs. 15,000. Festive season offer from Healthy Home.';

/**
 * Site-wide promo popup shown on first load of a visit.
 *
 * Dismissal is remembered in sessionStorage so it appears once per tab session
 * rather than on every route change or page refresh within that session.
 * sessionStorage (not localStorage) so a genuinely new visit shows it again.
 */
const SEEN_KEY = 'hh-promo-seen';

export default function PromoPopup() {
  // Decided once, lazily. Doing this in an effect instead would break under
  // StrictMode's double-invoke: the first pass would set the "seen" flag, the
  // cleanup would cancel the timer, and the second pass would read its own flag
  // and decide the popup had already been dismissed.
  const [shouldShow] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) !== '1';
    } catch {
      // Private mode / storage blocked — show it rather than hide the offer.
      return true;
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    // Small delay so it doesn't fight the page's entrance animation.
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // Non-fatal: worst case it shows again on the next load.
      }
    }, 700);
    return () => clearTimeout(t);
  }, [shouldShow]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    // Stop the page behind from scrolling while the popup is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Special offer"
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <motion.div
            className="relative w-auto max-w-[92vw] max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close offer"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-ink/70 text-white flex items-center justify-center hover:bg-ink transition"
            >
              <X size={17} />
            </button>
            {/* Sized to fit either a portrait or a landscape creative without
                cropping or an inner scrollbar. */}
            <img
              src={IMAGE}
              alt={ALT}
              className="block mx-auto h-auto w-auto max-h-[90vh] max-w-[92vw] object-contain"
              // If the creative is missing, don't leave a broken-image popup behind.
              onError={() => setOpen(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
