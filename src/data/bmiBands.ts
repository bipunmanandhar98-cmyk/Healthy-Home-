/**
 * WHO Body Mass Index bands and the maths that maps a BMI onto the dial.
 *
 * Kept apart from BmiGauge.tsx deliberately: a module that exports both a
 * component and plain constants/functions trips the react-refresh lint rule,
 * and this data is worth importing on its own — bmiCategory needs the colours,
 * and the tests need the angle mapping without rendering anything.
 *
 * Geometry notes, since the arc maths is easy to get subtly wrong:
 *   - A point at angle t (degrees) on radius R is (cx + R*cos t, cy - R*sin t).
 *     The y is negated because SVG's y axis points down while the maths one
 *     points up, so t=90 has to land at the top of the arc.
 *   - t=180 is the left end and t=0 the right end, so bands run from high t to
 *     low t. That direction is clockwise on screen, which is sweep-flag 1; the
 *     inner arc runs back the other way, so its flag is 0.
 */

/** Lowest and highest BMI the dial shows. Outside this the needle pins. */
export const BMI_MIN = 12;
export const BMI_MAX = 45;

export type BmiBand = {
  key: string;
  label: string;
  range: string;
  /** Inclusive lower bound. The last band's upper bound is BMI_MAX. */
  from: number;
  color: string;
};

/**
 * WHO BMI bands, ordered lowest first so the sweep left-to-right reads
 * ascending, which is the direction the dial draws them.
 */
export const BMI_BANDS: BmiBand[] = [
  { key: 'underweight', label: 'Underweight', range: '< 18.5', from: BMI_MIN, color: '#38BDF8' },
  { key: 'healthy', label: 'Healthy', range: '18.5 – 24.9', from: 18.5, color: '#2DD4BF' },
  { key: 'overweight', label: 'Overweight', range: '25.0 – 29.9', from: 25, color: '#FBBF24' },
  { key: 'obese', label: 'Obese', range: '30.0 – 39.9', from: 30, color: '#FB923C' },
  { key: 'severe', label: 'Severely Obese', range: '≥ 40.0', from: 40, color: '#F87171' },
];

/** Maps a BMI onto the dial's 180° sweep: 180° at BMI_MIN, 0° at BMI_MAX. */
export function bmiToAngle(bmi: number): number {
  const clamped = Math.min(BMI_MAX, Math.max(BMI_MIN, bmi));
  return 180 - ((clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180;
}

/** The band a BMI falls in, or null when the BMI predates the lowest band. */
export function bandForBmi(bmi: number): BmiBand | null {
  // Reversed so the first match is the highest band at or below the BMI.
  return [...BMI_BANDS].reverse().find((b) => bmi >= b.from) ?? null;
}
