export type Treatment = {
  id: string;
  name: string;
  shortName: string;
  category: 'Weight Management' | 'Dermatology' | 'Lab Tests';
  tagline: string;
  description: string;
  overview: string;
  price: string;
  priceNote: string;
  duration: string;
  downtime: string;
  results: string;
  image: string;
  benefits: string[];
  suitableFor: string[];
  process: { title: string; desc: string }[];
  badge?: string;
  faqs: { q: string; a: string }[];
};

export const treatments: Treatment[] = [
  {
    id: 'weight-management',
    name: 'Weight Management',
    shortName: 'Weight Management',
    category: 'Weight Management',
    tagline: 'Guided programs. Lasting results.',
    description: 'Healthy Home Weight Management brings every body goal under one roof — from testing and coaching to non-invasive shaping. Start with a free BCA assessment and get a plan built around your body, schedule and budget.',
    overview: 'Weight Management at Healthy Home is a complete, clinician-guided journey: measure first with BCA testing, then follow a personalized mix of weight-loss or weight-gain coaching, CoolSculpting, body shaping, and at-home support. Every plan is non-extreme, trackable and supported across all 6 Nepal branch.',
    price: '', priceNote: '', duration: '30-60 min', downtime: 'None', results: 'Ongoing',
    image: '/images/site/svc-weight-management.jpg',
    benefits: ['Personalized plans from real body data', 'Non-invasive shaping options', 'Coaching + progress tracking', 'At-home package support', 'All 6 Nepal branch'],
    suitableFor: ['Adults starting a weight-loss journey', 'Clients needing obesity guidance', 'Anyone wanting BCA/body-fat baselines', 'Clients preferring non-invasive shaping', 'Busy clients needing a home package'],
    process: [
      { title: 'Measure', desc: 'BCA testing + body/fat assessment sets your baseline.' },
      { title: 'Plan', desc: 'Specialist writes your mix of coaching, sessions and home support.' },
      { title: 'Act', desc: 'Coaching visits, shaping sessions and home-package routines.' },
      { title: 'Maintain', desc: 'Reviews, re-tests and membership savings keep results.' },
    ],
    badge: 'Most Popular',
    faqs: [
      { q: 'Do I start with BCA testing?', a: 'Yes — BCA testing plus body/fat assessment gives your baseline so every later step is measurable.' },
      { q: 'Is CoolSculpting surgical?', a: 'No. CoolSculpting and body shaping at Healthy Home are non-invasive with no downtime.' },
    ],
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    shortName: 'Dermatology',
    category: 'Dermatology',
    tagline: 'Healthy skin, expert care.',
    description: 'Dermatologist-led skin care from everyday glow to targeted correction — HydraFacial treatment, laser hair removal, tightening, lifting, stretchmark care, chemical peeling and derma consultation.',
    overview: 'Dermatology at Healthy Home covers the full skin journey: consultation and analysis first, then gentle non-invasive treatments matched to your skin type — glow facials, laser hair removal, tightening and lifting, stretchmark and scar care, and medical-grade peels.',
    price: '', priceNote: '', duration: '20-60 min', downtime: 'None', results: '2-4 weeks glow',
    image: '/images/site/svc-dermatology.jpg',
    benefits: ['Derma consultation first', 'Non-invasive, no-downtime options', 'Plans for every skin type', 'Face + body coverage', 'Membership savings'],
    suitableFor: ['Dull, uneven or congested skin', 'Unwanted facial/body hair', 'Early laxity on face, neck or body', 'Stretchmarks, spots or scars', 'Anyone wanting a skin plan'],
    process: [
      { title: 'Consult', desc: 'Derma consultation + skin analysis maps your plan.' },
      { title: 'Treat', desc: 'Targeted sessions — facial, laser, tightening, peel.' },
      { title: 'Review', desc: 'Progress photos and plan adjustments.' },
      { title: 'Maintain', desc: 'Home care + membership touch-ups.' },
    ],
    badge: 'Top Rated',
    faqs: [
      { q: 'Is there downtime?', a: 'No — our dermatology services are non-invasive and gentle. Most clients return to routine the same day.' },
      { q: 'Which service first?', a: 'Start with a derma consultation. Your specialist will sequence glow, correction and maintenance.' },
    ],
  },
  {
    id: 'lab-tests',
    name: 'Lab Tests',
    shortName: 'Lab Tests',
    category: 'Lab Tests',
    tagline: 'Know your numbers. Own your health.',
    description: 'The Whole Body Lab Test is your health baseline — one comprehensive panel, clinician-reviewed, with an actionable next-step plan for any weight or skin program.',
    overview: 'Lab Tests at Healthy Home means one thing done well: the Whole Body Lab Test. A comprehensive panel reviewed by our care team, so weight and skin plans start from real numbers — not guesses.',
    price: '', priceNote: '', duration: '30-45 min', downtime: 'None', results: 'Action plan included',
    image: '/images/site/svc-lab-tests.jpg',
    benefits: ['Comprehensive whole-body panel', 'Clinician-reviewed results', 'Action plan included', 'Right start for any program'],
    suitableFor: ['Anyone starting weight or skin programs', 'Clients wanting a yearly baseline', 'Clients with fatigue, weight or skin concerns'],
    process: [
      { title: 'Sample', desc: 'Quick in-branch sample collection.' },
      { title: 'Analyze', desc: 'Certified lab processing.' },
      { title: 'Review', desc: 'Clinician walks through results + next steps.' },
      { title: 'Act', desc: 'Results feed directly into your plan.' },
    ],
    badge: 'Recommended',
    faqs: [
      { q: 'Do I need to fast?', a: 'Your branch will confirm prep when you book — most panels need a short morning fast.' },
      { q: 'How fast are results?', a: 'Results plus a reviewed action plan, typically within a few working days.' },
    ],
  },
];

