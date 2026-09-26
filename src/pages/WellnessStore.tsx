import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Phone, CalendarDays, Sparkles, Check, Tag, ArrowRight, Leaf } from 'lucide-react';
import { products, productCategories } from '../data/content';
import { useBooking } from '../components/chrome';
import { SectionHead, CtaBanner } from '../components/shared';

/** Matches the number already used in CtaBanner, so the store does not invent one. */
const PHONE_HREF = 'tel:+977015335763';
const PHONE_TEXT = '01-5335763';

const rupees = (n: number) => 'Rs. ' + n.toLocaleString('en-IN');

/* Product photography may not have been supplied yet. Rather than ship a
   broken-image icon, the <img> sits on top of a neutral branded tile and is
   hidden on error, so a missing file degrades to the tile. */
function ProductImage({ p }: { p: (typeof products)[number] }) {
  return (
    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-sand via-cream to-sand">
      <div className="absolute inset-0 grid place-items-center">
        <Leaf size={34} className="text-gold/50" />
      </div>
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        decoding="async"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className="relative w-full h-full object-cover"
      />
    </div>
  );
}

function ProductCard({ p, index }: { p: (typeof products)[number]; index: number }) {
  const sold = p.inStock === false;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="bg-white border border-linen rounded-3xl overflow-hidden hover:shadow-xl transition flex flex-col"
    >
      <div className="relative">
        <ProductImage p={p} />
        {p.badge && <span className="absolute top-3 left-3 bg-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full shadow">{p.badge}</span>}
        {sold && <span className="absolute inset-0 bg-white/70 grid place-items-center text-[11px] tracking-[0.2em] uppercase text-stone2">Out of stock</span>}
      </div>

      <div className="p-5 flex flex-col grow">
        <p className="text-[11px] tracking-[0.2em] uppercase text-golddark">{p.category}</p>
        <h3 className="font-display text-2xl leading-tight mt-1">{p.name}</h3>
        <p className="text-sm text-mocha mt-2 grow">{p.blurb}</p>

        {p.details && p.details.length > 0 && (
          <ul className="mt-3 space-y-1">
            {p.details.map((d) => (
              <li key={d} className="text-[12px] text-stone2 flex items-start gap-1.5">
                <Check size={13} className="text-gold shrink-0 mt-0.5" /> {d}
              </li>
            ))}
          </ul>
        )}

        {/* Price is only ever rendered from real data — never a struck-through
            "was" figure, which would be an invented discount. */}
        <p className="mt-4 pt-4 border-t border-linen font-display text-2xl text-golddark">
          {typeof p.price === 'number' ? rupees(p.price) : <span className="text-lg text-mocha">Price on request</span>}
        </p>

        <a
          href={PHONE_HREF}
          className={`mt-3 w-full text-center rounded-full py-3 text-[11px] tracking-[0.2em] uppercase font-medium transition ${
            sold ? 'border border-ink/20 text-stone2 cursor-not-allowed' : 'bg-gold text-white hover:bg-[#00747B]'
          }`}
          aria-disabled={sold}
        >
          {sold ? 'Currently unavailable' : 'Call to order'}
        </a>
      </div>
    </motion.article>
  );
}

