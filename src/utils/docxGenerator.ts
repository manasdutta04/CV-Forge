import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData } from '../types/resume';

export class DOCXGenerator {
  static async generateResumeDocx(resumeData: ResumeData, filename: string = 'resume.docx') {
    const { personalInfo, education, experience, projects, skills, achievements } = resumeData;

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch
              bottom: 720, // 0.5 inch
              left: 720,   // 0.5 inch
              right: 720,  // 0.5 inch
            },
          },
        },
        children: [
          // Header with Name
          new Paragraph({
            children: [
              new TextRun({
                text: personalInfo.fullName.toUpperCase(),
                bold: true,
                size: 32, // 16pt
                font: 'Times New Roman',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }, // small space after
          }),

          // Contact Information
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  personalInfo.phone,
                  personalInfo.email,
                  personalInfo.location
                ].filter(Boolean).join(' | '),
                size: 20, // 10pt
                font: 'Times New Roman',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),

          // Social Links
          ...(personalInfo.linkedIn || personalInfo.github ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: [
                    personalInfo.linkedIn ? `LinkedIn: ${personalInfo.linkedIn}` : '',
                    personalInfo.github ? `GitHub: ${personalInfo.github}` : ''
                  ].filter(Boolean).join(' | '),
                  size: 20, // 10pt
                  font: 'Times New Roman',
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
            })
          ] : []),

          // Horizontal line
          new Paragraph({
            children: [new TextRun({ text: '', size: 1 })],
            border: {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { after: 240 },
          }),

          // Objective Section
          ...(personalInfo.objective ? [
            this.createSectionHeading('OBJECTIVE'),
            new Paragraph({
              children: [
                new TextRun({
                  text: personalInfo.objective,
                  size: 22, // 11pt
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 280 },
              alignment: AlignmentType.JUSTIFIED,
            }),
          ] : []),

          // Education Section
          ...(education.length > 0 ? [
            this.createSectionHeading('EDUCATION'),
            ...education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree} in ${edu.field}, ${edu.institution}`,
                    bold: true,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    text: `\t${edu.startDate} - ${edu.endDate}`,
                    size: 20, // 10pt
                    font: 'Times New Roman',
                    italics: true,
                  }),
                ],
                spacing: { after: 120 },
                tabStops: [{
                  type: 'right',
                  position: 9360, // right align
                }],
              }),
              ...(edu.cgpa || edu.percentage ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: [
                        edu.cgpa ? `CGPA: ${edu.cgpa}` : '',
                        edu.percentage ? `Percentage: ${edu.percentage}%` : ''
                      ].filter(Boolean).join(', '),
                      size: 20, // 10pt
                      font: 'Times New Roman',
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ] : [new Paragraph({ spacing: { after: 200 } })]),
            ]),
          ] : []),

          // Experience Section
          ...(experience.length > 0 ? [
            this.createSectionHeading('EXPERIENCE'),
            ...experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.position} at ${exp.company}`,
                    bold: true,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    text: `\t${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                    size: 20, // 10pt
                    font: 'Times New Roman',
                    italics: true,
                  }),
                ],
                spacing: { after: 120 },
                tabStops: [{
                  type: 'right',
                  position: 9360, // right align
                }],
              }),
              ...exp.description.filter(desc => desc.trim()).map(desc => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${desc}`,
                      size: 22, // 11pt
                      font: 'Times New Roman',
                    }),
                  ],
                  spacing: { after: 120 },
                  indent: { left: 360 }, // indent bullet points
                })
              ),
              ...(exp.skills && exp.skills.length > 0 ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Technologies: ${exp.skills.join(', ')}`,
                      size: 20, // 10pt
                      font: 'Times New Roman',
                      italics: true,
                    }),
                  ],
                  spacing: { after: 200 },
                  indent: { left: 360 },
                }),
              ] : [new Paragraph({ spacing: { after: 200 } })]),
            ]),
          ] : []),

          // Projects Section
          ...(projects.length > 0 ? [
            this.createSectionHeading('PROJECTS'),
            ...projects.flatMap(project => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.name,
                    bold: true,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    text: `\t${project.startDate} - ${project.endDate}`,
                    size: 20, // 10pt
                    font: 'Times New Roman',
                    italics: true,
                  }),
                ],
                spacing: { after: 120 },
                tabStops: [{
                  type: 'right',
                  position: 9360, // right align
                }],
              }),
              ...(project.description ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: project.description,
                      size: 22, // 11pt
                      font: 'Times New Roman',
                    }),
                  ],
                  spacing: { after: 120 },
                  indent: { left: 360 },
                }),
              ] : []),
              ...project.highlights.filter(highlight => highlight.trim()).map(highlight => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${highlight}`,
                      size: 22, // 11pt
                      font: 'Times New Roman',
                    }),
                  ],
                  spacing: { after: 120 },
                  indent: { left: 360 },
                })
              ),
              ...(project.technologies.length > 0 ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Technologies: ${project.technologies.join(', ')}`,
                      size: 20, // 10pt
                      font: 'Times New Roman',
                      italics: true,
                    }),
                  ],
                  spacing: { after: 200 },
                  indent: { left: 360 },
                }),
              ] : [new Paragraph({ spacing: { after: 200 } })]),
            ]),
          ] : []),

          // Skills Section
          ...(skills.length > 0 && skills.some(category => category.items.length > 0) ? [
            this.createSectionHeading('SKILLS'),
            ...skills.filter(category => category.items.length > 0).map(category => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${category.category}: `,
                    bold: true,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                  new TextRun({
                    text: category.items.join(', '),
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                ],
                spacing: { after: 120 },
              })
            ),
            new Paragraph({ spacing: { after: 280 } }),
          ] : []),

          // Achievements Section
          ...(achievements.length > 0 ? [
            this.createSectionHeading('ACHIEVEMENTS'),
            ...achievements.map(achievement => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement.title}`,
                    bold: true,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                  }),
                  ...(achievement.description ? [
                    new TextRun({
                      text: ` - ${achievement.description}`,
                      size: 22, // 11pt
                      font: 'Times New Roman',
                    }),
                  ] : []),
                  ...(achievement.date ? [
                    new TextRun({
                      text: ` (${achievement.date})`,
                      size: 20, // 10pt
                      font: 'Times New Roman',
                      italics: true,
                    }),
                  ] : []),
                ],
                spacing: { after: 120 },
                indent: { left: 360 },
              })
            ),
          ] : []),
        ],
      }],
    });

    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);
      return true;
    } catch (error) {
      console.error('Error generating DOCX:', error);
      return false;
    }
  }

  private static createSectionHeading(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman',
        }),
      ],
      spacing: { 
        before: 240,
        after: 120 
      },
      border: {
        bottom: {
          color: '000000',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 4,
        },
      },
    });
  }
}
