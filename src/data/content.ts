/* Every image path below comes from the central registry, so each photo can be
   swapped in one place without touching the other ones. See src/data/images.ts. */
import { IMG } from './images';

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
    overview: 'Weight Management at Healthy Home is a complete, clinician-guided journey: measure first with BCA testing, then follow a personalized mix of weight-loss or weight-gain coaching, CoolSculpting, body shaping, and at-home support. Every plan is non-extreme, trackable and supported across all 6 Nepal branches.',
    price: '', priceNote: '', duration: '30-60 min', downtime: 'None', results: 'Ongoing',
    image: IMG.treatment.weightManagement,
    benefits: ['Personalized plans from real body data', 'Non-invasive shaping options', 'Coaching + progress tracking', 'At-home package support', 'All 6 Nepal branches'],
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
    description: 'Dermatologist-led skin care from everyday glow to targeted correction — HydraFacial treatment, laser hair removal, tightening, lifting, stretch mark care, chemical peeling and derma consultation.',
    overview: 'Dermatology at Healthy Home covers the full skin journey: consultation and analysis first, then gentle non-invasive treatments matched to your skin type — glow facials, laser hair removal, tightening and lifting, stretch mark and scar care, and medical-grade peels.',
    price: '', priceNote: '', duration: '20-60 min', downtime: 'None', results: '2-4 weeks glow',
    image: IMG.treatment.dermatology,
    benefits: ['Derma consultation first', 'Non-invasive, no-downtime options', 'Plans for every skin type', 'Face + body coverage', 'Membership savings'],
    suitableFor: ['Dull, uneven or congested skin', 'Unwanted facial/body hair', 'Early laxity on face, neck or body', 'Stretch marks, spots or scars', 'Anyone wanting a skin plan'],
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
    image: IMG.treatment.labTests,
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

/* Sub-service copy.
 *
 * `description`, `overview` and `process` were imported from the live
 * healthyhome.com.np service pages (the "Overview"/"About" prose and the
 * "Our Method" steps, tidied for the web). The live site has no equivalent of
 * `duration`, `expectedResults` or `faqs` — nothing there to copy — so those
 * three still hold the original hand-written values and have never been
 * verified against healthyhome.com.np. Treat any clinical claim in those
 * fields as unsourced.
 *
 * `benefits` was also left alone: the live site only publishes a benefits list
 * for HydraFacial, so sourcing them per-service would mean inventing 15 of 16. */
