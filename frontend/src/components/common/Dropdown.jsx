import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({
  trigger,
  items,
  className = '',
  menuClassName = '',
  buttonClassName = '',
  itemClassName = '',
  placement = 'bottom-start',
  onSelect,
  isOpen: controlledIsOpen,
  setIsOpen: setControlledIsOpen,
  size = 'md',
  variant = 'default',
  disabled = false
}) => {
  // Allow controlled or uncontrolled usage
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined && setControlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? setControlledIsOpen : setInternalIsOpen;
  
  const containerRef = useRef(null);
  
  // Button/trigger size classes
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  // Button/trigger variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white',
    minimal: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
  };
  
  // Placement styles - determine where dropdown menu appears
  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom': 'top-full left-1/2 transform -translate-x-1/2 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top': 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
    'left-start': 'right-full top-0 mr-1',
    'left': 'right-full top-1/2 transform -translate-y-1/2 mr-1',
    'left-end': 'right-full bottom-0 mr-1',
    'right-start': 'left-full top-0 ml-1',
    'right': 'left-full top-1/2 transform -translate-y-1/2 ml-1',
    'right-end': 'left-full bottom-0 ml-1'
  };
  
  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedVariant = variantClasses[variant] || variantClasses.default;
  const selectedPlacement = placementClasses[placement] || placementClasses['bottom-start'];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Handle item selection
  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    }
    setIsOpen(false);
  };
  
  // Default trigger is a button
  const defaultTrigger = (
    <button 
      className={`inline-flex items-center justify-between rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selectedSize} ${selectedVariant} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${buttonClassName}`}
      onClick={toggleDropdown}
      disabled={disabled}
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      <span>Select</span>
      <FaChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
  
  // Custom or default trigger
  const triggerElement = trigger ? (
    React.cloneElement(trigger, {
      onClick: (e) => {
        e.preventDefault();
        if (trigger.props.onClick) {
          trigger.props.onClick(e);
        }
        toggleDropdown();
      },
      'aria-haspopup': 'true',
      'aria-expanded': isOpen
    })
  ) : defaultTrigger;
  
  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {triggerElement}
      
      {isOpen && (
        <div 
          className={`absolute z-10 w-56 mt-1 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${selectedPlacement} ${menuClassName}`}
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <div key={index}>
                {item.divider ? (
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                ) : item.content ? (
                  // Allow rendering custom content
                  <div className="px-4 py-2">{item.content}</div>
                ) : (
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      item.disabled 
                        ? 'opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    } ${item.className || ''} ${itemClassName}`}
                    onClick={() => !item.disabled && handleSelect(item)}
                    disabled={item.disabled}
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any,
      icon: PropTypes.node,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
      description: PropTypes.string,
      content: PropTypes.node,
      className: PropTypes.string
    })
  ).isRequired,
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  placement: PropTypes.oneOf([
    'bottom-start', 'bottom', 'bottom-end',
    'top-start', 'top', 'top-end',
    'left-start', 'left', 'left-end',
    'right-start', 'right', 'right-end'
  ]),
  onSelect: PropTypes.func,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'minimal']),
  disabled: PropTypes.bool
};

export default Dropdown;