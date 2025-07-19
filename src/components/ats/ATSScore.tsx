import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import type { ResumeData } from '../../types/resume';
import type { ATSAnalysis } from '../../types/ats';
import { ATSAnalyzer } from '../../utils/atsAnalyzer';
import './ATSScore.css';

interface ATSScoreProps {
  resumeData: ResumeData;
}

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  className = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return <span className={className}>{count}{suffix}</span>;
};

const ATSScore: React.FC<ATSScoreProps> = ({ resumeData }) => {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const analyzeResume = () => {
    setIsAnalyzing(true);
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const score = ATSAnalyzer.analyzeResume(resumeData);
      const analysisResult: ATSAnalysis = {
        score,
        timestamp: new Date(),
        version: '1.0'
      };
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!analysis) {
    return (
      <div className="ats-score-container">
        <div className="ats-header">
          <h3>ATS Compatibility Check</h3>
          <p>Analyze how well your resume will perform with Applicant Tracking Systems</p>
        </div>
        
        <div className="ats-start-section">
          <div className="ats-info">
            <div className="info-icon">🎯</div>
            <div className="info-content">
              <h4>Why Check ATS Compatibility?</h4>
              <ul>
                <li>90% of large companies use ATS to filter resumes</li>
                <li>Improve your chances of passing initial screenings</li>
                <li>Get actionable feedback to optimize your resume</li>
                <li>Ensure proper formatting and keyword usage</li>
              </ul>
            </div>
          </div>
          
          <button 
            className="ats-analyze-btn"
            onClick={analyzeResume}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="spinner"></div>
                Analyzing Resume...
              </>
            ) : (
              <>
                <span>🔍</span>
                Check ATS Score
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ats-score-container">
      <div className="ats-header">
        <h3>ATS Compatibility Score</h3>
        <p>Your resume's compatibility with Applicant Tracking Systems</p>
      </div>

      {/* Overall Score */}
      <div className="ats-overall-score">
        <div className="score-circle">
          <div className={`score-value ${getScoreColor(analysis.score.overall)}`}>
            <CountUp 
              end={analysis.score.overall} 
              suffix="%" 
              className="score-number"
            />
          </div>
          <div className="score-label">
            {getScoreLabel(analysis.score.overall)}
          </div>
        </div>
        
        <div className="score-breakdown">
          <h4>Section Breakdown</h4>
          <div className="breakdown-grid">
            {Object.entries(analysis.score.sections).map(([section, score]) => (
              <div 
                key={section}
                className="breakdown-item"
                onClick={() => toggleSection(section)}
              >
                <div className="breakdown-header">
                  <span className="section-name">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                  <span className={`section-score ${getScoreColor(score)}`}>
                    <CountUp end={score} suffix="%" />
                  </span>
                </div>
                <div className="score-bar">
                  <div 
                    className={`score-fill ${getScoreColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {analysis.score.suggestions.length > 0 && (
        <div className="ats-suggestions">
          <h4>💡 Improvement Suggestions</h4>
          <ul className="suggestions-list">
            {analysis.score.suggestions.map((suggestion, index) => (
              <li key={index} className="suggestion-item">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="ats-insights">
        {analysis.score.strengths.length > 0 && (
          <div className="strengths-section">
            <h4>✅ Strengths</h4>
            <ul className="insights-list">
              {analysis.score.strengths.map((strength, index) => (
                <li key={index} className="insight-item strength">
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.score.weaknesses.length > 0 && (
          <div className="weaknesses-section">
            <h4>⚠️ Areas for Improvement</h4>
            <ul className="insights-list">
              {analysis.score.weaknesses.map((weakness, index) => (
                <li key={index} className="insight-item weakness">
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Re-analyze Button */}
      <div className="ats-actions">
        <button 
          className="ats-reanalyze-btn"
          onClick={analyzeResume}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="spinner"></div>
              Re-analyzing...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Re-analyze
            </>
          )}
        </button>
        
        <div className="analysis-timestamp">
          Last analyzed: {analysis.timestamp.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ATSScore;