export default function WellnessStore() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState<string>('All');

  const shown = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active]
  );

  const chips = ['All', ...productCategories];

  return (
    <div>
      {/* Hero */}
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Healthy Home Wellness Store</p>
          <h1 className="font-display text-5xl sm:text-6xl mt-3">Wellness, <em className="gold-text not-italic">to take home</em></h1>
          <p className="text-mocha mt-4 max-w-xl mx-auto">
            The wellness teas, nutrition and skin-care range we use and recommend in clinic. Order by phone or
            at any branch counter.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-14">
        {products.length === 0 ? (
          /* Honest empty state. The range is real (see the Membership benefits)
             but stock is not published yet, so nothing is listed and no
             placeholder product is shown. */
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-sand grid place-items-center mx-auto">
              <Package size={26} className="text-golddark" />
            </div>
            <h2 className="font-display text-4xl mt-5">The shelves are being stocked</h2>
            <p className="text-mocha mt-4 leading-relaxed">
              Our wellness teas, nutrition range and skin-care products are available in clinic today. Online
              ordering is being switched on — in the meantime, call the branch nearest you or ask at the front
              desk and we will help you order.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mt-7">
              <a
                href={PHONE_HREF}
                className="bg-gold text-white px-8 min-h-[44px] rounded-full text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-2 hover:bg-[#00747B] transition"
              >
                <Phone size={15} /> Call {PHONE_TEXT}
              </a>
              <button
                onClick={() => openBooking()}
                className="border border-ink/25 text-ink px-8 min-h-[44px] rounded-full text-xs tracking-[0.2em] uppercase flex items-center gap-2 hover:bg-sand transition"
              >
                <CalendarDays size={15} /> Book a consultation
              </button>
            </div>

            <div className="mt-10 text-left bg-sand/50 border border-linen rounded-3xl p-6 sm:p-8">
              <p className="text-[11px] tracking-[0.25em] uppercase text-golddark flex items-center gap-2">
                <Sparkles size={14} /> Meanwhile, members save on products
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-mocha">
                <li className="flex items-start gap-2"><Check size={15} className="text-gold shrink-0 mt-0.5" /> 10% off the wellness teas and nutrition range</li>
                <li className="flex items-start gap-2"><Check size={15} className="text-gold shrink-0 mt-0.5" /> 5% off the skin-care range, all year</li>
                <li className="flex items-start gap-2"><Check size={15} className="text-gold shrink-0 mt-0.5" /> Early access to every offer, three days before it goes public</li>
              </ul>
              <Link
                to="/membership"
                className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-golddark font-medium hover:underline min-h-[44px]"
              >
                Explore membership <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Category chips, derived from the data so they can never drift */}
            <div className="flex flex-wrap gap-2 justify-center">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  aria-pressed={active === c}
                  className={`text-[11px] tracking-widest uppercase border rounded-full px-4 min-h-[40px] inline-flex items-center transition ${
                    active === c
                      ? 'bg-gold border-gold text-white'
                      : 'border-ink/20 text-ink hover:bg-gold hover:border-gold hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {shown.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </div>

            <p className="text-center text-xs text-stone2 mt-8 flex items-center justify-center gap-1.5">
              <Leaf size={13} className="text-gold" />
              Not sure what suits you? Your consultation can recommend a routine — no obligation.
            </p>
            <div className="text-center mt-4">
              <button
                onClick={() => openBooking()}
                className="inline-flex items-center gap-2 bg-gold text-white px-8 min-h-[44px] rounded-full text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#00747B] transition"
              >
                <CalendarDays size={15} /> Book a consultation
              </button>
            </div>
          </>
        )}
      </div>

      {/* How ordering works — no cart or payment gateway is wired up yet, so
          the page says exactly how a customer orders rather than implying
          an online checkout exists. */}
      {products.length > 0 && (
        <section className="bg-sand/40 border-y border-linen">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <SectionHead
              center={false}
              eyebrow="How it works"
              title={<>Simple, <em className="gold-text not-italic">in-clinic or by phone</em></>}
              sub="We take orders over the phone or at any branch counter. We will confirm availability, the price and delivery or pickup before anything is charged."
            />
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Phone, t: 'Call to order', s: `Ring ${PHONE_TEXT} and we will check stock for you.` },
                { icon: Tag, t: 'Member pricing', s: 'Members get 10% off the wellness tea range.' },
                { icon: Package, t: 'Pickup or delivery', s: 'Collect in branch, or ask us about delivery.' },
              ].map((s) => (
                <div key={s.t} className="bg-white border border-linen rounded-2xl p-6">
                  <s.icon size={22} className="text-gold" />
                  <p className="font-medium mt-3">{s.t}</p>
                  <p className="text-xs text-stone2 mt-1 leading-relaxed">{s.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </div>
  );
}
