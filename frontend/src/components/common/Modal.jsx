import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
  overlayClassName = '',
  titleClassName = '',
  footerClassName = '',
  icon = null,
}) => {
  const modalRef = useRef(null);
  
  // Handle escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (isOpen && closeOnEsc && event.keyCode === 27) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        closeOnClickOutside &&
        modalRef.current && 
        !modalRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, onClose]);
  
  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full'
  };
  
  const modalSize = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${overlayClassName}`}>
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div 
          ref={modalRef}
          className={`w-full ${modalSize} transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all ${className}`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={`flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 ${titleClassName}`}>
              <div className="flex items-center">
                {icon && <div className="mr-2">{icon}</div>}
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className={`p-4 ${contentClassName}`}>
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'full']),
  closeOnClickOutside: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  icon: PropTypes.node
};

// Convenience component for standard modal actions in footer
Modal.Footer = ({ onClose, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm', isLoading = false }) => (
  <div className="flex justify-end space-x-2">
    <Button
      variant="secondary"
      onClick={onClose}
      disabled={isLoading}
    >
      {cancelText}
    </Button>
    <Button
      onClick={onConfirm}
      isLoading={isLoading}
    >
      {confirmText}
    </Button>
  </div>
);

Modal.Footer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Modal;