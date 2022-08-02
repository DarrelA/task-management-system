import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ApplicationModal, LoadingSpinner } from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

const useStyles = makeStyles({
  root: {
    minWidth: 375,
    maxWidth: 375,
    minHeight: 375,
    maxHeight: 375,
    margin: 10,
  },
  title: {
    fontSize: 22,
  },
  pos: {
    marginBottom: 12,
  },
});

const Applicationa = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const {
    getApplicationsData,
    applications,
    groups,
    createApplication,
    updateApplication,
  } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;

  const { isLoading, taskMessage } = taskContext;
  const [openAppModal, setOpenAppModal] = useState(false);
  const [editAppMode, setEditAppMode] = useState({ edit: false });

  const openTaskModalHandler = () => setOpenAppModal(true);
  const closeTaskModalHandler = () => {
    setEditAppMode({ edit: false });
    setOpenAppModal(false);
  };

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (!!taskMessage) toast.error(taskMessage);

    if (!!message) toast.error(message);
  }, [taskMessage, message]);

  useEffect(() => {
    accessToken && getApplicationsData(accessToken);
  }, [accessToken, getApplicationsData]);

  const appModalHandler = (inputData) => {
    if (!inputData) return;
    if (!editAppMode.edit) createApplication(inputData, accessToken);
    else {
      updateApplication(inputData, accessToken);
      closeTaskModalHandler();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {openAppModal && (
        <ApplicationModal
          open={openAppModal}
          onClose={closeTaskModalHandler}
          appModalHandler={appModalHandler}
          editAppMode={editAppMode}
          groups={groups}
        />
      )}

      <Grid container spacing={1} justifyContent="center">
        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ margin: '16px 0' }}
          onClick={openTaskModalHandler}
        >
          Create New Application
        </Button>
      </Grid>

      <Grid
        container
        spacing={1}
        justifyContent="flex-start"
        style={{ padding: (0, 15) }}
      >
        {applications?.map((application) => (
          <Card className={classes.root} variant="outlined" key={application.App_Acronym}>
            <CardContent>
              <Grid
                container
                justifyContent="space-between"
                style={{ paddingBottom: 10 }}
              >
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {application.App_Rnumber}: {application.App_Acronym}
                </Typography>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditAppMode({ ...application, edit: true });
                      openTaskModalHandler();
                    }}
                  >
                    <span className="material-icons">edit</span>
                  </Button>
                </CardActions>
              </Grid>

              <Grid
                container
                justifyContent="space-between"
                style={{ paddingBottom: 10 }}
              >
                <Typography variant="overline">
                  start date: {application.App_startDate}
                </Typography>
                <Typography variant="overline">
                  end date: {application?.App_endDate || 'Pending'}
                </Typography>
              </Grid>

              <Typography variant="body2">{application.App_Description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </>
  );
};

export default Applicationa;
