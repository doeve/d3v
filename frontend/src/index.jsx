import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ToastProvider } from './components/common/Toast';

// Apply Tailwind styles
import './tailwind.css';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <ToastProvider>
        <App />
      </ToastProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);