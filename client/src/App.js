import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import useUserContext from './context/userContext';
import { LoginUpdate, UserManagement } from './pages/';
import { NavBar } from './components';

const App = () => {
  const theme = createTheme({ palette: { type: 'dark' } });
  const { checkRefreshToken } = useUserContext();

  useEffect(() => {
    checkRefreshToken();
  }, [checkRefreshToken]);

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Routes>
        <Route path="/" element={<LoginUpdate />} />
        <Route path="/updateprofile" element={<LoginUpdate />} />
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/apps" element={<div>apps page</div>} />
        <Route path="*" element={<div>Page 404! There's nothing here!</div>} />
      </Routes>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default App;
