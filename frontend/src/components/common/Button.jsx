import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white focus:ring-gray-500 disabled:bg-gray-200 disabled:dark:bg-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-400',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 disabled:bg-yellow-400',
    info: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 disabled:bg-purple-400',
    outline: 'bg-transparent border border-current text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500'
  };
  
  const selectedSize = sizeStyles[size] || sizeStyles.md;
  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  
  const classes = `${baseStyles} ${selectedSize} ${selectedVariant} ${className} ${disabled || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'outline',
    'ghost'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func
};

export default Button;