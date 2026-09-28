/* ============================================================================
 * JOB LISTINGS — source: "Job tittle.xlsx" (Total Employee Position)
 * ============================================================================
 *
 * TITLES AND DEPARTMENTS are taken verbatim from the spreadsheet. Three
 * inconsistencies in the sheet were normalised so the filter has one clean
 * entry per department:
 *   - "Sales and Marketing" and "Sales &Marketing"  -> "Sales & Marketing"
 *   - trailing spaces on several "Operation " cells
 *   - CEO's department "All" -> "Leadership", because "All" is already the
 *     "no filter" option in the dropdown and two identical entries rendered
 *     a duplicated, meaningless choice
 * Everything else is as-written, including "Derma" and "Video Grapher &
 * Editor" — change those here if the sheet was a typo.
 *
 * ── REVIEW BEFORE PUBLISHING ────────────────────────────────────────────
 * The spreadsheet supplied only a title and a department. The description,
 * responsibilities, requirements, experience, type, location and dates below
 * were DRAFTED WITH AI and have not been confirmed by anyone at Healthy
 * Home. In particular the requirements imply specific qualifications and
 * registrations, and the posting dates/deadlines are placeholders. Please
 * have someone review all 32 before these go live as real vacancies.
 *
 * Location, type and posting dates are also absent from the sheet. Locations
 * were assigned by department so the location filter stays meaningful, and
 * all deadlines are set in the future relative to September 2026.
 * ========================================================================== */

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
};
/** The leave policy as specified by Healthy Home. Keep this the single source
 *  so the 32 listings and the org-level benefits section cannot drift apart. */
export const LEAVE_POLICY = 'Paid leave: 12 days annual + 12 days sick + all public holidays';

/* Benefits every role shares, including the leave policy. The listings below
   only carry their role-SPECIFIC extras; the shared block is prepended at the
   bottom of this file so all 32 stay consistent and the leave policy can be
   changed in exactly one place. */
const coreBenefits = [
  'Health insurance for self + dependents',
  'Free Healthy Home services for self (annual wellness credit)',
  'Staff discount on services and products for family',
  LEAVE_POLICY,
  'Learning budget for courses, trainings and certifications',
];

/** A listing as authored: `benefits` holds only the role-specific extras. */
type JobDraft = Omit<Job, 'benefits'> & { benefits?: string[] };

