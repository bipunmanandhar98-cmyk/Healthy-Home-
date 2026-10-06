import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* Collapsible detail rows, used on the service pages to fold the long detail
 * blocks (benefits, suitability, process, expected results, FAQs) away behind a
 * heading so the page reads as a summary first.
 *
 * This is the accordion pattern already used by the service list on /services,
 * extracted so it exists once. It deliberately does NOT use <details>: that
 * element cannot be height-animated, so it would snap open, and it has no hook
 * for honouring prefers-reduced-motion.
 *
 * Multiple rows may be open at once. Collapsing the rest on each toggle is the
 * other common behaviour, but it fights a reader comparing two sections, and
 * these panels are short enough that it is not needed to keep the page tidy.
 *
 * Each row is a real button carrying aria-expanded and aria-controls, and the
 * panel is a labelled region, so the open/closed state is announced rather than
 * being purely visual. */

export type AccordionItem = {
  /** Stable identity for the row, also used to persist which rows are open. */
  id: string;
  title: string;
  /** Short note on the right of the header — typically an item count. */
  meta?: string;
  content: ReactNode;
};

/** DOM ids cannot contain spaces, and FAQ rows use a question as their id. */
function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'row';
}

const HEADING = { 2: 'h2', 3: 'h3', 4: 'h4' } as const;

export default function Accordion({
  items,
  initiallyOpen = [],
  headingLevel = 2,
}: {
  items: AccordionItem[];
  /** Ids open on first render. Everything else starts collapsed. */
  initiallyOpen?: string[];
  /** Keeps the rows in the document outline without skipping a level. */
  headingLevel?: 2 | 3 | 4;
}) {
  const [open, setOpen] = useState<string[]>(initiallyOpen);
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const Heading = HEADING[headingLevel];

  const toggle = (id: string) =>
    setOpen(v => (v.includes(id) ? v.filter(x => x !== id) : [...v, id]));

  return (
    <div className="grid gap-3">
      {items.map(it => {
        const isOpen = open.includes(it.id);
        const key = slug(it.id);
        const btnId = `${uid}-${key}-btn`;
        const panelId = `${uid}-${key}-panel`;
        return (
          <div key={it.id} className="bg-white border border-linen rounded-2xl overflow-hidden">
            <Heading className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 min-h-[56px] hover:bg-cream/70 transition-colors"
              >
                <span className="font-display text-xl sm:text-2xl leading-snug">{it.title}</span>
                <span className="flex items-center gap-3 shrink-0">
                  {it.meta && (
                    <span className="text-[11px] text-stone2 uppercase tracking-widest">{it.meta}</span>
                  )}
                  <span
                    className={`w-8 h-8 rounded-full border border-linen grid place-items-center transition-colors ${
                      isOpen ? 'bg-sand' : 'bg-white'
                    }`}
                  >
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
                </span>
              </button>
            </Heading>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.28 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}