import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

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

    formControl: {
      minWidth: 166,
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });
  const [inputAppData, setInputAppData] = useState({
    Task_name: '',
    Task_description: '',
    Task_plan: '',
  });
  const [disableCreate, setDisableCreate] = useState(false);

  const inputAppHandler = (e) =>
    setInputAppData({
      ...inputAppData,
      [e.target?.id]: e.target.value,
      [e.target?.name]: e.target.value,
    });

  const createTaskHandler = () => taskCreateModalHandler({ ...inputAppData });

  useEffect(() => {
    !inputAppData.Task_name ? setDisableCreate(true) : setDisableCreate(false);
  }, [inputAppData.Task_name]);

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
              onInput={inputAppHandler}
              value={inputAppData.Task_name}
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
                onChange={inputAppHandler}
                value={inputAppData.Task_plan}
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
          onInput={inputAppHandler}
          value={inputAppData.Task_description}
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
