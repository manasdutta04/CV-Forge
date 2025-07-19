import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ResumeData, ResumeConfig } from '../../types/resume';
import './ResumePreview.css';

interface ResumePreviewProps {
  resumeData: ResumeData;
  config: ResumeConfig;
  onClose: () => void;
}

export function ResumePreview({ resumeData, onClose }: ResumePreviewProps) {
  const { personalInfo, education, experience, projects, skills, achievements } = resumeData;

  return (
    <div className="resume-preview-overlay">
      <div className="resume-preview-container">
        <div className="preview-header">
          <h2>Resume Preview</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="resume-content" id="resume-content">
          {/* Header with Name and Contact */}
          <div className="resume-header">
            <h1 className="resume-name">{personalInfo.fullName}</h1>
            <div className="contact-line">
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.email && <span> | </span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {(personalInfo.phone || personalInfo.email) && personalInfo.location && <span> | </span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
            {personalInfo.linkedIn && (
              <div className="social-line">
                <span>LinkedIn: {personalInfo.linkedIn}</span>
                {personalInfo.github && <span> | GitHub: {personalInfo.github}</span>}
              </div>
            )}
          </div>

          {/* Objective */}
          {personalInfo.objective && (
            <div className="resume-section">
              <h2 className="section-heading">OBJECTIVE</h2>
              <div className="section-content">
                <p className="objective-text">{personalInfo.objective}</p>
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="resume-section">
              <h2 className="section-heading">EDUCATION</h2>
              <div className="section-content">
                {education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <div className="item-header">
                      <span className="item-title">{edu.degree} in {edu.field}, {edu.institution}</span>
                      <span className="item-date">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    {(edu.cgpa || edu.percentage) && (
                      <div className="item-details">
                        {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                        {edu.percentage && <span>Percentage: {edu.percentage}%</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="resume-section">
              <h2 className="section-heading">SKILLS</h2>
              <div className="section-content">
                {skills.map((skillCategory, index) => (
                  <div key={index} className="skill-item">
                    <span className="skill-category-name">{skillCategory.category}:</span>
                    <span className="skill-list">{skillCategory.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="resume-section">
              <h2 className="section-heading">WORK EXPERIENCE</h2>
              <div className="section-content">
                {experience.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="item-header">
                      <span className="item-title">{exp.position}</span>
                      <span className="item-date">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="item-subtitle">{exp.company}</div>
                    <ul className="item-bullets">
                      {exp.description.map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="resume-section">
              <h2 className="section-heading">PROJECTS</h2>
              <div className="section-content">
                {projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="item-header">
                      <span className="item-title">{project.name}</span>
                      <span className="item-date">
                        {project.startDate} {project.endDate && `– ${project.endDate}`}
                      </span>
                    </div>
                    <div className="item-description">{project.description}</div>
                    <div className="item-details">
                      <strong>Technologies:</strong> {project.technologies.join(', ')}
                    </div>
                    <ul className="item-bullets">
                      {project.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="resume-section">
              <h2 className="section-heading">ACHIEVEMENTS & ACTIVITIES</h2>
              <div className="section-content">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="item-header">
                      <span className="item-title">{achievement.title}</span>
                      <span className="item-date">{achievement.date}</span>
                    </div>
                    {achievement.organization && (
                      <div className="item-subtitle">{achievement.organization}</div>
                    )}
                    <div className="item-description">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
