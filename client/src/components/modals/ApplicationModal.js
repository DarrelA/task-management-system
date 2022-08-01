import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import { Button, Grid, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

const InputModal = ({ open, onClose, newTaskHandler }) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      height: 500,
      maxHeight: 500,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });
  const [inputTaskData, setInputTaskData] = useState({
    App_Acronym: '',
    App_Description: '',
    App_startDate: '',
    App_endDate: '',
  });
  const [disableCreate, setDisableCreate] = useState(false);

  const inputUserHandler = (e) =>
    setInputTaskData({ ...inputTaskData, [e.target.id]: e.target.value });
  const createTaskHandler = () => newTaskHandler({ ...inputTaskData });

  useEffect(() => {
    // @TODO: Validation
  }, []);

  const taskForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createTaskHandler}>
        <TextField
          label="App Acronym"
          type="text"
          id="app_acronym"
          placeholder="delta"
          onInput={inputUserHandler}
          value={inputTaskData.App_Acronym}
          fullWidth
          autoFocus
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

export default InputModal;
