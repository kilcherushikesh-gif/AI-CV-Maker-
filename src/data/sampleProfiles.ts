import { ResumeData } from '../types/resume';

export const SAMPLE_TECH_LEAD: ResumeData = {
  id: 'sample-tech-lead',
  title: 'Lead Full-Stack Software Engineer CV',
  personalInfo: {
    fullName: 'Rishi',
    jobTitle: 'Lead Full-Stack Software Engineer & Solutions Architect',
    email: 'rishi.dev@example.com',
    phone: '+1 (555) 382-9104',
    location: 'Bengaluru, India (Open to Remote)',
    website: 'https://rishi.dev',
    linkedin: 'linkedin.com/in/rishi-dev',
    github: 'github.com/rishi-dev',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  summary: 'High-impact Lead Full-Stack Software Engineer with 6+ years of expertise architecting high-scale web platforms, distributed cloud microservices, and AI integrations. Spearheaded technical delivery of enterprise web applications serving 1.5M+ active users, cutting API latency by 44% and lowering cloud infrastructure costs. Proven track record in TypeScript, React, Next.js, Node.js, Python, and AWS cloud ecosystem. Dedicated to clean code, ATS-friendly documentation, and agile engineering leadership.',
  experiences: [
    {
      id: 'exp-1',
      role: 'Lead Software Engineer / Tech Lead',
      company: 'Apex Cloud Solutions',
      location: 'Bengaluru, India',
      startDate: '2022-04',
      endDate: 'Present',
      current: true,
      description: 'Heading architecture and full-stack engineering team for cloud data and enterprise collaboration platform.',
      bullets: [
        'Architected real-time event streaming and synchronization engine using Node.js, Redis, and WebSockets, cutting latency by 45% for 850K concurrent users.',
        'Mentored an engineering squad of 8 developers, standardizing TypeScript testing with Jest and Playwright to achieve 92% automated code coverage.',
        'Led migration from monolithic backend to decoupled microservices on AWS ECS and Lambda, producing $75,000 annual cloud infrastructure savings.',
        'Spearheaded integration of Gemini AI workflow automation, accelerating customer query resolution times by 52%.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Senior Full-Stack Developer',
      company: 'FinPulse Digital Technologies',
      location: 'Mumbai, India',
      startDate: '2019-08',
      endDate: '2022-03',
      current: false,
      description: 'Built high-throughput payment checkout workflows and financial analytics dashboards.',
      bullets: [
        'Engineered responsive merchant payment portals with React, Next.js, and TypeScript, processing $12M+ in monthly transactions with 99.98% uptime.',
        'Refactored relational PostgreSQL schemas and query indexing, reducing p99 API response duration from 580ms to 78ms.',
        'Established automated CI/CD pipelines via GitHub Actions and Docker, reducing production deployment release cycle from 40 minutes to under 6 minutes.',
      ],
    },
    {
      id: 'exp-3',
      role: 'Software Engineer',
      company: 'Nexa Innovations',
      location: 'Bengaluru, India',
      startDate: '2018-06',
      endDate: '2019-07',
      current: false,
      bullets: [
        'Developed client-facing web modules and RESTful APIs using React, Redux, Node.js, and MongoDB, elevating user retention by 26%.',
        'Implemented rigorous API validation and integration test suites, reducing customer-reported edge-case bugs by 35%.',
      ],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Engineering',
      school: 'National Institute of Technology (NIT)',
      location: 'India',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '8.9 / 10.0',
      honors: 'First Class with Distinction',
    },
  ],
  skillCategories: [
    {
      id: 'skills-frontend',
      category: 'Frontend & UI',
      items: ['React 19', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Redux Toolkit', 'HTML5/CSS3'],
    },
    {
      id: 'skills-backend',
      category: 'Backend & Cloud',
      items: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'REST APIs', 'GraphQL', 'AWS (ECS, Lambda, S3, RDS)', 'Docker', 'Microservices'],
    },
    {
      id: 'skills-databases',
      category: 'Databases & Caching',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB'],
    },
    {
      id: 'skills-practices',
      category: 'DevOps, AI & Practices',
      items: ['System Design', 'CI/CD Pipelines', 'Git/GitHub', 'Jest', 'Playwright', 'Gemini AI API', 'Agile/Scrum', 'Performance Optimization'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniFlow - High-Throughput Task Orchestration Engine',
      role: 'Lead Architect & Maintainer',
      link: 'https://github.com/rishi-dev/omniflow',
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      description: 'Distributed job scheduler and queue visualizer capable of dispatching 40,000+ jobs/minute with automated failover and telemetry.',
      bullets: [
        'Built zero-dependency lightweight DAG scheduling engine with sub-millisecond task dispatch latency.',
        'Star count exceeded 1,800+ on GitHub with adoption across 15+ developer teams.',
      ],
    },
    {
      id: 'proj-2',
      name: 'AI-Powered Smart ATS Resume Parser',
      role: 'Sole Developer',
      link: 'https://github.com/rishi-dev/ai-resume-parser',
      technologies: ['React', 'Next.js', 'Gemini API', 'Tailwind CSS', 'TypeScript'],
      description: 'Intelligent resume auditing engine that parses candidate CVs, detects missing high-priority keywords, and scores ATS job match readiness in real time.',
      bullets: [
        'Achieved 96% accuracy extracting candidate skills, experience years, and quantifiable bullet achievements.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-09',
      link: 'https://aws.amazon.com/certification',
    },
    {
      id: 'cert-2',
      name: 'Meta Certified Full-Stack Developer Professional',
      issuer: 'Coursera / Meta',
      issueDate: '2022-07',
    },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Professional' },
    { id: 'lang-2', language: 'Hindi', proficiency: 'Native' },
    { id: 'lang-3', language: 'Marathi', proficiency: 'Native' },
  ],
  customSections: [],
  sectionOrder: ['summary', 'experiences', 'skills', 'projects', 'educations', 'certifications', 'languages'],
};

export const SAMPLE_PRODUCT_MANAGER: ResumeData = {
  id: 'sample-pm',
  title: 'Lead Product Manager CV',
  personalInfo: {
    fullName: 'Elena Rostova',
    jobTitle: 'Principal Product Manager',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 890-1234',
    location: 'Seattle, WA',
    website: 'https://elenarostova.com',
    linkedin: 'linkedin.com/in/elena-rostova-pm',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  summary: 'Data-driven Principal Product Manager with 8+ years steering 0-to-1 consumer and enterprise SaaS products. Proven record accelerating ARR growth from $3M to $28M through iterative user research, rapid experimentation, and cross-functional alignment across 30+ designers and engineers.',
  experiences: [
    {
      id: 'pm-exp-1',
      role: 'Lead Product Manager',
      company: 'Zenith SaaS Platforms',
      location: 'Seattle, WA',
      startDate: '2021-04',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led product strategy and roadmap for AI analytics suite, driving $14M net new ARR within 18 months of launch.',
        'Spearheaded onboarding overhaul using cohort analysis and automated product walkthroughs, raising 30-day activation by 34%.',
        'Coordinated with Sales, Marketing, and Customer Success to reduce churn from 4.8% to 1.9% year-over-year.',
      ],
    },
    {
      id: 'pm-exp-2',
      role: 'Senior Product Manager',
      company: 'Kinetix Media',
      location: 'San Francisco, CA',
      startDate: '2018-09',
      endDate: '2021-03',
      current: false,
      bullets: [
        'Owned creator monetization tools, rolling out subscription tipping and digital storefronts to 450,000 creators.',
        'Executed 40+ A/B tests on conversion funnels, generating a verified 22% bump in checkout completion rate.',
      ],
    },
  ],
  educations: [
    {
      id: 'pm-edu-1',
      degree: 'Master of Business Administration (MBA)',
      field: 'Product Strategy & Technology Management',
      school: 'Northwestern University (Kellogg)',
      location: 'Evanston, IL',
      startDate: '2016-09',
      endDate: '2018-06',
    },
    {
      id: 'pm-edu-2',
      degree: 'B.A. in Economics & Data Analytics',
      field: 'Quantitative Economics',
      school: 'University of Washington',
      location: 'Seattle, WA',
      startDate: '2012-09',
      endDate: '2016-06',
    },
  ],
  skillCategories: [
    {
      id: 'pm-skills-1',
      category: 'Product & Strategy',
      items: ['Product Roadmap', 'User Journey Mapping', 'A/B Experimentation', 'Go-To-Market (GTM)', 'Pricing Models'],
    },
    {
      id: 'pm-skills-2',
      category: 'Analytics & Tools',
      items: ['SQL', 'Mixpanel', 'Amplitude', 'Tableau', 'Jira', 'Figma', 'Linear'],
    },
  ],
  projects: [
    {
      id: 'pm-proj-1',
      name: 'AI Insights Copilot',
      role: 'Product Lead',
      technologies: ['Generative AI', 'NLP', 'Data Pipelines'],
      description: 'Zero-prompt natural language business intelligence assistant integrated into enterprise dashboards.',
      bullets: [
        'Adopted by 85 enterprise tier accounts within first quarter.',
      ],
    },
  ],
  certifications: [
    {
      id: 'pm-cert-1',
      name: 'Certified Scrum Product Owner (CSPO)',
      issuer: 'Scrum Alliance',
      issueDate: '2020-05',
    },
  ],
  languages: [
    { id: 'pm-lang-1', language: 'English', proficiency: 'Native' },
    { id: 'pm-lang-2', language: 'Spanish', proficiency: 'Fluent' },
  ],
  customSections: [],
  sectionOrder: ['summary', 'experiences', 'skills', 'projects', 'educations', 'certifications', 'languages'],
};

export const SAMPLE_GRADUATE: ResumeData = {
  id: 'sample-grad',
  title: 'Junior Software Engineer CV',
  personalInfo: {
    fullName: 'Maya Patel',
    jobTitle: 'Junior Software Developer',
    email: 'maya.patel@alumni.edu',
    phone: '+1 (555) 432-8765',
    location: 'Chicago, IL (Relocating anywhere)',
    website: 'https://mayapatel.tech',
    linkedin: 'linkedin.com/in/mayapatel-cs',
    github: 'github.com/mayapatel',
  },
  summary: 'Motivated Computer Science graduate with strong fundamentals in full-stack web development, data structures, and algorithmic problem solving. Winner of 2 collegiate hackathons with hands-on internship experience building responsive React applications and REST APIs.',
  experiences: [
    {
      id: 'grad-exp-1',
      role: 'Software Engineering Intern',
      company: 'BlueWave Digital',
      location: 'Chicago, IL',
      startDate: '2024-05',
      endDate: '2024-08',
      current: false,
      bullets: [
        'Refactored legacy customer support portal into modern React 18 frontend, decreasing page load time by 38%.',
        'Created 12 REST API endpoints in Python FastAPI with automated Swagger documentation and unit tests.',
        'Collaborated daily with senior engineers in an agile team, participating in peer code reviews and sprint retrospectives.',
      ],
    },
  ],
  educations: [
    {
      id: 'grad-edu-1',
      degree: 'B.S. in Computer Science',
      field: 'Software Systems',
      school: 'University of Illinois Urbana-Champaign',
      location: 'Urbana, IL',
      startDate: '2020-08',
      endDate: '2024-05',
      gpa: '3.92 / 4.00',
      honors: 'Dean\'s List all semesters, Summa Cum Laude',
    },
  ],
  skillCategories: [
    {
      id: 'grad-skills-1',
      category: 'Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL'],
    },
    {
      id: 'grad-skills-2',
      category: 'Technologies',
      items: ['React', 'Node.js', 'FastAPI', 'Git', 'Docker', 'PostgreSQL', 'Tailwind CSS'],
    },
  ],
  projects: [
    {
      id: 'grad-proj-1',
      name: 'EduTrack - Study Schedule AI',
      role: 'Solo Developer',
      link: 'https://github.com/mayapatel/edutrack',
      technologies: ['React', 'TypeScript', 'Node.js', 'OpenAI/Gemini API'],
      description: 'Intelligent study planner web application that generates personalized spaced-repetition schedules for university exams.',
      bullets: [
        'Used by 1,800+ students on campus with 4.8/5 star feedback.',
      ],
    },
  ],
  certifications: [
    {
      id: 'grad-cert-1',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      issueDate: '2023-11',
    },
  ],
  languages: [
    { id: 'grad-lang-1', language: 'English', proficiency: 'Native' },
    { id: 'grad-lang-2', language: 'Hindi', proficiency: 'Native' },
  ],
  customSections: [],
  sectionOrder: ['summary', 'educations', 'experiences', 'skills', 'projects', 'certifications', 'languages'],
};

export const INITIAL_EMPTY_RESUME: ResumeData = {
  id: 'new-resume',
  title: 'My Professional CV',
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experiences: [],
  educations: [],
  skillCategories: [
    { id: 'cat-1', category: 'Core Skills', items: [] },
  ],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  sectionOrder: ['summary', 'experiences', 'educations', 'skills', 'projects', 'certifications', 'languages'],
};
