import type { ResumeData } from '../types/resume';
import type { ATSScore } from '../types/ats';

export class ATSAnalyzer {
  private static readonly KEYWORDS_WEIGHT = 0.3;
  private static readonly FORMATTING_WEIGHT = 0.25;
  private static readonly STRUCTURE_WEIGHT = 0.25;
  private static readonly CONTENT_WEIGHT = 0.2;

  static analyzeResume(resumeData: ResumeData): ATSScore {
    const formattingScore = this.analyzeFormatting(resumeData);
    const keywordsScore = this.analyzeKeywords(resumeData);
    const structureScore = this.analyzeStructure(resumeData);
    const contentScore = this.analyzeContent(resumeData);

    const overall = Math.round(
      formattingScore * this.FORMATTING_WEIGHT +
      keywordsScore * this.KEYWORDS_WEIGHT +
      structureScore * this.STRUCTURE_WEIGHT +
      contentScore * this.CONTENT_WEIGHT
    );

    const suggestions = this.generateSuggestions(resumeData, {
      formatting: formattingScore,
      keywords: keywordsScore,
      structure: structureScore,
      content: contentScore
    });

    const strengths = this.identifyStrengths(resumeData, {
      formatting: formattingScore,
      keywords: keywordsScore,
      structure: structureScore,
      content: contentScore
    });

    const weaknesses = this.identifyWeaknesses(resumeData, {
      formatting: formattingScore,
      keywords: keywordsScore,
      structure: structureScore,
      content: contentScore
    });

    return {
      overall,
      sections: {
        formatting: formattingScore,
        keywords: keywordsScore,
        structure: structureScore,
        content: contentScore
      },
      suggestions,
      strengths,
      weaknesses
    };
  }

  private static analyzeFormatting(resumeData: ResumeData): number {
    let score = 100;
    const issues: string[] = [];

    // Check for proper contact information format
    if (!resumeData.personalInfo.email || !this.isValidEmail(resumeData.personalInfo.email)) {
      score -= 15;
      issues.push('Invalid or missing email format');
    }

    if (!resumeData.personalInfo.phone || !this.isValidPhone(resumeData.personalInfo.phone)) {
      score -= 10;
      issues.push('Invalid or missing phone format');
    }

    // Check for consistent date formats
    const dateFormatIssues = this.checkDateFormats(resumeData);
    if (dateFormatIssues > 0) {
      score -= dateFormatIssues * 5;
      issues.push('Inconsistent date formats detected');
    }

    // Check for special characters that might cause parsing issues
    const specialCharIssues = this.checkSpecialCharacters(resumeData);
    if (specialCharIssues > 0) {
      score -= specialCharIssues * 2;
      issues.push('Special characters detected that may cause ATS parsing issues');
    }

    return Math.max(0, score);
  }

  private static analyzeKeywords(resumeData: ResumeData): number {
    let score = 0;
    const keywordCount = this.countTechnicalKeywords(resumeData);
    const industryKeywords = this.countIndustryKeywords(resumeData);
    const actionVerbs = this.countActionVerbs(resumeData);

    // Technical keywords (0-40 points)
    if (keywordCount >= 15) score += 40;
    else if (keywordCount >= 10) score += 30;
    else if (keywordCount >= 5) score += 20;
    else if (keywordCount >= 2) score += 10;

    // Industry keywords (0-30 points)
    if (industryKeywords >= 8) score += 30;
    else if (industryKeywords >= 5) score += 20;
    else if (industryKeywords >= 3) score += 15;
    else if (industryKeywords >= 1) score += 10;

    // Action verbs (0-30 points)
    if (actionVerbs >= 10) score += 30;
    else if (actionVerbs >= 7) score += 25;
    else if (actionVerbs >= 5) score += 20;
    else if (actionVerbs >= 3) score += 15;
    else if (actionVerbs >= 1) score += 10;

    return Math.min(100, score);
  }

  private static analyzeStructure(resumeData: ResumeData): number {
    let score = 0;

    // Essential sections present
    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) score += 20;
    if (resumeData.education.length > 0) score += 20;
    if (resumeData.experience.length > 0) score += 25;
    if (resumeData.skills.length > 0) score += 20;
    if (resumeData.projects.length > 0) score += 10;
    if (resumeData.achievements.length > 0) score += 5;

