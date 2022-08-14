import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';
import useLocalStorage from '../hooks/useLocalStorage';

const useStyles = makeStyles((theme) => ({
  root: { width: 1340, margin: '100px auto', padding: 20 },
  formControl: { minWidth: 166 },
  decription: { maxHeight: 300, overflowY: 'scroll' },

  notesReadme: {
    marginTop: 15,
    width: 1300,
    maxWidth: 1300,
    minHeight: 160,
    maxHeight: 400,
    overflowY: 'scroll !important',
    overflowX: 'hidden',
  },
}));

const TaskUpdate = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const {
    taskMessage,
    isLoading,
    getTaskData,
    appPermits,
    getPlansData,
    plans,
    updateTask,
  } = taskContext;
  const userContext = useUserContext();
  const { accessToken } = userContext;
  const { App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done } =
    appPermits;

  const { App_Acronym, taskName } = useParams();
  const navigate = useNavigate();

  const options = {
    weekday: 'short',
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  const [Task_name, setTask_name] = useLocalStorage('TaskName', '');
  const [Task_id, setTask_id] = useLocalStorage('TaskId', '');
  const [Task_state, setTask_state] = useLocalStorage('TaskState', '');
  const [Task_notes, setTask_notes] = useLocalStorage('TaskNotes', '');
  const [New_task_note, setNew_task_note] = useLocalStorage('NewTaskNote', '');
  const [Task_description, setTask_description] = useLocalStorage('TaskDescription', '');
  const [Task_creator, setTask_creator] = useLocalStorage('TaskCreator', '');
  const [Task_owner, setTask_owner] = useLocalStorage('TaskOwner', '');
  const [Task_plan, setTask_plan] = useLocalStorage('TaskPlan', '');
  const [createdAt, setcreatedAt] = useLocalStorage('createdAt', '');

  const [disableCreate, setDisableCreate] = useState(false);

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (!!taskMessage) toast.error(taskMessage);
  }, [taskMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const firstFetchTask = async () => {
      const { task } = await getTaskData(App_Acronym, taskName, accessToken);
      if (!!task || taskMessage === 'success') {
        setTask_name(task.Task_name);
        setTask_id(task.Task_id);
        setTask_state(task.Task_state);
        setTask_notes(task.Task_notes);
        setNew_task_note('');
        setTask_description(task.Task_description);
        setTask_creator(task.Task_creator);
        setTask_owner(task.Task_owner);
        setTask_plan(task.Task_plan || '');
        setcreatedAt(new Date(task.createdAt).toLocaleString('en-US', options) || '');
      }
    };

    accessToken && firstFetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [App_Acronym, taskName, accessToken, getTaskData, taskMessage, Task_notes]);

  useEffect(() => {
    accessToken && getPlansData(App_Acronym, accessToken);
  }, [App_Acronym, accessToken, getPlansData]);

  useEffect(() => {
    (Task_state === 'open' && !App_permit_Open) ||
    (Task_state === 'todolist' && !App_permit_toDoList) ||
    (Task_state === 'doing' && !App_permit_Doing) ||
    (Task_state === 'done' && !App_permit_Done)
      ? setDisableCreate(true)
      : setDisableCreate(false);
  }, [
    Task_state,
    App_permit_Open,
    App_permit_toDoList,
    App_permit_Doing,
    App_permit_Done,
  ]);

  const updateTaskHandler = () => {
    updateTask(
      { Task_name, Task_state, Task_plan, New_task_note },
      App_Acronym,
      accessToken
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Grid spacing={1} container justifyContent="center">
      <Card className={classes.root} variant="outlined" key={Task_name}>
        <form onSubmit={updateTaskHandler}>
          <Grid spacing={1} container justifyContent="center">
            <Grid container item xs={4}>
              <TextField
                label="Name"
                type="text"
                id="Task_name"
                value={Task_name}
                autoFocus
                disabled={!!Task_name}
                required
              />
            </Grid>

            <Grid container item xs={4}>
              <TextField
                label="Id"
                type="text"
                id="Task_id"
                value={Task_id}
                disabled={!!Task_id}
              />
            </Grid>

            <Grid container item xs={4}>
              <TextField
                label="State"
                type="text"
                id="Task_state"
                value={Task_state}
                disabled={!!Task_state}
              />
            </Grid>
          </Grid>
          <Grid spacing={1} container justifyContent="center">
            <Grid container item xs={4}>
              <TextField
                label="Creator"
                type="text"
                id="Task_creator"
                value={Task_creator}
                autoFocus
                disabled={!!Task_creator}
                required
              />
            </Grid>

            <Grid container item xs={4}>
              <TextField
                label="Owner"
                type="text"
                id="Task_owner"
                value={Task_owner}
                disabled={!!Task_owner}
              />
            </Grid>

            <Grid container item xs={4}>
              <TextField
                label="Create At"
                type="text"
                id="createdAt"
                value={createdAt}
                disabled={!!createdAt}
              />
            </Grid>

            <Grid container item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Task_plan">Plan</InputLabel>
                <Select
                  labelId="Task_plan"
                  id="Task_plan"
                  name="Task_plan"
                  value={Task_plan}
                  onChange={(e) => setTask_plan(e.target.value)}
                  disabled={
                    (Task_state === 'open' && !App_permit_Open) ||
                    (Task_state === 'todolist' && !App_permit_toDoList) ||
                    (Task_state === 'doing' && !App_permit_Doing) ||
                    Task_state === 'done' ||
                    Task_state === 'close'
                  }
                >
                  <MenuItem key="empty" value="">
                    None
                  </MenuItem>
                  {plans?.map((plan) => (
                    <MenuItem key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                      {plan.Plan_MVP_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            label="Description"
            type="textarea"
            id="Task_description"
            minRows={5}
            multiline
            onInput={(e) => setTask_description(e.target.value)}
            value={Task_description}
            disabled={!!Task_description}
            fullWidth
            className={classes.decription}
          />

          <Typography variant="h6" style={{ paddingTop: 20, textAlign: 'center' }}>
            Notes
          </Typography>

          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            className={classes.notesReadme}
            defaultValue={Task_notes}
            readOnly
          />

          <TextField
            label="Task Note"
            type="textarea"
            id="New_task_note"
            minRows={5}
            multiline
            onInput={(e) => setNew_task_note(e.target.value)}
            value={New_task_note}
            fullWidth
            disabled={
              (Task_state === 'open' && !App_permit_Open) ||
              (Task_state === 'todolist' && !App_permit_toDoList) ||
              (Task_state === 'doing' && !App_permit_Doing) ||
              Task_state === 'done' ||
              Task_state === 'close'
            }
          />

          <Grid spacing={1} container justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ margin: '16px 0' }}
              disabled={disableCreate}
            >
              Update
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
};

export default TaskUpdate;
