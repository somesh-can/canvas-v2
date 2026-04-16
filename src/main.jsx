import React from 'react';
import ReactDOM from 'react-dom/client';
import PresentationPage from './app/page.jsx';
import './index.css';
import './app/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PresentationPage />
  </React.StrictMode>
);