export const subServices: SubService[] = [
  // ── Weight Management (7) ──
  {
    id: 'bca-testing', parentId: 'weight-management', name: 'BCA Testing',
    description: 'A precise, science-backed look at your body’s internal health — not just your weight.',
    overview: 'At Healthy Home, our Body Composition Analysis (BCA) Testing offers a precise, science-backed evaluation of your body’s internal health—not just your weight. Using an advanced Body Composition Analyzer (BCA) machine, we measure critical health parameters that provide a complete picture of your physical condition. Unlike traditional BMI tests that only consider height and weight, BCA testing delivers in-depth insights into how your body is structured and functioning, helping you make smarter decisions about your health, fitness, and lifestyle. We also provide advanced BMI (Body Mass Index) testing through the same state-of-the-art analyzer. This comprehensive assessment goes beyond traditional BMI measurements to give you a detailed insight into your body composition, including body fat percentage, muscle mass, hydration levels, and mineral content. By understanding these key health indicators, you gain a clear picture of your overall wellness, enabling you to make informed decisions about your fitness and weight management journey. Whether you are starting a new fitness plan, monitoring your progress, or simply curious about your body’s condition, this test serves as a scientific foundation for personalized health recommendations.',
    image: IMG.service.bcaTesting, duration: '20-30 min',
    benefits: ['Accurate muscle vs fat breakdown', 'Visceral-fat and water insights', 'Trackable progress baseline', 'Personalized targets from real data'],
    suitableFor: ['Anyone starting weight loss or gain', 'Clients stuck at a plateau', 'Coaching + shaping candidates'],
    process: [
      { title: 'Accurate Height & Weight Measurement', desc: 'Precise measurement of height and weight to calculate your BMI accurately for a clear health baseline.' },
      { title: 'Body Fat Percentage Analysis', desc: 'Advanced tools measure fat versus muscle ratio to provide deeper insight beyond BMI numbers.' },
      { title: 'Lifestyle & Health Evaluation', desc: 'Assessment of diet, activity, and medical history to contextualize BMI results and tailor recommendations.' },
      { title: 'Personalized Health Guidance', desc: 'Customized advice based on your BMI and overall health to guide weight management or wellness plans.' },
    ],
    expectedResults: 'A clear baseline report plus targets from day one; re-tests show measurable change within weeks.',
    faqs: [
      { q: 'Does it hurt?', a: 'No — the scan is completely non-invasive. You simply stand on the analyzer fully clothed.' },
      { q: 'How often should I re-test?', a: 'Most clients re-test every 4–6 weeks to track muscle and fat change.' },
    ],
  },
  {
    id: 'weight-loss', parentId: 'weight-management', name: 'Weight Loss',
    description: 'Coach-guided fat loss built on real body data — not crash diets or extreme workouts.',
    overview: 'Healthy Home’s weight loss program is designed for individuals seeking a healthier, more confident version of themselves without relying on crash diets or extreme workouts. Our approach focuses on natural, non-invasive methods that promote effective fat loss, muscle toning, improved metabolism, and visible inch loss through advanced body shaping and targeted fat loss treatments. Through expert consultations, personalized diet plans, and supportive therapies, we address the root causes of weight gain, including hormonal imbalances, stress, poor lifestyle habits, and slow metabolic function. Instead of temporary fixes, our program works on correcting internal imbalances to deliver consistent and sustainable progress—an approach widely supported by global health authorities like the WHO, which emphasizes long-term lifestyle-based weight management.',
    image: IMG.service.weightLoss, duration: '45-60 min',
    benefits: ['Personalized nutrition targets', 'Activity + habit coaching', 'Regular weigh-ins and BCA reviews', 'Non-extreme, sustainable pace'],
    suitableFor: ['Adults wanting steady fat loss', 'Post-assessment coaching candidates', 'Home-package companions'],
    process: [
      { title: 'Body Composition Analysis', desc: 'Detailed assessment of fat, muscle, and water to tailor your weight loss program precisely to your body’s needs.' },
      { title: 'Fat-Melting Therapy', desc: 'Non-invasive treatment targeting stubborn fat cells to break them down and aid natural elimination by the body.' },
      { title: 'Inch Loss Treatment', desc: 'Specialized techniques focused on reducing body circumference in key areas like belly, thighs, and arms for visible shaping.' },
      { title: 'Detox & Metabolism Boost', desc: 'Natural detox therapies and herbal teas cleanse your system and enhance metabolism for faster, healthier weight loss.' },
      { title: 'Nutrition & Lifestyle Coaching', desc: 'Personalized guidance on diet and habits to create sustainable changes that complement treatments and prevent weight regain.' },
      { title: 'Regular Progress Tracking', desc: 'Weekly evaluations ensure your plan’s effectiveness and allow adjustments to keep your weight loss steady and on target.' },
    ],
    expectedResults: 'Steady, trackable loss from weeks 3–4, with coaching milestones along the way.',
    faqs: [
      { q: 'How fast will I see results?', a: 'Most clients see steady progress by weeks 3–4, with bigger change over 12 weeks.' },
      { q: 'Is diet extreme?', a: 'No — plans fit Nepali meals and daily routine, with coaching not restriction.' },
    ],
  },
  {
    id: 'coolsculpting', parentId: 'weight-management', name: 'CoolSculpting',
    description: 'Non-invasive body contouring that freezes and permanently eliminates stubborn fat cells.',
    overview: 'CoolSculpting at Healthy Home is a clinically proven, non-invasive fat reduction treatment that uses advanced controlled cooling (Cryolipolysis) technology to target and permanently eliminate stubborn fat cells. This FDA-cleared fat-freezing procedure is designed to contour the body safely and effectively—without surgery, needles, anesthesia, or downtime. CoolSculpting works by freezing fat cells in targeted areas, causing them to break down and be naturally eliminated by the body over time. Unlike traditional weight-loss methods that only shrink fat cells, this treatment permanently destroys fat cells, leading to long-lasting and natural-looking body contouring results. With no downtime, minimal discomfort, and visible results over time, CoolSculpting has become one of the most popular non-surgical body contouring solutions worldwide. At Healthy Home, each treatment is customized to your body goals, ensuring safe, effective, and aesthetically pleasing results. If you’re looking for a surgery-free way to sculpt your body and reduce stubborn fat, CoolSculpting offers a scientifically backed, long-term solution.',
    image: IMG.service.coolsculpting, duration: '35-60 min',
    benefits: ['Targets stubborn fat pockets', 'Non-invasive, no anesthesia', 'No downtime', 'Pairs with coaching + BCA tracking'],
    suitableFor: ['Clients near goal weight with stubborn areas', 'Non-surgical shaping seekers', 'Coaching-program companions'],
    process: [
      { title: 'Targeted Fat Freezing', desc: 'Precisely cools stubborn fat cells in problem areas without harming surrounding tissues for effective fat reduction.' },
      { title: 'Natural Fat Elimination', desc: 'Body gradually processes and removes frozen fat cells over weeks, resulting in lasting contour improvement.' },
      { title: 'Non-Invasive Treatment', desc: 'No surgery or needles involved—safe, painless, and requires no downtime for quick recovery.' },
      { title: 'Customized Treatment Plans', desc: 'Personalized sessions designed to target specific areas based on individual body shape and fat distribution.' },
    ],
    expectedResults: 'Visible contour refinement over 4–12 weeks as treated fat cells are naturally cleared.',
    faqs: [
      { q: 'Does it hurt?', a: 'Most clients feel intense cold then numbness; sessions are well tolerated.' },
      { q: 'How many sessions?', a: 'Your specialist maps cycles at consult — many clients start with 1–2 per area.' },
    ],
  },
  {
    id: 'breast-reduction-wm', parentId: 'weight-management', name: 'Breast Reduction',
    description: 'A natural, non-surgical approach to reducing breast size and improving comfort.',
    overview: 'Breast Reduction at Healthy Home offers a natural, non-surgical approach to reducing breast size and improving comfort. Large or heavy breasts can often lead to physical discomfort, poor posture, and self-consciousness. Our treatment focuses on breaking down excess fat tissues using advanced non-invasive technology combined with therapeutic techniques similar to our body shaping and skin tightening programs. This safe and personalized method helps in reshaping and firming the breast area without any surgical intervention, scarring, or downtime. Ideal for those seeking relief from back or shoulder pain or simply aiming for a more proportionate body shape, our program promotes both physical ease and body confidence. For clients seeking overall transformation, this treatment can also be combined with our non-invasive weight loss solutions or a customized weight loss home package for enhanced results.',
    image: IMG.service.breastReduction, duration: '45-60 min',
    benefits: ['Private consultation first', 'Weight + posture review', 'Shaping and support planning', 'Clear referral guidance if needed'],
    suitableFor: ['Clients seeking reduction guidance', 'Posture/back-comfort concerns', 'Weight-linked support candidates'],
    process: [
      { title: 'Fat Dissolving Therapy', desc: 'Non-invasive treatments target and break down excess fat in the breast area to reduce volume naturally.' },
      { title: 'Skin Firming Techniques', desc: 'Stimulates collagen to tighten skin and improve breast shape without surgery or scarring.' },
      { title: 'Lymphatic Drainage Massage', desc: 'Promotes fluid removal and reduces swelling, enhancing comfort and contour after treatment.' },
      { title: 'Personalized Care Plans', desc: 'Customized programs designed to meet individual needs and ensure safe, effective breast reduction results.' },
    ],
    expectedResults: 'A clear, respectful plan with comfort and proportion goals tracked over visits.',
    faqs: [
      { q: 'Is this surgery?', a: 'No — Healthy Home provides consultation-led support plans and guidance, not surgery.' },
      { q: 'Is it private?', a: 'Yes — one-on-one consultations in a private room, with female staff available.' },
    ],
  },
  {
    id: 'body-shaping', parentId: 'weight-management', name: 'Body Shaping',
    description: 'Sculpt and refine specific areas of the body for a more toned, contoured appearance.',
    overview: 'Healthy Home’s Body Shaping Treatment is designed to sculpt and refine specific areas of the body for a more toned and contoured appearance. Unlike general weight loss, this treatment targets localized fat deposits in areas such as the abdomen, thighs, and arms, helping you achieve a more defined body shape. Utilizing advanced, non-invasive technology, our painless and side-effect-free approach effectively breaks down stubborn fat, delivering visible results within just a few sessions. Whether you’re looking to enhance your natural curves or achieve a more balanced physique, our customized treatments help you reach your body goals with precision and ease.',
    image: IMG.service.bodyShaping, duration: '30-60 min',
    benefits: ['Targets abdomen, arms, thighs', 'Toning + definition focus', 'No downtime', 'Stacks with weight-loss coaching'],
    suitableFor: ['Post-loss toning', 'Event-ready definition', 'Coaching companions'],
    process: [
      { title: 'Targeted Fat Reduction', desc: 'Non-invasive techniques focus on melting stubborn fat deposits to sculpt and slim specific body areas effectively.' },
      { title: 'Skin Tightening Technology', desc: 'Uses radiofrequency and ultrasound to stimulate collagen production, improving skin firmness and elasticity.' },
      { title: 'Muscle Toning Therapy', desc: 'Advanced treatments help strengthen and define muscles for a more toned and contoured appearance.' },
      { title: 'Customized Treatment Plans', desc: 'Personalized programs tailored to your body type and goals for optimal shaping results.' },
      { title: 'Nutritional Guidance', desc: 'Dietary advice supports fat loss and muscle toning, enhancing overall body shaping effects.' },
      { title: 'Regular Progress Monitoring', desc: 'Continuous assessments to track changes and adjust treatment plans for maximum effectiveness.' },
    ],
    expectedResults: 'Firmer, more defined contours over a short series, maintained with coaching.',
    faqs: [
      { q: 'How many sessions?', a: 'Most plans run a short series — your specialist maps count at consult.' },
      { q: 'Any downtime?', a: 'None — return to routine immediately after sessions.' },
    ],
  },
  {
    id: 'weight-gain', parentId: 'weight-management', name: 'Weight Gain',
    description: 'Healthy, balanced weight gain through safe, natural, muscle-first methods.',
    overview: 'Healthy Home’s Weight Gain program is designed to help individuals achieve a healthy and balanced increase in body weight through safe and natural methods. Whether you struggle with low appetite, metabolic issues, or underlying health concerns, our customized approach focuses on building lean muscle mass and improving overall nutrition. We combine expert guidance, specialized therapies, and lifestyle modifications to ensure gradual and sustainable weight gain. This program not only enhances your physique but also boosts energy levels and supports overall well-being, helping you gain weight in a healthy and controlled manner.',
    image: IMG.service.weightGain, duration: '45-60 min',
    benefits: ['Muscle-first gain targets', 'Nutrition surplus planning', 'Strength guidance', 'BCA-tracked progress'],
    suitableFor: ['Underweight adults', 'Muscle-building beginners', 'Post-illness recovery support'],
    process: [
      { title: 'Nutritional Counseling', desc: 'Personalized diet plans to increase calorie intake healthily, focusing on balanced nutrition and muscle-building foods.' },
      { title: 'High-Calorie Formula', desc: 'Rich blend of nutrients designed to help increase daily calorie intake for effective weight gain.' },
      { title: 'Easily Digestible', desc: 'Formulated for optimal absorption, minimizing digestive discomfort and maximizing nutrient uptake.' },
      { title: 'Convenient Usage', desc: 'Simple preparation for daily consumption, making it easy to incorporate into your routine.' },
    ],
    expectedResults: 'Steady, healthy gain focused on muscle, reviewed every few weeks.',
    faqs: [
      { q: 'Will I just gain fat?', a: 'No — plans target muscle-first gain with BCA tracking to prove it.' },
      { q: 'Do I need a gym?', a: 'No — strength guidance adapts to home or gym routines.' },
    ],
  },
  {
    id: 'weight-loss-home-package', parentId: 'weight-management', name: 'Weight Loss Home Package',
    description: 'A curated diet plan and product mix for safe, sustainable weight loss — from the comfort of home.',
    overview: 'At Healthy Home, we believe that distance should never hinder your journey to achieving your fitness goals. That’s why we offer the Weight Loss Home Package, a comprehensive solution designed for clients who want to lose weight effectively from the comfort of their own homes. This package includes a carefully curated weight loss diet plan, along with our premium Healthy Home products, all designed to support healthy and sustainable weight loss. By combining expert guidance with our Non-Surgical Body Shaping services, this package allows clients to achieve an average of 3–5 kg weight loss per month. Whether you’re looking to shed those extra pounds or simply want to embrace a healthier lifestyle, our Weight Loss Home Package offers all the tools you need to succeed in the comfort of your home, providing the guidance, personalized care and support you need. For improving skin elasticity and overall appearance during your weight loss journey, you may benefit from our Skin Tightening Treatment, which helps maintain firm and youthful-looking skin conveniently from your home. To ensure your health is fully supported, consider a Derma Consultation alongside your package — our experts can provide personalized guidance to address skin concerns, ensuring your weight loss journey is safe, effective, and holistic.',
    image: IMG.service.weightLossHomePackage, duration: 'Home-based',
    benefits: ['At-home teas + guides', 'Remote coaching check-ins', 'Meal frameworks that fit Nepali kitchens', 'In-center BCA reviews'],
    suitableFor: ['Busy professionals', 'Clients outside Kathmandu Valley', 'Coaching-program companions'],
    process: [
      { title: 'Customized Diet Plans', desc: 'Personalized nutrition guidance designed to suit your lifestyle and promote effective, healthy weight loss at home.' },
      { title: 'Herbal & Natural Product Mix', desc: 'A carefully crafted blend of herbal and natural supplements designed to boost metabolism and support safe weight loss.' },
      { title: 'Green Tea Support', desc: 'Rich in antioxidants, green tea enhances fat burning and detoxification naturally, helping you shed pounds gently.' },
      { title: 'Time-Based Supplement Schedule', desc: 'Products are taken at specific times to maximize absorption and effectiveness throughout the day.' },
      { title: 'Regular Follow-Ups', desc: 'Consistent check-ins to monitor progress, adjust the plan, and ensure steady, sustainable weight loss results.' },
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
    description: 'Vortex technology that deep-cleanses, exfoliates, extracts and hydrates — instant glow, no downtime.',
    overview: 'Healthy Home’s HydraFacial Treatment is a non-invasive skincare solution designed to deeply cleanse, exfoliate, and hydrate the skin. Using advanced vortex technology, this treatment effectively removes dead skin cells, unclogs pores, and infuses the skin with nourishing serums tailored to your specific needs. Whether you’re dealing with dryness, dullness, or uneven skin tone, our HydraFacial delivers instant, visible results, leaving your skin refreshed, smooth, and glowing. Unlike traditional facials, HydraFacial provides instant results with no downtime, making it a safe and effective solution for all skin types, including sensitive skin.',
    image: IMG.service.hydrafacial, duration: '30-45 min',
    benefits: ['Instant glow, zero downtime', 'Clears congestion gently', 'Hydrates and evens tone', 'Safe before events'],
    suitableFor: ['Dull or congested skin', 'Pre-event glow', 'First-time facial clients'],
    process: [
      { title: 'Deep Cleansing', desc: 'Gently removes dirt, oil, and impurities from the skin’s surface for a fresh, clean base.' },
      { title: 'Exfoliation', desc: 'Uses gentle abrasion to slough off dead skin cells, revealing smoother, brighter skin underneath.' },
      { title: 'Pore Extraction', desc: 'Pain-free vacuum technology clears clogged pores and removes blackheads and debris.' },
      { title: 'Hydration Infusion', desc: 'Delivers nourishing serums packed with antioxidants, peptides, and hyaluronic acid to deeply hydrate and protect skin.' },
      { title: 'Skin Protection', desc: 'Antioxidants and peptides help strengthen skin’s barrier and combat environmental damage.' },
      { title: 'Custom Serum Application', desc: 'Tailored serums address specific skin concerns such as acne, pigmentation, or aging for targeted results.' },
    ],
    expectedResults: 'Camera-ready glow immediately; tone and texture improve over a short series.',
    faqs: [
      { q: 'Any downtime?', a: 'None — most clients return to routine immediately.' },
      { q: 'How often?', a: 'Monthly for maintenance; your specialist maps frequency at consult.' },
    ],
  },
  {
    id: 'laser-hair-removal', parentId: 'dermatology', name: 'Laser Hair Removal',
    description: 'Medical-grade diode laser that targets follicles for long-lasting reduction on all skin types.',
    overview: 'Laser Hair Reduction at Healthy Home is a safe and effective solution to permanently reduce unwanted hair from different parts of the body. Using advanced medical-grade laser technology, the treatment precisely targets hair follicles to inhibit future hair growth while protecting the surrounding skin. This non-invasive procedure is suitable for all skin tones and hair types, offering a long-lasting, convenient and pain-free alternative to traditional hair removal methods such as waxing, shaving, or threading. With minimal discomfort and no downtime, our customized laser sessions help you achieve smooth, hair-free skin across face and body areas — boosting confidence and saving valuable time in your daily grooming routine.',
    image: IMG.service.laserHairRemoval, duration: '15-45 min',
    benefits: ['Lasting hair reduction', 'Face + body areas', 'Settings matched to skin tone', 'Quick sessions'],
    suitableFor: ['Unwanted facial/body hair', 'Shaving/waxing alternatives', 'Maintenance seekers'],
    process: [
      { title: 'Advanced Diode Laser Technology', desc: 'Uses the latest diode laser for deeper, faster, and more effective hair follicle targeting with minimal discomfort.' },
      { title: 'Skin Cooling System', desc: 'Integrated cooling minimizes pain and protects skin during treatment for a comfortable experience.' },
      { title: 'Multi-Session Treatment Plan', desc: 'Customized schedule ensures gradual, permanent hair reduction by targeting hair in different growth cycles.' },
      { title: 'Suitable for All Skin Types', desc: 'New technology safely treats a wide range of skin tones, providing effective results for everyone.' },
      { title: 'Precision Targeting', desc: 'Handheld device allows precise treatment of small or sensitive areas for tailored hair removal.' },
      { title: 'No Downtime Recovery', desc: 'Non-invasive procedure with minimal redness, allowing clients to resume daily activities immediately.' },
    ],
    expectedResults: 'Progressive reduction over a series; maintenance keeps areas smooth.',
    faqs: [
      { q: 'Does it hurt?', a: 'Most clients feel brief warmth/snapping; cooling keeps sessions comfortable.' },
      { q: 'How many sessions?', a: 'Typically a series — your specialist maps count and spacing at consult.' },
    ],
  },
  {
    id: 'skin-tightening', parentId: 'dermatology', name: 'Skin Tightening',
    description: 'Radiofrequency and ultrasound that tighten loose skin and boost collagen — no surgery, no downtime.',
    overview: 'As we age, our skin naturally loses its firmness and elasticity due to the breakdown of collagen and elastin—two essential proteins that keep the skin tight and youthful. At Healthy Home, we offer a non-invasive Skin Tightening Treatment using advanced Radiofrequency (RF) technology, designed to lift, tone, and rejuvenate your skin without the need for surgery or downtime. Our clinically proven RF treatment gently heats the deeper layers of your skin, stimulating collagen and elastin production, which helps tighten loose skin, smooth out fine lines and wrinkles, and enhance overall skin tone. Whether you’re targeting sagging around the eyes, cheeks, jawline, or body areas like the abdomen, thighs, or arms, our customized RF sessions can bring back a firm and refreshed appearance. This treatment is ideal for those seeking a natural, safe, and long-lasting solution to aging or loose skin—without needles, scars, or recovery time.',
    image: IMG.service.skinTightening, duration: '30-60 min',
    benefits: ['Firms face, neck + body', 'Non-invasive, no downtime', 'Gradual natural-looking firmness', 'Pairs with facials + lifting'],
    suitableFor: ['Early laxity concerns', 'Post-weight-loss firming', 'Maintenance seekers'],
    process: [
      { title: 'Radiofrequency Therapy', desc: 'Uses controlled radiofrequency waves to heat deep skin layers, stimulating collagen and elastin for firmer skin.' },
      { title: 'Ultrasound Treatment', desc: 'Focused ultrasound energy penetrates deep tissues, promoting natural skin tightening and lifting effects without surgery.' },
      { title: 'Collagen Boost Stimulation', desc: 'Activates the skin’s natural collagen production to restore elasticity and reduce wrinkles over time.' },
      { title: 'Non-Invasive Procedure', desc: 'Safe, painless treatments that require no downtime, making it convenient for all lifestyles.' },
      { title: 'Targeted Treatment Areas', desc: 'Customizable to address loose skin on face, neck, arms, abdomen, and other body parts.' },
      { title: 'Regular Follow-Up Sessions', desc: 'Periodic treatments ensure lasting results by maintaining collagen levels and skin firmness.' },
    ],
    expectedResults: 'Gradual firmness over weeks, improving across a short series.',
    faqs: [
      { q: 'Any downtime?', a: 'None — mild warmth fades within hours for most clients.' },
      { q: 'How many sessions?', a: 'Most plans run a short series; mapped at consult.' },
    ],
  },
  {
    id: 'face-lifting', parentId: 'dermatology', name: 'Face Lifting',
    description: 'Non-surgical lifting for brow, cheeks, jawline and neck — definition without needles or downtime.',
    overview: 'At Healthy Home, we believe facial rejuvenation should be natural, safe, and non-invasive. Our Facelifting Treatment is designed to enhance your facial features and restore youthful skin without surgery or downtime. Using a powerful combination of Radiofrequency (RF) technology and vacuum therapy, this treatment lifts, tones, and redefines your facial structure while promoting healthy skin regeneration from within. The goal is to stimulate collagen and elastin production, improve skin elasticity, and enhance facial contour—all without the use of chemicals or invasive techniques. Whether you’re concerned about sagging skin, dullness, or early signs of aging, our facelifting solution helps you achieve a refreshed, youthful glow through science-backed methods and personalized care.',
    image: IMG.service.faceLifting, duration: '45-60 min',
    benefits: ['Lifts brow, cheeks, jawline', 'Non-surgical, no needles', 'Natural-looking definition', 'Single + series options'],
    suitableFor: ['Early jowls or soft jawline', 'Brow heaviness', 'Pre-event definition'],
    process: [
      { title: 'Radiofrequency Tightening', desc: 'Uses radiofrequency energy to stimulate collagen, tighten skin, and lift facial contours naturally.' },
      { title: 'Collagen Induction Therapy', desc: 'Enhances skin firmness by boosting collagen and elastin production through micro-channeling techniques.' },
      { title: 'Skin Firming Massage', desc: 'Manual or machine-assisted lifting massage improves blood flow and promotes tighter, lifted skin.' },
      { title: 'Jawline & Cheek Sculpting', desc: 'Non-invasive contouring techniques target sagging areas to define jawline and lift cheeks.' },
    ],
    expectedResults: 'Lifted, defined look building over weeks after sessions.',
    faqs: [
      { q: 'Is it painful?', a: 'Most clients describe warmth/pressure; comfort options are available.' },
      { q: 'How long do results last?', a: 'With maintenance, many clients enjoy months of definition.' },
    ],
  },
  {
    id: 'breast-tightening', parentId: 'dermatology', name: 'Breast Tightening',
    description: 'Consultation-led firming and lifting for sagging breast tissue — a safe alternative to surgery.',
    overview: 'Breast Tightening at Healthy Home is a non-invasive treatment designed to firm and lift sagging breast tissue, restoring a youthful and toned appearance. Using advanced technologies like radiofrequency and ultrasound, this procedure stimulates collagen production to enhance skin elasticity and improve breast contour. Ideal for women experiencing mild sagging due to aging, weight changes, or post-pregnancy effects, breast tightening offers a safe alternative to surgery without downtime or scars. Our personalized approach helps improve breast firmness and boosts confidence with natural-looking results.',
    image: IMG.service.breastTightening, duration: '30-45 min',
    benefits: ['Private consultation first', 'Firming support planning', 'Posture + care guidance', 'Respectful, discreet care'],
    suitableFor: ['Firmness concerns', 'Post-weight-change support', 'Guidance seekers'],
    process: [
      { title: 'Lipolysis Therapy', desc: 'Non-invasive fat melting technology targets excess fat and firms the breast area naturally.' },
      { title: 'Skin Tightening Radiofrequency', desc: 'Stimulates collagen production using RF energy to tighten loose skin and improve breast contour.' },
      { title: 'Vacuum Lifting Technique', desc: 'Applies suction to tone underlying tissues and enhance firmness without surgery.' },
      { title: 'Customized Firming Protocol', desc: 'Treatment plans tailored to breast shape and skin condition for optimal tightening results.' },
    ],
    expectedResults: 'A clear support plan with comfort goals tracked over visits.',
    faqs: [
      { q: 'Is it surgical?', a: 'No — consultation-led support plans and guidance only.' },
      { q: 'Is it private?', a: 'Yes — one-on-one, discreet consultations with female staff available.' },
    ],
  },
  {
    id: 'stretch-mark-removal', parentId: 'dermatology', name: 'Stretch Mark Removal',
    description: 'Radiofrequency and microneedling that fade stretch marks and smooth skin texture.',
    overview: 'At Healthy Home, we offer an advanced Stretch Mark Removal Treatment that uses Radio Frequency (RF) technology combined with specialized topical creams to effectively reduce the appearance of stretch marks. Stretch marks often develop due to rapid skin stretching, commonly during pregnancy, weight fluctuations, or growth spurts, and can affect confidence. Our treatment is designed to regenerate the skin and diminish the appearance of these marks with non-invasive, safe, and effective methods. Using RF technology, we stimulate the skin’s natural healing process, encouraging collagen and elastin production. This leads to improved skin texture, firmness, and elasticity, gradually reducing the visibility of stretch marks. By combining this technology with nourishing creams, our treatment provides a comprehensive solution for smoother, clearer skin.',
    image: IMG.service.stretchMarkRemoval, duration: '30-60 min',
    benefits: ['Fades new + older marks', 'Smooths texture', 'Abdomen, thighs, hips, arms', 'Plan matched to skin tone'],
    suitableFor: ['Post-pregnancy marks', 'Post-weight-change marks', 'Texture concerns'],
    process: [
      { title: 'Radiofrequency Therapy', desc: 'Uses heat energy to stimulate collagen and elastin, improving skin texture and reducing stretch mark visibility.' },
      { title: 'Microneedling Treatment', desc: 'Creates micro-injuries to trigger skin repair, boosting collagen production and smoothing stretch marks over time.' },
      { title: 'Customized Skin Repair Plan', desc: 'Tailored treatments based on skin type, mark depth, and duration for optimal stretch mark fading.' },
    ],
    expectedResults: 'Progressive fading and smoothing across a series.',
    faqs: [
      { q: 'Do marks vanish fully?', a: 'Most marks fade significantly; your specialist sets honest expectations at consult.' },
      { q: 'Any downtime?', a: 'Minimal — mild redness typically settles quickly.' },
    ],
  },
  {
    id: 'chemical-peeling', parentId: 'dermatology', name: 'Chemical Peeling',
    description: 'Medical-grade peels for spots, acne scars, pigmentation and uneven tone.',
    overview: 'Chemical Peeling at Healthy Home is a skin rejuvenation treatment that uses specially formulated solutions to exfoliate and remove dead skin cells, revealing smoother, brighter, and healthier skin underneath. This procedure helps reduce acne scars, pigmentation, fine lines, and uneven skin tone. Suitable for various skin types, chemical peels stimulate skin renewal by encouraging collagen production and improving texture. Whether you want to address specific skin concerns or simply refresh your complexion, this safe and effective treatment offers noticeable results with minimal downtime.',
    image: IMG.service.chemicalPeeling, duration: '30-45 min',
    benefits: ['Fades spots + acne marks', 'Brightens dull tone', 'Smooths texture', 'Depth matched to schedule'],
    suitableFor: ['Spots and uneven tone', 'Acne marks', 'Dull, rough texture'],
    process: [
      { title: 'Superficial Peels', desc: 'Gentle exfoliation using mild acids to treat dull skin, uneven tone, and mild pigmentation.' },
      { title: 'Medium Depth Peels', desc: 'Targets deeper layers to reduce acne scars, fine lines, and uneven texture effectively.' },
      { title: 'Acne Control Peels', desc: 'Formulated with salicylic or glycolic acids to clear clogged pores and reduce active acne.' },
      { title: 'Anti-Pigmentation Peels', desc: 'Designed to lighten dark spots, melasma, and sun damage for a more even skin tone.' },
      { title: 'Brightening & Glow Peels', desc: 'Refreshes the skin with radiance-boosting ingredients, leaving it smoother and glowing.' },
      { title: 'Customized Peel Plans', desc: 'Peels are chosen based on skin type, concern, and sensitivity for safe and visible results.' },
      { title: 'Derma Infusion', desc: 'Delivers active serums deep into the skin to hydrate, heal, and lighten stretch marks effectively.' },
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
    overview: 'At Healthy Home, we offer expert Derma Consultation Services to help you achieve healthy, glowing skin. Whether you’re struggling with acne, pigmentation, signs of aging, or other skin concerns, our experienced dermatologists are here to guide you with personalized, effective solutions. During your consultation, our professionals conduct a thorough skin analysis to assess your skin type, identify underlying issues, and recommend the most suitable treatments for your unique needs. We take a holistic approach, considering not only in-clinic treatments but also at-home skincare regimens and lifestyle changes to promote long-term skin health.',
    image: IMG.service.dermaConsultation, duration: '20-30 min',
    benefits: ['Full skin analysis', 'Written treatment plan', 'Honest sequencing + pricing'],
    suitableFor: ['First-time clients', 'Confused-by-options clients', 'Plan-before-spend seekers'],
    process: [
      { title: 'Skin Analysis with Expert', desc: 'In-depth examination by a skin specialist to understand your skin type, concerns, and underlying conditions.' },
      { title: 'Personalized Treatment Planning', desc: 'Customized skincare and treatment roadmap designed to match your specific skin needs and goals.' },
      { title: 'Product Guidance', desc: 'Recommendations on suitable skincare products to support your treatment and maintain long-term skin health.' },
      { title: 'Progress Monitoring', desc: 'Regular follow-ups to assess improvements, make adjustments, and ensure visible, lasting results.' },
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
    description: 'A comprehensive health screening panel with expert interpretation and a personalized action plan.',
    overview: 'Whole Body Lab Test at Healthy Home offers a comprehensive health screening to assess your overall wellness and detect potential issues early. This extensive panel includes tests for blood sugar, cholesterol, liver and kidney function, hormones, vitamins, and more. Our detailed analysis helps identify imbalances or deficiencies that may affect your health and vitality. With expert interpretation of results, we provide personalized recommendations to address any concerns and guide you toward optimal well-being. Regular whole body testing empowers you to take proactive steps for a healthier life.',
    image: IMG.service.wholeBodyLabTest, duration: '30-45 min',
    benefits: ['Comprehensive whole-body panel', 'Clinician-reviewed results', 'Action plan included', 'Feeds any weight/skin plan'],
    suitableFor: ['Program starters', 'Yearly-baseline seekers', 'Fatigue/weight/skin concerns'],
    process: [
      { title: 'Comprehensive Health Screening', desc: 'Covers major body systems including liver, kidney, thyroid, lipid, sugar, and vitamin levels for a full health profile.' },
      { title: 'Accurate Diagnostic Reports', desc: 'Tests conducted through certified labs ensure precise and reliable results you can trust.' },
      { title: 'Early Detection Support', desc: 'Helps identify potential health risks early, enabling timely lifestyle or medical interventions.' },
      { title: 'Expert Review & Guidance', desc: 'Our in-house consultant reviews your reports and offers personalized advice for improved health and wellness.' },
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
   * Trading normally, but does not take appointments. The head office is a
   * corporate/academy site rather than a patient-facing clinic, so it is still
   * listed on the Locations page but is shown greyed out and unselectable in
   * the booking flow. This is separate from `openingSoon`: that flag means the
   * branch does not exist yet, this one means it does but cannot serve patients.
   */
  noBooking?: boolean;
  /** Shown in place of the service summary on a branch that can't be booked. */
  noBookingNote?: string;
  /**
   * Google Maps rating and review count. Omit for branches with no listing —
   * the UI hides the row entirely rather than showing a placeholder.
   */
  rating?: number;
  reviews?: number;
  /** Badge shown on the locations card, e.g. 'Corporate' or 'Mini'. */
  tag?: string;
  /**
   * Optional branch photo for the location card. No branch has one yet, so the
   * card draws a branded initials tile instead — it never shows a broken image.
   * Add the file under public/images/branches/, register it in the image
   * registry (one key per placement, as that file requires), then set it here.
   */
  img?: string;
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
  { id: 'thapathali', name: 'Healthy Home Thapathali (HO)', address: 'Thapathali', city: 'Kathmandu', state: 'Bagmati', locationLine: 'Thapathali, Kathmandu', mapUrl: 'https://maps.app.goo.gl/9ogCGPACohPJZCWbA', phone: '01-5335763', email: 'admin@healthyhome.com.np', hours: 'Sun-Fri 9am-6pm', rating: 5, reviews: 2, flagship: true, tag: 'Corporate', noBooking: true, noBookingNote: 'Head office — appointments not taken here' },
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

/**
 * Branches a visitor can actually book at: trading, and patient-facing.
 * Excludes opening-soon branches and any flagged `noBooking` (the head office).
 */
export const bookableCenters = openCenters.filter(c => !c.noBooking);

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
    treatment: 'Dermatology', rating: 5, date: '2 months ago', image: IMG.review.apekshyaGiri,
    text: 'I had an amazing experience with Dr Arnija Rana. I was there for my skin consultation. I was suffering from severe acne for 8 years, and nothing helped. But Dr Rana helped me with it and my skin cleared in 3 months. The results were really amazing. I had been to other dermatologist before as well but nothing worked. And I feel so much better and very confident about my skin now. It’s all thanks to her.',
  },
  {
    name: 'Kaushal Raj Gnyawali', branch: 'Healthy Home Jamal', branchId: 'jamal',
    treatment: 'Weight Management', rating: 5, date: '4 months ago', image: IMG.review.kaushalRajGnyawali,
    text: 'Really happy with my experience at Healthy Home Nepal Jamal Branch. I went from 91 kg to 79 kg in about one and a half months. The results speak for themselves. But what helped me the most was talking to the nurses. They are very kind, hardworking, and always there when you need them. The front desk staff are also very nice and professional, and the clinic is clean and well kept. They take feedback seriously and try to improve, which I liked a lot.',
  },
  {
    name: 'Arjun Bahadur Kshetri', branch: 'Healthy Home Pokhara', branchId: 'pokhara',
    treatment: 'Weight Management', rating: 5, date: 'a month ago', image: IMG.review.arjunBahadurKshetri,
    text: 'A heartfelt thanks to the entire Healthy Home Pokhara team for your guidance and support. I’m happy to have achieved a weight loss of almost 18.75 kg in just 14 sessions. Truly grateful for your dedication and encouragement throughout my journey!',
  },
  {
    name: 'ganesh rimal', branch: 'Healthy Home Jamal', branchId: 'jamal',
    treatment: 'Weight Management', rating: 5, date: 'a month ago', image: IMG.review.ganeshRimal,
    text: 'I had an excellent experience with Healthy Home. Their personalized diet plan, regular follow-ups, and constant motivation made my weight loss journey much easier. I successfully lost 7 kg in just one month, and I’m very happy with the results. The team is professional, supportive, and always available to guide me whenever I had questions.',
  },
  {
    name: 'prabal batajoo', branch: 'Healthy Home Baneshwor', branchId: 'baneshwor',
    treatment: 'Weight Management', rating: 4, date: '5 months ago', image: IMG.review.prabalBatajoo,
    text: 'I previously weighed 94 kg, and after joining Healthy Home, I have successfully lost 12 kg. However, I would like to emphasize that joining alone does not guarantee weight loss—it truly requires strict discipline and commitment to a proper diet. The journey has been supported greatly by the staff, who are consistently polite, professional, and encouraging throughout the process.',
  },
  {
    name: 'Nick C', branch: 'Healthy Home Pulchowk', branchId: 'pulchowk',
    treatment: 'Weight Management + HydraFacial', rating: 5, date: '3 weeks ago', image: IMG.review.nickC,
    text: 'I’ve been coming here for a few months for the weight loss journey and hydrafacial. The staff here are exceptional. They are very kind, caring and very professional. I’ve never had an issue nor a bad experience and I will continue to support the business and the team. Thank you to the healthy home staff. You guys are now considered my family!',
  },
  {
    name: 'bijayata rai', branch: 'Healthy Home Jamal', branchId: 'jamal',
    treatment: 'Weight Management', rating: 5, date: '6 months ago', image: IMG.review.bijayataRai,
    text: 'I am having a wonderful experience with this weight loss program, lost around 5 kg in 5 sessions. The program is well-structured, easy to follow, and truly effective. It not only helped me lose weight but also taught me healthier dietary habits that I can maintain long-term. What impressed me the most was the support from the staff.',
  },
  {
    name: 'Ganesh Gurung', branch: 'Healthy Home Pokhara', branchId: 'pokhara',
    treatment: 'Weight Management', rating: 5, date: '4 months ago', image: IMG.review.ganeshGurung,
    text: 'As an old guy with some mobility difficulty, I was getting overweight. Healthy Home Pokhara has provided the best service to lose weight. I lost about 9 kgs within one and half month. I highly recommend anyone who is looking to lose weight.',
  },
  {
    name: 'Shiva Makaju', branch: 'Healthy Home Baneshwor', branchId: 'baneshwor',
    treatment: 'Weight Management', rating: 5, date: '2 months ago', image: IMG.review.shivaMakaju,
    text: 'I had a great experience here. The place is in a prime and convenient location, making it easy to visit. From the moment I arrived, the staff were warm, courteous, and professional. The service was efficient, well-organized, and delivered with attention to detail. I also appreciated that they provided clear, accurate, and honest information about their services, which helped me make informed decisions without any confusion.',
  },
  {
    name: 'Prakriti Karki', branch: 'Healthy Home Pulchowk', branchId: 'pulchowk',
    treatment: 'Weight Management', rating: 5, date: 'a month ago', image: IMG.review.prakritiKarki,
    text: 'Healthy Home offers excellent weight loss services in a friendly and encouraging environment. The entire team is kind, knowledgeable, and always willing to help. They truly care about their clients and make every step of the journey comfortable. Highly recommended!',
  },
];

/**
 * The three reviews shown in the landing page carousel.
 *
 * All ten remain in `testimonials` above: they are quoted verbatim from real
 * Google Business Profiles, so the full set is the record and is kept even
 * though only three are displayed. Re-order or swap this list to change what
 * appears — nothing else has to be edited.
 *
 * Chosen to cover three different branches and both service lines, so the
 * carousel does not read as three testimonials from the same clinic:
 *   Apekshya Giri   - Baneshwor, the only Dermatology review
 *   Kaushal Raj G.  - Jamal, the most specific result (91kg to 79kg)
 *   Ganesh Gurung  - Pokhara, so the franchise branch is represented
 *
 * Selected by name rather than by index, so reordering the array above cannot
 * silently change which reviews are featured.
 */
const FEATURED_REVIEW_NAMES = ['Apekshya Giri', 'Kaushal Raj Gnyawali', 'Ganesh Gurung'];

export const featuredTestimonials: Testimonial[] = FEATURED_REVIEW_NAMES
  .map(name => testimonials.find(t => t.name === name))
  .filter((t): t is Testimonial => t !== undefined);

/* Clinical leadership, shown in two places: the card grid on /about and the
   carousel on the landing page. Both read this array, so a change here updates
   both and the two can never drift apart.

   ORDER MATTERS: this is the order the landing page carousel cycles through, and
   it opens on the first person.

   `img` is optional and unset for everyone so far, because no confirmed
   photograph has been supplied. TeamAvatar falls back to an initials tile in that
   case, and a photo should only be attached to the person it actually shows —
   never borrowed from a colleague. Add a file under /public/images/team/ and a
   registry key in src/data/images.ts when a real photo is ready.

   `note` is optional too, and is a short factual line only — nothing here should
   read as a clinical claim about a specific person's qualifications beyond what
   the clinic has confirmed. */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** Short credential/ focus line, e.g. '20+ yrs · 50k+ consultations'. */
  note?: string;
  /** Path from the registry in src/data/images.ts — never a literal. */
  img?: string;
};

export const team: TeamMember[] = [
  { id: 'rana', name: 'Dr. Arnija Rana', role: 'Dermatologist' },
  { id: 'pokhrel', name: 'Dr. Kavita Pokhrel', role: 'Dermatologist' },
  { id: 'sapkota', name: 'Dr. Nabin Sapkota', role: 'Chief Medical Officer' },
  { id: 'bhattarai', name: 'Urika Bhattarai', role: 'Nutrition Consultant' },
  { id: 'chabegu', name: 'Eksa Chabegu', role: 'Nutrition Consultant' },
  { id: 'poudel', name: 'Sandhya Poudel', role: 'Nutrition Consultant' },
  { id: 'joshi', name: 'Preeti Baba Joshi', role: 'Nutrition Consultant' },
];

/* Products sold at the branch and online. This array is the single source of
   truth for /wellness-store: the category filter chips and the grid are both
   derived from it, so adding a product needs no other edits.

   Product photography is one dedicated file per product in
   /public/images/store/, wired up via `IMG.store.*` (see src/data/images.ts).
   Those files currently hold neutral branded placeholders — overwrite each
   one with the real product shot and nothing else needs to change. The card
   also falls back to a neutral tile on load error, so a missing file never
   ships as a visible defect. */
export type Product = {
  id: string;
  name: string;
  /** Grouping shown as a filter chip, e.g. 'Wellness Teas'. */
  category: string;
  /** Price in NPR. Omit rather than guess if a price is not confirmed. */
  price?: number;
  /** Path from `IMG.store.*` — never a literal, so it stays swappable. */
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

/* TODO: replace the placeholder files in /public/images/store/ with real
   product photography, one file per product. */
export const products: Product[] = [
  {
    id: 'healthy-home-morning-tea',
    name: 'Healthy Home Morning Tea',
    category: 'Wellness Teas',
    price: 700,
    image: IMG.store.healthyHomeMorningTea,
    blurb: 'A refreshing herbal tea to support a healthy start to your day.',
    details: ['Morning wellness support', 'Refreshing herbal blend', 'Suitable for daily consumption'],
    badge: 'Morning Wellness',
  },
  {
    id: 'day-tea',
    name: 'Day Tea',
    category: 'Wellness Teas',
    price: 1000,
    image: IMG.store.dayTea,
    blurb: 'A balanced wellness tea crafted to keep you refreshed throughout the day.',
    details: ['Daytime wellness support', 'Refreshing herbal blend', 'Ideal for daily use'],
    badge: 'Daily Wellness',
  },
  {
    id: 'night-tea',
    name: 'Night Tea',
    category: 'Wellness Teas',
    price: 1500,
    image: IMG.store.nightTea,
    blurb: 'A calming herbal tea designed for a relaxing evening routine.',
    details: ['Evening wellness support', 'Calming herbal blend', 'Ideal for nighttime routines'],
    badge: 'Evening Wellness',
  },
  {
    id: 'nepalese-herbal-tea',
    name: 'Nepalese Herbal Tea (Decaffeinated)',
    category: 'Wellness Teas',
    price: 1200,
    image: IMG.store.nepaleseHerbalTea,
    blurb: 'A naturally caffeine-free herbal tea featuring the goodness of Nepalese herbs.',
    details: ['Decaffeinated', 'Nepalese herbal blend', 'Suitable for daily consumption'],
    badge: 'Decaffeinated',
  },
  {
    id: 'gastric-tea',
    name: 'Gastric Tea',
    category: 'Wellness Teas',
    price: 800,
    image: IMG.store.gastricTea,
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
