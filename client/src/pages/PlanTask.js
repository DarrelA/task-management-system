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
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner, TaskModal } from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

const useStyles = makeStyles({
  root: {
    minWidth: 240,
    maxWidth: 240,
    minHeight: 200,
    maxHeight: 200,
    margin: (0, 10),
  },

  title: {
    fontSize: 22,
    textAlign: 'center',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: 5,
    '&:last-child': {
      paddingBottom: 0,
    },
  },

  description: {
    height: 90,
    maxHeight: 90,
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: (0, 5),
  },
});

const PlanTask = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const { getTasksData, tasks, createTask, updateTask } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;
  const { isLoading, taskMessage } = taskContext;

  const { App_Acronym } = useParams();
  const navigate = useNavigate();

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editTaskMode, setEditTaskMode] = useState({ edit: false });

  const openTaskModalHandler = () => setOpenTaskModal(true);
  const closeTaskModalHandler = () => {
    setEditTaskMode({ edit: false });
    setOpenTaskModal(false);
  };

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (taskMessage === 'Application is unavailable.') return navigate('/apps');
    else if (!!taskMessage) toast.error(taskMessage);

    if (!!message) toast.error(message);
  }, [navigate, taskMessage, message]);

  useEffect(() => {
    accessToken && getTasksData(App_Acronym, accessToken);
  }, [App_Acronym, accessToken, getTasksData]);

  const taskModalHandler = (inputData) => {
    if (!inputData) return;
    if (!editTaskMode.edit) createTask(inputData, App_Acronym, accessToken);
    else {
      updateTask(inputData, App_Acronym, accessToken);
      closeTaskModalHandler();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {openTaskModal && (
        <TaskModal
          open={openTaskModal}
          onClose={closeTaskModalHandler}
          taskModalHandler={taskModalHandler}
          editTaskMode={editTaskMode}
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
          Create Task
        </Button>
      </Grid>

      <Grid container spacing={1} justifyContent="flex-start">
        {tasks?.map((task) => (
          <Card className={classes.root} variant="outlined" key={task.Task_name}>
            <CardContent className={classes.cardContent}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {task.Task_name}
              </Typography>

              <Typography variant="body2" className={classes.description}>
                {task.Task_description}
              </Typography>

              <CardActions className={classes.cardActions}>
                <Button
                  size="small"
                  onClick={() => {
                    setEditTaskMode({ ...task, edit: true });
                    openTaskModalHandler();
                  }}
                >
                  <span className="material-icons">edit</span>
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </>
  );
};

export default PlanTask;