const drafts: JobDraft[] = [
  {
    id: 'ceo',
    title: 'CEO',
    department: 'Leadership',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '10+ years',
    description: 'Lead the whole organisation — clinical direction, branch growth and financial stewardship. Healthy Home is hiring a Chief Executive who can grow a multi-branch wellness brand without losing the standard of care that built it.',
    responsibilities: [
      'Set company strategy and hold the leadership team accountable to it',
      'Oversee clinical governance and service quality across all branches',
      'Drive branch expansion, revenue growth and profitability',
      'Own the annual budget, financial planning and key partnerships',
      'Represent Healthy Home with regulators, partners and the public',
      'Build and mentor the senior leadership team',
    ],
    requirements: [
      'Bachelor\'s degree in Business, Management or a related field',
      'MBA preferred',
      '10+ years senior leadership experience, ideally in healthcare or wellness',
      'Proven record of scaling multi-site operations',
      'Strong financial and people-management background',
    ],
    benefits: [
      'Executive performance bonus',
      'Health insurance for self + dependents',
      'Professional advisory support',
    ],
    postedDate: '2026-09-02',
    deadline: '2026-10-30',
  },
  {
    id: 'finance-manager',
    title: 'Finance Manager',
    department: 'Finance',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Take charge of Healthy Home\'s financial operations — budgeting, reporting, controls and compliance — across every branch.',
    responsibilities: [
      'Prepare monthly, quarterly and annual financial statements',
      'Build and monitor the annual budget across all branches',
      'Manage accounts receivable, payables and cash flow',
      'Maintain internal financial controls and audit readiness',
      'Ensure tax and regulatory compliance',
      'Support management with costing and profitability analysis',
    ],
    requirements: [
      'Bachelor\'s degree in Accounting, Finance or Commerce (CA/CMA preferred)',
      '5+ years in a financial leadership role',
      'Strong working knowledge of Nepal tax and accounting standards',
      'Proficiency in accounting software and Excel',
      'Experience managing multi-branch or multi-site finances',
    ],
    benefits: [
      'Performance bonus tied to financial targets',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-05',
    deadline: '2026-10-31',
  },
  {
    id: 'finance-officer',
    title: 'Finance Officer',
    department: 'Finance',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Support the finance team with day-to-day accounting, reconciliation and reporting so every branch closes cleanly on time.',
    responsibilities: [
      'Process day-to-day accounting entries and reconciliations',
      'Prepare payment vouchers and process staff and vendor payments',
      'Maintain ledgers for all branches and consolidate monthly figures',
      'Assist with budget tracking and variance reporting',
      'Support audit and inventory count processes',
      'Maintain proper filing of financial records',
    ],
    requirements: [
      'Bachelor\'s degree in Accounting, Finance or Commerce',
      '2+ years of accounting experience',
      'Working knowledge of Nepal tax rules',
      'Accuracy and attention to detail',
      'Comfortable with accounting software and MS Excel',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Study support for CA/CMA qualification',
    ],
    postedDate: '2026-09-05',
    deadline: '2026-10-31',
  },
  {
    id: 'finance-executive',
    title: 'Finance Executive',
    department: 'Finance',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'An entry-level finance role handling collections, expenses and basic bookkeeping across the branch network.',
    responsibilities: [
      'Handle cash and bank transactions accurately',
      'Record daily expenses and issue receipts',
      'Assist with client billing and payment follow-up',
      'Maintain supplier and expense documentation',
      'Support month-end closing activities',
    ],
    requirements: [
      'Bachelor\'s degree in Accounting, Finance or Commerce',
      '1+ year in a finance or accounts role',
      'Basic working knowledge of Excel and accounting software',
      'Attention to detail and honesty with cash handling',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Clear path to Finance Officer',
    ],
    postedDate: '2026-09-05',
    deadline: '2026-10-31',
  },
  {
    id: 'operation-manager',
    title: 'Operation Manager',
    department: 'Operation',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Run day-to-day operations across branches — staffing, scheduling, service quality and client experience.',
    responsibilities: [
      'Oversee daily branch operations and client experience',
      'Plan staff rosters, shift coverage and leave management',
      'Monitor service delivery standards and turnaround times',
      'Resolve operational issues and client escalations',
      'Coordinate between branches and head office',
      'Report operational KPIs to management',
    ],
    requirements: [
      'Bachelor\'s degree in Business Management, Hospitality or Healthcare Admin',
      '5+ years in an operations role, ideally in healthcare or wellness',
      'Experience managing staff rosters and shifts',
      'Strong problem-solving and communication skills',
      'Comfortable working across multiple locations',
    ],
    benefits: [
      'Performance incentives',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-08',
    deadline: '2026-10-31',
  },
  {
    id: 'franchise-head',
    title: 'Franchise Head',
    department: 'Business Development',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead franchise growth — recruit, qualify and support partners bringing Healthy Home to new locations across Nepal.',
    responsibilities: [
      'Develop the franchise pipeline and convert qualified leads',
      'Guide prospective franchisees through site and financial assessment',
      'Negotiate and close franchise agreements with legal',
      'Onboard new franchise partners and run initial training',
      'Support existing franchisees with business performance reviews',
    ],
    requirements: [
      'Bachelor\'s degree in Business or Marketing',
      '5+ years in franchise development or B2B sales',
      'Proven record of closing partnerships',
      'Strong presentation and negotiation skills',
      'Willingness to travel across Nepal',
    ],
    benefits: [
      'Sales commission on successful franchise sign-ups',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-08',
    deadline: '2026-10-31',
  },
  {
    id: 'franchise-officer',
    title: 'Franchise Officer',
    department: 'Business Development',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Support the franchise team with lead generation, partner communication and franchisee onboarding paperwork.',
    responsibilities: [
      'Generate and qualify franchise leads',
      'Maintain the franchise CRM and pipeline reports',
      'Coordinate site visits and partner meetings',
      'Assist with agreement documentation and onboarding logistics',
      'Liaise with existing franchisees for ongoing support',
    ],
    requirements: [
      'Bachelor\'s degree in Business or Marketing',
      '1+ year in sales or client-facing role',
      'Strong communication in Nepali and English',
      'Organised and comfortable with CRM tools',
    ],
    benefits: [
      'Sales incentives',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-08',
    deadline: '2026-10-31',
  },
  {
    id: 'hr-admin-manager',
    title: 'HR & Admin Manager',
    department: 'HR and Admin',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Own people operations and office administration — recruitment, contracts, records and workplace policy across all branches.',
    responsibilities: [
      'Lead recruitment, onboarding and offboarding for all branches',
      'Manage staff contracts, records, leave and attendance systems',
      'Handle employee relations, grievances and workplace discipline',
      'Maintain HR policies and ensure labour law compliance',
      'Oversee office administration, supplies and vendor contracts',
    ],
    requirements: [
      'Bachelor\'s degree in Human Resource Management or Business',
      '5+ years in an HR and administration role',
      'Strong knowledge of Nepal labour law',
      'Experience with recruitment systems and HR documentation',
      'Excellent interpersonal and confidential handling of records',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Professional HR training support',
    ],
    postedDate: '2026-09-10',
    deadline: '2026-10-31',
  },
  {
    id: 'hr-admin-intern',
    title: 'HR & Admin Intern',
    department: 'HR and Admin',
    location: 'Thapathali, Kathmandu',
    type: 'Internship',
    experience: 'No experience',
    description: 'A paid internship in recruitment and administration. You will learn end-to-end HR operations by supporting the HR & Admin Manager.',
    responsibilities: [
      'Assist with job posting and candidate screening',
      'Maintain staff files and HR documentation',
      'Support interview scheduling and candidate coordination',
      'Handle basic office admin duties and supply records',
      'Assist with onboarding paperwork for new staff',
    ],
    requirements: [
      'Currently pursuing a Bachelor\'s in Management, HR or a related field',
      'Strong written and spoken Nepali; English a plus',
      'MS Office familiarity',
      'Willingness to learn and take on varied tasks',
    ],
    benefits: [
      'Paid internship with mentoring',
      'Certificate of completion and strong reference',
      'Full scholarship consideration for further study',
    ],
    postedDate: '2026-09-10',
    deadline: '2026-10-15',
  },
  {
    id: 'head-marketing-sales',
    title: 'Head of Marketing & Sales',
    department: 'Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead brand and revenue growth — marketing campaigns, the sales team, and the strategy that connects both across all branches.',
    responsibilities: [
      'Set and execute the annual marketing and sales strategy',
      'Lead and coach the marketing and sales teams',
      'Own brand positioning, campaigns and budget allocation',
      'Drive lead generation and conversion targets',
      'Analyse campaign and sales performance to guide investment',
      'Represent the brand at events and in media',
    ],
    requirements: [
      'Bachelor\'s degree in Marketing, Communications or Business',
      '5+ years leading marketing and/or sales teams',
      'Experience in healthcare, wellness, beauty or hospitality preferred',
      'Strong analytical and commercial mindset',
      'Proven leadership and team management skills',
    ],
    benefits: [
      'Performance bonus on revenue targets',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-12',
    deadline: '2026-11-01',
  },
  {
    id: 'digital-marketing-manager',
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Run paid and organic digital campaigns across Meta, Google and TikTok, and turn clicks into booked appointments.',
    responsibilities: [
      'Plan and run paid campaigns on Meta, Google and TikTok',
      'Manage SEO, local listings and website content performance',
      'Build audiences, retargeting and lookalike strategies',
      'Set up tracking, pixels and conversion reporting',
      'Optimise campaigns against cost-per-booking targets',
      'Report monthly performance with clear recommendations',
    ],
    requirements: [
      'Bachelor\'s degree in Marketing, IT or a related field',
      '3+ years running digital performance campaigns',
      'Hands-on with Meta Ads Manager and Google Ads',
      'Strong analytical skills and comfort with dashboards',
      'Healthcare or wellness advertising experience is a plus',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Certification support for Google and Meta platforms',
    ],
    postedDate: '2026-09-12',
    deadline: '2026-11-01',
  },
  {
    id: 'graphic-designer-video-editor',
    title: 'Graphic Designer & Video Editor',
    department: 'Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Produce the brand\'s visual and video content — social posts, treatment explainers, reels and campaign assets.',
    responsibilities: [
      'Design social media posts, stories and campaign creatives',
      'Edit short-form video for Instagram, TikTok and YouTube',
      'Create treatment visuals and educational content',
      'Maintain a consistent brand look across all assets',
      'Adapt assets for different formats and platforms',
    ],
    requirements: [
      'Bachelor\'s degree or diploma in Graphic Design, Multimedia or a related field',
      '2+ years in design and video editing',
      'Expert in Adobe Photoshop, Illustrator and Premiere Pro',
      'Strong video editing and colour-grading skills',
      'A creative eye and attention to detail',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Creative hardware and software provided',
    ],
    postedDate: '2026-09-12',
    deadline: '2026-11-01',
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    department: 'Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'A design-focused role creating the static visual assets that carry the Healthy Home brand across print and digital.',
    responsibilities: [
      'Design brochures, posters, standees and print collateral',
      'Create social media and website graphics',
      'Prepare artwork for offset and digital printing',
      'Support the marketing team with design for events',
      'Maintain organised, production-ready design files',
    ],
    requirements: [
      'Bachelor\'s degree or diploma in Graphic Design or a related field',
      '1+ year of graphic design experience',
      'Strong Adobe Photoshop, Illustrator and InDesign skills',
      'Understanding of print production basics',
      'Good sense of layout, colour and typography',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Training in motion and brand design',
    ],
    postedDate: '2026-09-12',
    deadline: '2026-11-01',
  },
  {
    id: 'video-grapher-editor',
    title: 'Video Grapher & Editor',
    department: 'Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Shoot and edit video content on location — treatment footage, interviews, reels and branch documentaries.',
    responsibilities: [
      'Plan and shoot video at branches and events',
      'Operate camera, lighting and audio equipment',
      'Edit footage into engaging short-form and long-form content',
      'Manage footage storage and post-production workflow',
      'Support live shoots and marketing campaigns',
    ],
    requirements: [
      '1+ year in videography or video editing',
      'Hands-on with professional camera and lighting gear',
      'Strong editing skills in Premiere Pro, After Effects or DaVinci Resolve',
      'Ability to work on location and on a schedule',
      'Creative storytelling and a good eye for detail',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Access to professional camera equipment',
    ],
    postedDate: '2026-09-12',
    deadline: '2026-11-01',
  },
  {
    id: 'sales-supervisor',
    title: 'Sales Supervisor',
    department: 'Sales & Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Lead the inside sales and enquiry team — turning consultations into bookings, and coaching the team to hit target.',
    responsibilities: [
      'Supervise the sales team and allocate leads fairly',
      'Handle escalated client enquiries and objections',
      'Coach staff on service knowledge and sales techniques',
      'Monitor conversion rates and report on sales performance',
      'Coordinate sales offers with the marketing team',
    ],
    requirements: [
      'Bachelor\'s degree in Business, Sales or a related field',
      '3+ years in sales with at least 1 year leading a team',
      'Experience selling health, wellness or beauty services',
      'Strong communication in Nepali and English',
      'Target-driven and comfortable with incentives',
    ],
    benefits: [
      'Commission plus team performance bonus',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-14',
    deadline: '2026-11-01',
  },
  {
    id: 'sales-officer',
    title: 'Sales Officer',
    department: 'Sales & Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Talk to prospective clients, explain our services honestly, and guide them to the right program and branch.',
    responsibilities: [
      'Handle inbound calls, WhatsApp and walk-in enquiries',
      'Explain services, packages and pricing clearly',
      'Book consultations and follow up with interested clients',
      'Maintain a personal sales pipeline and daily targets',
      'Share honest guidance without overselling services',
    ],
    requirements: [
      'Bachelor\'s degree in any discipline',
      '1+ year in a sales or client-facing role',
      'Clear spoken Nepali and English',
      'Confident on the phone and in person',
      'Honest and client-first approach',
    ],
    benefits: [
      'Sales commission on every booking closed',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-14',
    deadline: '2026-11-01',
  },
  {
    id: 'sales-executive',
    title: 'Sales Executive',
    department: 'Sales & Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Drive client acquisition through outreach, follow-up calls and in-branch appointments at our flagship branch.',
    responsibilities: [
      'Reach out to new and past clients about relevant offers',
      'Convert enquiries into booked consultations',
      'Conduct in-branch client discussions',
      'Maintain accurate client records in the CRM',
      'Work towards monthly sales targets',
    ],
    requirements: [
      'Bachelor\'s degree in any discipline',
      '1+ year in sales, ideally in health or wellness',
      'Comfortable with CRM and basic reporting',
      'Self-motivated and target-oriented',
    ],
    benefits: [
      'Sales commission plus incentives',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-14',
    deadline: '2026-11-01',
  },
  {
    id: 'csr',
    title: 'CSR',
    department: 'Sales & Marketing',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Client Service Representative — the first point of contact for every client, on phone and in person.',
    responsibilities: [
      'Answer client calls and WhatsApp messages promptly',
      'Handle appointment scheduling and rescheduling',
      'Answer service, timing and pricing questions accurately',
      'Collect client feedback and route it to the right team',
      'Maintain polite, professional client communication',
    ],
    requirements: [
      'Bachelor\'s degree or Higher Secondary in any discipline',
      '1+ year in a customer service role',
      'Clear Nepali and working English',
      'Patient, polite and comfortable on the phone',
      'Basic computer and CRM familiarity',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Staff wellness credits and service access',
    ],
    postedDate: '2026-09-14',
    deadline: '2026-11-01',
  },
  {
    id: 'dermatologist',
    title: 'Dermatologist',
    department: 'Derma',
    location: 'Baneshwor, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead our clinical dermatology practice — consultations, treatment planning and oversight of laser, peel and facial protocols.',
    responsibilities: [
      'Conduct dermatology consultations and skin analysis',
      'Diagnose and plan treatment for complex skin concerns',
      'Oversee laser, HydraFacial, peel and tightening protocols',
      'Mentor and supervise the aesthetics team',
      'Maintain clinical records and treatment standards',
    ],
    requirements: [
      'MBBS with MD in Dermatology',
      'Valid Nepal Medical Council registration',
      '5+ years of dermatology practice',
      'Hands-on experience with aesthetic laser and devices',
      'Professional and empathetic manner with clients',
    ],
    benefits: [
      'Consultation and procedure incentive structure',
      'Health insurance for self + dependents',
      'Free Dermatology services for self + family',
    ],
    postedDate: '2026-09-16',
    deadline: '2026-11-15',
  },
  {
    id: 'outlet-manager',
    title: 'Outlet Manager/ Branch Manager',
    department: 'Operation',
    location: 'Jamal, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Run a Healthy Home branch end to end — team, client experience, revenue and day-to-day operations.',
    responsibilities: [
      'Manage daily branch operations and client experience',
      'Lead, schedule and appraise the branch team',
      'Own branch revenue, expenses and cash handling',
      'Ensure service quality, hygiene and equipment upkeep',
      'Handle escalations and client feedback',
      'Report branch performance to head office',
    ],
    requirements: [
      'Bachelor\'s degree in Business or Healthcare Administration',
      '5+ years managing a branch or outlet',
      'Experience in healthcare, wellness, beauty or hospitality',
      'Strong leadership and people-management skills',
      'Comfortable with sales targets and cash handling',
    ],
    benefits: [
      'Branch performance bonus',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-16',
    deadline: '2026-11-15',
  },
  {
    id: 'protocol-head',
    title: 'Protocol Head',
    department: 'Operation',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Own the clinical protocols and service standards that every branch follows, and keep them current and auditable.',
    responsibilities: [
      'Develop and update treatment protocols and SOPs',
      'Ensure all branches follow consistent clinical standards',
      'Train staff on new protocols and techniques',
      'Audit branches for protocol compliance',
      'Coordinate protocol updates with clinical leads',
    ],
    requirements: [
      'Bachelor\'s degree in Nursing, Physiotherapy or Healthcare',
      '5+ years in a clinical or clinical-operations role',
      'Strong understanding of treatment procedures',
      'Excellent documentation and training skills',
      'Detail-oriented and compliance-focused',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Paid clinical training and certification',
    ],
    postedDate: '2026-09-16',
    deadline: '2026-11-15',
  },
  {
    id: 'front-desk-supervisor',
    title: 'Front Desk Supervisor',
    department: 'Front Desk',
    location: 'Jamal, Kathmandu',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Lead the front desk team and own the client\'s first and last impression of every branch visit.',
    responsibilities: [
      'Supervise front desk staff and daily desk operations',
      'Manage appointment scheduling and diary capacity',
      'Handle billing, payments and insurance coordination',
      'Address client complaints and service recovery',
      'Train new front desk staff on systems and service',
    ],
    requirements: [
      'Bachelor\'s degree in any discipline',
      '3+ years in front desk or client service, 1+ year supervising',
      'Experience with clinic or hospitality operations',
      'Proficiency in CRM / clinic software and MS Office',
      'Calm, organised and client-first',
    ],
    benefits: [
      'Supervisory allowance and performance incentives',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-18',
    deadline: '2026-11-15',
  },
  {
    id: 'front-desk-officer',
    title: 'Front Desk Officer',
    department: 'Front Desk',
    location: 'Jamal, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Welcome clients, manage the appointment book, and keep the front desk running smoothly through the day.',
    responsibilities: [
      'Greet clients and manage check-in and check-out',
      'Schedule and confirm appointments across specialists',
      'Handle phone, email and walk-in enquiries',
      'Process payments and issue receipts',
      'Keep client records accurate and up to date',
    ],
    requirements: [
      'Higher Secondary or Bachelor\'s degree in any discipline',
      '1+ year in a front desk or receptionist role',
      'Good spoken Nepali and English',
      'Comfortable with computer applications',
      'Professional appearance and courteous manner',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Free Healthy Home services for self',
    ],
    postedDate: '2026-09-18',
    deadline: '2026-11-15',
  },
  {
    id: 'nutrition-consultant',
    title: 'Nutrition Consultant',
    department: 'Operation',
    location: 'Pulchowk, Lalitpur',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Assess clients nutritionally and build practical diet plans that fit real Nepali kitchens and budgets.',
    responsibilities: [
      'Conduct dietary assessment and nutrition counselling',
      'Build personalised meal plans for weight and wellness goals',
      'Use body composition data to guide nutrition targets',
      'Run group nutrition workshops',
      'Monitor client adherence and adjust plans over time',
    ],
    requirements: [
      'Bachelor\'s or Master\'s degree in Nutrition and Dietetics',
      '2+ years in clinical or public-health nutrition',
      'Strong counselling and communication skills',
      'Practical knowledge of Nepali dietary habits',
      'Comfortable using body composition analyzers',
    ],
    benefits: [
      'Consultation incentive structure',
      'Free Healthy Home services for self + family',
    ],
    postedDate: '2026-09-18',
    deadline: '2026-11-15',
  },
  {
    id: 'jr-nutrition-consultant',
    title: 'Jr. Nutrition Consultant',
    department: 'Operation',
    location: 'Pulchowk, Lalitpur',
    type: 'Full-time',
    experience: '0-1 years',
    description: 'A starting role in clinical nutrition, supporting senior consultants and managing follow-ups with clients.',
    responsibilities: [
      'Support senior consultants with client assessments',
      'Prepare sample diet charts and educational materials',
      'Conduct follow-up calls with clients on their nutrition plan',
      'Maintain client nutrition records',
      'Assist with group session preparation',
    ],
    requirements: [
      'Bachelor\'s degree in Nutrition, Dietetics or a related field',
      'Fresher or up to 1 year of relevant experience',
      'Clear communication in Nepali',
      'Compassionate and client-friendly manner',
    ],
    benefits: [
      'Structured training and mentorship',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-18',
    deadline: '2026-11-15',
  },
  {
    id: 'head-therapist',
    title: 'Head Therapist',
    department: 'Operation',
    location: 'Jamal, Kathmandu',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead the therapy team — body shaping, manual therapy and post-treatment rehabilitation — and set clinical standards.',
    responsibilities: [
      'Lead and supervise the therapist team',
      'Deliver advanced body shaping and manual therapy sessions',
      'Design treatment plans and progression for each client',
      'Maintain therapy records and progress notes',
      'Train therapists on new protocols and devices',
    ],
    requirements: [
      'Bachelor\'s degree in Physiotherapy (BPT) or a related field',
      'Valid Nepal Health Professional Council registration',
      '5+ years in physiotherapy or body-shaping therapy',
      'Hands-on experience with non-invasive body contouring devices',
      'Strong communication in Nepali and English',
    ],
    benefits: [
      'Supervisory allowance and performance incentives',
      'Free Healthy Home services for self + family',
    ],
    postedDate: '2026-09-20',
    deadline: '2026-11-20',
  },
  {
    id: 'therapist',
    title: 'Therapist',
    department: 'Operation',
    location: 'Jamal, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Deliver guided body shaping and therapy sessions, and guide clients through their treatment with care and honesty.',
    responsibilities: [
      'Conduct guided body shaping and therapy sessions',
      'Monitor client progress and update treatment plans',
      'Educate clients on home exercises and lifestyle changes',
      'Maintain session notes and treatment records',
      'Prepare and sanitise therapy rooms and equipment',
    ],
    requirements: [
      'Bachelor\'s degree in Physiotherapy or a related field',
      'Valid Nepal Health Professional Council registration',
      '1+ year in physiotherapy, fitness or body-shaping therapy',
      'Good communication and a caring approach',
      'Physically able to conduct hands-on sessions',
    ],
    benefits: [
      'Free Healthy Home services for self + family discount',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-20',
    deadline: '2026-11-20',
  },
  {
    id: 'aesthetic-nurse',
    title: 'Aesthetic Nurse',
    department: 'Operation',
    location: 'Baneshwor, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Support our dermatology team delivering laser, HydraFacial, peels and skin-tightening treatments safely.',
    responsibilities: [
      'Assist with laser, peel and facial treatments',
      'Complete pre-treatment skin assessments',
      'Maintain sterile technique and treatment room hygiene',
      'Manage consumables, serums and single-use items',
      'Provide aftercare instructions and follow-up calls',
    ],
    requirements: [
      'PCL in Nursing or B.Sc. in Nursing',
      'Valid Nepal Nursing Council registration',
      '1+ year in dermatology, aesthetics or a similar unit',
      'Knowledge of laser safety and skin physiology',
      'Calm, professional and client-focused',
    ],
    benefits: [
      'Aesthetic training and certification sponsorship',
      'Free dermatology treatments for self',
    ],
    postedDate: '2026-09-20',
    deadline: '2026-11-20',
  },
  {
    id: 'inventory-procurement-executive',
    title: 'Inventory & Procurement Executive',
    department: 'Inventory & Procurement',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Keep stock of clinical consumables, devices and retail products in the right branch, at the right level, at the right cost.',
    responsibilities: [
      'Manage purchase orders and supplier relationships',
      'Track stock levels across all branches',
      'Receive goods and verify quantities and quality',
      'Maintain stock records and conduct physical counts',
      'Flag slow-moving and fast-moving items to management',
      'Coordinate expiry management of consumables and products',
    ],
    requirements: [
      'Bachelor\'s degree in Supply Chain, Business or a related field',
      '2+ years in procurement or inventory management',
      'Experience with medical or retail consumables',
      'Strong record-keeping and reconciliation skills',
      'Proficiency in Excel and inventory software',
    ],
    benefits: [
      'Health insurance for self + dependents',
      'Transport allowance',
    ],
    postedDate: '2026-09-22',
    deadline: '2026-11-20',
  },
  {
    id: 'office-helper',
    title: 'Office Helper',
    department: 'Housekeeping',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: 'No experience',
    description: 'Keep our head office clean, tidy and well supplied, supporting a pleasant environment for staff and visitors.',
    responsibilities: [
      'Clean offices, meeting areas and common spaces',
      'Manage cleaning supplies and restock them',
      'Dispose of waste responsibly and maintain hygiene standards',
      'Support pantry and refreshment preparation for meetings',
      'Assist with basic office errands as needed',
    ],
    requirements: [
      'Basic literacy in Nepali',
      'Prior housekeeping or cleaning experience preferred',
      'Reliable, punctual and honest',
      'Physically fit for the role',
    ],
    benefits: [
      'Free Healthy Home services for self + family discount',
      'Meals provided during shift',
    ],
    postedDate: '2026-09-22',
    deadline: '2026-11-20',
  },
  {
    id: 'delivery-executive',
    title: 'Delivery Executive',
    department: 'Operation',
    location: 'Thapathali, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Deliver wellness products to clients across the Valley safely, accurately and on time.',
    responsibilities: [
      'Deliver products to clients on scheduled routes',
      'Verify orders before dispatch and obtain signatures',
      'Handle cash collection where applicable',
      'Maintain vehicle and delivery equipment',
      'Coordinate routes for timely delivery',
    ],
    requirements: [
      '1+ year in delivery or logistics',
      'Valid motorcycle or driving licence as relevant',
      'Good knowledge of Kathmandu Valley routes',
      'Honest and reliable with cash and goods',
      'Physical fitness for delivery work',
    ],
    benefits: [
      'Fuel and vehicle maintenance allowance',
      'Health insurance for self + dependents',
    ],
    postedDate: '2026-09-22',
    deadline: '2026-11-20',
  },
  {
    id: 'guest-relationship-executive',
    title: 'Guest Relationship Executive',
    department: 'Operation',
    location: 'Baneshwor, Kathmandu',
    type: 'Full-time',
    experience: '1+ year',
    description: 'Look after clients from their first visit onwards — welcome them, guide them, and follow up after treatment.',
    responsibilities: [
      'Welcome and guide clients through their branch visit',
      'Explain services clearly and answer questions honestly',
      'Follow up with clients after treatments to check progress',
      'Collect feedback and share it with the branch team',
      'Build long-term client relationships and encourage retention',
    ],
    requirements: [
      'Bachelor\'s degree in any discipline',
      '1+ year in client service, hospitality or wellness',
      'Warm, confident communication in Nepali and English',
      'Outgoing and relationship-focused personality',
      'Professional grooming and conduct',
    ],
    benefits: [
      'Wellness services for self + family',
      'Performance incentives for client retention',
    ],
    postedDate: '2026-09-22',
    deadline: '2026-11-20',
  },
];

/** Every listing gets the shared benefits first, then its own extras. */
export const jobs: Job[] = drafts.map(({ benefits = [], ...rest }) => ({
  ...rest,
  benefits: [...coreBenefits, ...benefits],
}));

/* ── What the public Careers page advertises ───────────────────────────────
   All 32 listings stay in `jobs` above as the record of every position, but
   only these are shown on the site: one per department, skipping the CEO and
   any Manager/Head-level role.

   To change what is advertised, edit this list — nothing else. Adding an id
   here also makes its department appear in the filter dropdown, because the
   filter options are derived from the published listings. */
const publishedIds: ReadonlySet<string> = new Set([
  'finance-officer',                    // Finance
  'nutrition-consultant',               // Operation
  'franchise-officer',                  // Business Development
  'hr-admin-intern',                    // HR and Admin
  'graphic-designer-video-editor',      // Marketing
  'sales-supervisor',                   // Sales & Marketing
  'dermatologist',                      // Derma
  'front-desk-supervisor',              // Front Desk
  'inventory-procurement-executive',    // Inventory & Procurement
  'office-helper',                      // Housekeeping
]);

/** The listings rendered on the public page, in sheet order. */
export const publishedJobs: Job[] = jobs.filter(j => publishedIds.has(j.id));

/* Sanity check: the set above should name a real listing, and should not have
   lost one through a typo. Throwing at module load turns a silent mistake
   (a filtered-out job that simply vanishes from the site) into a build error. */
{
  const known = new Set(jobs.map(j => j.id));
  const unknown = [...publishedIds].filter(id => !known.has(id));
  if (unknown.length > 0) {
    throw new Error(`[jobs] publishedIds contains unknown job id(s): ${unknown.join(', ')}`);
  }
}

/* Filter options, derived from the PUBLISHED listings only — otherwise the
   dropdown would offer departments that return zero results. 'All' is the
   "no filter" option.
   The guard below drops any real value that collides with that option —
   otherwise a department literally named "All" (as the spreadsheet has for
   the CEO) would render a second, identical entry in the dropdown. */
const ALL = 'All';
const unique = (values: string[]) =>
  [...new Set(values.map(v => v.trim()))].filter(v => v !== '' && v !== ALL);

export const departments = [ALL, ...unique(publishedJobs.map(j => j.department))];
export const locations = [ALL, ...unique(publishedJobs.map(j => j.location))];
export const jobTypes = [ALL, ...unique(publishedJobs.map(j => j.type))];
