import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Clock, ArrowRight, Check, ChevronDown, ChevronUp, Search, Filter, Star, Heart, Award, Users, GraduationCap, Stethoscope, BarChart2, Shield, Sparkles, X, Upload } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useBooking } from '../components/chrome';
import { SectionHead, CtaBanner } from '../components/shared';
import { IMG } from '../data/images';
/* Job listings and the filter options live in src/data/jobs.ts, which records
   exactly which fields came from the "Job tittle.xlsx" sheet and which were
   AI-drafted and still need review before these go live. See the header there.
   This page renders `publishedJobs` — all 32 roles are kept there as the full
   record, but only the advertised subset (one per department, no CEO and no
   Manager/Head-level role) is shown publicly. */
import { publishedJobs as jobs, departments, locations, jobTypes, type Job, LEAVE_POLICY } from '../data/jobs';
import {
  careersEmailConfigured,
  sendJobApplication,
  validateResume,
  RESUME_ACCEPT,
  type SendResult,
} from '../lib/applicationEmail';

const fadeUp = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } as const;

const values = [
  { icon: Heart, title: 'Client-First Culture', desc: 'Every decision starts with "what\'s best for the client?" — honest care over upselling.' },
  { icon: Award, title: 'Clinical Excellence', desc: 'Physician-led, evidence-based protocols. 100+ hours academy training for every specialist.' },
  { icon: GraduationCap, title: 'Growth & Learning', desc: 'Annual education budgets, certification sponsorships, mentorship programs, and clear career paths.' },
  { icon: Users, title: 'Collaborative Team', desc: 'Multidisciplinary rounds, cross-department projects, and a culture of mutual support.' },
  { icon: Shield, title: 'Work-Life Balance', desc: 'Reasonable shifts, generous leave, hybrid options where possible, and wellness credits.' },
  { icon: Sparkles, title: 'Innovation Welcome', desc: 'New ideas encouraged — from treatment protocols to client experience improvements.' },
];

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'Senior Physiotherapist', location: 'Thapathali', tenure: '3 years', text: 'I\'ve grown from a junior physio to leading the Weight Management rehabilitation program. The mentorship here is real — senior physicians invest time in your development. Plus, seeing clients transform their lives is incredibly rewarding.', avatar: IMG.staff.career1 },
  { name: 'Sanjana Thapa', role: 'Dermatology Nurse', location: 'Baneshwor', tenure: '2 years', text: 'The training on advanced laser and RF devices gave me skills I couldn\'t get elsewhere. Management sponsors certifications, and the team feels like family. I\'ve also used my staff credits for treatments — my skin has never looked better!', avatar: IMG.staff.career2 },
  { name: 'Rajan KC', role: 'Wellness Coach', location: 'Pulchowk', tenure: '1.5 years', text: 'What I love is the autonomy to design coaching plans that actually work for Nepali lifestyles. No cookie-cutter diets. The outcome-based bonuses motivate me, and the hybrid schedule lets me pursue my master\'s degree part-time.', avatar: IMG.staff.career3 },
  { name: 'Anita Gurung', role: 'Front Desk Supervisor', location: 'Jamal', tenure: '4 years', text: 'Started as a coordinator, now supervising the flagship branch\'s front desk. The career path is clear — they promote from within. Health insurance for my family and free services for me are huge perks. Proud to be part of Healthy Home\'s growth.', avatar: IMG.staff.career4 },
];

const stats = [
  { value: '100+', label: 'Team Members', icon: Users },
  { value: '6', label: 'Branch', icon: MapPin },
  { value: '94%', label: 'Staff Retention', icon: Heart },
  { value: '10+', label: 'Promotions', icon: ArrowRight },
];

