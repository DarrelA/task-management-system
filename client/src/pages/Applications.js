import { Button, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ApplicationModal, LoadingSpinner } from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

const Applications = () => {
  const taskContext = useTaskContext();
  const { createApplication } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;

  const { isLoading, taskMessage } = taskContext;
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const toggleTaskModalHandler = () => setOpenTaskModal((prevState) => !prevState);

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (!!taskMessage) toast.error(taskMessage);

    if (!!message) toast.error(message);
  }, [taskMessage, message]);

  const newAppHandler = (inputData) => {
    if (!inputData) return;
    createApplication(inputData, accessToken);
  };

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
        <ApplicationModal
          open={openTaskModal}
          onClose={toggleTaskModalHandler}
          newAppHandler={newAppHandler}
        />
      )}
    </Grid>
  );
};

export default Applications;
