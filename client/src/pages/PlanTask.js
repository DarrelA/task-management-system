import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

import { LoadingSpinner, PlanModal, TaskModal } from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

const useStyles = makeStyles({
  columnHeaderRed: { color: '#f44336' },
  columnHeaderGreen: { color: '#8bc34a' },

  root: {
    maxWidth: 1400,
    minHeight: 800,
    padding: 10,
  },

  buttons: {
    maxWidth: 300,
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },

  planContent: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-around',
    minHeight: 150,
    maxWidth: 800,
  },

  description: {
    overflowY: 'scroll',
    overflowX: 'hidden',
    height: 210,
    maxHeight: 210,
  },
});

const PlanTask = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const {
    getTasksData,
    appPermits,
    createTask,
    updateTask,
    updateTaskState,
    updateKanbanIndex,
    createPlan,
    updatePlan,
  } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;
  const { taskMessage } = taskContext;

  const { App_Acronym } = useParams();
  const navigate = useNavigate();

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editTaskMode, setEditTaskMode] = useState({ edit: false });

  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [editPlanMode, setEditPlanMode] = useState({ edit: false });

  // fetchTasksOnRefresh on first load
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState();

  const openTaskModalHandler = () => setOpenTaskModal(true);
  const closeTaskModalHandler = () => {
    setEditTaskMode({ edit: false });
    setOpenTaskModal(false);
  };

  const openPlanModalHandler = () => setOpenPlanModal(true);
  const closePlanModalHandler = () => {
    setEditPlanMode({ edit: false });
    setOpenPlanModal(false);
  };

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (taskMessage === 'Application is unavailable.') return navigate('/apps');
    else if (taskMessage === 'Forbidden') return window.location.reload();
    else if (!!taskMessage) toast.error(taskMessage);

    if (!!message) toast.error(message);
  }, [navigate, taskMessage, message]);

  // @TODO: Prevent createTask Modal from closing due to rerender
  useEffect(() => {
    const fetchTasksOnRefresh = async () => {
      const tasks = await getTasksData(App_Acronym, accessToken);
      if (tasks) {
        setColumns(tasks);
        setIsLoading(false);
      }
    };
    accessToken && fetchTasksOnRefresh();
  }, [App_Acronym, accessToken, getTasksData]);

  const taskModalHandler = async (inputData) => {
    if (!inputData) return;
    if (!editTaskMode.edit) {
      const success = await createTask(inputData, App_Acronym, accessToken);
      if (success)
        setColumns({
          ...columns,
          open: { ...columns.open, items: [...columns.open.items, inputData] },
        });
    } else {
      updateTask(inputData, App_Acronym, accessToken);
      closeTaskModalHandler();
    }
  };

  const planModalHandler = async (inputData) => {
    if (!inputData) return;
    if (!editTaskMode.edit) {
      const success = await createPlan(inputData, App_Acronym, accessToken);
      // if (success)
      //   setColumns({
      //     ...columns,
      //     open: { ...columns.open, items: [...columns.open.items, inputData] },
      //   });
    } else {
      updatePlan(inputData, App_Acronym, accessToken);
      closeTaskModalHandler();
    }
  };

  const onDragEndHandler = (result, columns, setColumns) => {
    if (!result.destination) return;

    const from = result.source.droppableId;
    const to = result.destination.droppableId;

    // Validation for promoting and demoting state
    if (
      (from === 'open' && to !== 'open' && to !== 'todolist') ||
      (from === 'todolist' && to !== 'todolist' && to !== 'doing') ||
      (from === 'doing' && to !== 'doing' && to !== 'todolist' && to !== 'done') ||
      (from === 'done' && to !== 'done' && to !== 'doing' && to !== 'close') ||
      (from === 'close' && to !== 'close')
    )
      return;

    if (
      (from === 'open' && !appPermits.App_permit_Open) ||
      (from === 'todolist' && !appPermits.App_permit_toDoList) ||
      (from === 'doing' && !appPermits.App_permit_Doing) ||
      (from === 'done' && !appPermits.App_permit_Done)
    )
      return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });

      updateTaskState(
        App_Acronym,
        result.draggableId,
        source.droppableId,
        destination.droppableId,
        accessToken
      );

      updateKanbanIndex(
        {
          ...columns.name,
          [source.droppableId]: {
            ...sourceColumn,
            name: columns.name,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            name: columns.name,
            items: destItems,
          },
        },
        result.draggableId,
        App_Acronym,
        accessToken
      );
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
      updateKanbanIndex(
        {
          ...columns.name,
          [source.droppableId]: { ...column, name: columns.name, items: copiedItems },
        },
        result.draggableId,
        App_Acronym,
        accessToken
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {openTaskModal && (
        <TaskModal
          open={openTaskModal}
          onClose={closeTaskModalHandler}
          taskModalHandler={taskModalHandler}
          editTaskMode={editTaskMode}
        />
      )}

      {openPlanModal && (
        <PlanModal
          open={openPlanModal}
          onClose={closePlanModalHandler}
          planModalHandler={planModalHandler}
          editPlanMode={editPlanMode}
        />
      )}

      <Grid container spacing={1} justifyContent="center">
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          className={classes.buttons}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ margin: '16px 0' }}
            onClick={openPlanModalHandler}
          >
            Create Plan
          </Button>

          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ margin: '16px 0' }}
            onClick={openTaskModalHandler}
            disabled={!appPermits.App_permit_Create}
          >
            Create Task
          </Button>
        </Grid>
      </Grid>

      {/* @TODO: Collaspe all kanbans of all plans*/}
      <Grid container spacing={1} justifyContent="center">
        <Card
          className={classes.root}
          variant="outlined"
          key={App_Acronym}
          style={{ borderColor: 'blue' }} // @TODO: Match respective plan's hex code
        >
          <CardContent className={classes.cardContent}>
            {/* @TODO: Collaspe all plans */}
            <Grid
              container
              spacing={1}
              justifyContent="center"
              className={classes.planContent}
            >
              <Typography>Plan Name</Typography>
              <Typography>Plan Description</Typography>
            </Grid>

            <Grid container spacing={1} justifyContent="center">
              <DragDropContext
                onDragEnd={(result) => onDragEndHandler(result, columns, setColumns)}
              >
                {Object.entries(columns)?.map(([columnId, column], index) => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                      key={columnId}
                    >
                      {column.name === 'Open' && (
                        <h2
                          className={
                            appPermits.App_permit_Open
                              ? classes.columnHeaderGreen
                              : classes.columnHeaderRed
                          }
                        >
                          {column.name}
                        </h2>
                      )}
                      {column.name === 'To Do List' && (
                        <h2
                          className={
                            appPermits.App_permit_toDoList
                              ? classes.columnHeaderGreen
                              : classes.columnHeaderRed
                          }
                        >
                          {column.name}
                        </h2>
                      )}
                      {column.name === 'Doing' && (
                        <h2
                          className={
                            appPermits.App_permit_Doing
                              ? classes.columnHeaderGreen
                              : classes.columnHeaderRed
                          }
                        >
                          {column.name}
                        </h2>
                      )}
                      {column.name === 'Done' && (
                        <h2
                          className={
                            appPermits.App_permit_Done
                              ? classes.columnHeaderGreen
                              : classes.columnHeaderRed
                          }
                        >
                          {column.name}
                        </h2>
                      )}
                      {column.name === 'Close' && <h2>{column.name}</h2>}
                      <div style={{ margin: 8 }}>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? 'lightblue'
                                    : 'lightgrey',
                                  padding: 4,
                                  width: 250,
                                  minHeight: 500,
                                }}
                              >
                                {column.items.map((item, index) => (
                                  <Draggable
                                    key={item.Task_name}
                                    draggableId={item.Task_name}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: 'none',
                                          padding: 16,
                                          margin: '0 0 8px 0',
                                          minHeight: '50px',
                                          backgroundColor: snapshot.isDragging
                                            ? '#263B4A'
                                            : '#456C86',
                                          color: 'white',
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        {item.Task_id}
                                        <br />
                                        {item.Task_name}
                                        <br />
                                        {item.Task_description}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
              </DragDropContext>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default PlanTask;
