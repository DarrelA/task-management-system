import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
} from '@material-ui/core';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Login = () => {
  const userContext = useUserContext();
  const { isLoading, message, accessToken, isAdmin, id } = userContext;
  const [formData, setFormData] = useState(initialState);
  const [updateProfilePage, setUpdateProfilePage] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/updateprofile') setUpdateProfilePage(true);
    else {
      setUpdateProfilePage(false);
      if (!isLoading && !!accessToken && isAdmin) navigate('/usermanagement');
      else if (!isLoading && !!accessToken) navigate('/app');
    }

    if (message === 'success') {
      toast.success(message, { autoClose: 200 });
      navigate('/app');
    }
    if (!!message && message !== 'success') toast.error(message);
  }, [isLoading, accessToken, isAdmin, navigate, pathname, message]);

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
      userContext.updateProfile(formData, id, accessToken);
    } else userContext.login(formData);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card style={{ maxWidth: 400, margin: '100px auto', padding: '20px 5px' }}>
      <CardContent>
        <Grid container spacing={1}>
          <form onSubmit={submitHandler}>
            <Typography variant="h5">{updateProfilePage ? 'Update' : 'Login'}</Typography>
            <TextField
              label="Email"
              type="email"
              id="email"
              placeholder="lane@company.com"
              onInput={inputHandler}
              fullWidth
            />

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
                charactersand maximum 10 characters.
              </Typography>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Login;
