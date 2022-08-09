import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
} from '@material-ui/core';

import {
  CreatePlanTask,
  LoadingSpinner,
  PlanCard,
  PlanModal,
  TaskCardColumn,
  TaskCreateModal,
  TaskUpdateModal,
} from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

const useStyles = makeStyles({
  tasksCardContent: { display: 'flex', flexDirection: 'column' },
  dragDropContext: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  droppable: { padding: 4, width: 250, minHeight: 500 },
  draggable: { userSelect: 'none', padding: 16, margin: '0 0 8px 0', minHeight: '50px' },

  description: { overflowY: 'scroll', overflowX: 'hidden', height: 210, maxHeight: 210 },
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
    getPlansData,
    plans,
    createPlan,
    updatePlan,
  } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;
  const { taskMessage } = taskContext;

  const { App_Acronym } = useParams();
  const navigate = useNavigate();

  const [openTaskCreateModal, setOpenTaskCreateModal] = useState(false);
  const [openTaskUpdateModal, setOpenTaskUpdateModal] = useState(false);
  const [taskItemData, setTaskItemData] = useState();
  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [editPlanMode, setEditPlanMode] = useState({ edit: false });

  // fetchTasksOnRefresh on first load
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState();

  const openTaskCreateModalHandler = () => setOpenTaskCreateModal(true);
  const closeTaskCreateModalHandler = () => setOpenTaskCreateModal(false);

  const openTaskUpdateModalHandler = () => setOpenTaskUpdateModal(true);
  const closeTaskUpdateModalHandler = () => setOpenTaskUpdateModal(false);

  const openPlanModalHandler = () => setOpenPlanModal(true);
  const closePlanModalHandler = () => {
    setEditPlanMode({ edit: false });
    setOpenPlanModal(false);
  };

  const taskUpdateModalHandler = async (inputData) => {
    if (!inputData) return;
    updateTask(inputData, App_Acronym, accessToken);
    closeTaskCreateModalHandler();
  };

  const planModalHandler = async (inputData) => {
    if (!inputData) return;
    if (!editPlanMode.edit) {
      await createPlan(inputData, App_Acronym, accessToken);
      // const success = await createPlan(inputData, App_Acronym, accessToken);
      // if (success)
      //   setColumns({
      //     ...columns,
      //     open: { ...columns.open, items: [...columns.open.items, inputData] },
      //   });
    } else {
      updatePlan(inputData, App_Acronym, accessToken);
      closePlanModalHandler();
    }
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

  useEffect(() => {
    accessToken && getPlansData(App_Acronym, accessToken);
  }, [App_Acronym, accessToken, getPlansData]);

  const taskCreateModalHandler = async (inputData) => {
    if (!inputData) return;

    const success = await createTask(inputData, App_Acronym, accessToken);
    if (success)
      setColumns({
        ...columns,
        open: { ...columns.open, items: [...columns.open.items, inputData] },
      });
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
      {openTaskCreateModal && (
        <TaskCreateModal
          open={openTaskCreateModal}
          onClose={closeTaskCreateModalHandler}
          taskCreateModalHandler={taskCreateModalHandler}
          plans={plans}
        />
      )}

      {openTaskUpdateModal && (
        <TaskUpdateModal
          open={openTaskUpdateModal}
          onClose={closeTaskUpdateModalHandler}
          taskUpdateModalHandler={taskUpdateModalHandler}
          taskItemData={taskItemData}
          plans={plans}
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

      <CreatePlanTask
        openPlanModalHandler={openPlanModalHandler}
        openTaskCreateModalHandler={openTaskCreateModalHandler}
        appPermits={appPermits}
      />

      <PlanCard
        plans={plans}
        App_Acronym={App_Acronym}
        setEditPlanMode={setEditPlanMode}
        openPlanModalHandler={openPlanModalHandler}
      />

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
                                      {item.Task_name}
                                      <br />
                                      {item.Task_description}

                                      <CardActions className={classes.cardActions}>
                                        <Button
                                          size="small"
                                          onClick={() => {
                                            setTaskItemData(item);
                                            openTaskUpdateModalHandler();
                                          }}
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
