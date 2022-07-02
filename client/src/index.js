import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/userContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
