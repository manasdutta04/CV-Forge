import { useState, useEffect } from 'react';
import { Plus, Trash2, Code2, Lightbulb, Users, Wrench } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Skill } from '../../types/resume';
import './SkillsForm.css';

const SKILL_CATEGORIES = [
  { id: 'programming', label: 'Programming Languages', icon: Code2 },
  { id: 'frameworks', label: 'Frameworks & Libraries', icon: Wrench },
  { id: 'tools', label: 'Tools & Technologies', icon: Wrench },
  { id: 'soft', label: 'Soft Skills', icon: Users },
  { id: 'other', label: 'Other Skills', icon: Lightbulb }
];

export function SkillsForm() {
  const { state, dispatch } = useResume();
  const { skills } = state.resumeData;

  const [skillsList, setSkillsList] = useState<Skill[]>(skills);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize with default categories if empty
    if (skills.length === 0) {
      const defaultSkills: Skill[] = SKILL_CATEGORIES.map(category => ({
        category: category.label,
        items: []
      }));
      setSkillsList(defaultSkills);
    } else {
      setSkillsList(skills);
    }
  }, [skills]);

  const updateSkillCategory = (index: number, items: string[]) => {
    const newSkillsList = [...skillsList];
    newSkillsList[index] = {
      ...newSkillsList[index],
      items: items.filter(item => item.trim() !== '')
    };
    setSkillsList(newSkillsList);

    // Update input value to reflect current skills
    setInputValues(prev => ({ 
      ...prev, 
      [index]: newSkillsList[index].items.join(', ') 
    }));

    // Clear error when user starts typing
    if (errors[`category-${index}`]) {
      setErrors(prev => ({ ...prev, [`category-${index}`]: '' }));
    }
  };

  const handleSkillsInput = (index: number, value: string) => {
    // Update the input value state to preserve what user is typing
    setInputValues(prev => ({ ...prev, [index]: value }));
    
    // Parse skills when user types comma or enters
    if (value.includes(',')) {
      const skills = value
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      // Update skills without updating input value (to avoid feedback loop)
      const newSkillsList = [...skillsList];
      newSkillsList[index] = {
        ...newSkillsList[index],
        items: skills
      };
      setSkillsList(newSkillsList);
    }
  };

  const handleSkillsBlur = (index: number) => {
    const value = inputValues[index] || '';
    if (value.trim()) {
      const skills = value
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      updateSkillCategory(index, skills);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkillsBlur(index);
    }
  };

  const addCustomCategory = () => {
    const newCategory: Skill = {
      category: '',
      items: []
    };
    setSkillsList([...skillsList, newCategory]);
  };

  const updateCategoryName = (index: number, name: string) => {
    const newSkillsList = [...skillsList];
    newSkillsList[index] = {
      ...newSkillsList[index],
      category: name
    };
    setSkillsList(newSkillsList);
  };

  const removeCategory = (index: number) => {
    if (index >= SKILL_CATEGORIES.length) { // Only allow removing custom categories
      setSkillsList(skillsList.filter((_, i) => i !== index));
    }
  };

  const validateSkills = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    let hasSkills = false;

    skillsList.forEach((skill, index) => {
      if (skill.items.length > 0) {
        hasSkills = true;
      }
      
      if (index >= SKILL_CATEGORIES.length && !skill.category.trim()) {
        newErrors[`category-${index}`] = 'Category name is required';
      }
    });

    if (!hasSkills) {
      newErrors.general = 'Please add at least one skill in any category';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateSkills();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Filter out empty categories
      const validSkills = skillsList.filter(skill => 
        skill.category.trim() && skill.items.length > 0
      );
      
      dispatch({ type: 'UPDATE_SKILLS', payload: validSkills });
      dispatch({ type: 'COMPLETE_STEP', payload: 4 });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 5 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
  };

  const getSkillSuggestions = (category: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'Programming Languages': [
        'JavaScript', 'Python', 'Java', 'C++', 'C', 'TypeScript', 'HTML', 'CSS', 'SQL', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin'
      ],
      'Frameworks & Libraries': [
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Bootstrap', 'Tailwind CSS'
      ],
      'Tools & Technologies': [
        'Git', 'Docker', 'AWS', 'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Linux', 'VS Code', 'Figma', 'Postman'
      ],
      'Soft Skills': [
        'Problem Solving', 'Team Collaboration', 'Communication', 'Leadership', 'Project Management', 'Time Management', 'Critical Thinking'
      ],
      'Other Skills': [
        'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Mobile Development', 'API Development', 'Database Design', 'Testing'
      ]
    };

    return suggestions[category] || [];
  };

  return (
    <div className="skills-form">
      <div className="form-header">
        <h2 className="form-title">Skills</h2>
        <p className="form-description">
          List your technical and soft skills. Organize them by category to make your resume easy to scan.
        </p>
      </div>

      {errors.general && (
        <div className="error-banner">
          {errors.general}
        </div>
      )}

      <div className="skills-categories">
        {skillsList.map((skill, index) => {
          const categoryInfo = SKILL_CATEGORIES[index];
          const Icon = categoryInfo?.icon || Lightbulb;
          const isCustomCategory = index >= SKILL_CATEGORIES.length;

          return (
            <div key={index} className="skill-category">
              <div className="category-header">
                <div className="category-title">
                  <Icon size={20} />
                  {isCustomCategory ? (
                    <Input
                      value={skill.category}
                      onChange={(value) => updateCategoryName(index, value)}
                      placeholder="Category name"
                      error={errors[`category-${index}`]}
                    />
                  ) : (
                    <h3>{skill.category}</h3>
                  )}
                </div>
                {isCustomCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(index)}
                    className="remove-category-btn"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>

              <div className="skills-input-section">
                <Input
                  placeholder={`Add ${skill.category.toLowerCase() || 'skills'}... (separate with commas)`}
                  value={inputValues[index] ?? skill.items.join(', ')}
                  onChange={(value) => handleSkillsInput(index, value)}
                  onBlur={() => handleSkillsBlur(index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  hint={`e.g., ${getSkillSuggestions(skill.category).slice(0, 3).join(', ')}`}
                />
                
                {skill.items.length > 0 && (
                  <div className="skills-count">
                    {skill.items.length} skill{skill.items.length !== 1 ? 's' : ''} added
                  </div>
                )}

                {skill.items.length > 0 && (
                  <div className="skills-preview">
                    {skill.items.map((item, itemIndex) => (
                      <span key={itemIndex} className="skill-tag">
                        {item}
                        <button
                          type="button"
                          className="remove-skill"
                          onClick={() => {
                            const newItems = skill.items.filter((_, i) => i !== itemIndex);
                            updateSkillCategory(index, newItems);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {categoryInfo && (
                <div className="skill-suggestions">
                  <p className="suggestions-label">Popular {skill.category.toLowerCase()}:</p>
                  <div className="suggestions-grid">
                    {getSkillSuggestions(skill.category).map((suggestion, suggestionIndex) => (
                      <button
                        key={suggestionIndex}
                        type="button"
                        className={`suggestion-tag ${skill.items.includes(suggestion) ? 'selected' : ''}`}
                        onClick={() => {
                          const currentSkills = skill.items;
                          if (currentSkills.includes(suggestion)) {
                            updateSkillCategory(index, currentSkills.filter(s => s !== suggestion));
                          } else {
                            updateSkillCategory(index, [...currentSkills, suggestion]);
                          }
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="add-category">
        <Button
          variant="outline"
          onClick={addCustomCategory}
          fullWidth
        >
          <Plus size={16} />
          Add Custom Category
        </Button>
      </div>

      <div className="skills-summary">
        <h3>Skills Summary</h3>
        <div className="summary-grid">
          {skillsList
            .filter(skill => skill.items.length > 0)
            .map((skill, index) => (
              <div key={index} className="summary-category">
                <h4>{skill.category}</h4>
                <p>{skill.items.length} skill{skill.items.length !== 1 ? 's' : ''}</p>
              </div>
            ))}
        </div>
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
          Continue to Achievements
        </Button>
      </div>
    </div>
  );
}
