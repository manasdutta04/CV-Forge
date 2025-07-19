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
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.4';
    container.style.color = '#333';
    container.style.padding = '40px';
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
      <div style="max-width: 714px; margin: 0 auto; font-family: Arial, sans-serif;">
        <!-- Header -->
        <header style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #1e40af; font-weight: bold;">
            ${personalInfo.fullName}
          </h1>
          <div style="font-size: 14px; color: #666; line-height: 1.6;">
            <div>${personalInfo.email} | ${personalInfo.phone}</div>
            ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
            <div style="margin-top: 8px;">
              ${personalInfo.linkedIn ? `LinkedIn: ${personalInfo.linkedIn} | ` : ''}
              ${personalInfo.github ? `GitHub: ${personalInfo.github}` : ''}
            </div>
          </div>
        </header>

        <!-- Professional Objective -->
        ${personalInfo.objective ? `
          <section style="margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Professional Objective
            </h2>
            <p style="margin: 0; line-height: 1.6; color: #374151;">
              ${personalInfo.objective}
            </p>
          </section>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <section style="margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Education
            </h2>
            ${education.map(edu => `
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                  <div>
                    <h3 style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">
                      ${edu.degree} in ${edu.field}
                    </h3>
                    <div style="color: #6b7280; font-size: 14px;">${edu.institution}</div>
                  </div>
                  <div style="text-align: right; color: #6b7280; font-size: 14px;">
                    <div>${edu.startDate} - ${edu.endDate}</div>
                    ${edu.cgpa ? `<div>CGPA: ${edu.cgpa}</div>` : ''}
                    ${edu.percentage ? `<div>${edu.percentage}%</div>` : ''}
                  </div>
                </div>
                ${edu.achievements && edu.achievements.length > 0 ? `
                  <ul style="margin: 8px 0 0 20px; padding: 0;">
                    ${edu.achievements.map(achievement => `<li style="margin-bottom: 3px; color: #374151;">${achievement}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Experience -->
        ${experience.length > 0 ? `
          <section style="margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Experience
            </h2>
            ${experience.map(exp => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                  <div>
                    <h3 style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">
                      ${exp.position}
                    </h3>
                    <div style="color: #6b7280; font-size: 14px;">${exp.company}</div>
                  </div>
                  <div style="text-align: right; color: #6b7280; font-size: 14px;">
                    ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                ${exp.description.length > 0 ? `
                  <ul style="margin: 8px 0 0 20px; padding: 0;">
                    ${exp.description.map(desc => `<li style="margin-bottom: 3px; color: #374151;">${desc}</li>`).join('')}
                  </ul>
                ` : ''}
                ${exp.skills && exp.skills.length > 0 ? `
                  <div style="margin-top: 8px;">
                    <strong style="color: #1f2937; font-size: 14px;">Skills:</strong>
                    <span style="color: #374151; font-size: 14px;"> ${exp.skills.join(', ')}</span>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Projects -->
        ${projects.length > 0 ? `
          <section style="margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Projects
            </h2>
            ${projects.map(project => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                  <h3 style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">
                    ${project.name}
                  </h3>
                  <div style="color: #6b7280; font-size: 14px;">
                    ${project.startDate} - ${project.endDate}
                  </div>
                </div>
                <p style="margin: 5px 0; color: #374151; font-size: 14px; line-height: 1.5;">
                  ${project.description}
                </p>
                ${project.highlights.length > 0 ? `
                  <ul style="margin: 8px 0 0 20px; padding: 0;">
                    ${project.highlights.map(highlight => `<li style="margin-bottom: 3px; color: #374151;">${highlight}</li>`).join('')}
                  </ul>
                ` : ''}
                ${project.technologies.length > 0 ? `
                  <div style="margin-top: 8px;">
                    <strong style="color: #1f2937; font-size: 14px;">Technologies:</strong>
                    <span style="color: #374151; font-size: 14px;"> ${project.technologies.join(', ')}</span>
                  </div>
                ` : ''}
                ${project.githubUrl || project.liveUrl ? `
                  <div style="margin-top: 8px; font-size: 14px;">
                    ${project.githubUrl ? `<span style="color: #2563eb;">GitHub: ${project.githubUrl}</span>` : ''}
                    ${project.githubUrl && project.liveUrl ? ' | ' : ''}
                    ${project.liveUrl ? `<span style="color: #2563eb;">Live: ${project.liveUrl}</span>` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Skills -->
        ${skills.length > 0 ? `
          <section style="margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Skills
            </h2>
            ${skills.filter(skill => skill.items.length > 0).map(skill => `
              <div style="margin-bottom: 12px;">
                <strong style="color: #1f2937; font-size: 14px;">${skill.category}:</strong>
                <span style="color: #374151; font-size: 14px; margin-left: 8px;">
                  ${skill.items.join(', ')}
                </span>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Achievements -->
        ${achievements.length > 0 ? `
          <section style="margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Achievements & Awards
            </h2>
            ${achievements.map(achievement => `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <h3 style="margin: 0; font-size: 14px; color: #1f2937; font-weight: 600;">
                      ${achievement.title}
                    </h3>
                    ${achievement.organization ? `
                      <div style="color: #6b7280; font-size: 13px;">${achievement.organization}</div>
                    ` : ''}
                    ${achievement.description ? `
                      <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">
                        ${achievement.description}
                      </p>
                    ` : ''}
                  </div>
                  ${achievement.date ? `
                    <div style="color: #6b7280; font-size: 13px; text-align: right;">
                      ${achievement.date}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }
}
