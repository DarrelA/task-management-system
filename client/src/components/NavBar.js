import {
  AppBar,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
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
  const { accessToken } = userContext;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Task Management System
        </Typography>
        {accessToken && (
          <Button component={Link} to={'/usermanagement'}>
            User Management
          </Button>
        )}
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
