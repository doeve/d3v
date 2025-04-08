import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Tabs = ({
  tabs,
  defaultActiveTab,
  onChange,
  variant = 'default',
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = '',
  orientation = 'horizontal'
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || (tabs.length > 0 ? tabs[0].id : null));
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Tab variants
  const variantStyles = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'py-2 px-1 border-b-2 font-medium text-sm',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
    },
    pills: {
      container: 'space-x-1',
      tab: 'py-2 px-4 text-sm font-medium rounded-md',
      active: 'bg-blue-600 text-white',
      inactive: 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
    },
    cards: {
      container: '',
      tab: 'py-2 px-4 text-sm font-medium rounded-t-md',
      active: 'bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700',
      inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }
  };
  
  const selectedVariant = variantStyles[variant] || variantStyles.default;
  
  const containerClasses = `${
    orientation === 'vertical' 
      ? 'flex'
      : 'flex flex-col sm:flex-row'
  } ${className}`;
  
  const tabsContainerClasses = `${
    orientation === 'vertical'
      ? 'flex flex-col border-r border-gray-200 dark:border-gray-700 pr-4 w-1/4'
      : selectedVariant.container
  }`;
  
  const activeContent = tabs.find(tab => tab.id === activeTab)?.content || null;
  
  return (
    <div className={containerClasses}>
      {/* Tab buttons */}
      <div className={tabsContainerClasses}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${selectedVariant.tab} ${
              tab.id === activeTab
                ? `${selectedVariant.active} ${activeTabClassName}`
                : `${selectedVariant.inactive} ${tabClassName}`
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
            aria-current={tab.id === activeTab ? 'page' : undefined}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                tab.id === activeTab
                  ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className={`${
        orientation === 'vertical' ? 'w-3/4 pl-4' : 'mt-4'
      } ${contentClassName}`}>
        {activeContent}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      disabled: PropTypes.bool,
      count: PropTypes.number
    })
  ).isRequired,
  defaultActiveTab: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'pills', 'cards']),
  className: PropTypes.string,
  tabClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default Tabs;