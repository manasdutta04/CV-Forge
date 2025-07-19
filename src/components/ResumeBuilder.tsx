import { useResume } from '../context/ResumeContext';
import { StepNavigation } from './navigation/StepNavigation';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { EducationForm } from './forms/EducationForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { SkillsForm } from './forms/SkillsForm';
import { AchievementsForm } from './forms/AchievementsForm';
import { ReviewForm } from './forms/ReviewForm';
import './ResumeBuilder.css';

export function ResumeBuilder() {
  const { state } = useResume();

  const renderCurrentStep = () => {
    const currentStep = state.steps[state.currentStep];
    
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'education':
        return <EducationForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'skills':
        return <SkillsForm />;
      case 'achievements':
        return <AchievementsForm />;
      case 'review':
        return <ReviewForm />;
      default:
        return <div className="step-placeholder">Unknown step</div>;
    }
  };

  return (
    <div className="resume-builder">
      <StepNavigation />
      <div className="resume-builder__content">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
