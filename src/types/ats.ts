export interface ATSScore {
  overall: number;
  sections: {
    formatting: number;
    keywords: number;
    structure: number;
    content: number;
  };
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface ATSAnalysis {
  score: ATSScore;
  timestamp: Date;
  version: string;
}
