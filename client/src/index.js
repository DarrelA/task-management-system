import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from './context/userContext';
import { responsiveFontSizes } from '@material-ui/core';

let MUItheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

MUItheme = responsiveFontSizes(MUItheme);

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider theme={MUItheme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
