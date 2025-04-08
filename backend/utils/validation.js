// Validation utility for D3V application

/**
 * Validates wallet address format based on blockchain
 * @param {string} address - The wallet address to validate
 * @param {string} blockchain - The blockchain type (e.g., 'solana', 'ethereum')
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidAddress = (address, blockchain) => {
    if (!address) return false;
    
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
      case 'binance':
      case 'polygon':
      case 'avalanche':
        // Basic ETH-like address validation
        return /^0x[a-fA-F0-9]{40}$/.test(address);
        
      case 'solana':
        // Basic Solana address validation
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        
      case 'bitcoin':
        // Basic Bitcoin address validation
        return /(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^bc1[a-z0-9]{39,59}$)/.test(address);
        
      default:
        return true; // If blockchain is unknown, pass validation
    }
  };
  
  /**
   * Validates private key format
   * @param {string} privateKey - The private key to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  exports.isValidPrivateKey = (privateKey) => {
    if (!privateKey) return false;
    
    // Basic check for common private key formats
    // Note: In a real application, more specific validation per blockchain would be needed
    return (
      // Hex format (ETH, etc.)
      /^(0x)?[0-9a-fA-F]{64}$/.test(privateKey) ||
      // WIF format (Bitcoin)
      /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(privateKey) ||
      // Solana base58 format
      /^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(privateKey) ||
      // Mnemonic format (12-24 words)
      /^([a-z]+\\s){11,23}[a-z]+$/.test(privateKey)
    );
  };
  
  /**
   * Validates token or currency symbol
   * @param {string} symbol - The symbol to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  exports.isValidSymbol = (symbol) => {
    if (!symbol) return false;
    
    // Basic check for common token symbol format
    return /^[A-Z0-9._-]{1,10}$/.test(symbol);
  };
  
  /**
   * Validates amount as positive number
   * @param {number|string} amount - The amount to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  exports.isValidAmount = (amount) => {
    if (amount === undefined || amount === null) return false;
    
    const num = Number(amount);
    return !isNaN(num) && num >= 0;
  };
  
  /**
   * Sanitizes input to prevent injection attacks
   * @param {string} input - The input to sanitize
   * @returns {string} - Sanitized input
   */
  exports.sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Basic sanitization - remove script tags, SQL injection patterns, etc.
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/'/g, '\'')
      .replace(/"/g, '"')
      .replace(/;/g, ';')
      .replace(/--/g, '__')
      .replace(/\/\*/g, '/*')
      .replace(/\*\//g, '*/');
  };