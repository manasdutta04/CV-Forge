import { PDFGenerator } from '../utils/pdfGenerator';
import type { ResumeData } from '../types/resume';

// Sample resume data for testing PDF generation
const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234-567-8900",
    location: "New York, NY",
    linkedIn: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    objective: "Aspiring software developer with a passion for creating innovative solutions and a strong foundation in computer science fundamentals."
  },
  education: [
    {
      id: "edu-1",
      institution: "University of Technology",
      degree: "Bachelor of Technology",
      field: "Computer Science",
      startDate: "2020",
      endDate: "2024",
      cgpa: "8.5",
      percentage: "",
      achievements: [
        "Dean's List for 3 consecutive semesters",
        "Relevant Coursework: Data Structures, Algorithms, Web Development"
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Tech Startup Inc.",
      position: "Software Development Intern",
      startDate: "Jun 2023",
      endDate: "Aug 2023",
      current: false,
      description: [
        "Developed responsive web applications using React and Node.js",
        "Collaborated with a team of 5 developers using Agile methodologies",
        "Improved application performance by 25% through code optimization"
      ],
      skills: ["React", "Node.js", "JavaScript", "Git"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-commerce Platform",
      description: "A full-stack e-commerce web application with user authentication, product catalog, and payment processing.",
      startDate: "Jan 2023",
      endDate: "May 2023",
      technologies: ["React", "Express.js", "MongoDB", "Stripe API"],
      githubUrl: "https://github.com/johndoe/ecommerce-platform",
      liveUrl: "https://myecommerce-demo.com",
      highlights: [
        "Implemented secure user authentication with JWT",
        "Integrated Stripe payment gateway for transactions",
        "Built responsive UI with modern design principles"
      ]
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "Python", "Java", "C++"]
    },
    {
      category: "Web Technologies",
      items: ["React", "Node.js", "HTML/CSS", "Express.js"]
    },
    {
      category: "Tools & Technologies",
      items: ["Git", "MongoDB", "PostgreSQL", "Docker"]
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Best Project Award",
      organization: "University Tech Fest 2023",
      date: "March 2023",
      description: "Awarded for innovative e-commerce platform project"
    },
    {
      id: "ach-2",
      title: "Coding Competition Winner",
      organization: "ACM Chapter",
      date: "September 2022",
      description: "First place in university-level algorithmic programming contest"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "2023-01-15",
      expiryDate: "2026-01-15",
      credentialId: "AWS-CP-12345",
      url: "https://aws.amazon.com/certification/"
    }
  ]
};

export async function testPDFGeneration() {
  try {
    console.log('Starting PDF generation test...');
    
    await PDFGenerator.generateResumePDF(
      sampleResumeData, 
      { 
        template: 'modern',
        colorScheme: 'blue',
        fontSize: 'medium',
        showAchievements: true,
        showCertifications: true
      },
      {
        filename: 'test_resume.pdf',
        quality: 1.0,
        format: 'a4',
        margin: 15
      }
    );
    
    console.log('PDF generation test completed successfully!');
    return true;
  } catch (error) {
    console.error('PDF generation test failed:', error);
    return false;
  }
}

// Export for use in browser console
(window as any).testPDFGeneration = testPDFGeneration;
