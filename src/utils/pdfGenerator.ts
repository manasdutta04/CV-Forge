import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData, ResumeConfig } from '../types/resume';

export interface PDFGenerationOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
  margin?: number;
}

export class PDFGenerator {
  private static defaultOptions: PDFGenerationOptions = {
    filename: 'resume.pdf',
    quality: 1.0,
    format: 'a4',
    margin: 10
  };

  static async generateFromElement(
    element: HTMLElement, 
    options: PDFGenerationOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const margin = opts.margin!;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', opts.format);
      let position = margin;

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        position,
        imgWidth - (margin * 2),
        imgHeight
      );
      
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          position,
          imgWidth - (margin * 2),
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(opts.filename!);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateResumePDF(
    resumeData: ResumeData,
    config: ResumeConfig,
    options: PDFGenerationOptions = {}
  ): Promise<void> {
    const filename = options.filename || `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    const opts = { ...options, filename };

    // Create a temporary container for the resume
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width in pixels at 96 DPI
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Times New Roman, Times, serif';
    container.style.fontSize = '12pt';
    container.style.lineHeight = '1.2';
    container.style.color = '#000';
    container.style.padding = '6px 15px 25px 15px';
    container.style.boxSizing = 'border-box';

    // Generate HTML content for the resume
    container.innerHTML = this.generateResumeHTML(resumeData, config);
    
    // Append to body temporarily
    document.body.appendChild(container);

    try {
      await this.generateFromElement(container, opts);
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  }

  private static generateResumeHTML(resumeData: ResumeData, _config: ResumeConfig): string {
    const { personalInfo, education, experience, projects, skills, achievements } = resumeData;

    return `
      <div style="font-family: 'Times New Roman', 'Times', serif; font-size: 12pt; line-height: 1.2; color: #000000; background: #ffffff; padding: 15px 15px 25px 15px;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 12px; border-bottom: 1px solid #000000; padding-bottom: 6px;">
          <h1 style="font-size: 20pt; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">
            ${personalInfo.fullName}
          </h1>
          <div style="font-size: 11pt; margin: 3px 0;">
            ${personalInfo.phone ? personalInfo.phone : ''}${personalInfo.phone && personalInfo.email ? ' | ' : ''}${personalInfo.email ? personalInfo.email : ''}${(personalInfo.phone || personalInfo.email) && personalInfo.location ? ' | ' : ''}${personalInfo.location ? personalInfo.location : ''}
          </div>
          ${personalInfo.linkedIn ? `
            <div style="font-size: 11pt; margin: 3px 0;">
              LinkedIn: ${personalInfo.linkedIn}${personalInfo.github ? ` | GitHub: ${personalInfo.github}` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Objective -->
        ${personalInfo.objective ? `
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #000000; letter-spacing: 0.5px;">
              OBJECTIVE
            </h2>
            <div style="margin-left: 0;">
              <p style="font-size: 12pt; margin: 0; text-align: justify; line-height: 1.3;">
                ${personalInfo.objective}
              </p>
            </div>
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #000000; letter-spacing: 0.5px;">
              EDUCATION
            </h2>
            <div style="margin-left: 0;">
              ${education.map(edu => `
                <div style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                    <span style="font-weight: bold; font-size: 12pt;">
                      ${edu.degree} in ${edu.field}, ${edu.institution}
                    </span>
                    <span style="font-size: 11pt; font-style: italic;">
                      ${edu.startDate} - ${edu.endDate}
                    </span>
                  </div>
                  ${(edu.cgpa || edu.percentage) ? `
                    <div style="font-size: 11pt; margin-bottom: 3px;">
                      ${edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}${edu.cgpa && edu.percentage ? ', ' : ''}${edu.percentage ? `Percentage: ${edu.percentage}%` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #000000; letter-spacing: 0.5px;">
              SKILLS
            </h2>
            <div style="margin-left: 0;">
              ${skills.map(skillCategory => `
                <div style="margin-bottom: 4px; display: flex; gap: 8px;">
                  <span style="font-weight: bold; min-width: 130px; flex-shrink: 0; font-size: 12pt;">
                    ${skillCategory.category}:
                  </span>
                  <span style="flex: 1; font-size: 12pt;">
                    ${skillCategory.items.join(', ')}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #000000; letter-spacing: 0.5px;">
              WORK EXPERIENCE
            </h2>
            <div style="margin-left: 0;">
              ${experience.map(exp => `
                <div style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                    <span style="font-weight: bold; font-size: 12pt;">
                      ${exp.position}
                    </span>
                    <span style="font-size: 11pt; font-style: italic;">
                      ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div style="font-size: 12pt; margin-bottom: 3px;">
                    ${exp.company}
                  </div>
                  ${exp.description.length > 0 ? `
                    <ul style="margin: 3px 0 0 18px; padding: 0;">
                      ${exp.description.map(desc => `
                        <li style="margin-bottom: 2px; font-size: 12pt; line-height: 1.3;">
                          ${desc}
                        </li>
                      `).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Projects -->
        ${projects.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #000000; letter-spacing: 0.5px;">
              PROJECTS
            </h2>
            <div style="margin-left: 0;">
              ${projects.map(project => `
                <div style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                    <span style="font-weight: bold; font-size: 12pt;">
                      ${project.name}
                    </span>
                    <span style="font-size: 11pt; font-style: italic;">
                      ${project.startDate} ${project.endDate ? `– ${project.endDate}` : ''}
                    </span>
                  </div>
                  <div style="font-size: 12pt; margin-bottom: 3px;">
                    ${project.description}
                  </div>
                  <div style="font-size: 11pt; margin-bottom: 3px;">
                    <strong>Technologies:</strong> ${project.technologies.join(', ')}
                  </div>
                  ${project.highlights.length > 0 ? `
                    <ul style="margin: 3px 0 0 18px; padding: 0;">
                      ${project.highlights.map(highlight => `
                        <li style="margin-bottom: 2px; font-size: 12pt; line-height: 1.3;">
                          ${highlight}
                        </li>
                      `).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Achievements -->
        ${achievements.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #000000; letter-spacing: 0.5px;">
              ACHIEVEMENTS & ACTIVITIES
            </h2>
            <div style="margin-left: 0;">
              ${achievements.map(achievement => `
                <div style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                    <span style="font-weight: bold; font-size: 12pt;">
                      ${achievement.title}
                    </span>
                    <span style="font-size: 11pt; font-style: italic;">
                      ${achievement.date}
                    </span>
                  </div>
                  ${achievement.organization ? `
                    <div style="font-size: 12pt; margin-bottom: 3px;">
                      ${achievement.organization}
                    </div>
                  ` : ''}
                  <div style="font-size: 12pt; margin-bottom: 3px;">
                    ${achievement.description}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}
