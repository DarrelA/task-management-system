import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { useState } from 'react';
import { Button, Chip, Grid, TextField } from '@material-ui/core';

const InputModal = ({
  whichModal,
  open,
  onClose,
  newGroupHandler,
  newUserHandler,
  allGroups,
}) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    usergroups: {
      overflow: 'scroll',
      maxHeight: 400,
      marginTop: 15,
      marginBottom: 5,
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });
  const [inputGroupData, setInputGroupData] = useState('');
  const [inputUserData, setInputUserData] = useState({
    username: '',
    email: '@company.com',
    inGroups: [],
  });
  const [inGroups, setInGroups] = useState([]);
  const [notInGroups, setNotInGroups] = useState([...allGroups]);

  const inputGroupHandler = (e) => setInputGroupData(e.target.value);
  const createGroupHandler = () => newGroupHandler(inputGroupData);

  const inputUserHandler = (e) =>
    setInputUserData({ ...inputUserData, [e.target.id]: e.target.value });
  const createUserHandler = () => newUserHandler({ ...inputUserData, inGroups });

  const groupForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createGroupHandler}>
        <TextField
          label="User Group"
          type="text"
          id="usergroup"
          placeholder="Group1"
          onInput={inputGroupHandler}
          fullWidth
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ margin: '16px 0' }}
        >
          Create
        </Button>
      </form>
    </div>
  );

  const userForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createUserHandler}>
        <TextField
          label="Username"
          type="text"
          id="username"
          placeholder="John Doe"
          onInput={inputUserHandler}
          value={inputUserData.username}
          fullWidth
          autoFocus
        />

        <TextField
          label="Email"
          type="email"
          id="email"
          placeholder="lane@company.com"
          onInput={inputUserHandler}
          fullWidth
          value={inputUserData.email}
        />

        <TextField
          label="Password"
          type="password"
          id="password"
          onInput={inputUserHandler}
          fullWidth
        />

        <TextField
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          onInput={inputUserHandler}
          fullWidth
        />

        <Grid
          container
          spacing={1}
          alignContent="space-between"
          justifyContent="space-between"
          className={classes.usergroups}
        >
          <Grid spacing={1} container justifyContent="center">
            {inGroups.map((group) => (
              <Grid item key={group}>
                <Chip
                  label={group}
                  size="medium"
                  variant="default"
                  color="default"
                  clickable
                  onClick={() => {
                    setInGroups(inGroups.filter((grp) => grp !== group));
                    setNotInGroups([group, ...notInGroups].sort());
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Grid spacing={1} container justifyContent="center">
            {notInGroups.map((group) => (
              <Grid item key={group}>
                <Chip
                  label={group}
                  size="small"
                  variant="default"
                  color="secondary"
                  clickable
                  onClick={() => {
                    setNotInGroups(notInGroups.filter((grp) => grp !== group));
                    setInGroups([group, ...inGroups]);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ margin: '16px 0' }}
        >
          Create
        </Button>
      </form>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {whichModal === 'group' ? groupForm : userForm}
    </Modal>
  );
};

export default InputModal;
