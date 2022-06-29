import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import useUserContext from './context/userContext';
import { SignupLogin, UserManagement } from './pages/index.js';

const App = () => {
  const { checkRefreshToken } = useUserContext();

  useEffect(() => {
    checkRefreshToken();
  }, [checkRefreshToken]);

  return (
    <Routes>
      <Route path="/" element={<div>'Landing page</div>} />
      <Route path="/signup" element={<SignupLogin />} />
      <Route path="/usermanagement" element={<UserManagement />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default App;
