import { Button, Grid } from '@material-ui/core';

const CreatePlanTask = (props) => {
  const { openPlanModalHandler, openTaskCreateModalHandler, appPermits } = props;

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        style={{ maxWidth: 300 }}
      >
        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ margin: '16px 0' }}
          onClick={openPlanModalHandler}
          disabled={!appPermits?.isProjectManager}
        >
          Create Plan
        </Button>

        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ margin: '16px 0' }}
          onClick={openTaskCreateModalHandler}
          disabled={!appPermits?.App_permit_Create}
        >
          Create Task
        </Button>
      </Grid>
    </Grid>
  );
};
export default CreatePlanTask;
