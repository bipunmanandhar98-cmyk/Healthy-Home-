import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { openCenters } from '../data/content';
import { useBooking } from './booking';
import { SectionHead } from './shared';
import { LocationCard } from './ui/location-card';

/* Branch preview for the foot of a page: every trading branch, with the two
 * actions a visitor actually needs at that point — book, and get directions.
 *
 * Built on `openCenters` rather than a hardcoded slice, so a branch added to the
 * data appears here automatically and the head office can never advertise a
 * booking it cannot keep. The booking button is only rendered where the booking
 * modal would accept the branch: BookingModal resolves its preset against
 * `bookableCenters`, which excludes opening-soon and noBooking branches, so
 * passing anything else would open the modal with the wrong branch selected.
 *
 * The card's own title drops the "Healthy Home " prefix. The page is already
 * branded, the full name overflows the card at this width, and the branch
 * district is the part a visitor scans for.
 *
 * No waitlist email box. The one this replaced submitted to an `alert()` and
 * discarded the address — a form that collects an email and lies about what
 * happens to it. /locations still has that behaviour and is worth fixing
 * separately; until it really sends, a second copy would be a second place to
 * lose someone's address.
 *
 * Split out of Home.tsx: the landing page is already ~750 lines and this is the
 * section most likely to be wanted on other routes.
 */

/** "Healthy Home Baneshwor" -> "Baneshwor" */
function shortName(name: string) {
  return name.replace(/^Healthy Home\s+/i, '').replace(/\s*\(HO\)$/i, '');
}

export default function LocationsPreview() {
  const { openBooking } = useBooking();

  return (
    <section className="bg-cream border-t border-linen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHead
            center={false}
            eyebrow="Find Your Health Nearby"
            title={
              <>
                {openCenters.length} branches, <em className="gold-text not-italic">one standard</em>
              </>
            }
            sub="From Thapathali to Pokhara — same clinical excellence, same care, everywhere."
          />
          <Link
            to="/locations"
            className="shrink-0 inline-flex items-center gap-2 border border-ink/20 px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-white hover:border-gold transition"
          >
            All Locations <MapPin size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {openCenters.map((c, i) => {
            const bookable = !c.openingSoon && !c.noBooking;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
                className="flex justify-center"
              >
                <LocationCard
                  imageUrl={c.img}
                  location={shortName(c.name)}
                  country={c.city}
                  href={
                    c.mapUrl ??
                    `https://maps.google.com/?q=${encodeURIComponent(c.address + ' ' + c.city)}`
                  }
                  onBook={bookable ? () => openBooking({ center: c.id }) : undefined}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}