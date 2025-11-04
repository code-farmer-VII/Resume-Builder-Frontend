import jsPDF from 'jspdf';
import { Resume } from '../lib/type';

const formatDate = (dateString: string | Date) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short'
  });
};

// Reusable: balanced lines (whole words, equal length)
const splitIntoBalancedLines = (
  pdf: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] => {
  pdf.setFontSize(fontSize);
  pdf.setFont('arial', 'normal');

  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (pdf.getTextWidth(test) <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);

  return lines;
};

export const generatePDF = async (data: Resume, fileName: string): Promise<void> => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 57;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeightFactor = 1.15;
  let y = margin;

  const addPageIfNeeded = (estimatedHeight: number) => {
    if (y + estimatedHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const getTextHeight = (text: string, fontSize: number, maxWidth: number) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    return lines.length * fontSize * lineHeightFactor;
  };

  const addSectionHeader = (title: string) => {
    addPageIfNeeded(14 * lineHeightFactor + 15);
    pdf.setFontSize(14);
    pdf.setFont('arial', 'bold');
    pdf.text(title.toUpperCase(), margin, y);
    y += 7 * lineHeightFactor;
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, margin + contentWidth, y);
    y += 15;
    pdf.setFont('arial', 'normal');
  };

  // === HEADER: NAME ===
  pdf.setFontSize(24);
  pdf.setFont('arial', 'bold');
  const nameLines = pdf.splitTextToSize(data.full_name, contentWidth);
  nameLines.forEach((line: string) => {
    const lineWidth = pdf.getTextWidth(line);
    const x = margin + (contentWidth - lineWidth) / 2;
    pdf.text(line, x, y);
    y += 24 * lineHeightFactor;
  });

  // === CONTACTS ===
  pdf.setFontSize(10);
  pdf.setFont('arial', 'normal');
  y += 5;

  const contacts: { text: string, link?: string }[] = [];
  const separator = ' | ';
  const separatorWidth = pdf.getTextWidth(separator);
  let totalWidth = 0;

  if (data.phone) contacts.push({ text: data.phone });
  if (data.email) contacts.push({ text: data.email, link: `mailto:${data.email}` });
  if (data.linkedin) contacts.push({ text: 'LinkedIn', link: data.linkedin });

  contacts.forEach((c, i) => {
    totalWidth += pdf.getTextWidth(c.text);
    if (i < contacts.length - 1) totalWidth += separatorWidth;
  });

  let currentX = margin + (contentWidth - totalWidth) / 2;
  contacts.forEach((c, i) => {
    pdf.textWithLink(c.text, currentX, y, c.link ? { url: c.link } : {});
    currentX += pdf.getTextWidth(c.text);
    if (i < contacts.length - 1) {
      pdf.text(separator, currentX, y);
      currentX += separatorWidth;
    }
  });

  y += 10 * lineHeightFactor + 10;
  pdf.setLineWidth(1);
  pdf.line(margin, y, margin + contentWidth, y);
  y += 15;

  // === PROFESSIONAL SUMMARY ===
  if (data.summary) {
    addSectionHeader('Professional Summary');
    const lines = splitIntoBalancedLines(pdf, data.summary, contentWidth, 11);
    lines.forEach((line) => {
      addPageIfNeeded(11 * lineHeightFactor);
      pdf.setFontSize(11);
      pdf.text(line, margin, y);
      y += 11 * lineHeightFactor;
    });
    y += 15;
  }

  // === PROFESSIONAL EXPERIENCE ===
  if (data.experience && data.experience.length > 0) {
    addSectionHeader('Professional Experience');
    data.experience.forEach((exp) => {
      let estimatedHeight = 12 * lineHeightFactor * 2 + 10;
      if (exp.description) {
        exp.description.forEach((item) => {
          estimatedHeight += getTextHeight(item, 11, contentWidth - 10);
        });
      }
      addPageIfNeeded(estimatedHeight);

      // Company + Dates
      pdf.setFont('arial', 'bold');
      pdf.setFontSize(12);
      pdf.text(exp.company, margin, y);
      const dateStr = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      const dateWidth = pdf.getTextWidth(dateStr);
      pdf.text(dateStr, margin + contentWidth - dateWidth, y);
      y += 12 * lineHeightFactor + 5;

      // Position + Location
      pdf.setFontSize(12);
      pdf.setFont('arial', 'italic');
      pdf.text(exp.position, margin, y);
      const locStr = `${exp.city}${exp.city && exp.state ? ', ' : ''}${exp.state}`;
      const locWidth = pdf.getTextWidth(locStr);
      pdf.text(locStr, margin + contentWidth - locWidth, y);
      y += 12 * lineHeightFactor;

      // === BULLET DESCRIPTIONS ===
      if (exp.description && exp.description.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('arial', 'normal');

        exp.description.forEach((item) => {
          const lines = splitIntoBalancedLines(pdf, item, contentWidth - 10, 11);

          lines.forEach((line, i) => {
            addPageIfNeeded(11 * lineHeightFactor);
            const bullet = i === 0 ? '• ' : '  ';   // Every bullet item gets • on first line
            pdf.text(bullet + line, margin + 5, y);
            y += 11 * lineHeightFactor;
          });
        });
      }
      y += 10;
    });
    y += 10;
  }

  // === EDUCATION ===
  if (data.education && data.education.length > 0) {
    addSectionHeader('Education');
    data.education.forEach((edu) => {
      let estimatedHeight = 12 * lineHeightFactor * (edu.field ? 3 : 2) + (edu.gpa ? 12 * lineHeightFactor : 0) + 10;
      addPageIfNeeded(estimatedHeight);

      pdf.setFontSize(12);
      pdf.setFont('arial', 'bolditalic');
      pdf.text(edu.degree, margin, y);
      const locStr = `${edu.city}${edu.city && edu.state ? ', ' : ''}${edu.state}`;
      const locWidth = pdf.getTextWidth(locStr);
      pdf.text(locStr, margin + contentWidth - locWidth, y);
      y += 12 * lineHeightFactor;

      pdf.setFont('arial', 'normal');
      pdf.text(edu.institution, margin, y);
      const dateStr = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`;
      const dateWidth = pdf.getTextWidth(dateStr);
      pdf.text(dateStr, margin + contentWidth - dateWidth, y);
      y += 12 * lineHeightFactor;

      if (edu.field) {
        pdf.text(edu.field, margin, y);
        y += 12 * lineHeightFactor;
      }
      if (edu.gpa) {
        pdf.setFont('arial', 'bolditalic');
        const gpaStr = `GPA: ${edu.gpa}`;
        const gpaWidth = pdf.getTextWidth(gpaStr);
        pdf.text(gpaStr, margin + contentWidth - gpaWidth, y - 12 * lineHeightFactor);
      }
      y += 10;
    });
    y += 10;
  }

  // === SKILLS ===
  if (data.skills && data.skills.length > 0) {
    addSectionHeader('Skills');
    pdf.setFontSize(11);
    data.skills.forEach((group) => {
      pdf.setFont('arial', 'bold');
      const groupNameText = `${group.groupName}: `;
      const groupNameWidth = pdf.getTextWidth(groupNameText);
      const skillsText = group.skills.join(', ');
      const skillsMaxWidth = contentWidth - groupNameWidth - 5;
      const skillsLines = pdf.splitTextToSize(skillsText, skillsMaxWidth);
      const estimatedHeight = skillsLines.length * 11 * lineHeightFactor + 5;
      addPageIfNeeded(estimatedHeight);

      pdf.text(`• ${groupNameText}`, margin, y);
      pdf.setFont('arial', 'italic');
      pdf.setFontSize(10);
      pdf.text(skillsLines, margin + groupNameWidth + 5, y);
      y += skillsLines.length * 11 * lineHeightFactor + 5;
    });
    y += 10;
  }

  // === PROJECTS ===
  if (data.projects && data.projects.length > 0) {
    addSectionHeader('Projects');
    data.projects.forEach((project) => {
      let estimatedHeight = 12 * lineHeightFactor + getTextHeight(project.description, 11, contentWidth) + 10;
      if (project.technologies) estimatedHeight += 11 * lineHeightFactor;
      addPageIfNeeded(estimatedHeight);

      pdf.setFontSize(12);
      pdf.setFont('arial', 'bold');
      if (project.link) {
        pdf.textWithLink(project.name, margin, y, { url: project.link });
      } else {
        pdf.text(project.name, margin, y);
      }
      y += 12 * lineHeightFactor;

      pdf.setFontSize(11);
      pdf.setFont('arial', 'normal');
      const descLines = splitIntoBalancedLines(pdf, project.description, contentWidth, 11);
      descLines.forEach((line, i) => {
        addPageIfNeeded(11 * lineHeightFactor);
        pdf.text(`${i === 0 ? '• ' : '  '}${line}`, margin + 5, y);
        y += 11 * lineHeightFactor;
      });

      if (project.technologies && project.technologies.length > 0) {
        y += 5;
        pdf.setFont('arial', 'italic');
        pdf.text(project.technologies.join(', '), margin, y);
        y += 11 * lineHeightFactor;
      }
      y += 10;
    });
    y += 10;
  }

  // === CERTIFICATIONS ===
  if (data.certifications && data.certifications.length > 0) {
    addSectionHeader('Certifications');
    data.certifications.forEach((cert) => {
      let estimatedHeight = 12 * lineHeightFactor + 11 * lineHeightFactor + 10;
      addPageIfNeeded(estimatedHeight);

      pdf.setFontSize(12);
      pdf.setFont('arial', 'bold');
      if (cert.link) {
        pdf.textWithLink(cert.name, margin, y, { url: cert.link });
      } else {
        pdf.text(cert.name, margin, y);
      }
      y += 12 * lineHeightFactor;

      pdf.setFontSize(11);
      pdf.setFont('arial', 'normal');
      pdf.text(cert.issuer, margin, y);
      const dateStr = cert.date;
      const dateWidth = pdf.getTextWidth(dateStr);
      pdf.text(dateStr, margin + contentWidth - dateWidth, y);
      y += 11 * lineHeightFactor + 10;
    });
  }

  pdf.save(fileName);
};