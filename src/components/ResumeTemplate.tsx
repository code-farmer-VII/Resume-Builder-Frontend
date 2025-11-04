/*  ResumeTemplate.tsx  –  matches the PDF layout 1-to-1  */
import React from 'react';
import { Resume } from '../lib/type';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface ResumeTemplateProps {
  data: Resume;
  editable?: boolean;
  onEdit?: (field: string, value: any) => void;
}

/* --------------------------------------------------------------- */
/*  Helper – split a paragraph into balanced lines (same as PDF)   */
/* --------------------------------------------------------------- */
const splitIntoBalancedLines = (
  text: string,
  maxChars = 90 // approx. chars that fit in the content area
): string[] => {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= maxChars) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

/* --------------------------------------------------------------- */
const formatDate = (dateString: string | Date) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const handleExperienceEdit = (
  currentExperience: Resume['experience'],
  expIndex: number,
  descIndex: number,
  newValue: string,
  onEdit: (field: string, value: any) => void
) => {
  if (!currentExperience) return;
  const updated = JSON.parse(JSON.stringify(currentExperience));
  updated[expIndex].description[descIndex] = newValue;
  onEdit('experience', updated);
};

/* --------------------------------------------------------------- */
export const ResumeTemplate: React.FC<ResumeTemplateProps> = ({
  data,
  editable = false,
  onEdit,
}) => {
  const printStyles = `
    @page { size: A4; margin: 40mm; }
    @media print { body { -webkit-print-color-adjust: exact; } }
  `;

  return (
    <div
      id="resume-content"
      className="bg-white w-full max-w-[8.5in] mx-auto font-sans print:shadow-none"
    >
      <style>{printStyles}</style>

      {/* ---------- PAGE PADDING (≈ 20 mm) ---------- */}
      <div className="p-16 print:p-0">

        {/* ---------- HEADER ---------- */}
        <header className="border-b-2 border-gray-800 pb-4 mb-6">
          {/* NAME */}
          <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight text-center">
            {editable ? (
              <input
                type="text"
                value={data.full_name}
                onChange={(e) => onEdit?.('full_name', e.target.value)}
                className="w-full text-center border-b border-transparent hover:border-blue-400 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              data.full_name
            )}
          </h1>

          {/* CONTACTS – icons + text, centered */}
          <div className="flex justify-center gap-6 text-sm text-gray-600 mt-2">
            {data.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} />
                <span>{data.phone}</span>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{data.email}</span>
              </div>
            )}
            {data.linkedin && (
              <a href={data.linkedin} className="flex items-center gap-1">
                <Linkedin size={14} />
                <span>Linkedin</span>
              </a>
            )}
          </div>
        </header>

        {/* ---------- THIN LINE UNDER HEADER ---------- */}
        {/* <div className="border-t border-gray-800 mb-4" /> */}

        {/* ---------- PROFESSIONAL SUMMARY ---------- */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-300 pb-0.5">
              Professional Summary
            </h2>

            {editable ? (
              <textarea
                value={data.summary}
                onChange={(e) => onEdit?.('summary', e.target.value)}
                rows={4}
                className="w-full text-sm text-gray-700 leading-relaxed border border-transparent hover:border-blue-400 focus:border-blue-500 focus:outline-none p-1 rounded resize-y"
              />
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed space-y-0.5">
                {/* {splitIntoBalancedLines(data.summary).map((line, i) => (
                  <p key={i}>{line}</p>
                ))} */}
                {data.summary}
              </div>
            )}
          </section>
        )}

        {/* ---------- PROFESSIONAL EXPERIENCE ---------- */}
        {data.experience?.length ? (
          <section className="mb-6 print:break-inside-avoid">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-300 pb-0.5">
              Professional Experience
            </h2>

            {data.experience.map((exp, idx) => (
              <div key={idx} className="mb-5">

                {/* COMPANY + DATES (right-aligned) */}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{exp.company}</p>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>
                      {formatDate(exp.startDate)} -{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>

                {/* POSITION + LOCATION */}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <p className="text-xs italic text-gray-700">{exp.position}</p>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>
                      {exp.city}{exp.city && exp.state && ', '}{exp.state}
                    </p>
                  </div>
                </div>

                {/* BULLET DESCRIPTIONS */}
                {exp.description?.length ? (
                  <div className="mt-1 text-xs text-gray-700 leading-relaxed">
                    {editable && onEdit ? (
                      <textarea
                        value={exp.description.join('\n')}
                        onChange={(e) => onEdit('experience', data.experience.map((ex, i) => i === idx ? { ...ex, description: e.target.value.split('\n') } : ex))}
                        rows={exp.description.join('\n').split('\n').length + 1}
                        className="w-full border border-transparent hover:border-blue-400 focus:border-blue-500 focus:outline-none p-1 rounded resize-y"
                      />
                    ) : (
                      <p>{exp.description.join(' ')}</p>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {/* ---------- EDUCATION ---------- */}
        {data.education?.length ? (
          <section className="mb-6 print:break-inside-avoid">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-300 pb-0.5">
              Education
            </h2>

            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-xs text-gray-700">{edu.institution}</p>
                    {edu.field && <p className="text-xs text-gray-600">{edu.field}</p>}
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>
                      {edu.city}{edu.city && edu.state && ', '}{edu.state}
                    </p>
                    <p>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {edu.gpa && <p className="font-medium">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {/* ---------- SKILLS ---------- */}
        {data.skills?.length ? (
          <section className="mb-6 print:break-inside-avoid">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1 border-b border-gray-300 pb-0.5">
              Skills
            </h2>

            <div className="space-y-0.5">
              {data.skills.map((group, idx) => (
                <div key={idx} className="flex items-start text-xs">
                  <span className="font-bold text-gray-800 w-36 print:w-32">
                    {group.groupName}:
                  </span>
                  <span className="italic text-gray-700">{group.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ---------- PROJECTS ---------- */}
        {data.projects?.length ? (
          <section className="mb-6 print:break-inside-avoid">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-300 pb-0.5">
              Projects
            </h2>

            {data.projects.map((proj, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-900">{proj.name}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>

                <div className="mt-0.5 text-xs text-gray-700 leading-relaxed">
                  {editable && onEdit ? (
                    <textarea
                      value={proj.description}
                      onChange={(e) => onEdit('projects', data.projects.map((p, i) => i === idx ? { ...p, description: e.target.value } : p))}
                      rows={proj.description.split('\n').length + 1}
                      className="w-full border border-transparent hover:border-blue-400 focus:border-blue-500 focus:outline-none p-1 rounded resize-y"
                    />
                  ) : (
                    <p>{proj.description}</p>
                  )}
                </div>

                {proj.technologies?.length ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {proj.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {/* ---------- CERTIFICATIONS ---------- */}
        {data.certifications?.length ? (
          <section className="mb-6 print:break-inside-avoid">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-300 pb-0.5">
              Certifications
            </h2>

            {data.certifications.map((cert, idx) => (
              <div key={idx} className="mb-3">
                <p className="text-xs font-bold text-gray-900">{cert.name}</p>
                <p className="text-xs text-gray-700">
                  {cert.issuer} – {cert.date}
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 ml-2 hover:underline"
                    >
                      View Certificate
                    </a>
                  )}
                </p>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
};