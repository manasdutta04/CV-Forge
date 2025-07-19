import { useState, useEffect } from 'react';
import { Plus, Trash2, Code, Calendar, Github, ExternalLink } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Project } from '../../types/resume';
import './ProjectsForm.css';

export function ProjectsForm() {
  const { state, dispatch } = useResume();
  const { projects } = state.resumeData;

  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [techInputValues, setTechInputValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    setProjectsList(projects);
  }, [projects]);

  const createNewProject = (): Project => ({
    id: Date.now().toString(),
    name: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    githubUrl: '',
    liveUrl: '',
    highlights: ['']
  });

  const addProject = () => {
    const newProject = createNewProject();
    setProjectsList([...projectsList, newProject]);
  };

  const removeProject = (id: string) => {
    setProjectsList(projectsList.filter(proj => proj.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setProjectsList(projectsList.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));

    // Clear error when user starts typing
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: '' }
      }));
    }
  };

  const validateProject = (proj: Project): Record<string, string> => {
    const projErrors: Record<string, string> = {};

    if (!proj.name.trim()) projErrors.name = 'Project name is required';
    if (!proj.description.trim()) projErrors.description = 'Project description is required';
    if (!proj.startDate) projErrors.startDate = 'Start date is required';
    if (proj.technologies.length === 0) projErrors.technologies = 'At least one technology is required';

    if (proj.startDate && proj.endDate && new Date(proj.startDate) > new Date(proj.endDate)) {
      projErrors.endDate = 'End date must be after start date';
    }

    if (proj.githubUrl && !proj.githubUrl.includes('github.com')) {
      projErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    if (proj.liveUrl && !proj.liveUrl.startsWith('http')) {
      projErrors.liveUrl = 'Please enter a valid URL starting with http:// or https://';
    }

    if (!proj.highlights.some(highlight => highlight.trim())) {
      projErrors.highlights = 'At least one key highlight is required';
    }

    return projErrors;
  };

  const handleTechnologiesUpdate = (id: string, techText: string) => {
    // Update the input value state to preserve what user is typing
    setTechInputValues(prev => ({ ...prev, [id]: techText }));
    
    // Parse technologies when user types comma
    if (techText.includes(',')) {
      const technologies = techText
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      updateProject(id, 'technologies', technologies);
    }
  };

  const handleTechnologiesBlur = (id: string) => {
    const value = techInputValues[id] || '';
    if (value.trim()) {
      const technologies = value
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      updateProject(id, 'technologies', technologies);
      // Update input to reflect final state
      setTechInputValues(prev => ({ ...prev, [id]: technologies.join(', ') }));
    }
  };

  const handleTechKeyDown = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTechnologiesBlur(id);
    }
  };

  const handleHighlightAdd = (id: string) => {
    const project = projectsList.find(proj => proj.id === id);
    if (project) {
      updateProject(id, 'highlights', [...project.highlights, '']);
    }
  };

  const handleHighlightUpdate = (id: string, index: number, value: string) => {
    const project = projectsList.find(proj => proj.id === id);
    if (project) {
      const newHighlights = [...project.highlights];
      newHighlights[index] = value;
      updateProject(id, 'highlights', newHighlights);
    }
  };

  const handleHighlightRemove = (id: string, index: number) => {
    const project = projectsList.find(proj => proj.id === id);
    if (project && project.highlights.length > 1) {
      const newHighlights = project.highlights.filter((_, i) => i !== index);
      updateProject(id, 'highlights', newHighlights);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    if (projectsList.length === 0) {
      alert('Please add at least one project to showcase your skills');
      return;
    }

    projectsList.forEach(proj => {
      const projErrors = validateProject(proj);
      if (Object.keys(projErrors).length > 0) {
        newErrors[proj.id] = projErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      dispatch({ type: 'UPDATE_PROJECTS', payload: projectsList });
      dispatch({ type: 'COMPLETE_STEP', payload: 3 });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
  };

  return (
    <div className="projects-form">
      <div className="form-header">
        <h2 className="form-title">Projects</h2>
        <p className="form-description">
          Showcase your academic and personal projects. Include both technical projects and any significant work you've completed.
        </p>
      </div>

      <div className="projects-list">
        {projectsList.map((project, index) => (
          <div key={project.id} className="project-item">
            <div className="project-header">
              <h3 className="project-title">
                <Code size={20} />
                Project {index + 1}
              </h3>
              {projectsList.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="remove-btn"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="project-form-grid">
              <div className="form-row">
                <Input
                  label="Project Name"
                  placeholder="e.g., E-commerce Web Application"
                  value={project.name}
                  onChange={(value) => updateProject(project.id, 'name', value)}
                  error={errors[project.id]?.name}
                  required
                />
              </div>

              <div className="form-row">
                <Textarea
                  label="Project Description"
                  placeholder="Describe what your project does, its purpose, and main features..."
                  value={project.description}
                  onChange={(value) => updateProject(project.id, 'description', value)}
                  error={errors[project.id]?.description}
                  required
                  rows={3}
                />
              </div>

              <div className="form-row">
                <Input
                  label="Technologies Used"
                  placeholder="e.g., React, Node.js, MongoDB, Express, CSS"
                  value={techInputValues[project.id] ?? project.technologies.join(', ')}
                  onChange={(value) => handleTechnologiesUpdate(project.id, value)}
                  onBlur={() => handleTechnologiesBlur(project.id)}
                  onKeyDown={(e) => handleTechKeyDown(project.id, e)}
                  error={errors[project.id]?.technologies}
                  required
                  hint="Separate technologies with commas"
                />
                
                {project.technologies.length > 0 && (
                  <div className="tech-preview">
                    <div className="tech-count">
                      {project.technologies.length} technolog{project.technologies.length !== 1 ? 'ies' : 'y'} added
                    </div>
                    <div className="tech-tags">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                          <button
                            type="button"
                            className="remove-tech"
                            onClick={() => {
                              const newTechs = project.technologies.filter((_, i) => i !== techIndex);
                              updateProject(project.id, 'technologies', newTechs);
                              setTechInputValues(prev => ({ ...prev, [project.id]: newTechs.join(', ') }));
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row form-row--two-cols">
                <Input
                  label="Start Date"
                  type="date"
                  value={project.startDate}
                  onChange={(value) => updateProject(project.id, 'startDate', value)}
                  error={errors[project.id]?.startDate}
                  required
                  icon={<Calendar size={16} />}
                />
                <Input
                  label="End Date (Optional)"
                  type="date"
                  value={project.endDate || ''}
                  onChange={(value) => updateProject(project.id, 'endDate', value)}
                  error={errors[project.id]?.endDate}
                  hint="Leave empty if ongoing"
                  icon={<Calendar size={16} />}
                />
              </div>

              <div className="form-row form-row--two-cols">
                <Input
                  label="GitHub Repository (Optional)"
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={project.githubUrl || ''}
                  onChange={(value) => updateProject(project.id, 'githubUrl', value)}
                  error={errors[project.id]?.githubUrl}
                  icon={<Github size={16} />}
                />
                <Input
                  label="Live Demo URL (Optional)"
                  type="url"
                  placeholder="https://your-project-demo.com"
                  value={project.liveUrl || ''}
                  onChange={(value) => updateProject(project.id, 'liveUrl', value)}
                  error={errors[project.id]?.liveUrl}
                  icon={<ExternalLink size={16} />}
                />
              </div>

              <div className="highlights-section">
                <div className="highlights-header">
                  <label className="highlights-label">
                    Key Highlights & Achievements *
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHighlightAdd(project.id)}
                  >
                    <Plus size={16} />
                    Add Highlight
                  </Button>
                </div>

                {project.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="highlight-item">
                    <Textarea
                      placeholder="• Describe a key feature, achievement, or learning from this project..."
                      value={highlight}
                      onChange={(value) => handleHighlightUpdate(project.id, highlightIndex, value)}
                      rows={2}
                    />
                    {project.highlights.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHighlightRemove(project.id, highlightIndex)}
                        className="highlight-remove"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                
                {errors[project.id]?.highlights && (
                  <span className="error-message">{errors[project.id].highlights}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-project">
        <Button
          variant="outline"
          onClick={addProject}
          fullWidth
        >
          <Plus size={16} />
          Add Another Project
        </Button>
      </div>

      <div className="form-actions">
        <Button
          variant="secondary"
          onClick={handleBack}
          size="lg"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          disabled={projectsList.length === 0}
        >
          Continue to Skills
        </Button>
      </div>
    </div>
  );
}
