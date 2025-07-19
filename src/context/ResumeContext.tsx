import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, ResumeConfig, FormStep } from '../types/resume';

interface ResumeState {
  resumeData: ResumeData;
  config: ResumeConfig;
  currentStep: number;
  steps: FormStep[];
}

type ResumeAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<ResumeData['personalInfo']> }
  | { type: 'UPDATE_EDUCATION'; payload: ResumeData['education'] }
  | { type: 'UPDATE_EXPERIENCE'; payload: ResumeData['experience'] }
  | { type: 'UPDATE_PROJECTS'; payload: ResumeData['projects'] }
  | { type: 'UPDATE_SKILLS'; payload: ResumeData['skills'] }
  | { type: 'UPDATE_ACHIEVEMENTS'; payload: ResumeData['achievements'] }
  | { type: 'UPDATE_CERTIFICATIONS'; payload: ResumeData['certifications'] }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ResumeConfig> }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'LOAD_SAVED_DATA'; payload: ResumeState };

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    objective: ''
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  achievements: [],
  certifications: []
};

const initialConfig: ResumeConfig = {
  template: 'modern',
  colorScheme: '#2563eb',
  fontSize: 'medium',
  showAchievements: true,
  showCertifications: true
};

const initialSteps: FormStep[] = [
  { id: 'personal', title: 'Personal Information', description: 'Basic details and contact info', isCompleted: false, isActive: true },
  { id: 'education', title: 'Education', description: 'Academic background', isCompleted: false, isActive: false },
  { id: 'experience', title: 'Experience', description: 'Work experience and internships', isCompleted: false, isActive: false },
  { id: 'projects', title: 'Projects', description: 'Academic and personal projects', isCompleted: false, isActive: false },
  { id: 'skills', title: 'Skills', description: 'Technical and soft skills', isCompleted: false, isActive: false },
  { id: 'achievements', title: 'Achievements', description: 'Awards and recognitions', isCompleted: false, isActive: false },
  { id: 'review', title: 'Review & Download', description: 'Finalize and export your resume', isCompleted: false, isActive: false }
];

const initialState: ResumeState = {
  resumeData: initialResumeData,
  config: initialConfig,
  currentStep: 0,
  steps: initialSteps
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          personalInfo: { ...state.resumeData.personalInfo, ...action.payload }
        }
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        resumeData: { ...state.resumeData, education: action.payload }
      };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        resumeData: { ...state.resumeData, experience: action.payload }
      };
    case 'UPDATE_PROJECTS':
      return {
        ...state,
        resumeData: { ...state.resumeData, projects: action.payload }
      };
    case 'UPDATE_SKILLS':
      return {
        ...state,
        resumeData: { ...state.resumeData, skills: action.payload }
      };
    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        resumeData: { ...state.resumeData, achievements: action.payload }
      };
    case 'UPDATE_CERTIFICATIONS':
      return {
        ...state,
        resumeData: { ...state.resumeData, certifications: action.payload }
      };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
        steps: state.steps.map((step, index) => ({
          ...step,
          isActive: index === action.payload
        }))
      };
    case 'COMPLETE_STEP':
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          isCompleted: index <= action.payload
        }))
      };
    case 'CLEAR_ALL_DATA':
      return {
        ...initialState,
        currentStep: 0,
        steps: initialState.steps.map((step, index) => ({
          ...step,
          isActive: index === 0,
          isCompleted: false
        }))
      };
    case 'LOAD_SAVED_DATA':
      return action.payload;
    default:
      return state;
  }
}

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
  saveProgress: () => void;
  loadProgress: () => void;
  clearAllData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const saveProgress = () => {
    localStorage.setItem('cvforge-resume-data', JSON.stringify(state));
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('cvforge-resume-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVED_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  };

  const clearAllData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    localStorage.removeItem('cvforge-resume-data');
  };

  // Auto-save progress
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress();
    }, 1000);

    return () => clearTimeout(timer);
  }, [state]);

  // Load saved data on mount
  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <ResumeContext.Provider value={{ state, dispatch, saveProgress, loadProgress, clearAllData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
