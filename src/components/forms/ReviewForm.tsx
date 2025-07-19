import { useState } from 'react';
import { Download, Eye, Edit3, CheckCircle, FileText, Printer, Plus, FileDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import { ResumePreview } from '../resume/ResumePreview';
import { PDFGenerator } from '../../utils/pdfGenerator';
import ATSScore from '../ats/ATSScore';
import './ReviewForm.css';

export function ReviewForm() {
  const { state, dispatch, saveProgress, clearAllData } = useResume();
  const { resumeData, config } = state;
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 5 });
  };

  const handleEditSection = (stepIndex: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: stepIndex });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Check if user has minimal data for a meaningful resume
      const hasMinimalData = resumeData.personalInfo.fullName && 
                            resumeData.personalInfo.email && 
                            (resumeData.education.length > 0 || resumeData.experience.length > 0);

      if (!hasMinimalData) {
        // Show warning and use test data instead
        const useTestData = confirm(
          'Your resume doesn\'t have enough content yet. Would you like to generate a sample PDF with test data to see how it works?'
        );
        
        if (useTestData) {
          // Use the test function
          await (window as any).testPDFGeneration();
          alert('Sample resume PDF generated successfully! Fill out more sections for your personalized resume.');
          return;
        } else {
          alert('Please fill out at least your personal information and either education or experience before generating a PDF.');
          return;
        }
      }

      // Generate PDF using the PDF generator utility
      await PDFGenerator.generateResumePDF(resumeData, config, {
        filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        quality: 1.0,
        format: 'a4',
        margin: 15
      });
      
      // Mark as completed
      dispatch({ type: 'COMPLETE_STEP', payload: 6 });
      
      // Show success message
      alert('Resume PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createAnother = () => {
    // Calculate how much data will be lost
    const dataCount = {
      education: resumeData.education.length,
      experience: resumeData.experience.length,
      projects: resumeData.projects.length,
      skills: resumeData.skills.reduce((total, category) => total + category.items.length, 0),
      achievements: resumeData.achievements.length
    };
    
    const totalItems = Object.values(dataCount).reduce((sum, count) => sum + count, 0);
    const hasPersonalInfo = resumeData.personalInfo.fullName || resumeData.personalInfo.email;
    
    const confirmClear = confirm(
      '⚠️ CREATE NEW RESUME ⚠️\n\n' +
      'This will permanently delete ALL your current data:\n' +
      `• Personal information${hasPersonalInfo ? ' ✓' : ''}\n` +
      `• ${dataCount.education} Education entries\n` +
      `• ${dataCount.experience} Work experience entries\n` +
      `• ${dataCount.projects} Projects\n` +
      `• ${dataCount.skills} Skills\n` +
      `• ${dataCount.achievements} Achievements\n\n` +
      `Total: ${totalItems + (hasPersonalInfo ? 1 : 0)} items will be deleted\n\n` +
      'Are you sure you want to start fresh with a new resume?'
    );
    
    if (confirmClear) {
      clearAllData();
      alert('✅ All data cleared successfully!\n\nYou can now start creating a new resume from the beginning. Your previous resume data has been completely removed.');
    }
  };

  const handlePrintResume = () => {
    // Create a new window for printing only the resume
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const resumeHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.fullName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Times New Roman', 'Times', serif;
              font-size: 11pt;
              line-height: 1.2;
              color: #000000;
              background: #ffffff;
              padding: 10px 12px;
            }
            
            .resume-header {
              text-align: center;
              margin-bottom: 12px;
              border-bottom: 1.5px solid #000000;
              padding-bottom: 6px;
            }
            
            .resume-name {
              font-size: 18pt;
              font-weight: bold;
              margin: 0 0 5px 0;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            }
            
            .contact-line, .social-line {
              font-size: 10pt;
              margin: 2px 0;
            }
            
            .resume-section {
              margin-bottom: 14px;
            }
            
            .section-heading {
              font-size: 12pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 0 0 5px 0;
              padding-bottom: 2px;
              border-bottom: 1px solid #000000;
              letter-spacing: 0.3px;
            }
            
            .section-content {
              margin-left: 0;
            }
            
            .education-item, .experience-item, .project-item {
              margin-bottom: 10px;
            }
            
            .achievement-item {
              margin-bottom: 8px;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 2px;
            }
            
            .item-title {
              font-weight: bold;
              font-size: 11pt;
            }
            
            .item-date {
              font-size: 10pt;
              font-style: italic;
            }
            
            .item-subtitle {
              font-size: 11pt;
              margin-bottom: 3px;
            }
            
            .achievement-item .item-subtitle {
              margin-bottom: 2px;
            }
            
            .item-description {
              font-size: 11pt;
              margin-bottom: 3px;
              line-height: 1.3;
            }
            
            .achievement-item .item-description {
              margin-bottom: 2px;
            }
            
            .item-details {
              font-size: 10pt;
              margin-bottom: 3px;
            }
            
            .skill-item {
              margin-bottom: 4px;
              display: flex;
              gap: 8px;
            }
            
            .skill-category-name {
              font-weight: bold;
              min-width: 120px;
              flex-shrink: 0;
            }
            
            .skill-list {
              flex: 1;
            }
            
            .item-bullets {
              margin: 3px 0 0 16px;
              padding: 0;
            }
            
            .item-bullets li {
              margin-bottom: 2px;
              font-size: 11pt;
              line-height: 1.3;
            }
            
            .objective-text {
              font-size: 11pt;
              margin: 0;
              text-align: justify;
              line-height: 1.3;
            }
            
            @media print {
              body {
                padding: 0.5in;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-header">
            <h1 class="resume-name">${resumeData.personalInfo.fullName}</h1>
            <div class="contact-line">
              ${resumeData.personalInfo.phone ? resumeData.personalInfo.phone : ''}${resumeData.personalInfo.phone && resumeData.personalInfo.email ? ' | ' : ''}${resumeData.personalInfo.email ? resumeData.personalInfo.email : ''}${(resumeData.personalInfo.phone || resumeData.personalInfo.email) && resumeData.personalInfo.location ? ' | ' : ''}${resumeData.personalInfo.location ? resumeData.personalInfo.location : ''}
            </div>
            ${resumeData.personalInfo.linkedIn ? `
              <div class="social-line">
                LinkedIn: ${resumeData.personalInfo.linkedIn}${resumeData.personalInfo.github ? ` | GitHub: ${resumeData.personalInfo.github}` : ''}
              </div>
            ` : ''}
          </div>

          ${resumeData.personalInfo.objective ? `
            <div class="resume-section">
              <h2 class="section-heading">OBJECTIVE</h2>
              <div class="section-content">
                <p class="objective-text">${resumeData.personalInfo.objective}</p>
              </div>
            </div>
          ` : ''}

          ${resumeData.education.length > 0 ? `
            <div class="resume-section">
              <h2 class="section-heading">EDUCATION</h2>
              <div class="section-content">
                ${resumeData.education.map(edu => `
                  <div class="education-item">
                    <div class="item-header">
                      <span class="item-title">${edu.degree} in ${edu.field}, ${edu.institution}</span>
                      <span class="item-date">${edu.startDate} - ${edu.endDate}</span>
                    </div>
                    ${(edu.cgpa || edu.percentage) ? `
                      <div class="item-details">
                        ${edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}${edu.cgpa && edu.percentage ? ', ' : ''}${edu.percentage ? `Percentage: ${edu.percentage}%` : ''}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.skills.length > 0 ? `
            <div class="resume-section">
              <h2 class="section-heading">SKILLS</h2>
              <div class="section-content">
                ${resumeData.skills.map(skillCategory => `
                  <div class="skill-item">
                    <span class="skill-category-name">${skillCategory.category}:</span>
                    <span class="skill-list">${skillCategory.items.join(', ')}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.experience.length > 0 ? `
            <div class="resume-section">
              <h2 class="section-heading">WORK EXPERIENCE</h2>
              <div class="section-content">
                ${resumeData.experience.map(exp => `
                  <div class="experience-item">
                    <div class="item-header">
                      <span class="item-title">${exp.position}</span>
                      <span class="item-date">
                        ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div class="item-subtitle">${exp.company}</div>
                    ${exp.description.length > 0 ? `
                      <ul class="item-bullets">
                        ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.projects.length > 0 ? `
            <div class="resume-section">
              <h2 class="section-heading">PROJECTS</h2>
              <div class="section-content">
                ${resumeData.projects.map(project => `
                  <div class="project-item">
                    <div class="item-header">
                      <span class="item-title">${project.name}</span>
                      <span class="item-date">
                        ${project.startDate} ${project.endDate ? `– ${project.endDate}` : ''}
                      </span>
                    </div>
                    <div class="item-description">${project.description}</div>
                    <div class="item-details">
                      <strong>Technologies:</strong> ${project.technologies.join(', ')}
                    </div>
                    ${project.highlights.length > 0 ? `
                      <ul class="item-bullets">
                        ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.achievements.length > 0 ? `
            <div class="resume-section">
              <h2 class="section-heading">ACHIEVEMENTS & ACTIVITIES</h2>
              <div class="section-content">
                ${resumeData.achievements.map(achievement => `
                  <div class="achievement-item">
                    <div class="item-header">
                      <span class="item-title">${achievement.title}</span>
                      <span class="item-date">${achievement.date}</span>
                    </div>
                    ${achievement.organization ? `
                      <div class="item-subtitle">${achievement.organization}</div>
                    ` : ''}
                    <div class="item-description">${achievement.description}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(resumeHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print and close
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  const getSectionCompleteness = () => {
    const sections = [
      {
        name: 'Personal Information',
        completed: !!(resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone),
        stepIndex: 0
      },
      {
        name: 'Education',
        completed: resumeData.education.length > 0,
        stepIndex: 1
      },
      {
        name: 'Experience',
        completed: resumeData.experience.length > 0,
        stepIndex: 2
      },
      {
        name: 'Projects',
        completed: resumeData.projects.length > 0,
        stepIndex: 3
      },
      {
        name: 'Skills',
        completed: resumeData.skills.length > 0 && resumeData.skills.some(skill => skill.items.length > 0),
        stepIndex: 4
      },
      {
        name: 'Achievements',
        completed: resumeData.achievements.length > 0,
        stepIndex: 5
      }
    ];

    return sections;
  };

  const sections = getSectionCompleteness();
  const completedSections = sections.filter(section => section.completed).length;
  const completionPercentage = Math.round((completedSections / sections.length) * 100);

  const getResumeStats = () => {
    return {
      education: resumeData.education.length,
      experience: resumeData.experience.length,
      projects: resumeData.projects.length,
      skills: resumeData.skills.reduce((total, category) => total + category.items.length, 0),
      achievements: resumeData.achievements.length
    };
  };

  const stats = getResumeStats();

  return (
    <div className="review-form">
      <div className="form-header">
        <h2 className="form-title">Review & Download</h2>
        <p className="form-description">
          Review your resume content and download your professional resume.
        </p>
      </div>

      <div className="review-content">
        <div className="completion-overview">
          <div className="completion-header">
            <h3>Resume Completion</h3>
            <div className="completion-percentage">
              <span className="percentage-number">{completionPercentage}%</span>
              <span className="percentage-label">
                {completionPercentage === 100 ? 'Complete ✨' : 'Complete'}
              </span>
            </div>
          </div>
          
          <div className="completion-bar">
            <div 
              className="completion-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="completion-stats">
            <div className="stat-item" title={`${stats.education} education ${stats.education === 1 ? 'entry' : 'entries'} added`}>
              <span className="stat-number">{stats.education}</span>
              <span className="stat-label">Education</span>
            </div>
            <div className="stat-item" title={`${stats.experience} work experience ${stats.experience === 1 ? 'entry' : 'entries'} added`}>
              <span className="stat-number">{stats.experience}</span>
              <span className="stat-label">Experience</span>
            </div>
            <div className="stat-item" title={`${stats.projects} ${stats.projects === 1 ? 'project' : 'projects'} added`}>
              <span className="stat-number">{stats.projects}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item" title={`${stats.skills} technical skills added`}>
              <span className="stat-number">{stats.skills}</span>
              <span className="stat-label">Skills</span>
            </div>
            <div className="stat-item" title={`${stats.achievements} achievement ${stats.achievements === 1 ? 'entry' : 'entries'} added`}>
              <span className="stat-number">{stats.achievements}</span>
              <span className="stat-label">Awards</span>
            </div>
          </div>

          {completionPercentage === 100 && (
            <div className="completion-celebration">
              <div className="celebration-icon">🎉</div>
              <div className="celebration-text">
                <h4>Congratulations!</h4>
                <p>Your resume is complete and ready to download</p>
              </div>
            </div>
          )}
        </div>

        <div className="sections-review">
          <h3>Section Review</h3>
          <div className="sections-list">
            {sections.map((section, index) => (
              <div key={index} className={`section-item ${section.completed ? 'completed' : 'incomplete'}`}>
                <div className="section-info">
                  <div className="section-status">
                    {section.completed ? (
                      <CheckCircle size={20} className="status-icon completed" />
                    ) : (
                      <div className="status-icon incomplete" />
                    )}
                  </div>
                  <div className="section-details">
                    <h4>{section.name}</h4>
                    <p>{section.completed ? 'Complete' : 'Incomplete - recommended for better results'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSection(section.stepIndex)}
                >
                  <Edit3 size={14} />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Compatibility Check */}
        <ATSScore resumeData={resumeData} />

        <div className="resume-actions">
          <h3>Actions</h3>
          <div className="actions-grid">
            <button
              className="action-card"
              onClick={() => setShowPreview(true)}
            >
              <Eye size={24} />
              <h4>Preview Resume</h4>
              <p>See how your resume looks</p>
            </button>
            
            <button
              className="action-card"
              onClick={generatePDF}
              disabled={isGenerating}
            >
              <Download size={24} />
              <h4>{isGenerating ? 'Generating...' : 'Download PDF'}</h4>
              <p>{isGenerating ? 'Please wait' : 'Get your resume as PDF'}</p>
            </button>
            
            <button
              className="action-card"
              onClick={handlePrintResume}
            >
              <Printer size={24} />
              <h4>Print Resume</h4>
              <p>Print directly from browser</p>
            </button>
            
            <button
              className="action-card"
              onClick={saveProgress}
            >
              <FileText size={24} />
              <h4>Save Progress</h4>
              <p>Save to local storage</p>
            </button>
            
            <button
              className="action-card create-another"
              onClick={createAnother}
            >
              <Plus size={24} />
              <h4>Create Another</h4>
              <p>Start a new resume from scratch</p>
            </button>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button
          variant="secondary"
          onClick={handleBack}
          size="lg"
        >
          Back to Achievements
        </Button>
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          size="lg"
          loading={isGenerating}
        >
          <FileDown size={20} />
          Download Resume
        </Button>
      </div>

      {showPreview && (
        <ResumePreview
          resumeData={resumeData}
          config={config}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
