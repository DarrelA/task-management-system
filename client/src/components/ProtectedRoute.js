import useUserContext from '../context/userContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useUserContext();
  if (!accessToken) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