export type SubService = {
  id: string;
  parentId: string;
  name: string;
  description: string;
  overview: string;
  image: string;
  duration: string;
  benefits: string[];
  suitableFor: string[];
  process: { title: string; desc: string }[];
  expectedResults: string;
  faqs: { q: string; a: string }[];
};

export const subServices: SubService[] = [
  // ── Weight Management (7) ──
  {
    id: 'bca-testing', parentId: 'weight-management', name: 'BCA Testing',
    description: 'Body Composition Analysis — muscle, fat, water and metabolic insights in minutes.',
    overview: 'BCA Testing is the starting point of every Healthy Home weight journey. A quick, non-invasive scan breaks your body into muscle, fat, water and metabolic rate — so coaching and shaping decisions are based on data, not the scale alone.',
    image: '/images/site/sub-bca-testing.jpg', duration: '20-30 min',
    benefits: ['Accurate muscle vs fat breakdown', 'Visceral-fat and water insights', 'Trackable progress baseline', 'Personalized targets from real data'],
    suitableFor: ['Anyone starting weight loss or gain', 'Clients stuck at a plateau', 'Coaching + shaping candidates'],
    process: [
      { title: 'Scan', desc: 'Stand-on BCA scan takes a few minutes — no preparation needed.' },
      { title: 'Review', desc: 'Specialist walks through muscle, fat, water and metabolic age.' },
      { title: 'Plan', desc: 'Targets and next steps feed into your weight plan.' },
    ],
    expectedResults: 'A clear baseline report plus targets from day one; re-tests show measurable change within weeks.',
    faqs: [
      { q: 'Does it hurt?', a: 'No — the scan is completely non-invasive. You simply stand on the analyzer fully clothed.' },
      { q: 'How often should I re-test?', a: 'Most clients re-test every 4–6 weeks to track muscle and fat change.' },
    ],
  },
  {
    id: 'weight-loss', parentId: 'weight-management', name: 'Weight Loss',
    description: 'Coach-guided fat-loss programs with nutrition, activity and progress tracking.',
    overview: 'Weight Loss at Healthy Home is a structured program — not a crash diet. After BCA testing, your coach builds nutrition, activity and habit targets, then reviews progress at every visit.',
    image: '/images/site/sub-weight-loss.jpg', duration: '45-60 min',
    benefits: ['Personalized nutrition targets', 'Activity + habit coaching', 'Regular weigh-ins and BCA reviews', 'Non-extreme, sustainable pace'],
    suitableFor: ['Adults wanting steady fat loss', 'Post-assessment coaching candidates', 'Home-package companions'],
    process: [
      { title: 'Assess', desc: 'BCA + lifestyle review sets your start point.' },
      { title: 'Coach', desc: 'Nutrition and activity targets, plus habit check-ins.' },
      { title: 'Track', desc: 'Weigh-ins, measurements and re-tests keep you on track.' },
    ],
    expectedResults: 'Steady, trackable loss from weeks 3–4, with coaching milestones along the way.',
    faqs: [
      { q: 'How fast will I see results?', a: 'Most clients see steady progress by weeks 3–4, with bigger change over 12 weeks.' },
      { q: 'Is diet extreme?', a: 'No — plans fit Nepali meals and daily routine, with coaching not restriction.' },
    ],
  },
  {
    id: 'coolsculpting', parentId: 'weight-management', name: 'CoolSculpting',
    description: 'Non-invasive body contouring that targets stubborn fat areas.',
    overview: 'CoolSculpting targets stubborn fat pockets — abdomen, flanks, arms, thighs — with controlled cooling. Non-invasive, no anesthesia, no downtime: you relax during the session and return to routine after.',
    image: '/images/site/sub-coolsculpting.jpg', duration: '35-60 min',
    benefits: ['Targets stubborn fat pockets', 'Non-invasive, no anesthesia', 'No downtime', 'Pairs with coaching + BCA tracking'],
    suitableFor: ['Clients near goal weight with stubborn areas', 'Non-surgical shaping seekers', 'Coaching-program companions'],
    process: [
      { title: 'Map', desc: 'Specialist maps applicator placement to your goals.' },
      { title: 'Treat', desc: 'Controlled-cooling session while you relax.' },
      { title: 'Review', desc: 'Follow-ups track contour change over weeks.' },
    ],
    expectedResults: 'Visible contour refinement over 4–12 weeks as treated fat cells are naturally cleared.',
    faqs: [
      { q: 'Does it hurt?', a: 'Most clients feel intense cold then numbness; sessions are well tolerated.' },
      { q: 'How many sessions?', a: 'Your specialist maps cycles at consult — many clients start with 1–2 per area.' },
    ],
  },
  {
    id: 'breast-reduction-wm', parentId: 'weight-management', name: 'Breast Reduction',
    description: 'Consultation-led reduction support plans with clinical guidance.',
    overview: 'Breast Reduction at Healthy Home starts with a private consultation: assessment, weight and posture review, and a clinician-guided support plan — including shaping, coaching and referral guidance where needed.',
    image: '/images/site/sub-breast-reduction.jpg', duration: '45-60 min',
    benefits: ['Private consultation first', 'Weight + posture review', 'Shaping and support planning', 'Clear referral guidance if needed'],
    suitableFor: ['Clients seeking reduction guidance', 'Posture/back-comfort concerns', 'Weight-linked support candidates'],
    process: [
      { title: 'Consult', desc: 'Private assessment and goal discussion.' },
      { title: 'Plan', desc: 'Support plan across weight, shaping and care.' },
      { title: 'Support', desc: 'Follow-ups plus referral guidance where appropriate.' },
    ],
    expectedResults: 'A clear, respectful plan with comfort and proportion goals tracked over visits.',
    faqs: [
      { q: 'Is this surgery?', a: 'No — Healthy Home provides consultation-led support plans and guidance, not surgery.' },
      { q: 'Is it private?', a: 'Yes — one-on-one consultations in a private room, with female staff available.' },
    ],
  },
  {
    id: 'body-shaping', parentId: 'weight-management', name: 'Body Shaping',
    description: 'Shaping and toning sessions for abdomen, arms, thighs and more.',
    overview: 'Body Shaping tones and defines — abdomen, arms, thighs, flanks — through guided sessions paired with coaching. Ideal after initial fat loss or alongside BCA-tracked programs.',
    image: '/images/site/sub-body-shaping.jpg', duration: '30-60 min',
    benefits: ['Targets abdomen, arms, thighs', 'Toning + definition focus', 'No downtime', 'Stacks with weight-loss coaching'],
    suitableFor: ['Post-loss toning', 'Event-ready definition', 'Coaching companions'],
    process: [
      { title: 'Map', desc: 'Target areas mapped to your goals.' },
      { title: 'Shape', desc: 'Guided shaping sessions per area.' },
      { title: 'Track', desc: 'Measurements and photos track definition.' },
    ],
    expectedResults: 'Firmer, more defined contours over a short series, maintained with coaching.',
    faqs: [
      { q: 'How many sessions?', a: 'Most plans run a short series — your specialist maps count at consult.' },
      { q: 'Any downtime?', a: 'None — return to routine immediately after sessions.' },
    ],
  },
  {
    id: 'weight-gain', parentId: 'weight-management', name: 'Weight Gain',
    description: 'Healthy, supervised weight-gain plans with nutrition and strength guidance.',
    overview: 'Weight Gain at Healthy Home is healthy weight done right: BCA-guided muscle-first targets, nutrition surplus plans and strength guidance — supervised, trackable and sustainable.',
    image: '/images/site/sub-weight-gain.jpg', duration: '45-60 min',
    benefits: ['Muscle-first gain targets', 'Nutrition surplus planning', 'Strength guidance', 'BCA-tracked progress'],
    suitableFor: ['Underweight adults', 'Muscle-building beginners', 'Post-illness recovery support'],
    process: [
      { title: 'Assess', desc: 'BCA + nutrition review sets targets.' },
      { title: 'Build', desc: 'Surplus meal plans plus strength guidance.' },
      { title: 'Track', desc: 'Re-tests confirm muscle — not just scale — gain.' },
    ],
    expectedResults: 'Steady, healthy gain focused on muscle, reviewed every few weeks.',
    faqs: [
      { q: 'Will I just gain fat?', a: 'No — plans target muscle-first gain with BCA tracking to prove it.' },
      { q: 'Do I need a gym?', a: 'No — strength guidance adapts to home or gym routines.' },
    ],
  },
  {
    id: 'weight-loss-home-package', parentId: 'weight-management', name: 'Weight Loss Home Package',
    description: 'At-home weight-loss kit with guides, teas and remote coaching support.',
    overview: 'The Weight Loss Home Package brings Healthy Home to your door: BCA baseline in-branch, then teas, guides, meal frameworks and remote coaching — ideal for busy schedules or clients outside the Valley.',
    image: '/images/site/sub-home-package.jpg', duration: 'Home-based',
    benefits: ['At-home teas + guides', 'Remote coaching check-ins', 'Meal frameworks that fit Nepali kitchens', 'In-center BCA reviews'],
    suitableFor: ['Busy professionals', 'Clients outside Kathmandu Valley', 'Coaching-program companions'],
    process: [
      { title: 'Baseline', desc: 'In-center BCA + consult sets your kit.' },
      { title: 'Home routine', desc: 'Teas, guides and meal frameworks at home.' },
      { title: 'Remote reviews', desc: 'Coach check-ins plus in-branch re-tests.' },
    ],
    expectedResults: 'Steady home-based progress with accountability from your remote coach.',
    faqs: [
      { q: 'Do I ever visit a branch?', a: 'Yes — baseline and re-tests happen in-branch; the routine runs at home.' },
      { q: 'What is inside?', a: 'Teas, guides, meal frameworks and a coaching schedule — mapped at consult.' },
    ],
  },
  // ── Dermatology (8) ──
  {
    id: 'hydrafacial-treatment', parentId: 'dermatology', name: 'HydraFacial Treatment',
    description: 'Deep cleanse, exfoliation and hydration for instant glow.',
    overview: 'HydraFacial Treatment is our signature glow facial: cleanse, gentle exfoliation, painless extractions and antioxidant hydration — finished in under an hour with zero downtime.',
    image: '/images/site/sub-hydrafacial.jpg', duration: '30-45 min',
    benefits: ['Instant glow, zero downtime', 'Clears congestion gently', 'Hydrates and evens tone', 'Safe before events'],
    suitableFor: ['Dull or congested skin', 'Pre-event glow', 'First-time facial clients'],
    process: [
      { title: 'Cleanse', desc: 'Deep cleanse + gentle exfoliation.' },
      { title: 'Extract', desc: 'Painless extractions clear pores.' },
      { title: 'Hydrate', desc: 'Antioxidant infusion seals the glow.' },
    ],
    expectedResults: 'Camera-ready glow immediately; tone and texture improve over a short series.',
    faqs: [
      { q: 'Any downtime?', a: 'None — most clients return to routine immediately.' },
      { q: 'How often?', a: 'Monthly for maintenance; your specialist maps frequency at consult.' },
    ],
  },
  {
    id: 'laser-hair-removal', parentId: 'dermatology', name: 'Laser Hair Removal',
    description: 'Safe, lasting hair reduction for face and body.',
    overview: 'Laser Hair Removal offers lasting smoothness for upper lip, chin, underarms, arms, legs and bikini — with settings matched to your skin tone and hair type.',
    image: '/images/site/sub-laser.jpg', duration: '15-45 min',
    benefits: ['Lasting hair reduction', 'Face + body areas', 'Settings matched to skin tone', 'Quick sessions'],
    suitableFor: ['Unwanted facial/body hair', 'Shaving/waxing alternatives', 'Maintenance seekers'],
    process: [
      { title: 'Assess', desc: 'Skin + hair review sets safe settings.' },
      { title: 'Treat', desc: 'Quick laser passes per area.' },
      { title: 'Series', desc: 'Sessions spaced weeks apart for full reduction.' },
    ],
    expectedResults: 'Progressive reduction over a series; maintenance keeps areas smooth.',
    faqs: [
      { q: 'Does it hurt?', a: 'Most clients feel brief warmth/snapping; cooling keeps sessions comfortable.' },
      { q: 'How many sessions?', a: 'Typically a series — your specialist maps count and spacing at consult.' },
    ],
  },
  {
    id: 'skin-tightening', parentId: 'dermatology', name: 'Skin Tightening',
    description: 'Firming sessions for face, neck and body laxity.',
    overview: 'Skin Tightening firms early laxity on face, neck, arms and abdomen with gentle, non-invasive sessions that stimulate firmer-looking skin over time.',
    image: '/images/site/sub-tightening.jpg', duration: '30-60 min',
    benefits: ['Firms face, neck + body', 'Non-invasive, no downtime', 'Gradual natural-looking firmness', 'Pairs with facials + lifting'],
    suitableFor: ['Early laxity concerns', 'Post-weight-loss firming', 'Maintenance seekers'],
    process: [
      { title: 'Map', desc: 'Laxity mapped per area.' },
      { title: 'Firm', desc: 'Gentle firming sessions.' },
      { title: 'Track', desc: 'Photos track firmness over weeks.' },
    ],
    expectedResults: 'Gradual firmness over weeks, improving across a short series.',
    faqs: [
      { q: 'Any downtime?', a: 'None — mild warmth fades within hours for most clients.' },
      { q: 'How many sessions?', a: 'Most plans run a short series; mapped at consult.' },
    ],
  },
  {
    id: 'face-lifting', parentId: 'dermatology', name: 'Face Lifting',
    description: 'Non-surgical lifting for a firmer, lifted look.',
    overview: 'Face Lifting lifts brow, cheeks, jawline and neck with non-surgical sessions — definition without needles or downtime.',
    image: '/images/site/sub-lifting.jpg', duration: '45-60 min',
    benefits: ['Lifts brow, cheeks, jawline', 'Non-surgical, no needles', 'Natural-looking definition', 'Single + series options'],
    suitableFor: ['Early jowls or soft jawline', 'Brow heaviness', 'Pre-event definition'],
    process: [
      { title: 'Assess', desc: 'Facial mapping sets lift targets.' },
      { title: 'Lift', desc: 'Targeted lifting session.' },
      { title: 'Review', desc: 'Follow-ups refine definition.' },
    ],
    expectedResults: 'Lifted, defined look building over weeks after sessions.',
    faqs: [
      { q: 'Is it painful?', a: 'Most clients describe warmth/pressure; comfort options are available.' },
      { q: 'How long do results last?', a: 'With maintenance, many clients enjoy months of definition.' },
    ],
  },
  {
    id: 'breast-tightening', parentId: 'dermatology', name: 'Breast Tightening',
    description: 'Consultation-led firming support plans.',
    overview: 'Breast Tightening at Healthy Home is consultation-led: private assessment plus firming support plans across care, posture and shaping guidance.',
    image: '/images/site/sub-breast-tight.jpg', duration: '30-45 min',
    benefits: ['Private consultation first', 'Firming support planning', 'Posture + care guidance', 'Respectful, discreet care'],
    suitableFor: ['Firmness concerns', 'Post-weight-change support', 'Guidance seekers'],
    process: [
      { title: 'Consult', desc: 'Private assessment and goals.' },
      { title: 'Plan', desc: 'Firming support plan written for you.' },
      { title: 'Support', desc: 'Follow-ups track comfort and firmness.' },
    ],
    expectedResults: 'A clear support plan with comfort goals tracked over visits.',
    faqs: [
      { q: 'Is it surgical?', a: 'No — consultation-led support plans and guidance only.' },
      { q: 'Is it private?', a: 'Yes — one-on-one, discreet consultations with female staff available.' },
    ],
  },
  {
    id: 'stretch-mark-removal', parentId: 'dermatology', name: 'Stretch Mark Removal',
    description: 'Fading and smoothing sessions for stretch marks.',
    overview: 'Stretch Mark Removal fades and smooths marks on abdomen, thighs, hips and arms through gentle resurfacing sessions matched to mark age and skin tone.',
    image: '/images/site/sub-stretch.jpg', duration: '30-60 min',
    benefits: ['Fades new + older marks', 'Smooths texture', 'Abdomen, thighs, hips, arms', 'Plan matched to skin tone'],
    suitableFor: ['Post-pregnancy marks', 'Post-weight-change marks', 'Texture concerns'],
    process: [
      { title: 'Assess', desc: 'Mark age, tone and texture reviewed.' },
      { title: 'Treat', desc: 'Resurfacing sessions per area.' },
      { title: 'Track', desc: 'Photos track fading over weeks.' },
    ],
    expectedResults: 'Progressive fading and smoothing across a series.',
    faqs: [
      { q: 'Do marks vanish fully?', a: 'Most marks fade significantly; your specialist sets honest expectations at consult.' },
      { q: 'Any downtime?', a: 'Minimal — mild redness typically settles quickly.' },
    ],
  },
  {
    id: 'chemical-peeling', parentId: 'dermatology', name: 'Chemical Peeling',
    description: 'Medical-grade peels for spots, scars and dullness.',
    overview: 'Chemical Peeling renews tone and texture: medical-grade peels lift spots, soften acne marks and brighten dullness — matched to your skin tone and calendar.',
    image: '/images/site/sub-peel.jpg', duration: '30-45 min',
    benefits: ['Fades spots + acne marks', 'Brightens dull tone', 'Smooths texture', 'Depth matched to schedule'],
    suitableFor: ['Spots and uneven tone', 'Acne marks', 'Dull, rough texture'],
    process: [
      { title: 'Prep', desc: 'Skin review sets peel depth.' },
      { title: 'Peel', desc: 'In-center peel application.' },
      { title: 'Recover', desc: 'Aftercare kit + check-in.' },
    ],
    expectedResults: 'Brighter, evener tone in days; deeper correction across a series.',
    faqs: [
      { q: 'Will I peel a lot?', a: 'Light peels flake 2–3 days; deeper peels up to a week — matched to your calendar.' },
      { q: 'Is it safe for my skin tone?', a: 'Yes — depth and formula are matched to your tone at consult.' },
    ],
  },
  {
    id: 'derma-consultation', parentId: 'dermatology', name: 'Derma Consultation',
    description: 'One-on-one skin analysis and treatment planning with our derma team.',
    overview: 'Derma Consultation is where every skin journey should start: analysis, honest recommendations and a written plan with exact sequencing — no pressure, no guesswork.',
    image: '/images/site/sub-derma.jpg', duration: '20-30 min',
    benefits: ['Full skin analysis', 'Written treatment plan', 'Honest sequencing + pricing'],
    suitableFor: ['First-time clients', 'Confused-by-options clients', 'Plan-before-spend seekers'],
    process: [
      { title: 'Analyze', desc: 'Skin type, concerns and history reviewed.' },
      { title: 'Plan', desc: 'Written sequence with honest pricing.' },
      { title: 'Begin', desc: 'Book your first service when ready.' },
    ],
    expectedResults: 'A clear written plan you can start immediately — or take home.',
    faqs: [
      { q: 'How much is a derma consultation?', a: 'It is a paid consultation — we confirm the fee and exactly what it covers before you book anything, with zero pressure to proceed.' },
      { q: 'How long?', a: 'About 20–30 minutes with a licensed specialist.' },
    ],
  },
  // ── Lab Tests (1) ──
  {
    id: 'whole-body-lab-test', parentId: 'lab-tests', name: 'Whole Body Lab Test',
    description: 'Comprehensive whole-body lab panel — the right start for any program.',
    overview: 'The Whole Body Lab Test is one comprehensive panel covering key health markers — reviewed by our care team with an actionable next-step plan that feeds directly into weight and skin programs.',
    image: '/images/site/sub-lab.jpg', duration: '30-45 min',
    benefits: ['Comprehensive whole-body panel', 'Clinician-reviewed results', 'Action plan included', 'Feeds any weight/skin plan'],
    suitableFor: ['Program starters', 'Yearly-baseline seekers', 'Fatigue/weight/skin concerns'],
    process: [
      { title: 'Sample', desc: 'Quick in-branch collection.' },
      { title: 'Analyze', desc: 'Certified lab processing.' },
      { title: 'Review', desc: 'Results walk-through + next steps.' },
    ],
    expectedResults: 'Clear baselines plus a written action plan within a few working days.',
    faqs: [
      { q: 'Do I need to fast?', a: 'Your branch confirms prep at booking — most panels need a short morning fast.' },
      { q: 'Where are results reviewed?', a: 'In-center or by phone with our care team, plus a written plan.' },
    ],
  },
];

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const getSubServices = (parentId: string) => subServices.filter(s => s.parentId === parentId);

