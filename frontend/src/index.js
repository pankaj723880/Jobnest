import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- CRITICAL FIX: Changed import path
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Get the root element from the DOM (assuming <div id="root"></div> exists in index.html)
const container = document.getElementById('root');

// CRITICAL FIX: Use createRoot instead of the deprecated render method
const root = ReactDOM.createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);