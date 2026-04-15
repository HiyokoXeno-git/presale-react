import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './config/appkit.js' // initialise Reown AppKit (Web3Modal)

// Suppress noisy SVG attribute warnings from AppKit's bundled Lit framework
const _origError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('attribute width') || msg.includes('attribute height')) return;
  _origError(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
