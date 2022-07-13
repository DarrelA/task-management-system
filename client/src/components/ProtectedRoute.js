import useUserContext from '../context/userContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { email } = useUserContext();
  if (!email) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
