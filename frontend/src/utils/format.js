export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
    if (value === undefined || value === null) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  export const shortenAddress = (address, chars = 4) => {
    if (!address) return '';
    
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
  };
  
  export const formatNumber = (value, decimals = 2) => {
    if (value === undefined || value === null) return '-';
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  export const formatPercentage = (value, decimals = 2) => {
    if (value === undefined || value === null) return '-';
    
    return `${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)}%`;
  };
  
  export const formatDate = (date, format = 'short') => {
    if (!date) return '-';
    
    const dateObj = new Date(date);
    
    if (format === 'short') {
      return dateObj.toLocaleDateString();
    } else if (format === 'long') {
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (format === 'datetime') {
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    }
    
    return dateObj.toLocaleDateString();
  };