/* ============================================================================
 * CENTRAL IMAGE REGISTRY
 * ============================================================================
 *
 * Every image path in the site comes from here. No component or data file
 * hardcodes an image path any more.
 *
 * WHY THIS FILE EXISTS
 * Previously a single file such as `/images/site/svc-dermatology.jpg` was
 * pointed at by six unrelated places at once — the hero slider, the nav
 * dropdown, the home collage and the service card all rendered that same file.
 * Swapping "the dermatology photo" silently changed all of them, and you
 * could never change one without changing the rest.
 *
 * THE RULE:  one placement = one key = one file.
 * Two keys never resolve to the same file, so editing a file only ever
 * changes the single spot it is used in. The check at the bottom of this file
 * fails loudly in dev if that ever stops being true.
 *
 * HOW TO CHANGE AN IMAGE
 * 1. Put your new file in `public/images/<group>/` (create the folder if new).
 * 2. Find the key for the spot you want to change below.
 * 3. Change only the path string after the `:`.
 * That is the whole edit — nothing else in the app needs to be touched.
 *
 * If you want a different file format (e.g. `.webp` or `.png` instead of
 * `.jpg`), change the extension in the path to match the file you added. The
 * path is the only thing that matters, not the extension.
 * ========================================================================== */

const registry = {
  /* ── Brand ─────────────────────────────────────────────────────────────
     Used by: header (logoHeader), mobile drawer (logoMobile), footer
     (logoFooter, rendered with an invert filter) and the browser tab
     (favicon). Four separate files so you can restyle one without the rest. */
  brand: {
    logoHeader: '/images/brand/logo-header.png',
    logoMobile: '/images/brand/logo-mobile.png',
    logoFooter: '/images/brand/logo-footer.png',
    favicon: '/images/brand/favicon.png',
    /** Small leaf ornament in the scrolling brand strip on the home page. */
    leaf: '/images/brand/leaf.png',
  },

  /* ── Header navigation dropdown thumbnails ────────────────────────────
     The little square photo next to each service in the nav menu. Separate
     from `treatment.*` so you can use a square crop here without it having
     to match the wide service card. */
  nav: {
    weightManagement: '/images/nav/service-weight-management.jpg',
    dermatology: '/images/nav/service-dermatology.jpg',
    labTests: '/images/nav/service-lab-tests.jpg',
  },

  /* ── Page background textures ─────────────────────────────────────────
     Faint full-bleed photos behind page headers and the CTA banner, drawn at
     low opacity. `cta` is the shared banner used on most pages;
     `ctaFranchise` is the Franchise page's own copy of it. */
  bg: {
    about: '/images/backgrounds/about.jpg',
    services: '/images/backgrounds/services.jpg',
    locations: '/images/backgrounds/locations.jpg',
    membership: '/images/backgrounds/membership.jpg',
    cta: '/images/backgrounds/cta.jpg',
    ctaFranchise: '/images/backgrounds/cta-franchise.jpg',
  },

  /* ── Home: full-screen hero slider (4 rotating slides) ──────────────── */
  home: {
    hero1: '/images/home/hero-slide-1.jpg',
    hero2: '/images/home/hero-slide-2.jpg',
    hero3: '/images/home/hero-slide-3.jpg',
    hero4: '/images/home/hero-slide-4.jpg',

    /* ── Home: Instagram reel tiles ──────────────────────────────────────
       Square thumbnails linking out to the reel. Separate from the hero
       slides above, since a reel cover is cropped square. */
    reel1: '/images/home/reel-1.jpg',
    reel2: '/images/home/reel-2.jpg',
    reel3: '/images/home/reel-3.jpg',
    reel4: '/images/home/reel-4.jpg',

    /* ── Home: "Experience" photo collage ──────────────────────────────── */
    experienceMain: '/images/home/experience-main.jpg',
    experienceDerma: '/images/home/experience-derma.jpg',
    experienceWeight: '/images/home/experience-weight.jpg',
  },

  /* ── Home: before/after comparison slider ─────────────────────────────
     Shown as a drag-to-compare pair. These ship as neutral placeholders —
     overwrite both files in a pair together, keeping the same framing, or the
     slider will look broken. */
  result: {
    weightBefore: '/images/results/weight-before.jpg',
    weightAfter: '/images/results/weight-after.jpg',
    skinBefore: '/images/results/skin-before.jpg',
    skinAfter: '/images/results/skin-after.jpg',
  },

  /* ── Main treatment categories ────────────────────────────────────────
     The wide card image for each of the three top-level services, used on
     the Services page, the Specials offer cards and each service's own
     detail page. */
  treatment: {
    weightManagement: '/images/treatments/weight-management.jpg',
    dermatology: '/images/treatments/dermatology.jpg',
    labTests: '/images/treatments/lab-tests.jpg',
  },

  /* ── Sub-services ─────────────────────────────────────────────────────
     One photo per individual treatment, reused across every page that lists
     it (home grid, services list, booking modal, skin quiz, BMI calculator).
     That reuse is intentional — it is the same treatment. The photo itself
     is still independent of every other treatment. */
  service: {
    bcaTesting: '/images/services/bca-testing.jpg',
    weightLoss: '/images/services/weight-loss.jpg',
    coolsculpting: '/images/services/coolsculpting.jpg',
    breastReduction: '/images/services/breast-reduction.jpg',
    bodyShaping: '/images/services/body-shaping.jpg',
    weightGain: '/images/services/weight-gain.jpg',
    weightLossHomePackage: '/images/services/weight-loss-home-package.jpg',
    hydrafacial: '/images/services/hydrafacial.jpg',
    laserHairRemoval: '/images/services/laser-hair-removal.jpg',
    skinTightening: '/images/services/skin-tightening.jpg',
    faceLifting: '/images/services/face-lifting.jpg',
    breastTightening: '/images/services/breast-tightening.jpg',
    stretchMarkRemoval: '/images/services/stretch-mark-removal.jpg',
    chemicalPeeling: '/images/services/chemical-peeling.jpg',
    dermaConsultation: '/images/services/derma-consultation.jpg',
    wholeBodyLabTest: '/images/services/whole-body-lab-test.jpg',
  },

  /* ── Google review avatars ────────────────────────────────────────────
     One file per named reviewer quoted in the testimonial carousel. Real
     people, so these should stay recognisably the right person if you swap
     them at all. */
  review: {
    apekshyaGiri: '/images/reviews/apekshya-giri.jpg',
    kaushalRajGnyawali: '/images/reviews/kaushal-raj-gnyawali.jpg',
    arjunBahadurKshetri: '/images/reviews/arjun-bahadur-kshetri.jpg',
    ganeshRimal: '/images/reviews/ganesh-rimal.jpg',
    prabalBatajoo: '/images/reviews/prabal-batajoo.jpg',
    nickC: '/images/reviews/nick-c.jpg',
    bijayataRai: '/images/reviews/bijayata-rai.jpg',
    ganeshGurung: '/images/reviews/ganesh-gurung.jpg',
    shivaMakaju: '/images/reviews/shiva-makaju.jpg',
    prakritiKarki: '/images/reviews/prakriti-karki.jpg',
  },

  /* ── About page: clinical team ──────────────────────────────────────── */
  team: {
    about1: '/images/team/about-1.jpg',
    about2: '/images/team/about-2.jpg',
    about3: '/images/team/about-3.jpg',
    about4: '/images/team/about-4.jpg',
  },

  /* ── Career page: staff stories ───────────────────────────────────────
     Different people from the About team, so these are separate files. */
  staff: {
    career1: '/images/staff/career-1.jpg',
    career2: '/images/staff/career-2.jpg',
    career3: '/images/staff/career-3.jpg',
    career4: '/images/staff/career-4.jpg',
  },

  /* ── Franchise page ────────────────────────────────────────────────── */
  franchise: {
    /** Small round avatar in the franchise testimonial snippet. */
    reviewAvatar: '/images/franchise/review-avatar.jpg',
  },

  /* ── Wellness store products ──────────────────────────────────────────
     These ship as neutral placeholders. Overwrite each file with the product
     photo, keeping roughly a square crop. */
  store: {
    healthyHomeMorningTea: '/images/store/healthy-home-morning-tea.jpg',
    dayTea: '/images/store/day-tea.jpg',
    nightTea: '/images/store/night-tea.jpg',
    nepaleseHerbalTea: '/images/store/nepalese-herbal-tea.jpg',
    gastricTea: '/images/store/gastric-tea.jpg',
  },

  /* ── Promotional popup ──────────────────────────────────────────────── */
  promo: {
    popup: '/images/promo/popup.jpg',
  },
} as const;

