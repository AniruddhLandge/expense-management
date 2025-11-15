import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App.jsx';

// const React = require ("react");
// const ReactDOM = requie("react-dom/client");
// // import './styles.css';
// app.use(express.static("styles.css"));
// const App = require ('./App');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
