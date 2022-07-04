import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { isLoading, message, accessToken, isAdmin } = userContext;
  const [formData, setFormData] = useState(initialState);
  const [updateProfilePage, setUpdateProfilePage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !!accessToken && isAdmin) navigate('/usermanagement');
    else if (!isLoading && !!accessToken) navigate('/app');
    if (!!message) toast.error(message);
  }, [isLoading, accessToken, isAdmin, navigate, message]);

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();
    userContext.login(formData);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card style={{ maxWidth: 400, margin: '100px auto', padding: '20px 5px' }}>
      <CardContent>
        <Grid container spacing={1}>
          <form onSubmit={submitHandler}>
            <Typography variant="h5">{updateProfilePage ? 'Update' : 'Login'}</Typography>
            <TextField
              type="email"
              label="email"
              id="email"
              placeholder="mongkong@gmail.com"
              required
              onInput={inputHandler}
              fullWidth
            />

            <TextField
              type="password"
              label="password"
              id="password"
              required
              onInput={inputHandler}
              fullWidth
            />

            {updateProfilePage && (
              <TextField
                type="password"
                label="confirmPassword"
                id="confirmPassword"
                required
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Login;
