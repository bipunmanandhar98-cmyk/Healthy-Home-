import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation } from 'lucide-react';
import { openCenters } from '../data/content';
import { useBooking } from './booking';
import { SectionHead, Stars } from './shared';

/* Branch preview for the foot of a page: every trading branch, with the three
 * actions a visitor actually needs at that point — book, get notified, or get
 * directions.
 *
 * Deliberately built on `openCenters` rather than a hardcoded slice. The version
 * this restores was `centers.slice(0, 4)`, which put a "Book Here" button on the
 * Thapathali head office — a corporate site that cannot take appointments — and
 * hid whichever branch happened to fall outside the first four. Deriving the list
 * means a branch added to the data appears here automatically and a head office
 * can never advertise a booking it cannot keep.
 *
 * The card states mirror the /locations page exactly, including the note shown in
 * place of a button on a branch that cannot be booked, so the two never disagree.
 *
 * No waitlist email box here. The one this replaces submitted to an `alert()`
 * and discarded the address — a form that collects an email and lies about what
 * happens to it. The /locations page still has that behaviour and is worth fixing
 * separately; until it really sends, a second copy of it would just be a second
 * place to lose someone's address.
 *
 * Split out of Home.tsx rather than inlined: the landing page is already ~750
 * lines, and this is the section most likely to be wanted on other routes.
 */
export default function LocationsPreview() {
  const { openBooking } = useBooking();

  return (
    <section className="bg-cream border-t border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHead
            center={false}
            eyebrow="Find Your Health Nearby"
            title={<>{openCenters.length} branches, <em className="gold-text not-italic">one standard</em></>}
            sub="From Thapathali to Pokhara — same clinical excellence, same care, everywhere."
          />
          <Link
            to="/locations"
            className="shrink-0 inline-flex items-center gap-2 border border-ink/20 px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition"
          >
            All Locations <MapPin size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {openCenters.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
              className="bg-white border border-linen rounded-3xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 ease-out"
            >
              <div className="w-11 h-11 rounded-2xl bg-gold text-white flex items-center justify-center shadow-md shadow-[#00919A]/25">
                <MapPin size={18} />
              </div>

              <h3 className="font-display text-2xl mt-3">{c.name}</h3>
              <p className="text-sm text-mocha mt-1">{c.locationLine ?? <>{c.address}<br />{c.city}, {c.state}</>}</p>

              {c.rating ? (
                <p className="flex items-center gap-1.5 text-xs mt-2">
                  <Stars n={Math.round(c.rating)} size={11} />
                  <b>{c.rating}</b>
                  <span className="text-stone2">({c.reviews?.toLocaleString()} Google reviews)</span>
                </p>
              ) : null}

              {c.phone ? (
                <p className="flex items-center gap-1.5 text-xs text-mocha mt-3">
                  <Phone size={12} className="text-gold" /> {c.phone}
                </p>
              ) : null}

              <div className="flex gap-2 mt-auto pt-5">
                {c.openingSoon ? (
                  <p className="flex-1 self-center text-[11px] tracking-[0.12em] uppercase text-stone2 text-center">
                    Opening soon
                  </p>
                ) : c.noBooking ? (
                  <p className="flex-1 self-center text-[11px] tracking-[0.12em] uppercase text-stone2 text-center">
                    {c.noBookingNote ?? 'Appointments not available'}
                  </p>
                ) : (
                  <button
                    onClick={() => openBooking({ center: c.id })}
                    className="flex-1 bg-gold text-white rounded-full py-2.5 text-[11px] tracking-[0.18em] uppercase hover:bg-[#00747B]"
                  >
                    Book Here
                  </button>
                )}
                <a
                  href={c.mapUrl ?? `https://maps.google.com/?q=${encodeURIComponent(c.address + ' ' + c.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${c.noBooking ? 'flex-1' : 'w-11'} h-11 rounded-full border border-linen flex items-center justify-center hover:border-gold hover:text-[#007C83]`}
                  title="Directions"
                  aria-label={`Directions to ${c.name}`}
                >
                  <Navigation size={15} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}