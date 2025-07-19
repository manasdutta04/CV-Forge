import { Check, Circle } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import './StepNavigation.css';

export function StepNavigation() {
  const { state, dispatch } = useResume();

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to completed steps or the next step
    if (stepIndex <= state.currentStep + 1 && stepIndex < state.steps.length) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepIndex });
    }
  };

  return (
    <div className="step-navigation">
      <div className="step-navigation__container">
        {state.steps.map((step, index) => {
          const isCompleted = step.isCompleted;
          const isActive = state.currentStep === index;
          const isAccessible = index <= state.currentStep + 1;

          return (
            <div
              key={step.id}
              className={`step ${isActive ? 'step--active' : ''} ${isCompleted ? 'step--completed' : ''} ${isAccessible ? 'step--accessible' : ''}`}
              onClick={() => handleStepClick(index)}
            >
              <div className="step__indicator">
                {isCompleted ? (
                  <Check className="step__icon step__icon--check" size={16} />
                ) : (
                  <Circle className={`step__icon ${isActive ? 'step__icon--active' : ''}`} size={16} />
                )}
                <span className="step__number">{index + 1}</span>
              </div>
              
              <div className="step__content">
                <h3 className="step__title">{step.title}</h3>
                <p className="step__description">{step.description}</p>
              </div>
              
              {index < state.steps.length - 1 && (
                <div className={`step__connector ${isCompleted ? 'step__connector--completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
