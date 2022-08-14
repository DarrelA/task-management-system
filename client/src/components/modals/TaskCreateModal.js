import { useEffect, useState } from 'react';

import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import useLocalStorage from '../../hooks/useLocalStorage';

const TaskCreateModal = ({ open, onClose, taskCreateModalHandler, plans }) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      maxWidth: 800,
      width: '75%',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    formControl: { minWidth: 166 },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });

  const [Task_name, setTask_name] = useLocalStorage('Task_name', '');
  const [Task_description, setTask_description] = useLocalStorage('Task_description', '');
  const [Task_plan, setTask_plan] = useLocalStorage('Task_plan', '');
  const [New_task_note, setNew_task_note] = useLocalStorage('New_task_note', '');

  const [disableCreate, setDisableCreate] = useState(false);

  const createTaskHandler = () =>
    taskCreateModalHandler({ Task_name, Task_description, Task_plan, New_task_note });

  useEffect(() => {
    !Task_name || !Task_description ? setDisableCreate(true) : setDisableCreate(false);
  }, [Task_name, Task_description]);

  const taskForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createTaskHandler}>
        <Grid spacing={1} container justifyContent="center">
          <Grid container item xs={6}>
            <TextField
              label="Task Name"
              type="text"
              id="Task_name"
              placeholder="task 1"
              onInput={(e) => setTask_name(e.target.value)}
              value={Task_name}
              autoFocus
              required
            />
          </Grid>

          <Grid container item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="Task_plan">Plan</InputLabel>
              <Select
                labelId="Task_plan"
                id="Task_plan"
                name="Task_plan"
                onChange={(e) => setTask_plan(e.target.value)}
                value={Task_plan}
              >
                <MenuItem key="empty" value="">
                  None
                </MenuItem>
                {plans.map((plan) => (
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
          style={{ height: 400, maxHeight: 400, overflowY: 'scroll' }}
          fullWidth
          required
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
        />

        <Grid spacing={1} container>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ margin: '16px 0' }}
            disabled={disableCreate}
          >
            Create
          </Button>
        </Grid>
      </form>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {taskForm}
    </Modal>
  );
};

export default TaskCreateModal;
