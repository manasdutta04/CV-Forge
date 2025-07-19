# CV Forge 🔨

A modern, responsive resume builder web application specifically designed for Tier-2/Tier-3 students. CV Forge helps students create professional resumes through guided forms and structured questionnaires, making it easier to land internships, jobs, and opportunities.

## ✨ Features

- **Step-by-Step Guidance**: Multi-step form process with clear progress indicators
- **Student-Focused**: Tailored specifically for students from Tier-2/Tier-3 institutions
- **Professional Templates**: Clean, modern resume layouts optimized for entry-level positions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Your progress is automatically saved locally
- **Real-time Validation**: Instant feedback on form inputs
- **Accessibility First**: Built with screen readers and keyboard navigation in mind

## 🚀 Getting Started

### Prerequisites

- Node.js (version 20.19.0 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd cv-forge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules with modern CSS features
- **State Management**: React Context API
- **Icons**: Lucide React
- **PDF Generation**: jsPDF and html2canvas (planned)

## 📱 Application Structure

### Resume Building Steps

1. **Personal Information**: Basic details and contact information
2. **Education**: Academic background and achievements
3. **Experience**: Work experience and internships
4. **Projects**: Academic and personal projects
5. **Skills**: Technical and soft skills
6. **Achievements**: Awards, certifications, and recognitions
7. **Review & Download**: Final review and PDF export

### Key Components

- **Layout**: Main application layout with progress tracking
- **StepNavigation**: Visual step indicator and navigation
- **Forms**: Modular form components for each resume section
- **UI Components**: Reusable Button, Input, and Textarea components
- **Resume Context**: Global state management for resume data

## 🎨 Design Philosophy

CV Forge is designed with students in mind:

- **Beginner-Friendly**: Clear instructions and helpful hints
- **Professional Output**: Industry-standard resume formats
- **Accessibility**: WCAG compliant for all users
- **Mobile-First**: Optimized for mobile devices
- **Fast & Lightweight**: Minimal bundle size and fast loading

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/
│   ├── forms/          # Form components for each step
│   ├── layout/         # Layout components
│   ├── navigation/     # Navigation components
│   └── ui/             # Reusable UI components
├── context/            # React Context providers
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Project setup and architecture
- [x] Personal information form
- [x] Step navigation system
- [x] Responsive design foundation

### Phase 2 (Next)
- [ ] Education form with multiple entries
- [ ] Experience form with rich text descriptions
- [ ] Projects form with technology tags
- [ ] Skills management system

### Phase 3 (Future)
- [ ] Multiple resume templates
- [ ] PDF export functionality
- [ ] Resume preview in real-time
- [ ] Dark mode support
- [ ] Resume sharing capabilities

## 🤝 Contributing

We welcome contributions from students and developers! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 For Students

CV Forge is built by students, for students. We understand the challenges of creating a professional resume when you're just starting your career. This tool provides:

- Templates optimized for student profiles
- Guidance on what to include and how to phrase it
- Industry-standard formatting
- ATS-friendly designs

## 🙏 Acknowledgments

- Built with ❤️ for the student community
- Inspired by the need for accessible resume-building tools
- Thanks to all contributors and beta testers

---

**Made with ❤️ for students everywhere** 🎓


## Developers

[![Manas Dutta](https://avatars.githubusercontent.com/u/122201926?size=50)](https://github.com/manasdutta04 "Manas on GitHub") 