import { useCallback, useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

type Props = {
  before: string;
  after: string;
  /** Labels shown on the two halves. */
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  /** Tailwind aspect class for the frame, e.g. 'aspect-[4/3]'. */
  aspect?: string;
};

/**
 * Draggable before/after comparison.
 *
 * Pointer events cover mouse and touch in one path, plus full keyboard support
 * so it isn't mouse-only. The divider is clipped with clip-path rather than a
 * second sized wrapper, so both images stay in the same box at all times.
 */
export default function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  alt,
  aspect = 'aspect-[4/3]',
}: Props) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  // Only listen on the document while dragging, so a fast drag that leaves the
  // element still tracks correctly.
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => { e.preventDefault(); setFromClientX(e.clientX); };
    const up = () => setDragging(false);
    document.addEventListener('pointermove', move, { passive: false });
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(p => Math.max(0, p - step)); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setPos(p => Math.min(100, p + step)); }
    else if (e.key === 'Home') { e.preventDefault(); setPos(0); }
    else if (e.key === 'End') { e.preventDefault(); setPos(100); }
  };

  // Probe for the image separately. The placeholder branch doesn't render the
  // <img loading="lazy" decoding="async">, so an onLoad on it could never fire.
  useEffect(() => {
    let alive = true;
    const probe = new Image();
    probe.onload = () => { if (alive) setReady(true); };
    probe.onerror = () => { if (alive) setReady(false); };
    probe.src = after;
    return () => { alive = false; };
  }, [after]);

  // Shown until the real photos exist, so the section reads as deliberate
  // rather than broken. Never ship a mismatched stand-in pair as a "result".
  // Kept after every hook so hook order stays stable across renders.
  if (!ready) {
    return (
      <div className={`relative ${aspect} w-full max-h-[70vh] overflow-hidden rounded-3xl bg-sand border border-dashed border-linen grid place-items-center px-6 text-center`}>
        <div>
          <MoveHorizontal size={22} className="mx-auto text-stone2/70" />
          <p className="text-sm font-medium mt-3">{alt}</p>
          <p className="text-xs text-stone2 mt-1">Before &amp; after photos coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={frame}
      className={`relative ${aspect} w-full max-h-[70vh] overflow-hidden rounded-3xl bg-linen select-none`}
      onPointerDown={e => { e.preventDefault(); setDragging(true); setFromClientX(e.clientX); }}
    >
      {/* After sits underneath and is always fully painted. */}
      <img loading="lazy" decoding="async"
        src={after}
        alt={`${alt} — after`}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before is revealed from the left up to the divider. */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img loading="lazy" decoding="async"
          src={before}
          alt={`${alt} — before`}
          draggable={false}
          onError={e => { e.currentTarget.style.opacity = '0'; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <span className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase bg-ink/70 text-white px-2.5 py-1 rounded-full pointer-events-none">{beforeLabel}</span>
      <span className="absolute top-3 right-3 text-[10px] tracking-[0.18em] uppercase bg-gold text-white px-2.5 py-1 rounded-full pointer-events-none">{afterLabel}</span>

      {/* Divider */}
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)] pointer-events-none" style={{ left: `${pos}%` }} />

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${alt} before and after comparison`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before`}
        onKeyDown={onKeyDown}
        onPointerDown={e => { e.stopPropagation(); setDragging(true); setFromClientX(e.clientX); }}
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full grid place-items-center text-white shadow-lg transition-transform touch-none ${
          dragging ? 'scale-110 cursor-grabbing' : 'cursor-grab hover:scale-105'
        } ${pos > 8 ? 'bg-[#00919A]' : 'bg-white text-[#00919A]'}`}
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal size={18} />
      </div>
    </div>
  );
}
