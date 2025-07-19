import { useState } from 'react';
import { Download, Eye, Edit3, CheckCircle, FileText, Printer, Plus } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import { ResumePreview } from '../resume/ResumePreview';
import { PDFGenerator } from '../../utils/pdfGenerator';
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
              <span className="percentage-label">Complete</span>
            </div>
          </div>
          
          <div className="completion-bar">
            <div 
              className="completion-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="completion-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.education}</span>
              <span className="stat-label">Education</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.experience}</span>
              <span className="stat-label">Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.projects}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.skills}</span>
              <span className="stat-label">Skills</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.achievements}</span>
              <span className="stat-label">Awards</span>
            </div>
          </div>
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
              onClick={() => window.print()}
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

        <div className="tips-section">
          <h3>Tips for Success</h3>
          <div className="tips-grid">
            <div className="tip-item">
              <h4>🎯 Tailor for Each Job</h4>
              <p>Customize your resume for specific job applications by highlighting relevant skills and experiences.</p>
            </div>
            <div className="tip-item">
              <h4>📝 Keep it Concise</h4>
              <p>Aim for 1-2 pages maximum. Focus on your most relevant and impressive achievements.</p>
            </div>
            <div className="tip-item">
              <h4>🔍 ATS-Friendly</h4>
              <p>Use standard section headings and avoid complex formatting to ensure ATS compatibility.</p>
            </div>
            <div className="tip-item">
              <h4>📊 Quantify Achievements</h4>
              <p>Use numbers and metrics wherever possible to demonstrate your impact and achievements.</p>
            </div>
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
          <Download size={16} />
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
