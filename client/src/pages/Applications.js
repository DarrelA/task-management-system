import { Button, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ApplicationModal, LoadingSpinner } from '../components';
import useTaskContext from '../context/taskContext';

const Applications = () => {
  const taskContext = useTaskContext();
  const { isLoading, message } = taskContext;
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const toggleTaskModalHandler = () => setOpenTaskModal((prevState) => !prevState);

  useEffect(() => {
    if (message === 'success') toast.success(message, { autoClose: 200 });
    else if (!!message) toast.error(message);
  }, [message]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Grid container spacing={1} justifyContent="center">
      <Button
        type="button"
        variant="contained"
        color="primary"
        style={{ margin: '16px 0' }}
        onClick={toggleTaskModalHandler}
      >
        Create New Application
      </Button>

      {openTaskModal && (
        <ApplicationModal open={openTaskModal} onClose={toggleTaskModalHandler} />
      )}
    </Grid>
  );
};

export default Applications;
