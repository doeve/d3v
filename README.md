# D3V: Blockchain Wallet Management & Copy Trading Platform

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](package.json)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](frontend/package.json)

D3V is a full-stack blockchain wallet management application with autonomous copy trading capabilities. The platform enables users to track real blockchain wallets and simulate copy trading strategies with dummy money before using real funds.

![D3V Dashboard](docs/assets/dashboard-preview.png)

## ✨ Key Features

- **Real Wallet Tracking**: Monitor real blockchain wallets via Tatum API webhooks
- **Autonomous Copy Trading**: Copy trades based on wealth ratio (dynamic or fixed)
- **Simulation Mode**: Test trading strategies with dummy money
- **Fast Forward**: Replay historical wallet data to test strategies against past performance
- **Multi-Chain Support**: Works with Solana, Ethereum, Binance Smart Chain, and more
- **16-Character Key Access**: Secure login without registration
- **Advanced Analytics**: Detailed performance metrics and visualizations
- **Admin Panel**: First user can generate and manage other accounts

## 🔄 How Real Wallet Tracking Works

D3V leverages blockchain API webhooks to track real wallets in real-time:

1. **Real-Time Updates**: The system connects to Tatum's webhook API to receive instant notifications when transactions occur on tracked wallets
2. **Transaction Processing**: Each real transaction is processed and analyzed
3. **Simulated Copy Trading**: The system automatically executes simulated trades with dummy money based on your copy strategy settings
4. **Performance Tracking**: Results are displayed as if you were using real funds

This approach allows you to see exactly how your portfolio would perform if you were copying successful traders, without any financial risk.

## 📋 Technical Architecture

### Backend

- **Node.js & Express**: API server framework
- **MongoDB**: Database for wallet and transaction storage
- **Tatum API**: Blockchain connectivity and webhooks
- **JWT Authentication**: Secure 16-character key system
- **Encryption**: AES-256-GCM for sensitive data
- **Redis**: Caching and rate limiting (optional)

### Frontend

- **React**: UI framework
- **Tailwind CSS**: Styling and responsive design
- **Chart.js**: Performance visualizations
- **React Router**: Navigation
- **Context API**: State management
- **Axios**: API communication

### DevOps

- **Docker & Docker Compose**: Containerization
- **Nginx**: Reverse proxy and static file serving
- **MongoDB Volume**: Persistent data storage
- **Health Checks**: Automatic container monitoring

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm (for local development)
- Tatum API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/d3v.git
   cd d3v
   ```

2. Create environment variables file:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. Build and start the Docker containers:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost
   - API: http://localhost/api

### Development Setup

1. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Run frontend in development mode:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Run backend in development mode:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## 🔌 Webhook Integration

D3V utilizes Tatum's webhook system to track real wallet activities:

1. **Webhook Registration**: When adding a tracked wallet, D3V registers a webhook URL with Tatum
2. **Transaction Notifications**: Tatum sends HTTP POST requests to D3V when transactions occur
3. **Real-Time Processing**: The webhook handler processes incoming transaction data
4. **Copy Trade Execution**: If copy trading is enabled, simulated trades are executed

Example webhook payload:
```json
{
  "txId": "0x123abc...",
  "blockNumber": 12345678,
  "asset": "ETH",
  "amount": "0.5",
  "address": "0xabcdef123...",
  "counterAddress": "0x789def456...",
  "timestamp": 1618947265000
}
```

## 💵 Copy Trading Features

D3V supports multiple copy trading strategies:

- **Dynamic Ratio**: Copies trades proportionally to wealth (e.g., if tracked wallet uses 10% of funds, you use 10% of yours)
- **Fixed Ratio**: Uses a set multiplier (e.g., always invest 0.5x what the tracked wallet invests)
- **Custom Settings**: Minimum/maximum investment amounts and token filtering
- **Multiple Sources**: Copy from multiple wallets simultaneously

## 🔬 Simulation Capabilities

The simulation system provides:

- **Real Wallet Tracking**: Connect to actual blockchain addresses
- **Historical Analysis**: Fast forward through past wallet activity
- **Strategy Testing**: Compare different copying approaches
- **Performance Metrics**: ROI, success rate, profit/loss calculations
- **Risk-Free Testing**: Zero financial exposure

## 🔒 Security

- **16-Character Key**: Securely hashed access keys (no username/password)
- **No Registration**: Minimizes personal data storage
- **Encrypted Storage**: Sensitive wallet information is encrypted
- **JWT Authentication**: Short-lived tokens for API access
- **CORS Protection**: Controlled API access
- **Helmet**: HTTP security headers
- **Rate Limiting**: Prevents brute force attacks

## 🔍 Future Enhancements

- **Arbitrage Trading Bot**: Automated trading across exchanges (coming soon)
- **Mobile Application**: Native mobile experience
- **Advanced Filtering**: More sophisticated copy trading rules
- **ML-Based Predictions**: Trade suggestion enhancements
- **Additional Blockchain Support**: More networks and protocols

## 📊 Monitoring & Analytics

D3V provides comprehensive analytics:

- **Wallet Performance**: Detailed metrics on each wallet
- **Copy Trade Effectiveness**: How well your copy strategy performs
- **Token Distribution**: Visual breakdown of your portfolio
- **Historical Performance**: Time-series analysis of trading activity
- **Success Rate**: Trade outcome statistics

## 📜 License

This software is proprietary. All rights reserved.

## 🤝 Support

For support, please contact support@d3v.io or open an issue in this repository.

## 🙏 Acknowledgements

- [Tatum API](https://tatum.io/) for blockchain connectivity
- [React](https://reactjs.org/) and [Node.js](https://nodejs.org/) communities
- All contributors to this project

---

Built with ❤️ by the D3V Team
