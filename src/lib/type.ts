

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  full_name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  created_at: string;
  updated_at: string;
  ai_enhanced: boolean;
}

export interface SkillGroup {
  groupName: string;
  skills: string[];
}

export interface ExperienceEntry {
  company: string;
  position: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}
