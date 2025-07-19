export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  objective?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  cgpa?: string;
  percentage?: string;
  achievements?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  skills?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  achievements: Achievement[];
  certifications: Certification[];
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'creative';

export interface ResumeConfig {
  template: ResumeTemplate;
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
  showAchievements: boolean;
  showCertifications: boolean;
}
