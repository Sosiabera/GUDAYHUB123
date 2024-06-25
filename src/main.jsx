import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'
import { AuthContextProvider } from './Hooks/AuthContext';
import { global } from 'global';


if (typeof window !== 'undefined') {
  window.global = window.global || global;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
);
