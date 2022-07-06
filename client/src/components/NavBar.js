import { AppBar, Button, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useUserContext from '../context/userContext';

const NavBar = () => {
  const useStyles = makeStyles((theme) => ({
    root: { flexGrow: 1 },
    menuButton: { marginRight: theme.spacing(2) },
    title: { flexGrow: 1 },
  }));
  const classes = useStyles();

  const userContext = useUserContext();
  const { isLoading, name, isAdmin, logout } = userContext;

  if (isLoading) return <p></p>;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Task Management System
        </Typography>

        <Button component={Link} to={'/apps'}>
          Apps
        </Button>
        <Button component={Link} to={'/updateprofile'}>
          {name}
        </Button>

        {isAdmin && (
          <Button component={Link} to={'/usermanagement'}>
            User Management
          </Button>
        )}

        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
