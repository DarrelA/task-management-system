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
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

const InputModal = ({ open, onClose, appModalHandler, editAppMode, groups }) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: '75%',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });
  const [inputAppData, setInputAppData] = useState({
    App_Acronym: editAppMode.App_Acronym || '',
    App_Description: editAppMode.App_Description || '',
    App_startDate: editAppMode.App_startDate || '',
    App_endDate: editAppMode.App_endDate || '',
    App_permit_Open: editAppMode.App_permit_Open || '',
    App_permit_toDoList: editAppMode.App_permit_toDoList || '',
    App_permit_Doing: editAppMode.App_permit_Doing || '',
    App_permit_Done: editAppMode.App_permit_Done || '',
  });
  const [disableCreate, setDisableCreate] = useState(false);

  const inputAppHandler = (e) =>
    setInputAppData({
      ...inputAppData,
      [e.target?.id]: e.target.value,
      [e.target?.name]: e.target.value,
    });

  const createTaskHandler = () => appModalHandler({ ...inputAppData });

  useEffect(() => {
    // @TODO: Validation
  }, []);

  const taskForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createTaskHandler}>
        <TextField
          label="App Acronym"
          type="text"
          id="App_Acronym"
          placeholder="delta"
          onInput={inputAppHandler}
          value={inputAppData.App_Acronym}
          fullWidth
          autoFocus
          disabled={!!editAppMode.App_Acronym}
        />

        <TextField
          label="Description"
          type="textarea"
          id="App_Description"
          placeholder="Once upon a time..."
          minRows={5}
          multiline
          onInput={inputAppHandler}
          value={inputAppData.App_Description}
          fullWidth
          autoFocus
        />

        <TextField
          label="Description"
          type="textarea"
          id="App_Description"
          placeholder="Once upon a time..."
          minRows={5}
          multiline
          onInput={inputAppHandler}
          value={inputAppData.App_Description}
          fullWidth
          autoFocus
        />

        <Grid container spacing={1} justifyContent="space-around" style={{ padding: 25 }}>
          <TextField
            label="Start Date"
            id="App_startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputAppHandler}
            defaultValue={inputAppData.App_startDate}
          />

          <TextField
            label="End Date"
            id="App_endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputAppHandler}
            defaultValue={inputAppData.App_endDate}
          />
        </Grid>

        <Typography variant="h6" style={{ paddingTop: 30, textAlign: 'center' }}>
          Application Permissions
        </Typography>

        <Grid
          container
          spacing={1}
          justifyContent="space-around"
          style={{ paddingBottom: 25 }}
        >
          <FormControl className={classes.formControl}>
            <InputLabel id="App_permit_Open">Open</InputLabel>
            <Select
              labelId="App_permit_Open"
              id="App_permit_Open"
              name="App_permit_Open"
              value={inputAppData.App_permit_Open}
              onChange={inputAppHandler}
            >
              <MenuItem key="empty" value="">
                None
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.name} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id="App_permit_toDoList">To Do</InputLabel>
            <Select
              labelId="App_permit_toDoList"
              id="App_permit_toDoList"
              name="App_permit_toDoList"
              value={inputAppData.App_permit_toDoList}
              onChange={inputAppHandler}
            >
              <MenuItem key="empty" value="">
                None
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.name} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id="App_permit_Doing">Doing</InputLabel>
            <Select
              labelId="App_permit_Doing"
              id="App_permit_Doing"
              name="App_permit_Doing"
              value={inputAppData.App_permit_Doing}
              onChange={inputAppHandler}
            >
              <MenuItem key="empty" value="">
                None
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.name} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id="App_permit_Done">Done</InputLabel>
            <Select
              labelId="App_permit_Done"
              id="App_permit_Done"
              name="App_permit_Done"
              value={inputAppData.App_permit_Done}
              onChange={inputAppHandler}
            >
              <MenuItem key="empty" value="">
                None
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.name} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid spacing={1} container>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ margin: '16px 0' }}
            disabled={disableCreate}
          >
            {editAppMode.App_Acronym ? 'Update' : 'Create'}
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
