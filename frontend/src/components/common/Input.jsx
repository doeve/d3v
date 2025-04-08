import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  readOnly = false,
  error = null,
  helperText = null,
  required = false,
  className = '',
  leftIcon = null,
  rightIcon = null,
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
    primary: 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100',
    error: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-gray-100'
  };
  
  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedVariant = error ? variantClasses.error : variantClasses[variant] || variantClasses.default;
  
  // Base input classes
  const baseClasses = 'w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed';
  
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`${baseClasses} ${selectedSize} ${selectedVariant} ${
            leftIcon ? 'pl-10' : ''
          } ${
            rightIcon ? 'pr-10' : ''
          }`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'primary', 'error'])
};

export default Input;