import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import './PersonalInfoForm.css';

export function PersonalInfoForm() {
  const { state, dispatch } = useResume();
  const { personalInfo } = state.resumeData;

  const [formData, setFormData] = useState(personalInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(personalInfo);
  }, [personalInfo]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
      case 'location':
        return value.trim().length < 2 ? 'Location is required' : '';
      case 'linkedIn':
        if (value && !value.includes('linkedin.com')) {
          return 'Please enter a valid LinkedIn URL';
        }
        return '';
      case 'github':
        if (value && !value.includes('github.com')) {
          return 'Please enter a valid GitHub URL';
        }
        return '';
      case 'portfolio':
        if (value && !value.startsWith('http')) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'location'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] || '');
      if (error) newErrors[field] = error;
    });

    // Validate optional fields if they have values
    const optionalFields = ['linkedIn', 'github', 'portfolio'];
    optionalFields.forEach(field => {
      const value = formData[field as keyof typeof formData] || '';
      if (value) {
        const error = validateField(field, value);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: formData });
      dispatch({ type: 'COMPLETE_STEP', payload: 0 });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 1 });
    }
  };

  const isFormValid = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'location'];
    return requiredFields.every(field => {
      const value = formData[field as keyof typeof formData] || '';
      return value.trim().length > 0 && !validateField(field, value);
    });
  };

  return (
    <div className="personal-info-form">
      <div className="form-header">
        <h2 className="form-title">Personal Information</h2>
        <p className="form-description">
          Let's start with your basic information. This will appear at the top of your resume.
        </p>
      </div>

      <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
        <div className="form-row">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(value) => handleInputChange('fullName', value)}
            onBlur={() => handleBlur('fullName', formData.fullName)}
            error={errors.fullName}
            required
            icon={<User size={16} />}
          />
        </div>

        <div className="form-row form-row--two-cols">
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            onBlur={() => handleBlur('email', formData.email)}
            error={errors.email}
            required
            icon={<Mail size={16} />}
          />
          
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(value) => handleInputChange('phone', value)}
            onBlur={() => handleBlur('phone', formData.phone)}
            error={errors.phone}
            required
            icon={<Phone size={16} />}
          />
        </div>

        <div className="form-row">
          <Input
            label="Location"
            type="text"
            placeholder="City, State, Country"
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            onBlur={() => handleBlur('location', formData.location)}
            error={errors.location}
            required
            hint="Include city and state/country"
            icon={<MapPin size={16} />}
          />
        </div>

        <div className="form-section">
          <h3 className="section-title">Online Presence (Optional)</h3>
          
          <div className="form-row form-row--two-cols">
            <Input
              label="LinkedIn Profile"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedIn || ''}
              onChange={(value) => handleInputChange('linkedIn', value)}
              onBlur={() => handleBlur('linkedIn', formData.linkedIn || '')}
              error={errors.linkedIn}
              icon={<Linkedin size={16} />}
            />
            
            <Input
              label="GitHub Profile"
              type="url"
              placeholder="https://github.com/yourusername"
              value={formData.github || ''}
              onChange={(value) => handleInputChange('github', value)}
              onBlur={() => handleBlur('github', formData.github || '')}
              error={errors.github}
              icon={<Github size={16} />}
            />
          </div>

          <div className="form-row">
            <Input
              label="Portfolio/Website"
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.portfolio || ''}
              onChange={(value) => handleInputChange('portfolio', value)}
              onBlur={() => handleBlur('portfolio', formData.portfolio || '')}
              error={errors.portfolio}
              icon={<Globe size={16} />}
            />
          </div>
        </div>

        <div className="form-row">
          <Textarea
            label="Professional Objective (Optional)"
            placeholder="Brief statement about your career goals and what you're looking for..."
            value={formData.objective || ''}
            onChange={(value) => handleInputChange('objective', value)}
            hint="2-3 sentences about your career goals and aspirations"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            size="lg"
            fullWidth
          >
            Continue to Education
          </Button>
        </div>
      </form>
    </div>
  );
}
