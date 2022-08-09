import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import { Button, Grid, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

const TaskCreateModal = ({ open, onClose, taskCreateModalHandler }) => {
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
  const [inputAppData, setInputAppData] = useState({
    Task_name: '',
    Task_description: '',
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
        <TextField
          label="Task Name"
          type="text"
          id="Task_name"
          placeholder="task 1"
          onInput={inputAppHandler}
          value={inputAppData.Task_name}
          fullWidth
          autoFocus
          required
        />

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
