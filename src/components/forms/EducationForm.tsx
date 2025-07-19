import { useState, useEffect } from 'react';
import { Plus, Trash2, GraduationCap, Calendar, Award } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Education } from '../../types/resume';
import './EducationForm.css';

export function EducationForm() {
  const { state, dispatch } = useResume();
  const { education } = state.resumeData;

  const [educationList, setEducationList] = useState<Education[]>(education);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    setEducationList(education);
  }, [education]);

  const createNewEducation = (): Education => ({
    id: Date.now().toString(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    cgpa: '',
    percentage: '',
    achievements: []
  });

  const addEducation = () => {
    const newEducation = createNewEducation();
    setEducationList([...educationList, newEducation]);
  };

  const removeEducation = (id: string) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | string[]) => {
    setEducationList(educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));

    // Clear error when user starts typing
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: '' }
      }));
    }
  };

  const validateEducation = (edu: Education): Record<string, string> => {
    const eduErrors: Record<string, string> = {};

    if (!edu.institution.trim()) eduErrors.institution = 'Institution name is required';
    if (!edu.degree.trim()) eduErrors.degree = 'Degree is required';
    if (!edu.field.trim()) eduErrors.field = 'Field of study is required';
    if (!edu.startDate) eduErrors.startDate = 'Start date is required';
    if (!edu.endDate) eduErrors.endDate = 'End date is required';

    if (edu.startDate && edu.endDate && new Date(edu.startDate) > new Date(edu.endDate)) {
      eduErrors.endDate = 'End date must be after start date';
    }

    if (edu.cgpa && (isNaN(Number(edu.cgpa)) || Number(edu.cgpa) < 0 || Number(edu.cgpa) > 10)) {
      eduErrors.cgpa = 'CGPA must be between 0 and 10';
    }

    if (edu.percentage && (isNaN(Number(edu.percentage)) || Number(edu.percentage) < 0 || Number(edu.percentage) > 100)) {
      eduErrors.percentage = 'Percentage must be between 0 and 100';
    }

    return eduErrors;
  };

  const handleAchievementAdd = (id: string) => {
    const education = educationList.find(edu => edu.id === id);
    if (education) {
      updateEducation(id, 'achievements', [...(education.achievements || []), '']);
    }
  };

  const handleAchievementUpdate = (id: string, index: number, value: string) => {
    const education = educationList.find(edu => edu.id === id);
    if (education) {
      const newAchievements = [...(education.achievements || [])];
      newAchievements[index] = value;
      updateEducation(id, 'achievements', newAchievements);
    }
  };

  const handleAchievementRemove = (id: string, index: number) => {
    const education = educationList.find(edu => edu.id === id);
    if (education) {
      const newAchievements = education.achievements?.filter((_, i) => i !== index) || [];
      updateEducation(id, 'achievements', newAchievements);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    if (educationList.length === 0) {
      alert('Please add at least one educational qualification');
      return;
    }

    educationList.forEach(edu => {
      const eduErrors = validateEducation(edu);
      if (Object.keys(eduErrors).length > 0) {
        newErrors[edu.id] = eduErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      dispatch({ type: 'UPDATE_EDUCATION', payload: educationList });
      dispatch({ type: 'COMPLETE_STEP', payload: 1 });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 0 });
  };

  return (
    <div className="education-form">
      <div className="form-header">
        <h2 className="form-title">Education</h2>
        <p className="form-description">
          Add your educational background, starting with the most recent degree.
        </p>
      </div>

      <div className="education-list">
        {educationList.map((education, index) => (
          <div key={education.id} className="education-item">
            <div className="education-header">
              <h3 className="education-title">
                <GraduationCap size={20} />
                Education {index + 1}
              </h3>
              {educationList.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(education.id)}
                  className="remove-btn"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="education-form-grid">
              <div className="form-row">
                <Input
                  label="Institution/University"
                  placeholder="e.g., XYZ University"
                  value={education.institution}
                  onChange={(value) => updateEducation(education.id, 'institution', value)}
                  error={errors[education.id]?.institution}
                  required
                />
              </div>

              <div className="form-row form-row--two-cols">
                <Input
                  label="Degree"
                  placeholder="e.g., Bachelor of Technology"
                  value={education.degree}
                  onChange={(value) => updateEducation(education.id, 'degree', value)}
                  error={errors[education.id]?.degree}
                  required
                />
                <Input
                  label="Field of Study"
                  placeholder="e.g., Computer Science"
                  value={education.field}
                  onChange={(value) => updateEducation(education.id, 'field', value)}
                  error={errors[education.id]?.field}
                  required
                />
              </div>

              <div className="form-row form-row--two-cols">
                <Input
                  label="Start Date"
                  type="date"
                  value={education.startDate}
                  onChange={(value) => updateEducation(education.id, 'startDate', value)}
                  error={errors[education.id]?.startDate}
                  required
                  icon={<Calendar size={16} />}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={education.endDate}
                  onChange={(value) => updateEducation(education.id, 'endDate', value)}
                  error={errors[education.id]?.endDate}
                  required
                  hint="Expected graduation date if ongoing"
                  icon={<Calendar size={16} />}
                />
              </div>

              <div className="form-row form-row--two-cols">
                <Input
                  label="CGPA (Optional)"
                  placeholder="e.g., 8.5"
                  value={education.cgpa || ''}
                  onChange={(value) => updateEducation(education.id, 'cgpa', value)}
                  error={errors[education.id]?.cgpa}
                  hint="Out of 10"
                />
                <Input
                  label="Percentage (Optional)"
                  placeholder="e.g., 85"
                  value={education.percentage || ''}
                  onChange={(value) => updateEducation(education.id, 'percentage', value)}
                  error={errors[education.id]?.percentage}
                  hint="Overall percentage"
                />
              </div>

              <div className="achievements-section">
                <div className="achievements-header">
                  <label className="achievements-label">
                    <Award size={16} />
                    Academic Achievements (Optional)
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAchievementAdd(education.id)}
                  >
                    <Plus size={16} />
                    Add Achievement
                  </Button>
                </div>

                {education.achievements?.map((achievement, achIndex) => (
                  <div key={achIndex} className="achievement-item">
                    <Input
                      placeholder="e.g., Dean's List, Merit Scholarship, etc."
                      value={achievement}
                      onChange={(value) => handleAchievementUpdate(education.id, achIndex, value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAchievementRemove(education.id, achIndex)}
                      className="achievement-remove"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-education">
        <Button
          variant="outline"
          onClick={addEducation}
          fullWidth
        >
          <Plus size={16} />
          Add Another Education
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
          disabled={educationList.length === 0}
        >
          Continue to Experience
        </Button>
      </div>
    </div>
  );
}
