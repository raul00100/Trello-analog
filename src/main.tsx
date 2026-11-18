import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { SharedProvider } from './shared/context/SharedProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SharedProvider>
        <App />
      </SharedProvider>
    </BrowserRouter>
  </React.StrictMode>
);
