const axios = require('axios');
const crypto = require('crypto');
const { encryptData, decryptData } = require('../utils/encryption');

class TatumService {
  constructor() {
    this.apiKey = process.env.TATUM_API_KEY;
    this.apiUrl = process.env.TATUM_API_URL || 'https://api-eu1.tatum.io/v3';
    this.webhookUrl = process.env.WEBHOOK_URL;
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Generate wallet for a specific blockchain
  async generateWallet(blockchain, encryptionKey) {
    try {
      const response = await this.client.get(`/${blockchain}/wallet`);
      
      if (response.data && response.data.mnemonic) {
        // Encrypt sensitive data
        const encryptedMnemonic = encryptData(response.data.mnemonic, encryptionKey);
        
        return {
          mnemonic: encryptedMnemonic,
          xpub: response.data.xpub,
          blockchain
        };
      }
      
      throw new Error('Failed to generate wallet');
    } catch (error) {
      console.error('Tatum wallet generation error:', error);
      throw new Error(`Failed to generate ${blockchain} wallet: ${error.message}`);
    }
  }
  
  // Generate deposit address from xpub
  async generateAddress(blockchain, xpub, index = 0) {
    try {
      const response = await this.client.get(`/${blockchain}/address/${xpub}/${index}`);
      return response.data;
    } catch (error) {
      console.error('Tatum address generation error:', error);
      throw new Error(`Failed to generate address: ${error.message}`);
    }
  }
  
  // Get wallet balance
  async getBalance(blockchain, address) {
    try {
      const response = await this.client.get(`/${blockchain}/account/balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('Tatum balance check error:', error);
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
  
  // Get account transactions
  async getTransactions(blockchain, address, pageSize = 10, offset = 0) {
    try {
      const response = await this.client.get(
        `/${blockchain}/account/transaction/${address}?pageSize=${pageSize}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error('Tatum transactions fetch error:', error);
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
  }
  
  // Create transaction
  async createTransaction(blockchain, body, privateKey, encryptionKey) {
    try {
      // Decrypt private key if it's encrypted
      const decryptedPrivateKey = decryptData(privateKey, encryptionKey);
      
      // Add private key to the request body
      const requestBody = {
        ...body,
        fromPrivateKey: decryptedPrivateKey
      };
      
      const response = await this.client.post(`/${blockchain}/transaction`, requestBody);
      return response.data;
    } catch (error) {
      console.error('Tatum transaction creation error:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }
  
  // Create webhook subscription for address monitoring
  async createAddressWebhook(blockchain, address, walletId) {
    try {
      const response = await this.client.post('/subscription', {
        type: `${blockchain}_BLOCKCHAIN_TRANSACTION`,
        attr: {
          address,
          confirmations: 3, // Number of confirmations to wait for
          url: `${this.webhookUrl}/transactions/${walletId}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Tatum webhook creation error:', error);
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }
  
  // Delete webhook subscription
  async deleteWebhook(subscriptionId) {
    try {
      await this.client.delete(`/subscription/${subscriptionId}`);
      return true;
    } catch (error) {
      console.error('Tatum webhook deletion error:', error);
      throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }
  
  // Get current exchange rates for a token
  async getExchangeRate(currency, basePair = 'USD') {
    try {
      const response = await this.client.get(`/tatum/rate/${currency}?basePair=${basePair}`);
      return response.data;
    } catch (error) {
      console.error('Tatum exchange rate error:', error);
      throw new Error(`Failed to get exchange rate: ${error.message}`);
    }
  }
}

module.exports = new TatumService();