import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../components';
import useUserContext from '../context/userContext';

const Login = () => {
  const userContext = useUserContext();
  const { isLoading, message, accessToken, isAdmin, email } = userContext;

  const [formData, setFormData] = useState({
    email,
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [updateProfilePage, setUpdateProfilePage] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    pathname === '/updateprofile'
      ? setUpdateProfilePage(true)
      : setUpdateProfilePage(false);

    if (!isLoading && !!accessToken && pathname === '/')
      isAdmin ? navigate('/usermanagement') : navigate('/apps');

    if (message === 'success') toast.success(message, { autoClose: 200 });
    if (!!message && !message.includes('success')) toast.error(message);
  }, [isLoading, message, accessToken, isAdmin, navigate, pathname]);

  useEffect(
    () => message === 'success' && setFormData({ ...formData, email }),
    [message, email, formData]
  );

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();
    if (updateProfilePage) {
      if (formData.password) {
        if (formData.password !== formData.confirmPassword)
          return toast.error('Password is different from Confirm Password.');

        // Comprise of alphabets , numbers, and special character
        // Minimum 8 characters and maximum 10 characters
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/;
        if (!formData.password.match(regex))
          return toast.error('Please provide a valid password.');
      }
      userContext.updateProfile(formData, accessToken);
    } else userContext.login(formData);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Card style={{ maxWidth: 400, margin: '100px auto', padding: '20px 5px' }}>
      <CardContent>
        <Grid container spacing={1}>
          <form onSubmit={submitHandler}>
            <Typography variant="h5">{updateProfilePage ? 'Update' : 'Login'}</Typography>
            {updateProfilePage && (
              <TextField
                label="Email"
                type="email"
                id="email"
                placeholder="lane@company.com"
                onInput={inputHandler}
                fullWidth
                value={formData.email}
              />
            )}

            {!updateProfilePage && (
              <TextField
                label="Username"
                type="text"
                id="username"
                placeholder="John Doe"
                onInput={inputHandler}
                fullWidth
              />
            )}

            <TextField
              label="Password"
              type="password"
              id="password"
              onInput={inputHandler}
              fullWidth
            />

            {updateProfilePage && (
              <TextField
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onInput={inputHandler}
                fullWidth
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ margin: '16px 0' }}
            >
              {updateProfilePage ? 'Update' : 'Login'}
            </Button>
          </form>

          {updateProfilePage && (
            <>
              <Typography variant="overline" color="inherit">
                Password requirement:
              </Typography>

              <Typography variant="caption" color="inherit">
                Comprise of alphabets , numbers, and special character. Minimum 8
                characters and maximum 10 characters.
              </Typography>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Login;
