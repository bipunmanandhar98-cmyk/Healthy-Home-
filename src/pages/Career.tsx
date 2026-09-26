import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Clock, ArrowRight, Check, ChevronDown, ChevronUp, Search, Filter, Star, Heart, Award, Users, GraduationCap, Stethoscope, BarChart2, Shield, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useBooking } from '../components/chrome';
import { SectionHead, CtaBanner } from '../components/shared';

const fadeUp = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } as const;

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
};

const jobs: Job[] = [
  {
    id: 'physiotherapist-001',
    title: 'Physiotherapist',
    department: 'Weight Management',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Join our Weight Management team as a Physiotherapist. You will work closely with clinicians and wellness coaches to design personalized movement and rehabilitation programs for clients undergoing weight loss, body shaping, and post-treatment recovery.',
    responsibilities: [
      'Conduct initial physical assessments and movement screenings for new clients',
      'Design individualized exercise and rehabilitation programs',
      'Guide clients through supervised sessions (mobility, strength, posture correction)',
      'Collaborate with physicians and coaches to adjust programs based on progress',
      'Document session notes and progress reports in client records',
      'Educate clients on home exercise routines and injury prevention',
      'Support pre/post CoolSculpting and body shaping treatment protocols'
    ],
    requirements: [
      'Bachelor\'s degree in Physiotherapy (BPT) or equivalent',
      'Valid Nepal Health Professional Council (NHPC) registration',
      'Minimum 2 years clinical experience (weight management/sports rehab preferred)',
      'Strong manual therapy and exercise prescription skills',
      'Excellent communication skills in Nepali and English',
      'Ability to work in a multidisciplinary team environment'
    ],
    benefits: [
      'Competitive salary with performance bonuses',
      'Health insurance for self + dependents',
      'Continuing education allowance (Rs. 50,000/year)',
      'Free Healthy Home services for self + 50% off for family',
      'Professional development and mentorship program',
      'Paid leave: 18 days annual + 12 days sick + public holidays'
    ],
    postedDate: '2026-01-15',
    deadline: '2026-02-28'
  },
  {
    id: 'dermatology-nurse-002',
    title: 'Dermatology Nurse',
    department: 'Dermatology',
    location: 'Baneshwor, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'We are seeking a compassionate Dermatology Nurse to assist our specialists in delivering world-class skin treatments including HydraFacial, laser procedures, chemical peels, and skin tightening.',
    responsibilities: [
      'Prepare treatment rooms and ensure sterile field for all procedures',
      'Assist dermatologists during laser, peel, and injectable treatments',
      'Conduct pre-treatment skin assessments and document findings',
      'Provide post-treatment care instructions and follow-up calls',
      'Manage inventory of consumables, serums, and single-use items',
      'Maintain equipment (laser, HydraFacial, RF devices) per protocols',
      'Support client education on home care regimens and product usage'
    ],
    requirements: [
      'PCL Nursing or B.Sc. Nursing from recognized institution',
      'Valid Nepal Nursing Council registration',
      'Minimum 1 year experience in dermatology, aesthetics, or plastic surgery unit',
      'Knowledge of laser safety protocols and skin physiology',
      'Calm, professional demeanor with excellent client interaction skills',
      'Willingness to train on advanced aesthetic devices'
    ],
    benefits: [
      'Competitive salary with quarterly incentives',
      'Health insurance for self + dependents',
      'Free dermatology treatments for self',
      'Advanced aesthetic training certification sponsorship',
      'Flexible shift options (day/evening)',
      'Paid leave: 18 days annual + 12 days sick + public holidays'
    ],
    postedDate: '2026-01-20',
    deadline: '2026-03-15'
  },
  {
    id: 'wellness-coach-003',
    title: 'Wellness Coach',
    department: 'Weight Management',
    location: 'Pulchowk, Lalitpur',
    type: 'Full-time',
    experience: '1+ year',
    description: 'As a Wellness Coach, you will be the primary guide for clients on their weight management journey — providing nutrition counseling, habit coaching, and motivational support through in-person and virtual sessions.',
    responsibilities: [
      'Conduct weekly coaching sessions (in-person and virtual)',
      'Create personalized nutrition plans based on BCA results and dietary preferences',
      'Track client progress through weekly weigh-ins, measurements, and check-ins',
      'Adjust plans based on progress, lifestyle changes, and client feedback',
      'Facilitate group workshops on meal prep, mindful eating, and behavior change',
      'Coordinate with physiotherapists and physicians for integrated care',
      'Maintain detailed coaching logs and progress reports'
    ],
    requirements: [
      'Bachelor\'s in Nutrition, Dietetics, Public Health, or related field',
      'Certification in Health Coaching (NBHWC, ACE, or equivalent) preferred',
      'Minimum 1 year experience in weight management, clinical nutrition, or wellness coaching',
      'Strong motivational interviewing and behavior change counseling skills',
      'Proficiency in Nepali and English (Newari a plus)',
      'Comfortable using digital coaching platforms and body composition analyzers'
    ],
    benefits: [
      'Competitive salary with client outcome bonuses',
      'Health insurance for self + dependents',
      'Free Weight Management program for self + family discount',
      'Annual wellness retreat sponsorship',
      'Continuing education budget (Rs. 30,000/year)',
      'Paid leave: 18 days annual + 12 days sick + public holidays'
    ],
    postedDate: '2026-01-25',
    deadline: '2026-03-31'
  },
  {
    id: 'lab-technician-004',
    title: 'Lab Technician',
    department: 'Lab Tests',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Join our Lab Tests team to perform high-quality sample collection, processing, and analysis for our Whole Body Lab Test panel. You will ensure accuracy, timely reporting, and exceptional client experience.',
    responsibilities: [
      'Perform venipuncture and capillary blood collection with minimal discomfort',
      'Process samples (centrifugation, aliquoting, labeling) per SOPs',
      'Operate and maintain automated analyzers (biochemistry, hematology, immunoassay)',
      'Perform quality control checks and document results',
      'Ensure proper sample storage, transport, and chain-of-custody',
      'Collaborate with pathologists for result verification and critical value alerts',
      'Maintain lab accreditation documentation and participate in proficiency testing'
    ],
    requirements: [
      'B.Sc. Medical Laboratory Technology (BMLT) or equivalent',
      'Valid Nepal Health Professional Council registration as Lab Technologist',
      'Minimum 2 years experience in clinical laboratory (automated analyzers preferred)',
      'Strong knowledge of pre-analytical, analytical, and post-analytical phases',
      'Attention to detail and commitment to quality assurance',
      'Ability to work early morning shifts for fasting sample collection'
    ],
    benefits: [
      'Competitive salary with shift differential',
      'Health insurance for self + dependents',
      'Free annual Whole Body Lab Test for self + family',
      'Professional development: ASCP/IFCC certification support',
      'Modern, climate-controlled lab with latest analyzers',
      'Paid leave: 18 days annual + 12 days sick + public holidays'
    ],
    postedDate: '2026-02-01',
    deadline: '2026-03-31'
  },
  {
    id: 'front-desk-005',
    title: 'Front Desk Coordinator',
    department: 'Operations',
    location: 'Jamal, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Be the first point of contact for clients at our flagship branch. Manage appointments, client inquiries, billing, and ensure a seamless check-in/check-out experience.',
    responsibilities: [
      'Greet clients warmly and manage check-in/check-out flow',
      'Schedule and confirm appointments across multiple specialists',
      'Handle phone, email, and walk-in inquiries about services and pricing',
      'Process payments, generate invoices, and manage insurance claims',
      'Maintain client records and update CRM with accurate information',
      'Coordinate with clinical team for smooth client transitions',
      'Manage waitlist and optimize daily schedule utilization'
    ],
    requirements: [
      'Bachelor\'s degree in any discipline (Hospitality/Health Admin preferred)',
      'Minimum 1 year front desk experience (healthcare, hospitality, or spa)',
      'Excellent communication skills in Nepali and English',
      'Proficient in clinic management software / CRM / MS Office',
      'Strong organizational skills and ability to multitask under pressure',
      'Professional appearance and client-first mindset'
    ],
    benefits: [
      'Competitive salary with performance incentives',
      'Health insurance for self + dependents',
      'Free Healthy Home services for self (Rs. 25,000/year credit)',
      'Career growth path to Center Supervisor / Operations Manager',
      'Paid leave: 18 days annual + 12 days sick + public holidays',
      'Staff discounts on all products and family services'
    ],
    postedDate: '2026-02-05',
    deadline: '2026-03-15'
  },
  {
    id: 'marketing-associate-006',
    title: 'Marketing Associate',
    department: 'Marketing',
    location: 'Thapathali, Kathmandu (Hybrid)',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Drive brand awareness and client acquisition through digital marketing, content creation, social media, and community events. Work closely with the marketing lead to execute campaigns across all 6 branch.',
    responsibilities: [
      'Create and schedule social media content (Instagram, Facebook, TikTok)',
      'Write blog posts, email newsletters, and SMS campaigns',
      'Coordinate influencer collaborations and client testimonial videos',
      'Manage Google Ads, Meta Ads, and local SEO efforts',
      'Plan and execute monthly wellness events at branches',
      'Track and report on KPIs: reach, engagement, leads, conversions',
      'Support referral program and loyalty campaign execution'
    ],
    requirements: [
      'Bachelor\'s in Marketing, Communications, or related field',
      'Minimum 1 year digital marketing experience (healthcare/wellness a plus)',
      'Strong copywriting skills in English (Nepali a plus)',
      'Proficient in Canva, Meta Business Suite, Google Analytics, Mailchimp',
      'Creative eye for visual content and basic video editing (CapCut/Reels)',
      'Data-driven mindset with ability to optimize campaigns'
    ],
    benefits: [
      'Competitive salary with campaign performance bonuses',
      'Health insurance for self + dependents',
      'Free Healthy Home services for self + family discount',
      'Marketing conference/training budget (Rs. 50,000/year)',
      'Flexible hybrid work (3 days office / 2 days remote)',
      'Paid leave: 18 days annual + 12 days sick + public holidays'
    ],
    postedDate: '2026-02-10',
    deadline: '2026-03-31'
  }
];

