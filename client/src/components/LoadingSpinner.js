import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
  },
}));

// CircularIndeterminate
const LoadingSpinner = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size="5rem" />
    </div>
  );
};
export default LoadingSpinner;