    return Math.min(100, score);
  }

  private static analyzeContent(resumeData: ResumeData): number {
    let score = 0;
    
    // Content quality metrics
    const totalWords = this.countTotalWords(resumeData);
    const quantifiableAchievements = this.countQuantifiableAchievements(resumeData);
    const relevantContent = this.analyzeContentRelevance(resumeData);

    // Word count (0-30 points)
    if (totalWords >= 300 && totalWords <= 600) score += 30;
    else if (totalWords >= 200 && totalWords <= 800) score += 25;
    else if (totalWords >= 100) score += 15;

    // Quantifiable achievements (0-40 points)
    if (quantifiableAchievements >= 5) score += 40;
    else if (quantifiableAchievements >= 3) score += 30;
    else if (quantifiableAchievements >= 2) score += 20;
    else if (quantifiableAchievements >= 1) score += 15;

    // Content relevance (0-30 points)
    score += relevantContent;

    return Math.min(100, score);
  }

  private static generateSuggestions(_resumeData: ResumeData, scores: any): string[] {
    const suggestions: string[] = [];

    if (scores.formatting < 80) {
      suggestions.push('Ensure consistent date formats (MM/YYYY) throughout your resume');
      suggestions.push('Use standard section headings like "Education", "Experience", "Skills"');
    }

    if (scores.keywords < 70) {
      suggestions.push('Add more technical skills and industry-specific keywords');
      suggestions.push('Include relevant software, tools, and technologies you\'ve used');
      suggestions.push('Use action verbs like "developed", "implemented", "managed"');
    }

    if (scores.structure < 80) {
      suggestions.push('Include all essential sections: Contact, Education, Experience, Skills');
      suggestions.push('Add projects section to showcase your work');
    }

    if (scores.content < 70) {
      suggestions.push('Add quantifiable achievements (e.g., "Increased efficiency by 20%")');
      suggestions.push('Include specific technologies and methodologies used');
      suggestions.push('Keep descriptions concise but informative (aim for 300-600 words total)');
    }

    return suggestions;
  }

  private static identifyStrengths(resumeData: ResumeData, scores: any): string[] {
    const strengths: string[] = [];

    if (scores.formatting >= 85) {
      strengths.push('Excellent formatting and structure for ATS parsing');
    }

    if (scores.keywords >= 80) {
      strengths.push('Rich in relevant keywords and technical terms');
    }

    if (scores.structure >= 90) {
      strengths.push('Complete resume with all essential sections');
    }

    if (scores.content >= 80) {
      strengths.push('Strong content with quantifiable achievements');
    }

    if (resumeData.skills.length >= 3) {
      strengths.push('Comprehensive skills section');
    }

    if (resumeData.projects.length >= 2) {
      strengths.push('Good project portfolio demonstration');
    }

    return strengths;
  }

  private static identifyWeaknesses(resumeData: ResumeData, scores: any): string[] {
    const weaknesses: string[] = [];

    if (scores.formatting < 70) {
      weaknesses.push('Formatting issues that may confuse ATS systems');
    }

    if (scores.keywords < 60) {
      weaknesses.push('Insufficient technical keywords and industry terms');
    }

    if (scores.structure < 70) {
      weaknesses.push('Missing essential resume sections');
    }

    if (scores.content < 60) {
      weaknesses.push('Lack of quantifiable achievements and specific details');
    }

    if (resumeData.experience.length === 0) {
      weaknesses.push('No work experience listed');
    }

    if (resumeData.skills.length === 0) {
      weaknesses.push('No skills section provided');
    }

    return weaknesses;
  }

  // Helper methods
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  private static checkDateFormats(_resumeData: ResumeData): number {
    // Simple check for consistent date formats - in real implementation, 
    // you'd parse dates and check consistency
    return 0;
  }

  private static checkSpecialCharacters(resumeData: ResumeData): number {
    const problematicChars = /[#$%&@]/g;
    let count = 0;
    
    // Check various text fields for problematic characters
    const textFields = [
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.objective,
      ...resumeData.experience.flatMap(exp => exp.description),
      ...resumeData.projects.flatMap(proj => proj.highlights)
    ].filter(Boolean);

    textFields.forEach(text => {
      if (text) {
        const matches = text.match(problematicChars);
        if (matches) count += matches.length;
      }
    });

    return count;
  }

  private static countTechnicalKeywords(resumeData: ResumeData): number {
    const technicalKeywords = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'git', 'docker', 'aws', 'mongodb', 'postgresql', 'typescript', 'vue',
      'angular', 'spring', 'django', 'flask', 'express', 'api', 'database',
      'cloud', 'devops', 'ci/cd', 'agile', 'scrum', 'machine learning', 'ai'
    ];

    let count = 0;
    const allSkills = resumeData.skills.flatMap(category => category.items);
    const allText = [
      ...allSkills,
      ...resumeData.experience.flatMap(exp => exp.description),
      ...resumeData.projects.flatMap(proj => proj.highlights),
      ...resumeData.projects.flatMap(proj => proj.technologies)
    ].join(' ').toLowerCase();

    technicalKeywords.forEach(keyword => {
      if (allText.includes(keyword)) count++;
    });

    return count;
  }

  private static countIndustryKeywords(resumeData: ResumeData): number {
    const industryKeywords = [
      'software development', 'web development', 'full stack', 'frontend',
      'backend', 'mobile development', 'data analysis', 'project management',
      'team collaboration', 'problem solving', 'debugging', 'testing',
      'deployment', 'optimization', 'scalability', 'performance'
    ];

    let count = 0;
    const allText = [
      resumeData.personalInfo.objective || '',
      ...resumeData.experience.flatMap(exp => exp.description),
      ...resumeData.projects.flatMap(proj => proj.highlights)
    ].join(' ').toLowerCase();

    industryKeywords.forEach(keyword => {
      if (allText.includes(keyword)) count++;
    });

    return count;
  }

  private static countActionVerbs(resumeData: ResumeData): number {
    const actionVerbs = [
      'developed', 'implemented', 'created', 'designed', 'built', 'managed',
      'led', 'coordinated', 'optimized', 'improved', 'achieved', 'delivered',
      'collaborated', 'analyzed', 'resolved', 'established', 'maintained'
    ];

    let count = 0;
    const allText = [
      ...resumeData.experience.flatMap(exp => exp.description),
      ...resumeData.projects.flatMap(proj => proj.highlights)
    ].join(' ').toLowerCase();

    actionVerbs.forEach(verb => {
      if (allText.includes(verb)) count++;
    });

    return count;
  }

  private static countTotalWords(resumeData: ResumeData): number {
    const allText = [
      resumeData.personalInfo.objective || '',
      ...resumeData.experience.flatMap(exp => exp.description),
      ...resumeData.projects.flatMap(proj => proj.highlights),
      ...resumeData.achievements.map(ach => ach.description)
    ].join(' ');

    return allText.split(/\s+/).filter(word => word.length > 0).length;
  }

  private static countQuantifiableAchievements(resumeData: ResumeData): number {
    const numberRegex = /\d+(%|k|million|billion|hours|days|weeks|months|years|\$)/gi;
    let count = 0;

    const descriptions = [
      ...resumeData.experience.flatMap(exp => exp.description),
      ...resumeData.projects.flatMap(proj => proj.highlights),
      ...resumeData.achievements.map(ach => ach.description)
    ];

    descriptions.forEach(desc => {
      const matches = desc.match(numberRegex);
      if (matches) count += matches.length;
    });

    return count;
  }

  private static analyzeContentRelevance(resumeData: ResumeData): number {
    // Simple relevance scoring based on content completeness
    let score = 0;

    if (resumeData.personalInfo.objective && resumeData.personalInfo.objective.length > 50) {
      score += 10;
    }

    if (resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.description.length > 0)) {
      score += 10;
    }

    if (resumeData.projects.length > 0 && resumeData.projects.some(proj => proj.highlights.length > 0)) {
      score += 10;
    }

    return score;
  }
}
