import './Textarea.css';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  rows?: number;
  className?: string;
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  hint,
  rows = 4,
  className = ''
}: TextareaProps) {
  const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`textarea-group ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      
      <div className={`textarea-wrapper ${error ? 'textarea-wrapper--error' : ''}`}>
        <textarea
          id={textareaId}
          className="textarea"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          rows={rows}
        />
      </div>
      
      {error && <span className="textarea-error">{error}</span>}
      {hint && !error && <span className="textarea-hint">{hint}</span>}
    </div>
  );
}
