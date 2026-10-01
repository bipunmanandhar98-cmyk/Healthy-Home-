/**
 * Semicircular BMI dial, drawn as SVG.
 *
 * A gauge rather than a horizontal bar, because a needle pointing into a
 * coloured band is read faster than a marker slid along a strip — the eye goes
 * straight to the segment it landed in.
 *
 * Band widths are proportional to BMI values rather than equal, so a band
 * occupies exactly the range it represents. That keeps the needle honest about
 * how far apart two cut-offs are: on an equal-width bar the 18.5 boundary would
 * look identical whether it was 18.5 or 25.
 *
 * Only the component is exported here. The bands and the angle maths live in
 * data/bmiBands so this file stays a plain component module (a file exporting
 * both components and constants trips the react-refresh lint rule) and so the
 * maths can be tested without rendering anything.
 */
import { motion } from 'framer-motion';
import { BMI_BANDS, BMI_MAX, bmiToAngle, bandForBmi } from '../data/bmiBands';

/*
 * Geometry. The arc is a 180° sweep centred on CX, with its flat edge on the
 * centre line, so the highest point of the band is CY - R_OUTER.
 *
 * The viewBox has to clear the band arc plus the labels that sit ON the bands,
 * plus the hub below. Labels are the binding constraint: they are rotated to
 * the arc tangent, so a long word like "SEVERELY OBESE" extends past the band
 * it names at the steep angles near each end of the sweep. R_OUTER is therefore
 * kept modest and the viewBox is padded generously rather than clipping them.
 *
 * CX is not the horizontal centre of the viewBox. The hub hangs below the arc,
 * so the extra width on the right balances that. Get this wrong and the dial
 * looks off-centre inside its card even though the arc maths is right.
 */
const CX = 130;
const CY = 146;
const R_OUTER = 106;
const R_INNER = 64;
/** Where the labels are centred — between the band edges. */
const R_LABEL = (R_OUTER + R_INNER) / 2;
/** Needle proportions, sized against the band thickness. */
const NEEDLE_LEN = R_INNER - 4;
const HUB_R = 12;

