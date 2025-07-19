import type { ReactNode } from 'react';
import { useResume } from '../../context/ResumeContext';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state } = useResume();

  return (
    <div className="layout">
      <header className="header">
        <div className="header__content">
          <div className="header__brand">
            <h1 className="header__title">CV Forge</h1>
            <p className="header__subtitle">Professional Resume Builder for Students</p>
          </div>
          
          <div className="header__progress">
            <div className="progress-bar">
              <div 
                className="progress-bar__fill" 
                style={{ 
                  width: `${((state.currentStep + 1) / state.steps.length) * 100}%` 
                }}
              />
            </div>
            <span className="progress-text">
              Step {state.currentStep + 1} of {state.steps.length}
            </span>
          </div>
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <div className="footer__content">
          <p className="footer__text">
            Made with ❤️ for students • Your data is saved locally
          </p>
        </div>
      </footer>
    </div>
  );
}
