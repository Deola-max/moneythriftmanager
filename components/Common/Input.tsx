import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, name, error, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-error' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string; // Added placeholder to props
}

export const Select: React.FC<SelectProps> = ({ label, name, error, className = '', containerClassName = '', options, placeholder, ...restProps }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-error' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${className}`}
        // Set defaultValue to "" if placeholder exists and value is not controlled, to select the placeholder option.
        // If 'value' is in restProps, it's a controlled component, defaultValue is ignored.
        // If 'value' is not in restProps and 'defaultValue' is, that will be used.
        // This ensures the placeholder option is selected if no value/defaultValue is explicitly set to something else.
        defaultValue={restProps.value === undefined && restProps.defaultValue === undefined && placeholder ? "" : restProps.defaultValue}
        {...restProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};