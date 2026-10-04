import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, BadgeCheck, Calendar, Award, Users, Building2 } from 'lucide-react';
import { treatments, subServices, faqs, googleRating } from '../data/content';
import { useBooking } from '../components/booking';
import { SectionHead, TrustBar, CtaBanner, CountUp } from '../components/shared';
import BeforeAfter from '../components/BeforeAfter';
import TestimonialCarousel from '../components/TestimonialCarousel';
import TeamCarousel from '../components/TeamCarousel';
import WhatsAppWidget from '../components/WhatsAppWidget';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IMG } from '../data/images';

const fadeUp = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } as const;

/** Sub-services featured in the "What  Do" grid, in display order. */
const FEATURED_SUB_IDS = [
  'bca-testing',
  'weight-loss',
  'hydrafacial-treatment',
  'laser-hair-removal',
  'chemical-peeling',
  'breast-reduction-wm',
] as const;

export default function Home() {
  const { openBooking } = useBooking();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const headerOffset = 88;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  const brands = ['BCA TEST', 'WEIGHT LOSS', 'CHEMICAL PEELING', 'HYDRAFACIAL','LAB TEST'];

  /* How many brand items one copy of the marquee should hold.
   *
   * A -50% slide only loops seamlessly when a single copy is at least as wide as
   * the viewport. Five services make a list roughly half the width of a desktop
   * screen, so by the far end of every lap the track had run out and left bare
   * space on the right.
   *
   * Rather than hardcode a count that happens to suit one window, repeat the list
   * until one copy covers the viewport, re-measuring on resize. The count is kept
   * a whole number of full passes through `brands`, otherwise the lap boundary
   * would land mid-cycle and the same service would appear twice in a row. */
  const marqueeSample = useRef<HTMLSpanElement>(null);
  const [marqueeCount, setMarqueeCount] = useState(brands.length * 2);

  useLayoutEffect(() => {
    const measure = () => {
      const sample = marqueeSample.current;
      if (!sample) return;
      const item = sample.getBoundingClientRect().width;
      if (!item) return;
      const cycle = item * brands.length;
      // +1 spare pass, so a resize that lands just short still covers the width.
      const cycles = Math.max(2, Math.ceil(window.innerWidth / cycle) + 1);
      const next = cycles * brands.length;
      setMarqueeCount(prev => (prev === next ? prev : next));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    /* brands is a module-level constant, so this is a stable 5 and the effect
       still runs exactly once. */
  }, [brands.length]);

  const heroSlides = [
    {
      image: IMG.home.hero1,
      eyebrow: 'Healthy Home',
      title: <>Look <em className="gold-text not-italic font-semibold">Radiant.</em><br />Feel <em className="italic font-medium">Unstoppable.</em></>,
      description: 'Healthy Home Weight Management, Dermatology and Lab Tests, all under one caring roof.',
      button: 'Book Consultation',
      type: 'booking'
    },
    {
      image: IMG.home.hero2,
      eyebrow: 'Weight Management',
      title: <>Your <em className="gold-text not-italic">Healthier</em><br />Chapter Starts Here.</>,
      description: 'Personalized weight management programs designed around your goals.',
      button: 'Explore Weight Management',
      type: 'link',
      link: '/services/weight-management'
    },
    {
      image: IMG.home.hero3,
      eyebrow: 'Dermatology',
      title: <>Healthy Skin.<br /><em className="gold-text not-italic">Confident You.</em></>,
      description: 'Advanced dermatology and aesthetic treatments tailored to you.',
      button: 'Explore Dermatology',
      type: 'link',
      link: '/services/dermatology'
    },
    {
      image: IMG.home.hero4,
      eyebrow: 'The Healthy Home Experience',
      title: <>Luxury You Feel.<br />Service You Can <em className="gold-text not-italic">Trust.</em></>,
      description: 'Expert care, personalized plans and a better wellness experience under one roof.',
      button: 'Discover Healthy Home',
      type: 'link',
      link: '/about'
    }
  ];

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
    /* `heroSlides.length` rather than `heroSlides`: the array is rebuilt on
       every render, so depending on it would tear down and restart the timer
       each time the slide changed, freezing the carousel on one frame. The
       length is the only part the callback actually reads, and it never varies,
       so the timer still starts once and runs for the life of the page. */
  }, [heroSlides.length]);


  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div>
      {/* HERO — FULL-SCREEN IMAGE SLIDER */}
      <section className="bg-cream">
        {/* Height excludes the sticky header (--hh-header-h) so the CTAs are
            never pushed below the fold. min-h keeps it usable on short screens. */}
        <div className="relative w-full h-[calc(100svh-var(--hh-header-h))] min-h-[460px] overflow-hidden">

          {/* Slide image */}
          <AnimatePresence initial={false}>
            <motion.div
              key={heroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } }}
              className="absolute inset-0"
            >
              <img
                loading="eager"
                fetchPriority="high"
                src={heroSlides[heroSlide].image}
                alt={heroSlides[heroSlide].eyebrow}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Left-to-right overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/5" />

              {/* Bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slide content — positioned in the lower-left area as indicated */}
          <div className="absolute z-10 left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 bottom-20 sm:bottom-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={`hero-content-${heroSlide}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.12 } },
                  exit: { opacity: 0, transition: { duration: 0.22 } }
                }}
                className="w-full max-w-[620px] text-white pt-4"
              >
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/80"
                >
                  {heroSlides[heroSlide].eyebrow}
                </motion.p>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="font-display text-4xl sm:text-5xl lg:text-[58px] xl:text-[68px] leading-[0.98] mt-4"
                >
                  {heroSlides[heroSlide].title}
                </motion.h1>

                <div className="mt-5 flex flex-col items-start gap-5">
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="text-white/80 max-w-lg text-xs sm:text-sm lg:text-[15px] leading-relaxed"
                  >
                    {heroSlides[heroSlide].description}
                  </motion.p>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="flex flex-wrap gap-3 shrink-0">
                  {heroSlides[heroSlide].type === 'booking' ? (
                    <button
                      onClick={() => openBooking()}
                      className="bg-gold text-white px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] rounded-full text-[11px] sm:text-[10px] tracking-[0.16em] uppercase font-medium hover:bg-[#00747B] flex items-center gap-2 transition shadow-xl"
                    >
                      <Calendar size={15} />
                      {heroSlides[heroSlide].button}
                    </button>
                  ) : (
                    <Link
                      to={heroSlides[heroSlide].link!}
                      className="bg-gold text-white px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] rounded-full text-[11px] sm:text-[10px] tracking-[0.16em] uppercase font-medium hover:bg-[#00747B] flex items-center gap-2 transition shadow-xl"
                    >
                      {heroSlides[heroSlide].button}
                      <ArrowRight size={15} />
                    </Link>
                  )}

                  <Link
                    to="/services"
                    className="border border-white/60 bg-white/5 backdrop-blur-sm text-white px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] rounded-full text-[11px] sm:text-[10px] tracking-[0.16em] uppercase font-medium hover:bg-white hover:text-ink transition flex items-center gap-2"
                  >
                    Explore Services
                    <ArrowRight size={15} />
                  </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom-left slider controls. The bar stays visually slim, but the
              button is 44px tall so it is actually tappable on a phone. */}
          <div className="absolute z-20 left-6 sm:left-10 lg:left-16 bottom-7 sm:bottom-10 flex items-end gap-1 -mb-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={heroSlide === i}
                className={`flex items-end h-11 ${heroSlide === i ? 'w-11 sm:w-12' : 'w-8 sm:w-9'}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    heroSlide === i
                      ? 'w-9 sm:w-10 bg-white'
                      : 'w-6 sm:w-7 bg-white/40 hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute z-20 right-6 sm:right-10 lg:right-16 bottom-7 sm:bottom-10 text-white/80 text-[10px] tracking-[0.25em]">
            {String(heroSlide + 1).padStart(2, '0')}
            <span className="mx-2 text-white/40">/</span>
            {String(heroSlides.length).padStart(2, '0')}
          </div>
        </div>
      </section>

      {/* Brand marquee — full-bleed, looping continuously. */}
      <div className="marquee-viewport mt-7 border-y border-linen bg-white/60 py-3.5 overflow-hidden">
        <div className="marquee-track flex w-max">
          {/* Two identical copies, so the -50% slide is exactly one copy's width
              and the lap closes with no seam. Each copy repeats the list as many
              times as it needs to cover the viewport, so the strip is never short
              of text part-way through a lap.

              The trailing gap lives on each item (pr-10) rather than on the flex
              container. That keeps every item the same width, which is what lets
              the copy be measured and repeated without drift. */}
          {[0, 1].map(copy => (
            <div key={copy} inert={copy === 1} className="flex items-center">
              {Array.from({ length: marqueeCount }, (_, i) => {
                const b = brands[i % brands.length]!;
                return (
                  <span
                    key={i}
                    ref={copy === 0 && i === 0 ? marqueeSample : undefined}
                    className="text-xs tracking-[0.3em] uppercase text-mocha flex items-center leading-none h-6 pr-10"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        // Lab Tests isn't in the featured grid, so send it to its own page.
                        if (b === 'LAB TEST') { navigate('/services/lab-tests'); return; }
                        scrollToSection(
                          b === 'BCA TESTING' ? 'bca-testing' :
                          b === 'WEIGHT LOSS' ? 'weight-management' :
                          b === 'CHEMICAL PEELING' ? 'chemical-peeling' :
                          b === 'HYDRAFACIAL' ? 'hydrafacial' :
                          'laser-hair-removal'
                        );
                      }}
                      className="inline-flex items-center gap-5 min-h-[44px] leading-none hover:text-golddark transition-colors duration-300"
                    >
                      <span>{b}</span>
                      <img loading="lazy" decoding="async" src={IMG.brand.leaf} alt="" className="w-5 h-5 object-contain shrink-0" />
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

    {/* EXPERIENCE / WHY */}
    <section className="bg-white border-y border-linen relative overflow-hidden">
      <div className="absolute inset-0 texture-grain opacity-60" />
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center relative">
        <motion.div {...fadeUp}>
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">The Healthy Home Experience</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-3 leading-tight text-ink">Luxury you feel.<br />Service you can <em className="gold-text not-italic">trust.</em></h2>
          <div className="grid gap-5 mt-8">
            {[['Guided care, always', 'Every branch is staffed by clinicians, wellness coaches and licensed aestheticians with 100+ hours of Healthy Home academy training.'], ['Natural & non-invasive first', 'Weight-loss coaching, non-invasive aesthetic treatments, screening-led plans and lifestyle products — no surgery, no extremes.'], ['Honest, mapped pricing', 'Body/fat assessment, labs and written service plans before you spend a rupee. Members save 15-25% with rollover banked value.']].map(([t, s]) => (
              <div key={t} className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><BadgeCheck size={16} className="text-golddark" /></div><div><p className="font-medium text-ink">{t}</p><p className="text-mocha text-sm mt-1 leading-relaxed">{s}</p></div></div>
            ))}
          </div>
          <Link to="/about" className="inline-flex items-center gap-2 mt-8 min-h-[44px] border border-golddark/50 text-golddark px-7 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition">Our Story <ArrowRight size={14} /></Link>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
          <img loading="lazy" decoding="async" src={IMG.home.experienceMain} alt="Healthy Home medical professional with client" className="rounded-xl h-64 w-full object-cover col-span-2" />
          <img loading="lazy" decoding="async" src={IMG.home.experienceDerma} alt="Dermatology service" className="rounded-xl h-52 w-full object-cover" />
          <img loading="lazy" decoding="async" src={IMG.home.experienceWeight} alt="Weight management service" className="rounded-xl h-52 w-full object-cover" />
        </motion.div>
      </div>
    </section>

    {/* SERVICES — Card Grid */}
    <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-golddark">What We Do</p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mt-2">
          Personalized care,<br />
          <span className="gold-text non-italic">without the pressure.</span>
        </h2>
        <p className="text-sm text-stone2 mt-4 max-w-xl leading-relaxed">
          Aesthetics and longevity medicine under one roof. Every path starts with a provider who listens first.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {FEATURED_SUB_IDS.flatMap((id) => {
          const s = subServices.find((x) => x.id === id);
          const parent = s ? treatments.find((t) => t.id === s.parentId) : undefined;
          return s && parent ? [{ ...s, parent }] : [];
        }).map((s, i) => (
          <motion.div
            key={s.id}
            id={(() => {
              const name = s.name.toLowerCase();
              if (name.includes('bca')) return 'bca-testing';
              if (name.includes('weight')) return 'weight-management';
              if (name.includes('chemical peel')) return 'chemical-peeling';
              if (name.includes('hydrafacial')) return 'hydrafacial';
              if (name.includes('laser hair')) return 'laser-hair-removal';
              if (name.includes('lab')) return 'lab-test';
              return undefined;
            })()}
            {...fadeUp}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-linen rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
          >
            <Link
              to={`/services/${s.parent.id}/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
              className="block"
            >
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[9px] tracking-[0.22em] uppercase text-stone2">
                  {s.parent.name}
                </p>

                <h3 className="font-medium text-[15px] sm:text-base mt-2.5 leading-snug min-h-[2.5rem]">
                  {s.name}
                </h3>

                <p className="text-[10px] sm:text-[11px] text-stone2 mt-2 leading-relaxed line-clamp-2 min-h-[2rem]">
                  {s.description || `Personalized ${s.name.toLowerCase()} care designed around your goals.`}
                </p>

                <span className="inline-flex items-center gap-1 mt-4 text-[9px] tracking-[0.18em] uppercase text-[#007C83] font-medium">
                  Book Now <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 bg-gold text-white px-7 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-[#00747B] shadow-lg shadow-[#00919A]/20 transition"
        >
          View All Services <ArrowRight size={15} />
        </Link>
      </div>
    </section>

    {/* STATS — "Why Trust" band.
        Uses the site's most common section treatment (bg-white with linen
        rules) rather than a dark slab, so the band sits with its neighbours
        instead of interrupting them. Dark espresso is reserved for the footer
        and the CTA banner.
        Layout keeps the approved structure: heading left, figures 2x2 right.
        The heading is a real h2, so the band is reachable by screen readers.

        Labels use text-ink, not the site's usual text-stone2. Measured on this
        ground stone2 is only 2.7:1, which fails WCAG AA for small text. Ink is
        14.7:1. The standfirst keeps text-mocha, which is the site's body colour
        and clears AA on white at 4.6:1. */} 
    <section className="bg-white border-y border-linen">
      {/* Padding and figure size are tuned so the band lands near 1900x325 at a
          wide desktop: it is a banner, not a block of cards, and the height is
          content-driven rather than a fixed aspect. */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[0.92fr_1.45fr] gap-10 lg:gap-16 items-center">

          {/* Left: heading and standfirst */}
          <div className="max-w-md">
            <span aria-hidden="true" className="block h-px w-14 bg-gold mb-4" />
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-ink">
              Why Trust
              <span className="block italic text-gold">Healthy Home?</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-mocha mt-4">
              Your wellness journey, backed by experience, expertise and a growing community.
            </p>
          </div>

          {/* Right: the four figures, 2 x 2.
              A badge, a hairline rule and the figure read left to right, so the
              eye lands on the number without the label competing with it. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7 lg:gap-x-12 lg:gap-y-8">
            {([
              { badge: <Building2 size={22} />, value: '6', label: 'Branch across Nepal', animated: false },
              { badge: <Users size={22} />, value: '50K+', label: 'Sessions received', animated: true },
              { badge: <Award size={22} />, value: '21+', label: 'Years of expertise', animated: false },
              /* A lettered G rather than a star, so the Google figure carries its
                 own identity instead of reading as another symbol. */
              { badge: <span className="font-display text-[22px] leading-none pt-0.5">G</span>, value: String(googleRating.average), label: 'Google rating', animated: false },
            ]).map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="flex items-center gap-4"
              >
                <span
                  aria-hidden="true"
                  className="w-12 h-12 shrink-0 rounded-full grid place-items-center bg-sand/60 border border-linen text-gold"
                >
                  {s.badge}
                </span>
                <span aria-hidden="true" className="w-px h-10 shrink-0 bg-linen" />
                <div className="min-w-0">
                  <p className="font-display text-4xl sm:text-5xl leading-none text-ink">
                    {s.animated ? <CountUp to={50} suffix="K+" /> : s.value}
                  </p>
                  <p className="text-[11px] tracking-[0.22em] uppercase text-ink mt-2">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
      <SectionHead eyebrow="Effortless by Design" title="Your visit in 3 steps" />
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mt-10">
        {[['01', 'Consultation', 'Body/fat + wellness analysis, honest recommendations and written pricing. 30-45 minutes, zero pressure.'], ['02', 'Personalized plan', 'Sequenced services mapped around your goals, schedule and budget.'], ['03', 'Support + maintain', 'Coaching, reviews and products then maintain.']].map(([n, t, s]) => (
          <motion.div key={n} {...fadeUp} className="bg-white border border-linen rounded-3xl p-7 relative overflow-hidden group hover:shadow-xl transition-all duration-500 ease-out">
            <p className="font-display text-6xl text-sand group-hover:text-blush transition absolute top-3 right-5">{n}</p>
            <p className="font-display text-2xl relative">{t}</p>
            <p className="text-sm text-mocha mt-2 leading-relaxed relative">{s}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10"><TrustBar /></div>
    </section>

    {/* LEADERSHIP & EXPERTS */}
    <section className="bg-sand/60 border-y border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <SectionHead eyebrow="Leadership & Experts" title="Hands you can trust" sub="A few of the 200+ clinicians, coaches and aestheticians behind your results." />
        <TeamCarousel />
      </div>
    </section>

    {/* REAL RESULTS — before/after comparisons */}
    <section className="bg-white border-y border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <SectionHead
          center
          eyebrow="Real Results"
          title={<>Before & After <em className="gold-text not-italic">Treatment</em></>}
          sub="Drag the handle to compare. Every result varies by individual — these are shared with client consent."
        />
        {/* Constrained to max-w-3xl on purpose. At the full max-w-7xl a 9:16 frame
            would be 620px wide and 1100px tall, which overflows the screen. Each
            comparison is ~358px wide by 636px here — portrait, and short enough
            to sit on screen without scrolling. */}
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6 mt-12 max-w-3xl mx-auto">
          <BeforeAfter
            before={IMG.result.weightBefore}
            after={IMG.result.weightAfter}
            beforeLabel="Before"
            afterLabel="After"
            alt="Weight management result"
            aspect="aspect-[9/16]"
          />
          <BeforeAfter
            before={IMG.result.skinBefore}
            after={IMG.result.skinAfter}
            beforeLabel="Before"
            afterLabel="After"
            alt="Dermatology result"
            aspect="aspect-[9/16]"
          />
        </div>
        <p className="text-xs text-stone2 text-center mt-6 max-w-2xl mx-auto">
          Results depend on your starting point, consistency and aftercare. A consultation maps what is realistically achievable for you.
        </p>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="bg-sand/60 border-y border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <SectionHead
          eyebrow="Client Voices"
          title={<>What our clients <em className="gold-text not-italic">say</em></>}
          sub="Quoted from each branch's own Google Business Profile — swipe through them."
        />
        <div className="mt-10">
          <TestimonialCarousel />
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="max-w-3xl mx-auto px-4 py-16 lg:py-20">
      <SectionHead eyebrow="Good to Know" title="Q&A" />
      <div className="grid gap-4 mt-10">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white border border-linen rounded-2xl overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-[15px]">{f.q}<ChevronRight size={16} className={`text-gold transition ${openFaq === i ? 'rotate-90' : ''}`} /></button>
            {openFaq === i && <p className="px-6 pb-5 text-sm text-mocha leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>

    <CtaBanner />

      {/* Floating WhatsApp entry point. Home only — see WhatsAppWidget for why
          this is a deep link rather than an inline chat widget. */}
      <WhatsAppWidget />
    </div>
  );
}