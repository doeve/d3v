import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheck, FaInfo, FaExclamationTriangle, FaTimes, FaExclamationCircle } from 'react-icons/fa';

// Individual Toast Component
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  position = 'top-right',
  showProgress = true,
  showIcon = true,
  showCloseButton = true,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (duration === 0) return; // No auto-close
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer);
          setVisible(false);
          setTimeout(() => onClose(id), 300); // Allow exit animation to finish
          return 0;
        }
        return prev - 100;
      });
      
      setProgress((prev) => {
        const newProgress = (timeLeft / duration) * 100;
        return Math.max(newProgress, 0);
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [duration, id, onClose, timeLeft]);
  
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
      default:
        return <FaInfo />;
    }
  };
  
  // Get colors based on type
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-500 dark:border-green-700',
          icon: 'text-green-500 dark:text-green-400',
          text: 'text-green-800 dark:text-green-300',
          progress: 'bg-green-500 dark:bg-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-500 dark:border-red-700',
          icon: 'text-red-500 dark:text-red-400',
          text: 'text-red-800 dark:text-red-300',
          progress: 'bg-red-500 dark:bg-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          border: 'border-yellow-500 dark:border-yellow-700',
          icon: 'text-yellow-500 dark:text-yellow-400',
          text: 'text-yellow-800 dark:text-yellow-300',
          progress: 'bg-yellow-500 dark:bg-yellow-700'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-500 dark:border-blue-700',
          icon: 'text-blue-500 dark:text-blue-400',
          text: 'text-blue-800 dark:text-blue-300',
          progress: 'bg-blue-500 dark:bg-blue-700'
        };
    }
  };
  
  const colors = getColors();
  
  return (
    <div
      className={`max-w-sm w-full ${colors.bg} border-l-4 ${colors.border} shadow-md rounded-md overflow-hidden transition-all duration-300 ${
        visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          {showIcon && (
            <div className={`flex-shrink-0 ${colors.icon}`}>
              {getIcon()}
            </div>
          )}
          
          <div className={`ml-3 w-0 flex-1 pt-0.5 ${colors.text}`}>
            {title && <p className="text-sm font-medium">{title}</p>}
            {message && <p className="mt-1 text-sm">{message}</p>}
          </div>
          
          {showCloseButton && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`inline-flex ${colors.text} hover:opacity-75 focus:outline-none`}
                onClick={() => {
                  setVisible(false);
                  setTimeout(() => onClose(id), 300); // Allow exit animation to finish
                }}
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showProgress && duration > 0 && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full ${colors.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center']),
  showProgress: PropTypes.bool,
  showIcon: PropTypes.bool,
  showCloseButton: PropTypes.bool
};

// Toast Container Component
const ToastContainer = ({
  toasts = [],
  position = 'top-right',
  onClose,
}) => {
  // Position classes
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
  };
  
  const containerPosition = positionClasses[position] || positionClasses['top-right'];
  
  // Sort toasts to ensure consistent order
  const sortedToasts = [...toasts].sort((a, b) => a.id - b.id);
  
  return (
    <div className={`fixed z-50 p-4 space-y-4 w-full sm:max-w-sm ${containerPosition}`}>
      {sortedToasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
          position={position}
        />
      ))}
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
      title: PropTypes.string,
      message: PropTypes.string,
      duration: PropTypes.number
    })
  ).isRequired,
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center']),
  onClose: PropTypes.func.isRequired
};

// Toast Context for managing toasts throughout the app
const ToastContext = React.createContext(null);

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Add a new toast
  const addToast = ({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
    return id;
  };
  
  // Remove a toast by id
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Convenience methods
  const toast = {
    info: (params) => addToast({ type: 'info', ...params }),
    success: (params) => addToast({ type: 'success', ...params }),
    warning: (params) => addToast({ type: 'warning', ...params }),
    error: (params) => addToast({ type: 'error', ...params })
  };
  
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook for using toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

export default Toast;