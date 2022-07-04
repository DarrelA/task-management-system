import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import useUserContext from './context/userContext';
import { Login, UserManagement } from './pages/';
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
        <Route path="/" element={<div>'Landing page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/usermanagement" element={<UserManagement />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default App;