const departments = ['All', 'Weight Management', 'Dermatology', 'Lab Tests', 'Operations', 'Marketing'];
const locations = ['All', 'Thapathali, Kathmandu', 'Baneshwor, Kathmandu', 'Pulchowk, Lalitpur', 'Jamal, Kathmandu'];
const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract'];

const values = [
  { icon: Heart, title: 'Client-First Culture', desc: 'Every decision starts with "what\'s best for the client?" — honest care over upselling.' },
  { icon: Award, title: 'Clinical Excellence', desc: 'Physician-led, evidence-based protocols. 100+ hours academy training for every specialist.' },
  { icon: GraduationCap, title: 'Growth & Learning', desc: 'Annual education budgets, certification sponsorships, mentorship programs, and clear career paths.' },
  { icon: Users, title: 'Collaborative Team', desc: 'Multidisciplinary rounds, cross-department projects, and a culture of mutual support.' },
  { icon: Shield, title: 'Work-Life Balance', desc: 'Reasonable shifts, generous leave, hybrid options where possible, and wellness credits.' },
  { icon: Sparkles, title: 'Innovation Welcome', desc: 'New ideas encouraged — from treatment protocols to client experience improvements.' },
];

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'Senior Physiotherapist', location: 'Thapathali', tenure: '3 years', text: 'I\'ve grown from a junior physio to leading the Weight Management rehabilitation program. The mentorship here is real — senior physicians invest time in your development. Plus, seeing clients transform their lives is incredibly rewarding.', avatar: '/images/site/team-1.jpg' },
  { name: 'Sanjana Thapa', role: 'Dermatology Nurse', location: 'Baneshwor', tenure: '2 years', text: 'The training on advanced laser and RF devices gave me skills I couldn\'t get elsewhere. Management sponsors certifications, and the team feels like family. I\'ve also used my staff credits for treatments — my skin has never looked better!', avatar: '/images/site/team-2.jpg' },
  { name: 'Rajan KC', role: 'Wellness Coach', location: 'Pulchowk', tenure: '1.5 years', text: 'What I love is the autonomy to design coaching plans that actually work for Nepali lifestyles. No cookie-cutter diets. The outcome-based bonuses motivate me, and the hybrid schedule lets me pursue my master\'s degree part-time.', avatar: '/images/site/team-3.jpg' },
  { name: 'Anita Gurung', role: 'Front Desk Supervisor', location: 'Jamal', tenure: '4 years', text: 'Started as a coordinator, now supervising the flagship branch\'s front desk. The career path is clear — they promote from within. Health insurance for my family and free services for me are huge perks. Proud to be part of Healthy Home\'s growth.', avatar: '/images/site/team-4.jpg' },
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
  { icon: Calendar, title: 'Generous Leave', desc: '18 days annual + 12 days sick + all public holidays + birthday off' },
  { icon: Shield, title: 'Career Growth', desc: 'Clear promotion paths, mentorship, internal transfers across 6 branch' },
  { icon: Star, title: 'Staff Perks', desc: 'Referral bonuses, wellness retreats, product discounts, flexible schedules' },
];

export default function Career() {
  const { openBooking } = useBooking();
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
    openBooking({ treatment: job.department.toLowerCase().replace(' ', '-') });
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
    </div>
  );
}