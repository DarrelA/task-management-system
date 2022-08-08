import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import { Button, Grid, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

const PlanModal = ({ open, onClose, planModalHandler, editPlanMode }) => {
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
      margin: theme.spacing(1),
      minWidth: 150,
    },

    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState({ top: '15%', margin: 'auto' });
  const [inputAppData, setInputAppData] = useState({
    Plan_MVP_name: editPlanMode?.Plan_MVP_name || '',
    Task_description: editPlanMode?.Task_description || '',
    Plan_startDate: editPlanMode?.Plan_startDate || '',
    Plan_endDate: editPlanMode?.Plan_endDate || '',
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
    !inputAppData.Plan_MVP_name ? setDisableCreate(true) : setDisableCreate(false);
  }, [inputAppData.Plan_MVP_name]);

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

        <Grid container spacing={1} justifyContent="space-around" style={{ padding: 25 }}>
          <TextField
            label="Start Date"
            id="Plan_startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputAppHandler}
            defaultValue={inputAppData.Plan_startDate}
          />

          <TextField
            label="End Date"
            id="Plan_endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            onInput={inputAppHandler}
            defaultValue={inputAppData.Plan_endDate}
          />
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
