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
import { Link } from 'react-router-dom';
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

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },

  description: {
    overflowY: 'scroll',
    overflowX: 'hidden',
    height: 210,
    maxHeight: 210,
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: (0, 10),
  },
});

const Applications = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const {
    getApplicationsData,
    applications,
    groups,
    isProjectLead,
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
    [
      'App_Acronym',
      'App_Rnumber',
      'App_Description',
      'App_startDate',
      'App_endDate',
      'App_permit_Create',
      'App_permit_Open',
      'App_permit_toDoList',
      'App_permit_Doing',
      'App_permit_Done',
    ].forEach((key) => localStorage.removeItem(key));

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
    else updateApplication(inputData, accessToken);
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
          isProjectLead={isProjectLead}
        />
      )}

      <Grid container spacing={1} justifyContent="center">
        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ margin: '16px 0' }}
          onClick={openTaskModalHandler}
          disabled={!isProjectLead}
        >
          Create Application
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
            <CardContent className={classes.cardContent}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                #{application.App_Rnumber}: {application.App_Acronym}
              </Typography>

              <Grid
                container
                justifyContent="space-between"
                style={{ paddingBottom: 10 }}
              >
                <Typography variant="overline">
                  start date: {application.App_startDate || 'Pending'}
                </Typography>
                <Typography variant="overline">
                  end date: {application?.App_endDate || 'Pending'}
                </Typography>
              </Grid>

              <Typography variant="body2" className={classes.description}>
                {application.App_Description}
              </Typography>

              <CardActions className={classes.cardActions}>
                <Button
                  size="small"
                  onClick={() => {
                    setEditAppMode({ ...application, edit: true });
                    openTaskModalHandler();
                  }}
                >
                  <span className="material-icons">edit</span>
                </Button>

                <Link
                  to={`/apps/${application.App_Acronym}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <span className="material-icons">menu_book</span>
                </Link>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </>
  );
};

export default Applications;