function point(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

function bandPath(fromAngle: number, toAngle: number) {
  const o1 = point(fromAngle, R_OUTER);
  const o2 = point(toAngle, R_OUTER);
  const i2 = point(toAngle, R_INNER);
  const i1 = point(fromAngle, R_INNER);
  /* Computed rather than assumed: only a band spanning more than 180° needs
     the large-arc flag, and none currently do. Hard-coding 0 would draw the
     wrong shape the moment the scale or bands are widened. */
  const large = fromAngle - toAngle > 180 ? 1 : 0;
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export default function BmiGauge({ bmi }: { bmi: number | null }) {
  const angle = bmi != null ? bmiToAngle(bmi) : null;
  const band = bmi != null ? bandForBmi(bmi) : null;

  /* An arc cannot be read by a screen reader, so the dial carries the same
     information as text: where the needle sits and what that band means. */
  const readout =
    bmi == null
      ? 'Body Mass Index dial, not yet calculated'
      : `Body Mass Index ${bmi.toFixed(1)}, ${band?.label ?? 'outside the shown range'}${
          band ? ` (${band.range})` : ''
        }`;

  return (
    <div className="w-full" style={{ maxWidth: 340 }}>
      <svg
        /* Tall enough for the arc (CY - R_OUTER at the top, plus the hub and
           its shadow below CY) and wide enough that a rotated label at the
           steep angles near either end stays inside the box. */
        viewBox="0 0 260 192"
        role="img"
        aria-label={readout}
        className="w-full h-auto select-none overflow-visible"
      >
        {BMI_BANDS.map((b, i) => {
          const from = bmiToAngle(b.from);
          const to = bmiToAngle(i === BMI_BANDS.length - 1 ? BMI_MAX : BMI_BANDS[i + 1]!.from);
          const mid = (from + to) / 2;
          const label = point(mid, R_LABEL);
          /* Labels run along the band, so the usable width is the band's own
             chord, not the viewBox width. Long names are stepped down through
             three sizes and, if still too wide, condensed with letter-spacing
             rather than allowed to spill over the neighbouring band — that
             spill was visible on UNDERWEIGHT and SEVERELY OBESE. */
          /* Usable width is the band's own chord, not the viewBox width,
             because the labels run along the band. Each line is pinned to that
             chord independently via textLength — set on the parent <text> it
             would stretch both lines together and squash the range label. */
          const chord = 2 * R_LABEL * Math.sin(((from - to) / 2) * (Math.PI / 180));
          const maxWidth = chord - 8;
          const nameSize = b.label.length > 12 ? 7.2 : b.label.length > 9 ? 8 : 9;
          const rangeSize = nameSize * 0.88;
          /* Rough advance width for bold uppercase at a given size. Only used to
             decide whether a line needs condensing; the browser does the real
             measuring via textLength. */
          const fit = (text: string, size: number) =>
            Math.min(1, maxWidth / (text.length * size * 0.62));
          const nameFit = fit(b.label.toUpperCase(), nameSize);
          const rangeFit = fit(b.range, rangeSize);
          return (
            <g key={b.key}>
              <path d={bandPath(from, to)} fill={b.color} />
              <text
                transform={`rotate(${mid - 90} ${label.x} ${label.y})`}
                x={label.x}
                y={label.y}
                textAnchor="middle"
                className="fill-ink"
              >
                <tspan
                  x={label.x} dy={-3}
                  /* textLength/lengthAdjust are SVG presentation attributes,
                     not CSS, so they go on the element rather than in style. */
                  textLength={b.label.toUpperCase().length * nameSize * 0.62 * nameFit}
                  lengthAdjust="spacingAndGlyphs"
                  style={{ fontSize: nameSize, fontWeight: 700 }}
                >
                  {b.label.toUpperCase()}
                </tspan>
                <tspan
                  x={label.x} dy={nameSize + 1.6}
                  textLength={b.range.length * rangeSize * 0.62 * rangeFit}
                  lengthAdjust="spacingAndGlyphs"
                  style={{ fontSize: rangeSize, fontWeight: 500 }}
                >
                  {b.range}
                </tspan>
              </text>
            </g>
          );
        })}

        {/* Hairline between bands, in the dark background colour so it reads
            as a gap between segments rather than a stroke on top of them. */}
        {BMI_BANDS.slice(1).map((b) => {
          const a = bmiToAngle(b.from);
          const p1 = point(a, R_OUTER);
          const p2 = point(a, R_INNER);
          return (
            <line
              key={`sep-${b.key}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#2A211C" strokeWidth={2.5}
            />
          );
        })}

        {/* Needle. 90 - angle maps a maths angle onto a clockwise screen
            rotation, and framer-motion springs it between readings. */}
        {angle != null && (
          <motion.g
            initial={false}
            animate={{ rotate: 90 - angle }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            style={{ originX: `${CX}px`, originY: `${CY}px` }}
          >
            /* A tapered pointer: wide at the hub, sharp at the tip, so it reads
               as pointing rather than as a tick mark. */
            <polygon
              points={[
                `${CX},${CY - NEEDLE_LEN}`,
                `${CX - 5.5},${CY + 8}`,
                `${CX},${CY + 2}`,
                `${CX + 5.5},${CY + 8}`,
              ].join(' ')}
              fill="#14100E"
            />
          </motion.g>
        )}

        {/* Hub. Always drawn, so before a calculation the dial looks idle
            rather than broken. */}
        <circle cx={CX} cy={CY} r={HUB_R} fill="#14100E" opacity={angle == null ? 0.22 : 1} />
        <circle cx={CX} cy={CY} r={HUB_R - 5} fill="#F5EFE6" />
      </svg>
    </div>
  );
}
