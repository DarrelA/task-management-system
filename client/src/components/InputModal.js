import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { useState } from 'react';
import { Button, TextField } from '@material-ui/core';

const InputModal = ({ open, onClose, newGroupHandler }) => {
  const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [inputData, setInputData] = useState('');

  const inputHandler = (e) => setInputData(e.target.value);
  const createGroupHandler = () => {
    onClose();
    newGroupHandler(inputData);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <TextField
        label="User Group"
        type="text"
        id="usergroup"
        placeholder="Group 1"
        onInput={inputHandler}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ margin: '16px 0' }}
        onClick={createGroupHandler}
      >
        Create
      </Button>
    </div>
  );
  return (
    <Modal open={open} onClose={onClose}>
      {body}
    </Modal>
  );
};

export default InputModal;
