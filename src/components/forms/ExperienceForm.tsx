import { useState, useEffect } from 'react';
import { Plus, Trash2, Briefcase, Calendar, Building } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Experience } from '../../types/resume';
import './ExperienceForm.css';

export function ExperienceForm() {
  const { state, dispatch } = useResume();
  const { experience } = state.resumeData;

  const [experienceList, setExperienceList] = useState<Experience[]>(experience);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    setExperienceList(experience);
  }, [experience]);

  const createNewExperience = (): Experience => ({
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: [''],
    skills: []
  });

  const addExperience = () => {
    const newExperience = createNewExperience();
    setExperienceList([...experienceList, newExperience]);
  };

  const removeExperience = (id: string) => {
    setExperienceList(experienceList.filter(exp => exp.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | string[] | boolean) => {
    setExperienceList(experienceList.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));

    // Clear error when user starts typing
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: '' }
      }));
    }
  };

  const validateExperience = (exp: Experience): Record<string, string> => {
    const expErrors: Record<string, string> = {};

    if (!exp.company.trim()) expErrors.company = 'Company name is required';
    if (!exp.position.trim()) expErrors.position = 'Position title is required';
    if (!exp.startDate) expErrors.startDate = 'Start date is required';
    if (!exp.current && !exp.endDate) expErrors.endDate = 'End date is required';

    if (exp.startDate && exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
      expErrors.endDate = 'End date must be after start date';
    }

    if (!exp.description.some(desc => desc.trim())) {
      expErrors.description = 'At least one responsibility/achievement is required';
    }

    return expErrors;
  };

  const handleDescriptionAdd = (id: string) => {
    const experience = experienceList.find(exp => exp.id === id);
    if (experience) {
      updateExperience(id, 'description', [...experience.description, '']);
    }
  };

  const handleDescriptionUpdate = (id: string, index: number, value: string) => {
    const experience = experienceList.find(exp => exp.id === id);
    if (experience) {
      const newDescription = [...experience.description];
      newDescription[index] = value;
      updateExperience(id, 'description', newDescription);
    }
  };

  const handleDescriptionRemove = (id: string, index: number) => {
    const experience = experienceList.find(exp => exp.id === id);
    if (experience && experience.description.length > 1) {
      const newDescription = experience.description.filter((_, i) => i !== index);
      updateExperience(id, 'description', newDescription);
    }
  };

  const handleSkillsUpdate = (id: string, skillsText: string) => {
    const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    updateExperience(id, 'skills', skills);
  };

  const handleCurrentToggle = (id: string, isCurrent: boolean) => {
    updateExperience(id, 'current', isCurrent);
    if (isCurrent) {
      updateExperience(id, 'endDate', '');
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    experienceList.forEach(exp => {
      const expErrors = validateExperience(exp);
      if (Object.keys(expErrors).length > 0) {
        newErrors[exp.id] = expErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      dispatch({ type: 'UPDATE_EXPERIENCE', payload: experienceList });
      dispatch({ type: 'COMPLETE_STEP', payload: 2 });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 1 });
  };

  return (
    <div className="experience-form">
      <div className="form-header">
        <h2 className="form-title">Work Experience</h2>
        <p className="form-description">
          Add your work experience including internships, part-time jobs, and freelance work. Start with your most recent position.
        </p>
      </div>

      {experienceList.length === 0 && (
        <div className="no-experience">
          <p>No work experience yet? That's okay! You can add internships, projects, or skip this section for now.</p>
        </div>
      )}

      <div className="experience-list">
        {experienceList.map((experience, index) => (
          <div key={experience.id} className="experience-item">
            <div className="experience-header">
              <h3 className="experience-title">
                <Briefcase size={20} />
                Experience {index + 1}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(experience.id)}
                className="remove-btn"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="experience-form-grid">
              <div className="form-row form-row--two-cols">
                <Input
                  label="Company/Organization"
                  placeholder="e.g., TechCorp Solutions"
                  value={experience.company}
                  onChange={(value) => updateExperience(experience.id, 'company', value)}
                  error={errors[experience.id]?.company}
                  required
                  icon={<Building size={16} />}
                />
                <Input
                  label="Position/Role"
                  placeholder="e.g., Software Development Intern"
                  value={experience.position}
                  onChange={(value) => updateExperience(experience.id, 'position', value)}
                  error={errors[experience.id]?.position}
                  required
                  icon={<Briefcase size={16} />}
                />
              </div>

              <div className="form-row form-row--date-range">
                <Input
                  label="Start Date"
                  type="date"
                  value={experience.startDate}
                  onChange={(value) => updateExperience(experience.id, 'startDate', value)}
                  error={errors[experience.id]?.startDate}
                  required
                  icon={<Calendar size={16} />}
                />
                
                <div className="current-job-toggle">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) => handleCurrentToggle(experience.id, e.target.checked)}
                    />
                    I currently work here
                  </label>
                </div>

                {!experience.current && (
                  <Input
                    label="End Date"
                    type="date"
                    value={experience.endDate}
                    onChange={(value) => updateExperience(experience.id, 'endDate', value)}
                    error={errors[experience.id]?.endDate}
                    required
                    icon={<Calendar size={16} />}
                  />
                )}
              </div>

              <div className="responsibilities-section">
                <div className="responsibilities-header">
                  <label className="responsibilities-label">
                    Key Responsibilities & Achievements *
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescriptionAdd(experience.id)}
                  >
                    <Plus size={16} />
                    Add Point
                  </Button>
                </div>

                {experience.description.map((desc, descIndex) => (
                  <div key={descIndex} className="responsibility-item">
                    <Textarea
                      placeholder="• Describe your responsibilities and achievements..."
                      value={desc}
                      onChange={(value) => handleDescriptionUpdate(experience.id, descIndex, value)}
                      rows={2}
                    />
                    {experience.description.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDescriptionRemove(experience.id, descIndex)}
                        className="responsibility-remove"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                
                {errors[experience.id]?.description && (
                  <span className="error-message">{errors[experience.id].description}</span>
                )}
              </div>

              <div className="form-row">
                <Input
                  label="Skills Used (Optional)"
                  placeholder="e.g., React, Node.js, Python, Agile, etc."
                  value={experience.skills?.join(', ') || ''}
                  onChange={(value) => handleSkillsUpdate(experience.id, value)}
                  hint="Separate skills with commas"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-experience">
        <Button
          variant="outline"
          onClick={addExperience}
          fullWidth
        >
          <Plus size={16} />
          Add Work Experience
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
        >
          Continue to Projects
        </Button>
      </div>
    </div>
  );
}
