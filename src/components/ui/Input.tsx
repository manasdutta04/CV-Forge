import type { ReactNode } from 'react';
import './Input.css';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'date';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  hint,
  icon,
  className = ''
}: InputProps) {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''} ${icon ? 'input-wrapper--with-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
        />
      </div>
      
      {error && <span className="input-error">{error}</span>}
      {hint && !error && <span className="input-hint">{hint}</span>}
    </div>
  );
}
