import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  icon,
  actions,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  variant = 'default',
  isLoading = false,
  ...props
}) => {
  // Card variants
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800',
    primary: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
    info: 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800',
  };

  const variantStyle = variantStyles[variant] || variantStyles.default;
  
  return (
    <div 
      className={`rounded-lg shadow-md overflow-hidden ${variantStyle} ${className}`} 
      {...props}
    >
      {/* Card Header */}
      {(title || icon || actions) && (
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
          </div>
          
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Card Body */}
      <div className={`p-4 ${bodyClassName}`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          children
        )}
      </div>
      
      {/* Card Footer - Only rendered if footerClassName is provided */}
      {footerClassName && (
        <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}>
          {/* Footer content would be included in children */}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  icon: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  isLoading: PropTypes.bool
};

export default Card;