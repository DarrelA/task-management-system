import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Login = () => {
  const userContext = useUserContext();
  const { isLoading, message, accessToken, isAdmin } = userContext;
  const [formData, setFormData] = useState(initialState);
  const [updateProfilePage, setUpdateProfilePage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !!accessToken && isAdmin) navigate('/usermanagement');
    else if (!isLoading && !!accessToken) navigate('/');
    if (!!message) toast.error(message);
  }, [isLoading, accessToken, isAdmin, navigate, message]);

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();
    userContext.login(formData);
  };

  return (
    <section className="container center" id="cta">
      <form className="form" onSubmit={submitHandler}>
        <h2>{updateProfilePage ? 'Update' : 'Login'}</h2>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="mongkong@gmail.com"
            required
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={inputHandler}
          />
        </div>

        {updateProfilePage && (
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={inputHandler}
            />
          </div>
        )}

        <button className="btn btn--form">
          {updateProfilePage ? 'Update' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default Login;
