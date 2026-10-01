import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Floating WhatsApp chat button.
 *
 * IMPORTANT — this is a deep link, not an embedded chat widget. The URL opens
 * WhatsApp (app or web) with a prefilled message, in a new tab. That is the most
 * this number alone can do.
 *
 * A genuinely inline chat bubble — one that renders inside the page and lets
 * someone type without leaving the site — is not achievable with a phone link.
 * It requires Meta's WhatsApp Business Platform: a Meta Business account,
 * business verification, a phone number registered on the Cloud API, and a
 * approved message template. Nothing on the site can substitute for that setup.
 * If you want the inline version, ask Meta to onboard the number first; the
 * markup here is where the script would mount.
 */

/** Business number, in international format with no spaces or symbols. */
const PHONE = '9779851320156';

/** Pre-filled opening message. Encoded here so it cannot be broken by a stray quote. */
const MESSAGE = "Hello! I'm interested in your services.";

const WA_LINK =
  `https://api.whatsapp.com/send/?phone=%2B${PHONE}` +
  `&text=${encodeURIComponent(MESSAGE)}` +
  '&type=phone_number&app_absent=0';

/** WhatsApp's own brand green. Not a theme token — it has to match the logo. */
const WA_GREEN = '#25D366';

/**
 * The WhatsApp mark: a speech bubble drawn as an outline, with the tail at the
 * lower left and a telephone handset inside.
 *
 * Built from primitives rather than one path string, because the bubble is a
 * ring (a stroke) while the handset is solid (a fill) — a single filled path
 * cannot be both without hand-authoring the cut-outs.
 *
 * The handset is a curved handle with a thicker flange at each end, which is
 * what makes a shape read as a telephone receiver rather than an arc. It is
 * drawn horizontally, then rotated 45 degrees so it tilts the way the brand
 * mark does: earpiece upper-left, mouthpiece lower-right.
 *
 * The tail is drawn first so the bubble's ring paints over its top edge and
 * hides the seam where the two shapes meet.
 *
 * currentColor is used throughout so the glyph follows the surrounding text
 * colour, and the button sets that to white explicitly rather than relying on
 * inheritance — it is not guaranteed to be white otherwise.
 */
function WhatsAppGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      {/* Tail, behind the ring. */}
      <path d="M6.1 16.9 L3.4 21.9 L10.6 19.4 Z" fill="currentColor" />
      {/* Bubble ring. */}
      <circle cx="12" cy="11" r="8.5" stroke="currentColor" strokeWidth="2.1" />
      {/* Handset: handle plus two flanges, rotated as a group.
          Scaled about the bubble's centre first so the flanges clear the ring
          on both sides, which they did not at full size. */}
      <g
        transform="translate(12 11) rotate(45) scale(0.84) translate(-12 -11)"
        stroke="currentColor" fill="none" strokeLinecap="round"
      >
        <path d="M7.7 11.2 Q12 14.9 16.3 11.2" strokeWidth="2.5" />
        <path d="M6.5 9.4 L6.5 13.6" strokeWidth="3.6" />
        <path d="M17.5 9.4 L17.5 13.6" strokeWidth="3.6" />
      </g>
    </svg>
  );
}

export default function WhatsAppWidget() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  /* Held back briefly so it settles after the hero rather than landing on top
     of it, and so it never competes with the promo popup that appears at 700ms. */
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed bottom-5 right-4 sm:right-6 z-[110] flex justify-end"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      /* Hidden from the tab order and screen readers until it is actually on
         screen, so keyboard users do not tab into an invisible control. */
      aria-hidden={!show}
    >
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        onClick={() => {
          /* If the visitor has WhatsApp installed, the browser may hand off to
             the app instead of following the link. On iOS Safari that must be
             triggered inside the click handler, not in an effect, or the OS
             blocks it as a popup. */
          if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            window.location.href = WA_LINK;
          }
        }}
        aria-label="Chat with Healthy Home on WhatsApp. Opens in a new tab with a message ready to send."
        className="group flex items-center gap-0 rounded-full shadow-lg transition-transform hover:scale-[1.03] focus-visible:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/45"
        style={{ backgroundColor: WA_GREEN }}
      >
        <span
          className="hidden sm:block max-w-0 overflow-hidden whitespace-nowrap text-white text-[13px] font-medium tracking-[0.06em] uppercase transition-all duration-300 group-hover:max-w-[190px] group-hover:pl-5 group-hover:pr-1 group-focus-visible:max-w-[190px] group-focus-visible:pl-5 group-focus-visible:pr-1"
        >
          Chat on WhatsApp
        </span>
        {/* text-white here, not inherited: the glyph fills from currentColor and the
            anchor's own colour is not guaranteed to be white. */}
        <span
          className="grid place-items-center rounded-full text-white"
          style={{ width: 56, height: 56 }}
        >
          <WhatsAppGlyph className="w-[30px] h-[30px]" />
        </span>
      </a>
    </motion.div>
  );
}
