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
        
        <div className="resume-content">
          {/* Personal Information */}
          <section className="resume-section">
            <div className="personal-header">
              <h1 className="full-name">{personalInfo.fullName}</h1>
              <div className="contact-info">
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
                <span>{personalInfo.location}</span>
              </div>
              {personalInfo.objective && (
                <p className="objective">{personalInfo.objective}</p>
              )}
            </div>
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="education-entry">
                  <div className="entry-header">
                    <h3>{edu.degree} in {edu.field}</h3>
                    <span className="date-range">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="institution">{edu.institution}</p>
                  {(edu.cgpa || edu.percentage) && (
                    <p className="grades">
                      {edu.cgpa && `CGPA: ${edu.cgpa}`}
                      {edu.percentage && `Percentage: ${edu.percentage}%`}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} className="experience-entry">
                  <div className="entry-header">
                    <h3>{exp.position}</h3>
                    <span className="date-range">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="company">{exp.company}</p>
                  <ul className="description-list">
                    {exp.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="project-entry">
                  <div className="entry-header">
                    <h3>{project.name}</h3>
                    <span className="date-range">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <p className="technologies">
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                  <ul className="highlights-list">
                    {project.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Skills</h2>
              <div className="skills-grid">
                {skills.map((skillCategory, index) => (
                  <div key={index} className="skill-category">
                    <h4>{skillCategory.category}</h4>
                    <p>{skillCategory.items.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Achievements</h2>
              {achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-entry">
                  <div className="entry-header">
                    <h3>{achievement.title}</h3>
                    <span className="date-range">{achievement.date}</span>
                  </div>
                  {achievement.organization && (
                    <p className="organization">{achievement.organization}</p>
                  )}
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
