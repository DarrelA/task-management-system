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
import useLocalStorage from '../../hooks/useLocalStorage';

const ApplicationModal = ({
  open,
  onClose,
  appModalHandler,
  editAppMode,
  groups,
  isProjectLead,
}) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      maxWidth: 600,
      width: '75%',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },

    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });

  const [App_Acronym, setApp_Acronym] = useLocalStorage(
    'App_Acronym',
    editAppMode?.App_Acronym ?? ''
  );
  const [App_Rnumber, setApp_Rnumber] = useLocalStorage(
    'App_Rnumber',
    editAppMode?.App_Rnumber ?? ''
  );
  const [App_Description, setApp_Description] = useLocalStorage(
    'App_Description',
    editAppMode?.App_Description ?? ''
  );
  const [App_startDate, setApp_startDate] = useLocalStorage(
    'App_startDate',
    editAppMode?.App_startDate ?? ''
  );
  const [App_endDate, setApp_endDate] = useLocalStorage(
    'App_endDate',
    editAppMode?.App_endDate ?? ''
  );
  const [App_permit_Create, setApp_permit_Create] = useLocalStorage(
    'App_permit_Create',
    editAppMode?.App_permit_Create ?? ''
  );
  const [App_permit_Open, setApp_permit_Open] = useLocalStorage(
    'App_permit_Open',
    editAppMode?.App_permit_Open ?? ''
  );
  const [App_permit_toDoList, setApp_permit_toDoList] = useLocalStorage(
    'App_permit_toDoList',
    editAppMode?.App_permit_toDoList ?? ''
  );
  const [App_permit_Doing, setApp_permit_Doing] = useLocalStorage(
    'App_permit_Doing',
    editAppMode?.App_permit_Doing ?? ''
  );
  const [App_permit_Done, setApp_permit_Done] = useLocalStorage(
    'App_permit_Done',
    editAppMode?.App_permit_Done ?? ''
  );

  const [disableCreate, setDisableCreate] = useState(false);

  const createTaskHandler = () =>
    appModalHandler({
      App_Acronym,
      App_Rnumber,
      App_Description,
      App_startDate,
      App_endDate,
      App_permit_Create,
      App_permit_Open,
      App_permit_toDoList,
      App_permit_Doing,
      App_permit_Done,
    });

  useEffect(() => {
    App_Rnumber === false || !App_Acronym || !App_Description
      ? setDisableCreate(true)
      : setDisableCreate(false);
  }, [App_Rnumber, App_Acronym, App_Description]);

  const taskForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createTaskHandler}>
        <TextField
          label="App Rnumber"
          type="number"
          id="App_Rnumber"
          onInput={(e) => setApp_Rnumber(e.target.value)}
          value={App_Rnumber}
          required
          fullWidth
          disabled={!!editAppMode?.App_Acronym}
          autoFocus
        />

        <TextField
          label="App Acronym"
          type="text"
          id="App_Acronym"
          placeholder="delta"
          onInput={(e) => setApp_Acronym(e.target.value)}
          value={App_Acronym}
          required
          fullWidth
          disabled={!!editAppMode?.App_Acronym}
        />

        <TextField
          label="Description"
          type="textarea"
          id="App_Description"
          minRows={8}
          multiline
          onInput={(e) => setApp_Description(e.target.value)}
          value={App_Description}
          required
          fullWidth
          style={{ height: 200, maxHeight: 400, overflowY: 'scroll' }}
          disabled={!isProjectLead}
        />

        <Grid container spacing={1} justifyContent="space-around" style={{ padding: 25 }}>
          <TextField
            label="Start Date"
            id="App_startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={(e) => setApp_startDate(e.target.value)}
            defaultValue={App_startDate}
            disabled={!isProjectLead}
          />

          <TextField
            label="End Date"
            id="App_endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={(e) => setApp_endDate(e.target.value)}
            defaultValue={App_endDate}
            disabled={!isProjectLead}
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
            <InputLabel id="App_permit_Create">Create</InputLabel>
            <Select
              labelId="App_permit_Create"
              id="App_permit_Create"
              name="App_permit_Create"
              value={App_permit_Create}
              onChange={(e) => setApp_permit_Create(e.target.value)}
              disabled={!isProjectLead}
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
            <InputLabel id="App_permit_Open">Open</InputLabel>
            <Select
              labelId="App_permit_Open"
              id="App_permit_Open"
              name="App_permit_Open"
              value={App_permit_Open}
              onChange={(e) => setApp_permit_Open(e.target.value)}
              disabled={!isProjectLead}
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
              value={App_permit_toDoList}
              onChange={(e) => setApp_permit_toDoList(e.target.value)}
              disabled={!isProjectLead}
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
              value={App_permit_Doing}
              onChange={(e) => setApp_permit_Doing(e.target.value)}
              disabled={!isProjectLead}
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
              value={App_permit_Done}
              onChange={(e) => setApp_permit_Done(e.target.value)}
              disabled={!isProjectLead}
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
            disabled={disableCreate || !isProjectLead}
          >
            {editAppMode?.App_Acronym ? 'Update' : 'Create'}
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

export default ApplicationModal;
