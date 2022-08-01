import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { NavBar, ProtectedRoute } from './components';
import useUserContext from './context/userContext';
import { Applications, LoginUpdate, UserManagement } from './pages/';

const App = () => {
  const theme = createTheme({ palette: { type: 'dark' } });
  const { checkRefreshToken, accessToken } = useUserContext();

  useEffect(() => {
    checkRefreshToken();
  }, [checkRefreshToken]);

  return (
    <ThemeProvider theme={theme}>
      {accessToken && <NavBar />}
      <Routes>
        <Route path="/" element={<LoginUpdate />} />
        <Route
          path="/updateprofile"
          element={
            <ProtectedRoute>
              <LoginUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usermanagement"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apps"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>Page 404! There's nothing here!</div>} />
      </Routes>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default App;