const benefits = [
  { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive coverage for you + dependents (medical, dental, vision)' },
  { icon: GraduationCap, title: 'Learning Budget', desc: 'Rs. 30,000–50,000/year for courses, certifications, conferences' },
  { icon: Sparkles, title: 'Free Wellness Credits', desc: 'Rs. 25,000+ annual credits for Healthy Home services (self + family discounts)' },
  { icon: Calendar, title: 'Generous Leave', desc: `${LEAVE_POLICY.replace('Paid leave: ', '')} + birthday off` },
  { icon: Shield, title: 'Career Growth', desc: 'Clear promotion paths, mentorship, internal transfers across 6 branch' },
  { icon: Star, title: 'Staff Perks', desc: 'Referral bonuses, wellness retreats, product discounts, flexible schedules' },
];

/* ── Apply modal ─────────────────────────────────────────────────────────
   Single-column applicant form opened by a job's "Apply Now". Follows the
   booking modal's shell (same overlay, panel, scroll lock, Escape-to-close)
   but uses a one-pass layout rather than steps, since an application is short
   enough to take in one go. */
const fieldClass =
  'w-full bg-white border border-linen rounded-xl px-4 py-3 text-sm focus:border-gold transition';
const labelClass = 'block text-sm font-medium text-ink mb-1.5';
const reqClass = 'text-red-600';

function ApplyModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  /* A fresh form per opening, and no stale error or filename left over. */
  useEffect(() => {
    if (!job) return;
    formRef.current?.reset();
    setFileName('');
    setErr('');
    setResult(null);
    setSending(false);
    nameRef.current?.focus();
  }, [job]);

  /* Stop the page scrolling behind the panel while it is open. */
  useEffect(() => {
    if (!job) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [job]);

  useEffect(() => {
    if (!job) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [job, onClose]);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(data.get('applicant_name') ?? '').trim();
    const email = String(data.get('applicant_email') ?? '').trim();
    const phone = String(data.get('applicant_phone') ?? '').trim();
    const address = String(data.get('applicant_address') ?? '').trim();

    if (!name || !email || !phone || !address) {
      setErr('Please fill in your name, email, phone number and address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErr('That email address does not look right.');
      return;
    }
    const fileError = validateResume((data.get('applicant_resume') as File) ?? null);
    if (fileError) { setErr(fileError); return; }

    setErr('');
    setSending(true);
    const outcome = await sendJobApplication(formRef.current as HTMLFormElement);
    setSending(false);
    setResult(outcome);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          role="dialog" aria-modal="true" aria-labelledby="apply-title"
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        >
          <button
            onClick={onClose}
            aria-label="Close application form"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-stone2 hover:text-ink hover:bg-sand transition"
          >
            <X size={18} />
          </button>

          {result ? (
            <div className="p-8 text-center overflow-y-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 text-golddark flex items-center justify-center">
                <Check size={28} />
              </div>
              <h2 id="apply-title" className="font-display text-3xl mt-4">
                Application received
              </h2>

              {result === 'sent' ? (
                <p className="text-mocha mt-2 text-sm">
                  Thanks, {nameRef.current?.value.split(' ')[0] || 'there'} — your application and resume for{' '}
                  <span className="font-semibold text-ink">{job.title}</span> have been sent to our hiring team.
                  We'll be in touch at the email you gave us.
                </p>
              ) : (
                <p className="text-mocha mt-2 text-sm">
                  Your application for <span className="font-semibold text-ink">{job.title}</span> could not be
                  emailed from this site right now, so please send it to us directly at{' '}
                  <a href="mailto:recruit@healthyhome.com.np" className="text-golddark underline">recruit@healthyhome.com.np</a>{' '}
                  with your name and resume attached.
                </p>
              )}

              <div className="mt-5 bg-sand rounded-2xl p-5 text-left text-sm grid gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-stone2">Role</p>
                  <p className="font-medium">{job.title}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-stone2">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-stone2">Apply before</p>
                  <p className="font-medium">{new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <button onClick={onClose} className="mt-6 bg-gold text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#00747B]">
                Done
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="overflow-y-auto grow">
              <div className="px-6 pt-8 pb-1 sm:px-8 text-center">
                <h2 id="apply-title" className="font-display text-3xl sm:text-4xl text-ink">
                  Start Your Career Today
                </h2>
                <p className="text-sm text-mocha mt-2">
                  Please fill in your information to apply for the job.
                </p>
                <p className="text-[11px] text-stone2 mt-1">
                  {job.title} · {job.location}
                </p>
              </div>

              <div className="px-6 sm:px-8 py-5 grid gap-4">
                <div>
                  <label htmlFor="apply-name" className={labelClass}>
                    Applicant's Name<span className={reqClass}>*</span>
                  </label>
                  <input
                    ref={nameRef} id="apply-name" name="applicant_name" type="text" autoComplete="name"
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="apply-email" className={labelClass}>
                    Email Address<span className={reqClass}>*</span>
                  </label>
                  <input
                    id="apply-email" name="applicant_email" type="email" autoComplete="email"
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="apply-phone" className={labelClass}>
                    Contact Number<span className={reqClass}>*</span>
                  </label>
                  <input
                    id="apply-phone" name="applicant_phone" type="tel" autoComplete="tel"
                    placeholder="98XXXXXXXX"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="apply-address" className={labelClass}>
                    Current Address<span className={reqClass}>*</span>
                  </label>
                  <textarea
                    id="apply-address" name="applicant_address" rows={2}
                    placeholder="Where are you based right now?"
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <div>
                  <label htmlFor="apply-resume" className={labelClass}>
                    Upload Resume<span className={reqClass}>*</span>
                    <span className="font-normal text-stone2 text-xs ml-1.5">(Below 2MB, Format: pdf/docx/jpg)</span>
                  </label>
                  <div className="rounded-xl border border-linen bg-sand/50 px-3 py-2.5 flex items-center gap-3 flex-wrap">
                    <label
                      htmlFor="apply-resume"
                      className="inline-flex items-center gap-2 cursor-pointer bg-white border border-linen rounded-lg px-4 py-2 text-sm font-medium text-ink hover:border-gold transition shrink-0"
                    >
                      <Upload size={15} className="text-gold" />
                      Choose File
                    </label>
                    <span className="text-sm text-mocha truncate min-w-0">
                      {fileName || 'No file chosen'}
                    </span>
                    {/* Kept visually hidden rather than display:none, which would
                        make the input un-focusable and break the label's
                        click-to-open behaviour and screen readers. */}
                    <input
                      id="apply-resume" name="applicant_resume" type="file"
                      accept={RESUME_ACCEPT}
                      className="sr-only"
                      onChange={e => {
                        const f = e.target.files?.[0] ?? null;
                        setFileName(f ? f.name : '');
                        const problem = validateResume(f);
                        setErr(problem ?? '');
                      }}
                    />
                  </div>
                </div>

                {/* Carried through to the email template so the team knows the
                    role without cross-referencing the sender. */}
                <input type="hidden" name="job_title" value={job.title} />
                <input type="hidden" name="job_location" value={job.location} />
                <input type="hidden" name="job_department" value={job.department} />

                {err && (
                  <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    {err}
                  </p>
                )}

                {!careersEmailConfigured && (
                  <p className="text-xs text-stone2 bg-sand rounded-xl px-4 py-2.5">
                    Applications can't be emailed from this site yet. Submitting will show you how to send it directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gold hover:bg-[#00747B] text-white rounded-xl py-3.5 text-sm font-semibold tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending…' : 'Apply Now'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Career() {
  const { openBooking } = useBooking();
  const [applying, setApplying] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || job.department === selectedDept;
      const matchesLoc = selectedLoc === 'All' || job.location === selectedLoc;
      const matchesType = selectedType === 'All' || job.type === selectedType;
      return matchesSearch && matchesDept && matchesLoc && matchesType;
    });
  }, [searchQuery, selectedDept, selectedLoc, selectedType]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleApply = (job: Job) => {
    setApplying(job);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-xs text-stone2 flex items-center gap-1.5">
        <Link to="/" className="hover:text-ink inline-flex items-center min-h-[36px]">Home</Link>
        <span className="text-stone2">›</span>
        <span className="text-ink font-medium">Careers</span>
      </div>

      {/* Hero */}
      <section className="bg-white text-ink border-b border-linen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sand/70 via-cream/60 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-golddark">Join Our Team</p>
          <h1 className="font-display text-5xl sm:text-6xl mt-3">Build a career in <em className="gold-text not-italic">wellness</em></h1>
          <p className="text-mocha mt-4 max-w-xl mx-auto">Healthy Home is Nepal's leading wellness destination — 6 branch and 200+ professionals. We're growing and looking for passionate people to join our mission.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-mist">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> 6 Branch Across Nepal</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Physician-Led Care</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Growth & Learning Culture</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Competitive Benefits</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Statistics */}
        <motion.section {...fadeUp} className="mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-white border border-linen rounded-3xl p-6 text-center hover:shadow-xl transition">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gold/15 flex items-center justify-center mb-3"><stat.icon size={24} className="text-gold" /></div>
                <p className="font-display text-4xl text-ink font-semibold">{stat.value}</p>
                <p className="text-xs tracking-widest uppercase text-stone2 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Testimonials */}
        <motion.section {...fadeUp} className="mb-16 bg-sand/50 border-y border-linen rounded-3xl p-8 sm:p-12">
          <SectionHead eyebrow="Team Voices" title={<>What our people <em className="gold-text not-italic">say</em></>} center={false} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl overflow-hidden border border-linen hover:shadow-xl transition">
                <div className="h-40 overflow-hidden"><img src={t.avatar} alt={t.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" /></div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-gold text-gold" />)}</div>
                  </div>
                  <p className="text-sm text-mocha mb-4 leading-relaxed">"{t.text}"</p>
                  <div className="border-t border-linen pt-4">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-stone2">{t.role} · {t.location}</p>
                    <p className="text-xs text-stone2">{t.tenure} at Healthy Home</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Filters */}
        <motion.div {...fadeUp} className="bg-white border border-linen rounded-3xl p-6 mb-10">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone2" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, department, location..."
                className="w-full bg-white border border-linen rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-stone2 focus:border-gold"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="bg-white border border-linen rounded-full px-4 py-3 text-sm focus:border-gold appearance-none pr-10 cursor-pointer">
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={selectedLoc} onChange={e => setSelectedLoc(e.target.value)} className="bg-white border border-linen rounded-full px-4 py-3 text-sm focus:border-gold appearance-none pr-10 cursor-pointer">
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="bg-white border border-linen rounded-full px-4 py-3 text-sm focus:border-gold appearance-none pr-10 cursor-pointer">
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <p className="text-sm text-mocha">{filteredJobs.length} of {jobs.length} positions</p>
        </motion.div>

        {/* Job Listings */}
        <motion.div {...fadeUp} className="grid gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              {...fadeUp}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-linen rounded-3xl overflow-hidden hover:shadow-xl transition"
            >
              {/* Job Card - Collapsed */}
              <button
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                className="w-full p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] tracking-[0.15em] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full">{job.department}</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase bg-sand text-stone2 px-2.5 py-1 rounded-full">{job.type}</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full">{job.experience}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-ink mb-1">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-mocha">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Posted {formatDate(job.postedDate)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> Apply by {formatDate(job.deadline)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium text-golddark hidden sm:block">View Details</span>
                  {expandedJob === job.id ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className="text-gold" />}
                </div>
              </button>

              {/* Job Details - Expanded */}
              <AnimatePresence>
                {expandedJob === job.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-linen bg-sand/30"
                  >
                    <div className="p-6 sm:p-8 space-y-6">
                      <div>
                        <h4 className="font-display text-xl text-ink mb-3">About This Role</h4>
                        <p className="text-mocha leading-relaxed">{job.description}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-display text-lg text-ink mb-3 flex items-center gap-2"><Check size={16} className="text-gold" /> Key Responsibilities</h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-mocha"><span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-display text-lg text-ink mb-3 flex items-center gap-2"><Check size={16} className="text-gold" /> Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-mocha"><span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-display text-lg text-ink mb-3 flex items-center gap-2"><Check size={16} className="text-gold" /> Benefits & Perks</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {job.benefits.map((b, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-mocha bg-white border border-linen rounded-xl px-4 py-3"><Check size={14} className="text-gold shrink-0" />{b}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-linen/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-mocha">
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> Posted {formatDate(job.postedDate)}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} /> Deadline {formatDate(job.deadline)}</span>
                        </div>
                        <button
                          onClick={() => handleApply(job)}
                          className="bg-gold hover:bg-[#00747B] text-white px-6 py-3 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition flex items-center gap-2"
                        >
                          Apply Now <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {filteredJobs.length === 0 && (
          <motion.div {...fadeUp} className="text-center py-16">
            <p className="font-display text-3xl">No positions match your filters</p>
            <p className="text-mocha text-sm mt-2">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setSelectedDept('All'); setSelectedLoc('All'); setSelectedType('All'); }} className="mt-4 text-golddark underline underline-offset-2 text-sm">Clear all filters</button>
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-16">
          <CtaBanner />
        </div>
      </div>

      <ApplyModal job={applying} onClose={() => setApplying(null)} />
    </div>
  );
}
