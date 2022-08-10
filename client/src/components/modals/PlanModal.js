import { useEffect, useState } from 'react';
import { SwatchesPicker } from 'react-color';

import { Button, Grid, TextField } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

const PlanModal = ({ open, onClose, planModalHandler, editPlanMode }) => {
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
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });
  const [inputAppData, setInputAppData] = useState({
    Plan_MVP_name: editPlanMode?.Plan_MVP_name || '',
    Plan_startDate: editPlanMode?.Plan_startDate || '',
    Plan_endDate: editPlanMode?.Plan_endDate || '',
    Plan_color: editPlanMode?.Plan_color || '',
  });
  const [disableCreate, setDisableCreate] = useState(false);

  const inputAppHandler = (e) =>
    setInputAppData({
      ...inputAppData,
      [e.target?.id]: e.target.value,
      [e.target?.name]: e.target.value,
    });

  const createTaskHandler = () => planModalHandler({ ...inputAppData });

  useEffect(() => {
    !inputAppData.Plan_MVP_name ||
    !inputAppData.Plan_startDate ||
    !inputAppData.Plan_endDate ||
    !inputAppData.Plan_color
      ? setDisableCreate(true)
      : setDisableCreate(false);
  }, [
    inputAppData.Plan_MVP_name,
    inputAppData.Plan_startDate,
    inputAppData.Plan_endDate,
    inputAppData.Plan_color,
  ]);

  const taskForm = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={createTaskHandler}>
        <TextField
          label="Plan Name"
          type="text"
          id="Plan_MVP_name"
          placeholder="plan 1"
          onInput={inputAppHandler}
          value={inputAppData.Plan_MVP_name}
          fullWidth
          autoFocus
          disabled={!!editPlanMode?.Plan_MVP_name}
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
            onInput={inputAppHandler}
            defaultValue={inputAppData.Plan_startDate}
            required
          />

          <TextField
            label="End Date"
            id="Plan_endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputAppHandler}
            defaultValue={inputAppData.Plan_endDate}
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
            color={inputAppData.Plan_color}
            onChange={(colorPicked) =>
              setInputAppData({ ...inputAppData, Plan_color: colorPicked.hex })
            }
            required
          />
          <Grid
            container
            spacing={1}
            justifyContent="center"
            className={classes.colorDisplay}
            style={{ backgroundColor: inputAppData.Plan_color }}
          >
            {inputAppData.Plan_color.toUpperCase() || 'Pick a color!'}
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
            {editPlanMode?.Plan_MVP_name ? 'Update' : 'Create'}
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

export default PlanModal;
