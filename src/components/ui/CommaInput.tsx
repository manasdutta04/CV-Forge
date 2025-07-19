import { useState } from 'react';
import { Input } from './Input';
import './CommaInput.css';

interface CommaInputProps {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (items: string[]) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  tagColor?: 'blue' | 'purple' | 'green' | 'orange';
}

export function CommaInput({
  label,
  placeholder,
  value,
  onChange,
  hint,
  error,
  required = false,
  className = '',
  tagColor = 'purple'
}: CommaInputProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    // Parse items when user types comma
    if (text.includes(',')) {
      const items = text
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      onChange(items);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      const items = inputValue
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      onChange(items);
      setInputValue(items.join(', '));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  const removeItem = (index: number) => {
    const newItems = value.filter((_, i) => i !== index);
    onChange(newItems);
    setInputValue(newItems.join(', '));
  };

  return (
    <div className={`comma-input ${className}`}>
      <Input
        label={label}
        placeholder={placeholder}
        value={inputValue || value.join(', ')}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        hint={hint}
        error={error}
        required={required}
      />
      
      {value.length > 0 && (
        <div className="comma-input-preview">
          <div className="comma-input-count">
            {value.length} item{value.length !== 1 ? 's' : ''} added
          </div>
          <div className="comma-input-tags">
            {value.map((item, index) => (
              <span key={index} className={`comma-input-tag comma-input-tag--${tagColor}`}>
                {item}
                <button
                  type="button"
                  className="comma-input-remove"
                  onClick={() => removeItem(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
