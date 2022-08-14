import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

import {
  CreatePlanTask,
  LoadingSpinner,
  PlanCard,
  PlanModal,
  TaskCardColumn,
  TaskCreateModal,
} from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

const useStyles = makeStyles({
  tasksCardContent: { display: 'flex', flexDirection: 'column' },

  dragDropContext: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  droppable: { padding: 4, width: 250, minHeight: 500 },
  draggable: { userSelect: 'none', padding: 16, margin: '0 0 8px 0', minHeight: '50px' },

  text: { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: 0,
  },
});

const PlanTask = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const {
    taskMessage,
    isLoading,
    getAllTasksData,
    tasks,
    appPermits,
    createTask,
    updateTaskState,
    updateKanbanIndex,
    getPlansData,
    plans,
  } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;

  const { App_Acronym } = useParams();
  const navigate = useNavigate();

  const [openTaskCreateModal, setOpenTaskCreateModal] = useState(false);
  const [openPlanModal, setOpenPlanModal] = useState(false);

  // setFetchIsLoading on first load
  const [fetchIsLoading, setFetchIsLoading] = useState(true);
  const [columns, setColumns] = useState(tasks);

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (taskMessage === 'Application is unavailable.') return navigate('/apps');
    else if (!!taskMessage) toast.error(taskMessage);
    if (!!message) toast.error(message);
  }, [navigate, taskMessage, message]);

  useEffect(() => {
    const firstFetchTasks = async () => {
      const { tasks } = await getAllTasksData(App_Acronym, accessToken);
      if (!!tasks) {
        setColumns(tasks);
        setFetchIsLoading(false);
      }
    };
    accessToken && firstFetchTasks();
  }, [App_Acronym, accessToken, getAllTasksData]);

  useEffect(() => {
    accessToken && getPlansData(App_Acronym, accessToken);
  }, [App_Acronym, accessToken, getPlansData]);

  const openTaskCreateModalHandler = () => setOpenTaskCreateModal(true);
  const closeTaskCreateModalHandler = () => {
    setOpenTaskCreateModal(false);
    ['Task_name', 'Task_description', 'Task_plan', 'New_task_note'].forEach((key) =>
      localStorage.removeItem(key)
    );
  };

  const taskCreateModalHandler = async (inputData) => {
    if (!inputData) return;

    const success = await createTask(inputData, App_Acronym, accessToken);
    if (success)
      setColumns({
        ...columns,
        open: { ...columns.open, items: [...columns.open.items, inputData] },
      });
  };

  const openPlanModalHandler = () => setOpenPlanModal(true);
  const closePlanModalHandler = () => {
    setOpenPlanModal(false);
    ['Plan_MVP_name', 'Plan_startDate', 'Plan_endDate', 'Plan_color'].forEach((key) =>
      localStorage.removeItem(key)
    );
  };

  const onDragEndHandler = async (result, columns, setColumns) => {
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

      const success = updateTaskState(
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

      if (success) {
        setColumns({
          ...columns,
          [source.droppableId]: { ...sourceColumn, items: sourceItems },
          [destination.droppableId]: { ...destColumn, items: destItems },
        });
      }
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      updateKanbanIndex(
        {
          ...columns.name,
          [source.droppableId]: { ...column, name: columns.name, items: copiedItems },
        },
        result.draggableId,
        App_Acronym,
        accessToken
      );

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
    }
  };

  if (fetchIsLoading || isLoading) return <LoadingSpinner />;

  return (
    <>
      {openTaskCreateModal && (
        <TaskCreateModal
          open={openTaskCreateModal}
          onClose={closeTaskCreateModalHandler}
          taskCreateModalHandler={taskCreateModalHandler}
          plans={plans}
        />
      )}

      {openPlanModal && (
        <PlanModal open={openPlanModal} onClose={closePlanModalHandler} />
      )}

      <CreatePlanTask
        openPlanModalHandler={openPlanModalHandler}
        openTaskCreateModalHandler={openTaskCreateModalHandler}
        appPermits={appPermits}
      />

      <PlanCard plans={plans} App_Acronym={App_Acronym} />

      <Grid container spacing={1} justifyContent="center">
        <Card className={classes.root} variant="outlined" key={App_Acronym}>
          <CardContent className={classes.tasksCardContent}>
            <Grid container spacing={1} justifyContent="center">
              <DragDropContext
                onDragEnd={(result) => onDragEndHandler(result, columns, setColumns)}
              >
                {Object.entries(columns)?.map(([columnId, column], index) => {
                  return (
                    <div key={columnId} className={classes.dragDropContext}>
                      <TaskCardColumn column={column} appPermits={appPermits} />
                      <div style={{ margin: 8 }}>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={classes.droppable}
                              style={{
                                background: snapshot.isDraggingOver
                                  ? 'lightblue'
                                  : 'lightgrey',
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
                                      className={classes.draggable}
                                      style={{
                                        border: `0.4rem solid ${item.plan?.Plan_color}`,
                                        backgroundColor: snapshot.isDragging
                                          ? '#263B4A'
                                          : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <Typography variant="h6" className={classes.text}>
                                        {item.Task_name}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        className={classes.text}
                                      >
                                        {item.Task_description}
                                      </Typography>

                                      <CardActions className={classes.cardActions}>
                                        <Button
                                          size="small"
                                          component={Link}
                                          to={`/app/${App_Acronym}/task/${item.Task_name}`}
                                        >
                                          <span className="material-icons">edit</span>
                                        </Button>
                                      </CardActions>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
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