export const getParent = (subId: string) => treatments.find(t => t.id === subServices.find(s => s.id === subId)?.parentId);

export const findSubBySlug = (parentId: string, slug: string) =>
  subServices.find(s => s.parentId === parentId && (s.id === slug || slugify(s.name) === slug));

export type Center = {
  id: string; name: string; address: string; city: string; state: string;
  phone?: string; email?: string; hours?: string; flagship?: boolean;
  /**
   * Announced but not yet trading. These are listed on the Locations page but
   * are excluded from the booking flow, so no appointment can be taken for a
   * branch that cannot serve it.
   */
  openingSoon?: boolean;
  /**
   * Google Maps rating and review count. Omit for branches with no listing —
   * the UI hides the row entirely rather than showing a placeholder.
   */
  rating?: number;
  reviews?: number;
  /** Badge shown on the locations card, e.g. 'Corporate' or 'Mini'. */
  tag?: string;
  /**
   * Restricts the services offered at this branch to these sub-service ids.
   * When set, the booking modal lists only these instead of the main services.
   */
  services?: string[];
  /** Overrides the default two-line "address / city, state" display with a single line. */
  locationLine?: string;
  /** Direct Google Maps link. Falls back to a search built from address + city. */
  mapUrl?: string;
};

export const centers: Center[] = [
  { id: 'thapathali', name: 'Healthy Home Thapathali (HO)', address: 'Thapathali', city: 'Kathmandu', state: 'Bagmati', locationLine: 'Thapathali, Kathmandu', mapUrl: 'https://maps.app.goo.gl/9ogCGPACohPJZCWbA', phone: '01-5335763', email: 'admin@healthyhome.com.np', hours: 'Sun-Fri 9am-6pm', rating: 5, reviews: 2, flagship: true, tag: 'Corporate' },
  { id: 'baneshwor', name: 'Healthy Home Baneshwor', address: 'Baneshwor', city: 'Kathmandu', state: 'Bagmati', locationLine: 'Mid-Baneshwor, Kathmandu', mapUrl: 'https://maps.app.goo.gl/q1rcc8DovmeFUEiR8', phone: '01-4590575', email: 'baneshwor@healthyhome.com.np', hours: 'Sun-Fri 9am-6pm', rating: 4.8, reviews: 180 },
  { id: 'jamal', name: 'Healthy Home Jamal', address: 'Jamal', city: 'Kathmandu', state: 'Bagmati', locationLine: 'Jamal, Kathmandu', mapUrl: 'https://maps.app.goo.gl/ZdxX8pigNibXbvBk9', phone: '01-5363219', email: 'jamal@healthyhome.com.np', hours: 'Sun-Fri 9am-6pm', rating: 4.8, reviews: 191 },
  { id: 'chhaya', name: 'Healthy Home Chhaya Center', address: 'Chhaya Center', city: 'Kathmandu', state: 'Bagmati', locationLine: 'Chhaya Center, Kathmandu', phone: '', hours: 'Sun-Fri 9am-6pm', tag: 'Mini', services: ['bca-testing', 'derma-consultation'] },
  { id: 'pulchowk', name: 'Healthy Home Pulchowk', address: 'Pulchowk', city: 'Lalitpur', state: 'Bagmati', locationLine: 'Pulchowk, Lalitpur', mapUrl: 'https://maps.app.goo.gl/b7iam55RMoTvcFMz8', phone: '01-5426677', hours: 'Sun-Fri 9am-7pm', rating: 4.9, reviews: 33, tag: 'Franchise' },
  { id: 'pokhara', name: 'Healthy Home Pokhara', address: 'Pokhara', city: 'Pokhara', state: 'Gandaki', locationLine: 'New Road, Pokhara', mapUrl: 'https://maps.app.goo.gl/cDmiLPMTT27QJ4rs6', phone: '061-573258', hours: 'Sun-Fri 9am-6pm', rating: 4.7, reviews: 90, tag: 'Franchise' },
  // ── Announced, not yet trading ──
  { id: 'bhaktapur', name: 'Healthy Home Bhaktapur', address: 'Radhe Radhe', city: 'Bhaktapur', state: 'Bagmati', locationLine: 'Radhe Radhe, Bhaktapur', tag: 'Opening Soon', openingSoon: true },
  { id: 'maharajgunj', name: 'Healthy Home Maharajgunj', address: 'Maharajgunj', city: 'Kathmandu', state: 'Bagmati', locationLine: 'Maharajgunj, Kathmandu', tag: 'Opening Soon', openingSoon: true },
];