/** Every image path in the site. Import this instead of writing paths inline. */
export const IMG = registry;

/* Flattens the nested registry to dotted keys so the dev check below (and
   anything debugging it) can talk about images as 'home.hero1'. */
function flatten(
  source: Record<string, unknown>,
  prefix = '',
): { key: string; path: string }[] {
  return Object.entries(source).flatMap(([name, value]) =>
    typeof value === 'string'
      ? [{ key: `${prefix}${name}`, path: value }]
      : flatten(value as Record<string, unknown>, `${prefix}${name}.`),
  );
}

/* Two keys sharing one file is exactly the coupling this registry exists to
   prevent, so surface it in the console during `npm run dev` rather than
   letting it creep back in unnoticed. */
if (import.meta.env.DEV) {
  const all = flatten(registry as unknown as Record<string, unknown>);
  const byPath = new Map<string, string[]>();
  for (const { key, path } of all) {
    byPath.set(path, [...(byPath.get(path) ?? []), key]);
  }
  const shared = [...byPath.entries()].filter(([, keys]) => keys.length > 1);
  if (shared.length > 0) {
    console.warn(
      `[images] ${shared.length} image file(s) are shared by more than one ` +
        `placement. Give each its own file so they can be changed separately:\n` +
        shared
          .map(([path, keys]) => `  ${path} → ${keys.join(', ')}`)
          .join('\n'),
    );
  }
}
