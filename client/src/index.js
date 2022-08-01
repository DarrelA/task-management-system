import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from './context/userContext';
import { TaskProvider } from './context/taskContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <TaskProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer theme="dark" position="top-center" autoClose={2000} limit={3} />
      </TaskProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
