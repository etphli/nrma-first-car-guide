import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Lowbeam from './Lowbeam.jsx';
import './styles.css';
import './lowbeam.css';
import './assignment.css';

const legacyRoute = window.location.pathname === '/og' || window.location.pathname.startsWith('/og/');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {legacyRoute ? <App /> : <Lowbeam />}
  </React.StrictMode>,
);
