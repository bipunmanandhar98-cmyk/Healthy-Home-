import { useMemo, useState } from 'react';
import { Search, MapPin, Star, Phone, Clock, Navigation, Mail } from 'lucide-react';
import { centers, openCenters } from '../data/content';
import { useBooking } from '../components/chrome';
import { SectionHead, Stars } from '../components/shared';

export default function Locations() {
  const [q, setQ] = useState('');
  const { openBooking } = useBooking();
  const shown = useMemo(() => centers.filter(c =>
    (c.name + c.city + c.state + c.address).toLowerCase().includes(q.toLowerCase())
  ), [q]);
  // Chips filter by locality rather than province — that is what clients search
  // for. Derived so a new branch's city appears automatically.
  const cities = [...new Set(centers.map(c => c.city))];

  return (
    <div>
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <img src="/images/site/bg-locations.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Our Locations</p>
          <h1 className="font-display text-5xl sm:text-6xl mt-3">Find your <em className="gold-text not-italic">health nearby</em></h1>
          <p className="text-mocha mt-4 max-w-xl mx-auto">{openCenters.length} Healthy Home branches open across Kathmandu Valley, Lalitpur and Pokhara — plus 2 more opening soon. Every one held to the Healthy Home standard.</p>
          <div className="max-w-md mx-auto mt-6 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search city, state or address..." className="w-full bg-white border border-linen shadow-sm rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-stone2 focus:border-gold" />
          </div>
          <div className="flex gap-2 justify-center flex-wrap mt-5">
            {cities.map(s => <button key={s} onClick={() => setQ(s)} className="text-[11px] tracking-widest uppercase border border-ink/20 text-ink rounded-full px-4 min-h-[40px] inline-flex items-center hover:bg-gold hover:border-gold hover:text-white transition">{s}</button>)}
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SectionHead eyebrow={`${shown.length} Branches`} title={<>Where will you <em className="gold-text not-italic">visit us?</em></>} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {shown.map(c => (
            <div key={c.id} className="bg-white border border-linen rounded-3xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gold text-white flex items-center justify-center shadow-md shadow-[#00919A]/25"><MapPin size={18} /></div>
                {c.tag && <span className="text-[10px] tracking-[0.15em] uppercase bg-gold text-white px-3 py-1 rounded-full">{c.tag}</span>}
              </div>
              <h3 className="font-display text-2xl mt-3">{c.name}</h3>
              <p className="text-sm text-mocha mt-1">{c.locationLine ?? <>{c.address}<br />{c.city}, {c.state}</>}</p>
              {c.rating ? <p className="flex items-center gap-1.5 text-xs mt-2"><Stars n={Math.round(c.rating)} size={11} /> <b>{c.rating}</b> <span className="text-stone2">({c.reviews?.toLocaleString()} Google reviews)</span></p> : null}
              <div className="grid gap-1.5 text-xs text-mocha mt-3">
                {c.phone ? <p className="flex items-center gap-1.5"><Phone size={12} className="text-gold" /> {c.phone}</p> : null}
                {c.email ? <p className="flex items-center gap-1.5"><Mail size={12} className="text-gold" /> {c.email}</p> : null}
                {c.hours ? <p className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> {c.hours}</p> : null}
              </div>
              <div className="flex gap-2 mt-5">
                {c.openingSoon ? (
                  /* Not trading yet — taking a booking here would promise an
                     appointment the branch cannot keep, so this routes to the
                     waitlist instead. */
                  <button onClick={() => document.getElementById('branch-waitlist')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 h-11 rounded-full bg-sand text-ink/70 hover:bg-gold hover:text-white transition text-[11px] tracking-[0.18em] uppercase font-medium">Notify Me When Open</button>
                ) : c.id !== 'thapathali' ? (
                  <button onClick={() => openBooking({ center: c.id })} className="flex-1 bg-gold text-white rounded-full py-2.5 text-[11px] tracking-[0.18em] uppercase hover:bg-[#00747B]">Book Here</button>
                ) : null}
                <a href={c.mapUrl ?? `https://maps.google.com/?q=${encodeURIComponent(c.address + ' ' + c.city)}`} target="_blank" rel="noreferrer" className={`${c.id === 'thapathali' && !c.openingSoon ? 'flex-1' : 'w-11'} h-11 rounded-full border border-linen flex items-center justify-center hover:border-gold hover:text-[#007C83]`} title="Directions"><Navigation size={15} /></a>
              </div>
            </div>
          ))}
        </div>
        {shown.length === 0 && <p className="text-center text-mocha py-10">No branches match "{q}". <button onClick={() => setQ('')} className="underline text-golddark">Clear search</button></p>}
        <div id="branch-waitlist" className="mt-10 bg-white border border-linen shadow-sm rounded-3xl p-8 sm:p-10 grid md:grid-cols-2 gap-6 items-center scroll-mt-24">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-golddark">Expanding Across Nepal</p>
            <h3 className="font-display text-3xl sm:text-4xl mt-2 text-ink">More branches coming soon</h3>
            <p className="text-mocha text-sm mt-2">Join the waitlist for founding-member pricing (30% off your first year).</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); alert('You are on the waitlist! Watch your inbox for founding-member pricing.'); }} className="flex gap-2">
            <input required type="email" placeholder="Email for waitlist" className="flex-1 bg-sand border border-linen rounded-full px-5 py-3 text-sm placeholder:text-stone2 focus:border-gold" />
            <button className="bg-gold hover:bg-[#00747B] text-white rounded-full px-6 text-xs tracking-widest uppercase">Notify Me</button>
          </form>
        </div>
      </div>
    </div>
  );
}