/** Branches currently trading. Opening-soon branches are excluded. */
export const openCenters = centers.filter(c => !c.openingSoon);

/** Aggregate of the real per-branch Google metrics above. Branches with no
 *  listing (e.g. Chhaya) are excluded from the average but add 0 to the total. */
export const googleRating = (() => {
  const rated = centers.filter(c => typeof c.rating === 'number');
  const average = rated.reduce((s, c) => s + (c.rating ?? 0), 0) / (rated.length || 1);
  return {
    average: Number(average.toFixed(1)),
    total: centers.reduce((s, c) => s + (c.reviews ?? 0), 0),
    branchCount: rated.length,
  };
})();

/**
 * Real reviews, quoted verbatim from each branch's own Google Business Profile.
 * Do not hand-edit the wording — these are attributable to named people.
 * `branchId` links each review back to the listing it came from.
 */
export type Testimonial = {
  name: string;
  branch: string;
  branchId: string;
  treatment: string;
  rating: number;
  date: string;
  text: string;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Apekshya Giri', branch: 'Healthy Home Baneshwor', branchId: 'baneshwor',
    treatment: 'Dermatology', rating: 5, date: '2 months ago', image: '/images/site/avatar-2.jpg',
    text: 'I had an amazing experience with Dr Arnija Rana. I was there for my skin consultation. I was suffering from severe acne for 8 years, and nothing helped. But Dr Rana helped me with it and my skin cleared in 3 months. The results were really amazing. I had been to other dermatologist before as well but nothing worked. And I feel so much better and very confident about my skin now. It’s all thanks to her.',
  },
  {
    name: 'Kaushal Raj Gnyawali', branch: 'Healthy Home Jamal', branchId: 'jamal',
    treatment: 'Weight Management', rating: 5, date: '4 months ago', image: '/images/site/avatar-1.jpg',
    text: 'Really happy with my experience at Healthy Home Nepal Jamal Branch. I went from 91 kg to 79 kg in about one and a half months. The results speak for themselves. But what helped me the most was talking to the nurses. They are very kind, hardworking, and always there when you need them. The front desk staff are also very nice and professional, and the clinic is clean and well kept. They take feedback seriously and try to improve, which I liked a lot.',
  },
  {
    name: 'Arjun Bahadur Kshetri', branch: 'Healthy Home Pokhara', branchId: 'pokhara',
    treatment: 'Weight Management', rating: 5, date: 'a month ago', image: '/images/site/avatar-3.jpg',
    text: 'A heartfelt thanks to the entire Healthy Home Pokhara team for your guidance and support. I’m happy to have achieved a weight loss of almost 18.75 kg in just 14 sessions. Truly grateful for your dedication and encouragement throughout my journey!',
  },
  {
    name: 'ganesh rimal', branch: 'Healthy Home Jamal', branchId: 'jamal',
    treatment: 'Weight Management', rating: 5, date: 'a month ago', image: '/images/site/avatar-4.jpg',
    text: 'I had an excellent experience with Healthy Home. Their personalized diet plan, regular follow-ups, and constant motivation made my weight loss journey much easier. I successfully lost 7 kg in just one month, and I’m very happy with the results. The team is professional, supportive, and always available to guide me whenever I had questions.',
  },
  {
    name: 'prabal batajoo', branch: 'Healthy Home Baneshwor', branchId: 'baneshwor',
    treatment: 'Weight Management', rating: 4, date: '5 months ago', image: '/images/site/avatar-1.jpg',
    text: 'I previously weighed 94 kg, and after joining Healthy Home, I have successfully lost 12 kg. However, I would like to emphasize that joining alone does not guarantee weight loss—it truly requires strict discipline and commitment to a proper diet. The journey has been supported greatly by the staff, who are consistently polite, professional, and encouraging throughout the process.',
  },
  {
    name: 'Nick C', branch: 'Healthy Home Pulchowk', branchId: 'pulchowk',
    treatment: 'Weight Management + HydraFacial', rating: 5, date: '3 weeks ago', image: '/images/site/avatar-2.jpg',
    text: 'I’ve been coming here for a few months for the weight loss journey and hydrafacial. The staff here are exceptional. They are very kind, caring and very professional. I’ve never had an issue nor a bad experience and I will continue to support the business and the team. Thank you to the healthy home staff. You guys are now considered my family!',
  },
  {
    name: 'bijayata rai', branch: 'Healthy Home Jamal', branchId: 'jamal',
    treatment: 'Weight Management', rating: 5, date: '6 months ago', image: '/images/site/avatar-3.jpg',
    text: 'I am having a wonderful experience with this weight loss program, lost around 5 kg in 5 sessions. The program is well-structured, easy to follow, and truly effective. It not only helped me lose weight but also taught me healthier dietary habits that I can maintain long-term. What impressed me the most was the support from the staff.',
  },
  {
    name: 'Ganesh Gurung', branch: 'Healthy Home Pokhara', branchId: 'pokhara',
    treatment: 'Weight Management', rating: 5, date: '4 months ago', image: '/images/site/avatar-4.jpg',
    text: 'As an old guy with some mobility difficulty, I was getting overweight. Healthy Home Pokhara has provided the best service to lose weight. I lost about 9 kgs within one and half month. I highly recommend anyone who is looking to lose weight.',
  },
  {
    name: 'Shiva Makaju', branch: 'Healthy Home Baneshwor', branchId: 'baneshwor',
    treatment: 'Weight Management', rating: 5, date: '2 months ago', image: '/images/site/avatar-1.jpg',
    text: 'I had a great experience here. The place is in a prime and convenient location, making it easy to visit. From the moment I arrived, the staff were warm, courteous, and professional. The service was efficient, well-organized, and delivered with attention to detail. I also appreciated that they provided clear, accurate, and honest information about their services, which helped me make informed decisions without any confusion.',
  },
  {
    name: 'Prakriti Karki', branch: 'Healthy Home Pulchowk', branchId: 'pulchowk',
    treatment: 'Weight Management', rating: 5, date: 'a month ago', image: '/images/site/avatar-2.jpg',
    text: 'Healthy Home offers excellent weight loss services in a friendly and encouraging environment. The entire team is kind, knowledgeable, and always willing to help. They truly care about their clients and make every step of the journey comfortable. Highly recommended!',
  },
];

