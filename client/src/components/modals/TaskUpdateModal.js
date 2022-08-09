import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import { Button, Grid, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

const TaskModal = ({ open, onClose, taskModalHandler, taskItemData }) => {
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
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });

  const options = {
    weekday: 'short',
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  const [inputAppData, setInputAppData] = useState({
    Task_name: taskItemData?.Task_name || '',
    Task_id: taskItemData?.Task_id || '',
    Task_state: taskItemData?.Task_state || '',
    Task_description: taskItemData?.Task_description || '',
    Task_creator: taskItemData?.Task_creator || '',
    Task_owner: taskItemData?.Task_owner || '',
    createdAt: new Date(taskItemData?.createdAt).toLocaleString('en-US', options) || '',
  });
  const [disableCreate, setDisableCreate] = useState(false);

  const inputAppHandler = (e) =>
    setInputAppData({
      ...inputAppData,
      [e.target?.id]: e.target.value,
      [e.target?.name]: e.target.value,
    });

  const createTaskHandler = () => taskModalHandler({ ...inputAppData });

  useEffect(() => {
    !inputAppData.Task_name ? setDisableCreate(true) : setDisableCreate(false);
  }, [inputAppData.Task_name]);

  const taskForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createTaskHandler}>
        <Grid spacing={1} container justifyContent="center">
          <Grid container item xs={4}>
            <TextField
              label="Name"
              type="text"
              id="Task_name"
              placeholder="task 1"
              onInput={inputAppHandler}
              value={inputAppData.Task_name}
              autoFocus
              disabled={!!taskItemData?.Task_name}
              required
            />
          </Grid>

          <Grid container item xs={4}>
            <TextField
              label="Id"
              type="text"
              id="Task_id"
              value={inputAppData.Task_id}
              disabled={!!taskItemData?.Task_id}
            />
          </Grid>

          <Grid container item xs={4}>
            <TextField
              label="State"
              type="text"
              id="Task_state"
              value={inputAppData.Task_state}
              disabled={!!taskItemData?.Task_state}
            />
          </Grid>
        </Grid>

        <Grid spacing={1} container justifyContent="center">
          <Grid container item xs={4}>
            <TextField
              label="Creator"
              type="text"
              id="Task_creator"
              placeholder="task 1"
              onInput={inputAppHandler}
              value={inputAppData.Task_creator}
              autoFocus
              disabled={!!taskItemData?.Task_creator}
              required
            />
          </Grid>

          <Grid container item xs={4}>
            <TextField
              label="Owner"
              type="text"
              id="Task_owner"
              value={inputAppData.Task_owner}
              disabled={!!taskItemData?.Task_owner}
            />
          </Grid>

          <Grid container item xs={4}>
            <TextField
              label="Create At"
              type="text"
              id="createdAt"
              value={inputAppData.createdAt}
              disabled={!!taskItemData?.createdAt}
            />
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
            Update
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

export default TaskModal;
