import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Plus, Trash2, X } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';



interface Experience {
  company: string;
  position: string;
  city: string;
  state: string;
  startDate: string | Date;
  endDate: string | Date;
  current: boolean;
  description: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  city: string;
  state: string;
  startDate: string | Date;
  endDate: string | Date;
  gpa: string;
}

interface SkillGroup {
  groupName: string;
  skills: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface ResumeData {
  title: string;
  full_name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
}

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void;
  initialData?: Partial<ResumeData>;
}

const ensureArray = (arr: any[] | undefined) => Array.isArray(arr) ? arr : [];

const ensureExperienceDescriptions = (experience: Experience[] | undefined) => {
  if (!experience) return [];
  return experience.map(exp => ({
    ...exp,
    description: ensureArray(exp.description),
  }));
};


export const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ResumeData>({
    title: initialData?.title || '',
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    linkedin: initialData?.linkedin || '',
    summary: initialData?.summary || '',
    experience: ensureExperienceDescriptions(initialData?.experience),
    education:
      initialData?.education || [
        {
          institution: '',
          degree: '',
          field: '',
          city: '',
          state: '',
          startDate: '',
          endDate: '',
          gpa: '',
        },
      ],
    skills:
      initialData?.skills || [
        {
          groupName: '',
          skills: [''],
        },
      ],
    projects:
      initialData?.projects || [
        {
          name: '',
          description: '',
          technologies: [''],
          link: '',
        },
      ],
    certifications: initialData?.certifications || [],
  });

  const [currentSkills, setCurrentSkills] = useState<string[]>(
    (formData.skills ?? []).map(() => '')
  );



  const updateField = (field: keyof ResumeData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };


  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          company: '',
          position: '',
          city: '',
          state: '',
          startDate: '',
          endDate: '',
          current: false,
          description: [''],
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'current' && value === true) {
      updated[index].endDate = '';
    }
    setFormData({ ...formData, experience: updated });
  };

  const addExperienceDescription = (expIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].description.push('');
    setFormData({ ...formData, experience: updated });
  };

  const updateExperienceDescription = (
    expIndex: number,
    descIndex: number,
    value: string
  ) => {
    const updated = [...formData.experience];
    updated[expIndex].description[descIndex] = value;
    setFormData({ ...formData, experience: updated });
  };

  const removeExperienceDescription = (expIndex: number, descIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].description = updated[expIndex].description.filter((_, i) => i !== descIndex);
    setFormData({ ...formData, experience: updated });
  };



  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          institution: '',
          degree: '',
          field: '',
          city: '',
          state: '',
          startDate: '',
          endDate: '',
          gpa: '',
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, education: updated });
  };



  const addSkillGroup = () => {
    setFormData({ ...formData, skills: [...formData.skills, { groupName: '', skills: [''] }] });
    setCurrentSkills([...currentSkills, '']);
  };

  const removeSkillGroup = (index: number) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  const updateSkillGroup = (index: number, field: keyof SkillGroup, value: any) => {
    const updated = [...formData.skills];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, skills: updated });
  };

  const addSkillToGroup = (groupIndex: number, skill: string) => {
    if (skill.trim() === '') return;
    const updated = [...formData.skills];
    updated[groupIndex].skills.push(skill.trim());
    setFormData({ ...formData, skills: updated });

    const updatedCurrentSkills = [...currentSkills];
    updatedCurrentSkills[groupIndex] = '';
    setCurrentSkills(updatedCurrentSkills);
  };

  const removeSkillFromGroup = (groupIndex: number, skillIndex: number) => {
    const updated = [...formData.skills];
    updated[groupIndex].skills = updated[groupIndex].skills.filter((_, i) => i !== skillIndex);
    setFormData({ ...formData, skills: updated });
  };

  const updateCurrentSkill = (groupIndex: number, value: string) => {
    const updatedCurrentSkills = [...currentSkills];
    updatedCurrentSkills[groupIndex] = value;
    setCurrentSkills(updatedCurrentSkills);
  };



  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', technologies: [''], link: '' }],
    });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, projects: updated });
  };

  const addProjectTechnology = (projIndex: number) => {
    const updated = [...formData.projects];
    updated[projIndex].technologies.push('');
    setFormData({ ...formData, projects: updated });
  };

  const updateProjectTechnology = (projIndex: number, techIndex: number, value: string) => {
    const updated = [...formData.projects];
    updated[projIndex].technologies[techIndex] = value;
    setFormData({ ...formData, projects: updated });
  };

  const removeProjectTechnology = (projIndex: number, techIndex: number) => {
    const updated = [...formData.projects];
    updated[projIndex].technologies = updated[projIndex].technologies.filter((_, i) => i !== techIndex);
    setFormData({ ...formData, projects: updated });
  };



  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', issuer: '', date: '', link: '' }],
    });
  };

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, certifications: updated });
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData: ResumeData = {
      ...formData,
      skills: formData.skills
        .map((group) => ({
          ...group,
          skills: group.skills.filter((skill) => skill.trim() !== ''),
        }))
        .filter((group) => group.groupName.trim() !== '' && group.skills.length > 0),
      experience: formData.experience.map((exp) => ({
        ...exp,
        description: exp.description.filter((d) => d.trim() !== ''),
      })),
      projects: formData.projects.map((proj) => ({
        ...proj,
        technologies: proj.technologies.filter((t) => t.trim() !== ''),
      })),
    };
    onSubmit(cleanedData);
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold  mb-4">Basic Information</h2>
        <div className="space-y-4">
          <Input
            label="Resume Title"
            placeholder="e.g., Software Engineer Resume"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john.doe@email.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/johndoe"
            value={formData.linkedin}
            onChange={(e) => updateField('linkedin', e.target.value)}
          />
          <Textarea
            label="Professional Summary"
            placeholder="Brief overview of your professional background and key achievements..."
            value={formData.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold ">Experience</h2>
          <Button
            type="button"
            size="sm"
            onClick={addExperience}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md"
          >
            <Plus size={16} className="mr-1" /> Add Experience
          </Button>
        </div>
        {formData.experience.length > 0 && formData.experience.map((exp, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  required
                />
                <Input
                  label="Position"
                  placeholder="Job Title"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="e.g., San Francisco"
                  value={exp.city}
                  onChange={(e) => updateExperience(index, 'city', e.target.value)}
                />
                <Input
                  label="State"
                  placeholder="e.g., CA"
                  value={exp.state}
                  onChange={(e) => updateExperience(index, 'state', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-zinc-200 mb-1">Start Date</label>
                  <DatePicker
                    selected={exp.startDate ? new Date(exp.startDate) : null}
                    onChange={(date) => updateExperience(index, 'startDate', date)}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-[#0f172a] text-white placeholder-blue-400 border-gray-600"
                    placeholderText="Select start date"
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-zinc-200 mb-1">End Date</label>
                  <DatePicker
                    selected={exp.endDate ? new Date(exp.endDate) : null}
                    onChange={(date) => updateExperience(index, 'endDate', date)}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    disabled={exp.current}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-[#0f172a] text-white placeholder-blue-400 border-gray-600"
                    placeholderText={exp.current ? 'Present' : 'Select end date'}
                    required={!exp.current}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                  className="rounded"
                />
                Currently working here
              </label>
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Responsibilities
                </label>
                {exp.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex gap-2 mb-2">
                    <Textarea
                      placeholder="Describe your achievement or responsibility..."
                      value={desc}
                      onChange={(e) => updateExperienceDescription(index, descIndex, e.target.value)}
                      rows={2}
                    />
                    {exp.description.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperienceDescription(index, descIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addExperienceDescription(index)}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md"
                >
                  <Plus size={14} className="mr-1" /> Add Description
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold ">Education</h2>
          <Button
            type="button"
            size="sm"
            onClick={addEducation}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md"
          >
            <Plus size={16} className="mr-1" /> Add Education
          </Button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
            {formData.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="space-y-4">
              <Input
                label="Institution"
                placeholder="University Name"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Degree"
                  placeholder="Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  required
                />
                <Input
                  label="Field of Study"
                  placeholder="Computer Science"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="e.g., Boston"
                  value={edu.city}
                  onChange={(e) => updateEducation(index, 'city', e.target.value)}
                />
                <Input
                  label="State"
                  placeholder="e.g., MA"
                  value={edu.state}
                  onChange={(e) => updateEducation(index, 'state', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-zinc-200 mb-1">Start Date</label>
                  <DatePicker
                    selected={edu.startDate ? new Date(edu.startDate) : null}
                    onChange={(date) => updateEducation(index, 'startDate', date)}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-[#0f172a] text-white placeholder-blue-400 border-gray-600"
                    placeholderText="Select start date"
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-zinc-200 mb-1">End Date</label>
                  <DatePicker
                    selected={edu.endDate ? new Date(edu.endDate) : null}
                    onChange={(date) => updateEducation(index, 'endDate', date)}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-[#0f172a] text-white placeholder-blue-400 border-gray-600"
                    placeholderText="Select end date"
                    required
                  />
                </div>
              </div>
              <Input
                label="GPA (Optional)"
                placeholder="3.8"
                value={edu.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold ">Skills</h2>
          <Button type="button" size="sm" onClick={addSkillGroup} className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md">
            <Plus size={16} className="mr-1" /> Add Skill Group
          </Button>
        </div>
        <div className="space-y-6">
          {formData.skills.map((group, groupIndex) => (
            <div key={groupIndex} className="p-4 border border-gray-200 rounded-lg relative">
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkillGroup(groupIndex)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="space-y-4">
                <Input
                  label="Skill Group"
                  placeholder="e.g., Frontend Development"
                  value={group.groupName}
                  onChange={(e) => updateSkillGroup(groupIndex, 'groupName', e.target.value)}
                  required
                />
                <div className="pl-4 border-l-2 border-blue-500 space-y-2">
                  <label className="block text-sm font-medium text-zinc-200 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {group.skills.filter(s => s.trim() !== '').map((skill, skillIndex) => (
                      <span key={skillIndex} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 text-sm px-2 py-1 rounded-full">
                        {skill}
                        <button type="button" onClick={() => removeSkillFromGroup(groupIndex, skillIndex)} className="text-blue-300 hover:text-white">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., React.js"
                      value={currentSkills[groupIndex]}
                      onChange={(e) => updateCurrentSkill(groupIndex, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkillToGroup(groupIndex, currentSkills[groupIndex]);
                        }
                      }}
                    />
                    <Button
                    className='bg-gradient-to-r from-blue-500 to-pink-500 text-white'
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        addSkillToGroup(groupIndex, currentSkills[groupIndex]);
                      }}
                    >
                      <Plus size={14} className="mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold ">Projects</h2>
          <Button
            type="button"
            size="sm"
            onClick={addProject}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md"
          >
            <Plus size={16} className="mr-1" /> Add Project
          </Button>
        </div>
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
            {formData.projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="space-y-4">
              <Input
                label="Project Name"
                placeholder="Project Title"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                required
              />
              <Textarea
                label="Description"
                placeholder="Describe the project..."
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={3}
              />
              <Input
                label="Project Link (Optional)"
                placeholder="https://github.com/username/project"
                value={project.link}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Technologies Used
                </label>
                {project.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex gap-2 mb-2">
                    <Input
                      placeholder="e.g., React, TypeScript"
                      value={tech}
                      onChange={(e) => updateProjectTechnology(index, techIndex, e.target.value)}
                    />
                    {project.technologies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProjectTechnology(index, techIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addProjectTechnology(index)}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md"
                >
                  <Plus size={14} className="mr-1" /> Add Technology
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold ">Certifications (Optional)</h2>
          <Button
            type="button"
            size="sm"
            onClick={addCertification}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:opacity-90 shadow-md"
          >
            <Plus size={16} className="mr-1" /> Add Certification
          </Button>
        </div>
        {formData.certifications.map((cert, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
            <div className="space-y-4">
              <Input
                label="Certification Name"
                placeholder="AWS Certified Solutions Architect"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Issuer"
                  placeholder="Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  required
                />
                <Input
                  label="Date"
                  placeholder="Jan 2023"
                  value={cert.date}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                  required
                />
              </div>
              <Input
                label="Certificate Link (Optional)"
                placeholder="https://certification-url.com"
                value={cert.link}
                onChange={(e) => updateCertification(index, 'link', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className='bg-gradient-to-r from-blue-500 to-pink-500'>
          Generate Resume
        </Button>
      </div>
    </form>
  );
};