/* Products sold at the branch and online. This array is the single source of
   truth for /wellness-store: the category filter chips and the grid are both
   derived from it, so adding a product needs no other edits.

   Product photography lives in /public/images/store/ and is referenced by the
   `image` path below. Until a photo is added the card falls back to a neutral
   branded tile rather than a broken image, so a missing file never ships as a
   visible defect. */
export type Product = {
  id: string;
  name: string;
  /** Grouping shown as a filter chip, e.g. 'Wellness Teas'. */
  category: string;
  /** Price in NPR. Omit rather than guess if a price is not confirmed. */
  price?: number;
  /** Path under /public, e.g. '/images/store/green-tea.jpg'. */
  image: string;
  /** One or two plain sentences. No clinical claims. */
  blurb: string;
  /** Optional bullet points, e.g. ingredients or how to use. */
  details?: string[];
  /** Optional short label, e.g. 'Best Seller'. Only if genuinely true. */
  badge?: string;
  /** Set false to show as unavailable instead of hiding. Defaults to true. */
  inStock?: boolean;
};

/* TODO: add photography for each product to /public/images/store/ using the
   exact filenames below. */
export const products: Product[] = [
  {
    id: 'healthy-home-morning-tea',
    name: 'Healthy Home Morning Tea',
    category: 'Wellness Teas',
    price: 700,
    image: '/images/store/healthy-home-morning-tea.jpg',
    blurb: 'A refreshing herbal tea to support a healthy start to your day.',
    details: ['Morning wellness support', 'Refreshing herbal blend', 'Suitable for daily consumption'],
    badge: 'Morning Wellness',
  },
  {
    id: 'day-tea',
    name: 'Day Tea',
    category: 'Wellness Teas',
    price: 1000,
    image: '/images/store/day-tea.jpg',
    blurb: 'A balanced wellness tea crafted to keep you refreshed throughout the day.',
    details: ['Daytime wellness support', 'Refreshing herbal blend', 'Ideal for daily use'],
    badge: 'Daily Wellness',
  },
  {
    id: 'night-tea',
    name: 'Night Tea',
    category: 'Wellness Teas',
    price: 1500,
    image: '/images/store/night-tea.jpg',
    blurb: 'A calming herbal tea designed for a relaxing evening routine.',
    details: ['Evening wellness support', 'Calming herbal blend', 'Ideal for nighttime routines'],
    badge: 'Evening Wellness',
  },
  {
    id: 'nepalese-herbal-tea',
    name: 'Nepalese Herbal Tea (Decaffeinated)',
    category: 'Wellness Teas',
    price: 1200,
    image: '/images/store/nepalese-herbal-tea.jpg',
    blurb: 'A naturally caffeine-free herbal tea featuring the goodness of Nepalese herbs.',
    details: ['Decaffeinated', 'Nepalese herbal blend', 'Suitable for daily consumption'],
    badge: 'Decaffeinated',
  },
  {
    id: 'gastric-tea',
    name: 'Gastric Tea',
    category: 'Wellness Teas',
    price: 800,
    image: '/images/store/gastric-tea.jpg',
    blurb: 'A herbal tea formulated as part of a gentle wellness routine for digestive comfort.',
    details: ['Digestive wellness support', 'Herbal blend', 'Ideal for a mindful tea routine'],
    badge: 'Digestive Wellness',
  },
];

export const productCategories = [...new Set(products.map((p) => p.category))];

export const faqs = [
  { q: 'What does the consultation include?', a: 'Every consultation covers body/fat assessment, service mapping and honest pricing with zero pressure. Consults run 30-45 minutes and are billed separately — we confirm the fee with you before booking.' },
  { q: 'Who provides services at Healthy Home?', a: 'Our clinicians, wellness coaches and licensed aestheticians deliver every service under clinical direction. Every specialist completes 100+ hours of Healthy Home academy training. No trainees, ever.' },
  { q: 'Do you offer financing or memberships?', a: 'Yes - flexible payment plans from 0% APR, plus the Healthy Home Membership (Rs. 5,000/year) with 20% OFF on all services, 30% OFF on 1 annual package, bonus points, gifts and early access.' },
  { q: 'Which service should I start with?', a: 'Start with body goals (Weight Management), skin goals (Dermatology), or baselines (Lab Tests). Most plans combine two - your consult maps the right sequence.' },
  { q: 'How fast will I see results?', a: 'Lab tests give answers on day one, dermatology services glow in days, and weight programs typically show steady progress by weeks 3-4. Your coach sets milestones at your first visit.' },
];
