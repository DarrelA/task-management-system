import { useEffect, useState } from 'react';
import { SwatchesPicker } from 'react-color';
import { useParams } from 'react-router-dom';

import { Button, Grid, TextField } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import useTaskContext from '../../context/taskContext';
import useUserContext from '../../context/userContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const PlanModal = ({ open, onClose }) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      maxWidth: 500,
      maxHeight: 700,
      width: '75%',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    dates: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
    },

    colorDisplay: {
      maxHeight: 100,
      maxWidth: '320px',
      margin: (0, 10),
    },
  }));

  const classes = useStyles();

  const taskContext = useTaskContext();
  const userContext = useUserContext();

  const [modalStyle] = useState({ top: '15%', margin: 'auto' });

  const [inputData, setInputData] = useLocalStorage('planCreateForm', {
    Plan_MVP_name: '',
    Plan_startDate: '',
    Plan_endDate: '',
    Plan_color: '',
  });
  const { Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_color } = inputData;

  const [disableCreate, setDisableCreate] = useState(false);

  const { App_Acronym } = useParams();

  useEffect(() => {
    !Plan_MVP_name || !Plan_startDate || !Plan_endDate || !Plan_color
      ? setDisableCreate(true)
      : setDisableCreate(false);
  }, [Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_color]);

  const inputHandler = (e) =>
    setInputData({
      ...inputData,
      [e.target?.id]: e.target.value,
      [e.target?.name]: e.target.value,
    });

  const planModalHandler = () =>
    taskContext.createPlan(inputData, App_Acronym, userContext.accessToken);

  const planForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={planModalHandler}>
        <TextField
          label="Plan Name"
          type="text"
          id="Plan_MVP_name"
          placeholder="plan 1"
          onInput={inputHandler}
          value={Plan_MVP_name}
          fullWidth
          autoFocus
          required
        />

        <Grid
          container
          spacing={1}
          justifyContent="space-around"
          className={classes.dates}
        >
          <TextField
            label="Start Date"
            id="Plan_startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputHandler}
            defaultValue={Plan_startDate}
            required
          />

          <TextField
            label="End Date"
            id="Plan_endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputHandler}
            defaultValue={Plan_endDate}
            required
          />
        </Grid>

        <Grid
          container
          spacing={1}
          justifyContent="center"
          style={{ padding: 25, paddingBottom: 0 }}
        >
          <SwatchesPicker
            color={Plan_color}
            onChange={(colorPicked) =>
              setInputData({ ...inputData, Plan_color: colorPicked.hex })
            }
            required
          />
          <Grid
            container
            spacing={1}
            justifyContent="center"
            className={classes.colorDisplay}
            style={{ backgroundColor: Plan_color }}
          >
            {Plan_color?.toUpperCase() || 'Pick a color!'}
          </Grid>
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
      {planForm}
    </Modal>
  );
};

export default PlanModal;
