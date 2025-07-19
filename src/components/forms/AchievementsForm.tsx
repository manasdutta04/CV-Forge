import { useState, useEffect } from 'react';
import { Plus, Trash2, Award, Trophy, Calendar, Building } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Achievement } from '../../types/resume';
import './AchievementsForm.css';

export function AchievementsForm() {
  const { state, dispatch } = useResume();
  const { achievements } = state.resumeData;

  const [achievementsList, setAchievementsList] = useState<Achievement[]>(achievements);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    setAchievementsList(achievements);
  }, [achievements]);

  const createNewAchievement = (): Achievement => ({
    id: Date.now().toString(),
    title: '',
    description: '',
    date: '',
    organization: ''
  });

  const addAchievement = () => {
    const newAchievement = createNewAchievement();
    setAchievementsList([...achievementsList, newAchievement]);
  };

  const removeAchievement = (id: string) => {
    setAchievementsList(achievementsList.filter(ach => ach.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievementsList(achievementsList.map(ach => 
      ach.id === id ? { ...ach, [field]: value } : ach
    ));

    // Clear error when user starts typing
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: '' }
      }));
    }
  };

  const validateAchievement = (ach: Achievement): Record<string, string> => {
    const achErrors: Record<string, string> = {};

    if (!ach.title.trim()) achErrors.title = 'Achievement title is required';
    if (!ach.description.trim()) achErrors.description = 'Achievement description is required';
    if (!ach.date) achErrors.date = 'Date is required';

    return achErrors;
  };

  const handleSubmit = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    achievementsList.forEach(ach => {
      const achErrors = validateAchievement(ach);
      if (Object.keys(achErrors).length > 0) {
        newErrors[ach.id] = achErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: achievementsList });
      dispatch({ type: 'COMPLETE_STEP', payload: 5 });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 6 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
  };

  const getAchievementSuggestions = () => [
    'Academic Excellence Award',
    'Dean\'s List',
    'Merit Scholarship',
    'Best Project Award',
    'Hackathon Winner',
    'Coding Competition Prize',
    'Leadership Award',
    'Volunteer Recognition',
    'Sports Achievement',
    'Cultural Event Prize',
    'Research Paper Publication',
    'Patent Filed',
    'Startup Competition Winner',
    'Technical Paper Presentation',
    'Industry Certification'
  ];

  return (
    <div className="achievements-form">
      <div className="form-header">
        <h2 className="form-title">Achievements & Awards</h2>
        <p className="form-description">
          Highlight your accomplishments, awards, recognitions, and notable achievements. This section helps you stand out from other candidates.
        </p>
      </div>

      {achievementsList.length === 0 && (
        <div className="no-achievements">
          <div className="no-achievements-content">
            <Trophy size={48} className="no-achievements-icon" />
            <h3>No achievements yet?</h3>
            <p>
              Think about academic awards, competition wins, certifications, volunteer recognition, 
              or any accomplishment you're proud of. Even small wins count!
            </p>
            <div className="achievement-examples">
              <h4>Examples to consider:</h4>
              <ul>
                <li>Academic honors (Dean's List, merit scholarships)</li>
                <li>Competition results (hackathons, coding contests)</li>
                <li>Certifications earned</li>
                <li>Leadership roles</li>
                <li>Volunteer contributions</li>
                <li>Sports or cultural achievements</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="achievements-list">
        {achievementsList.map((achievement, index) => (
          <div key={achievement.id} className="achievement-item">
            <div className="achievement-header">
              <h3 className="achievement-title">
                <Award size={20} />
                Achievement {index + 1}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAchievement(achievement.id)}
                className="remove-btn"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="achievement-form-grid">
              <div className="form-row">
                <Input
                  label="Achievement Title"
                  placeholder="e.g., First Place in National Coding Competition"
                  value={achievement.title}
                  onChange={(value) => updateAchievement(achievement.id, 'title', value)}
                  error={errors[achievement.id]?.title}
                  required
                  icon={<Trophy size={16} />}
                />
              </div>

              <div className="form-row">
                <Textarea
                  label="Description"
                  placeholder="Describe your achievement, what you did to earn it, and its significance..."
                  value={achievement.description}
                  onChange={(value) => updateAchievement(achievement.id, 'description', value)}
                  error={errors[achievement.id]?.description}
                  required
                  rows={3}
                />
              </div>

              <div className="form-row form-row--two-cols">
                <Input
                  label="Date Received"
                  type="date"
                  value={achievement.date}
                  onChange={(value) => updateAchievement(achievement.id, 'date', value)}
                  error={errors[achievement.id]?.date}
                  required
                  icon={<Calendar size={16} />}
                />
                <Input
                  label="Organization/Institution (Optional)"
                  placeholder="e.g., IEEE, University, Company Name"
                  value={achievement.organization || ''}
                  onChange={(value) => updateAchievement(achievement.id, 'organization', value)}
                  icon={<Building size={16} />}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="achievement-suggestions">
        <h3>Need inspiration? Here are common achievements:</h3>
        <div className="suggestions-grid">
          {getAchievementSuggestions().map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="suggestion-item"
              onClick={() => {
                const newAchievement = createNewAchievement();
                newAchievement.title = suggestion;
                setAchievementsList([...achievementsList, newAchievement]);
              }}
            >
              <Award size={16} />
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="add-achievement">
        <Button
          variant="outline"
          onClick={addAchievement}
          fullWidth
        >
          <Plus size={16} />
          Add Achievement
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
          Review & Finalize
        </Button>
      </div>
    </div>
  );
}
