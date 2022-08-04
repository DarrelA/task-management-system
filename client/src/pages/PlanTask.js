import { Button, Grid, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner, TaskModal } from '../components';
import useTaskContext from '../context/taskContext';
import useUserContext from '../context/userContext';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const useStyles = makeStyles({
  root: {
    minWidth: 240,
    maxWidth: 240,
    minHeight: 200,
    maxHeight: 200,
    margin: (0, 10),
  },

  title: {
    fontSize: 22,
    textAlign: 'center',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: 5,
    '&:last-child': {
      paddingBottom: 0,
    },
  },

  description: {
    height: 90,
    maxHeight: 90,
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: (0, 5),
  },
});

const PlanTask = () => {
  const classes = useStyles();

  const taskContext = useTaskContext();
  const { getTasksData, tasks, createTask, updateTask } = taskContext;
  const userContext = useUserContext();
  const { accessToken, message } = userContext;
  const { isLoading, taskMessage } = taskContext;

  const { App_Acronym } = useParams();
  const navigate = useNavigate();

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editTaskMode, setEditTaskMode] = useState({ edit: false });
  const [columns, setColumns] = useState(tasks);

  const openTaskModalHandler = () => setOpenTaskModal(true);
  const closeTaskModalHandler = () => {
    setEditTaskMode({ edit: false });
    setOpenTaskModal(false);
  };

  useEffect(() => {
    if (taskMessage === 'success') toast.success(taskMessage, { autoClose: 200 });
    else if (taskMessage === 'Application is unavailable.') return navigate('/apps');
    else if (!!taskMessage) toast.error(taskMessage);

    if (!!message) toast.error(message);
  }, [navigate, taskMessage, message]);

  useEffect(() => {
    accessToken && getTasksData(App_Acronym, accessToken);
  }, [App_Acronym, accessToken, getTasksData]);

  const taskModalHandler = (inputData) => {
    if (!inputData) return;
    if (!editTaskMode.edit) {
      createTask(inputData, App_Acronym, accessToken);
      setColumns({
        ...columns,
        open: { ...columns.open, items: [...columns.open.items, inputData] },
      });
    } else {
      updateTask(inputData, App_Acronym, accessToken);
      closeTaskModalHandler();
    }
  };

  const onDragEndHandler = (result, columns, setColumns) => {
    console.log(result);
    if (!result.destination) return;

    if (
      result.source.droppableId === 'open' &&
      result.destination.droppableId !== 'todolist'
    )
      return;

    if (
      result.source.droppableId === 'todolist' &&
      result.destination.droppableId !== 'doing'
    )
      return;

    if (result.source.droppableId === 'doing')
      if (
        result.destination.droppableId !== 'todolist' &&
        result.destination.droppableId !== 'done'
      )
        return;

    if (result.source.droppableId === 'done')
      if (
        result.destination.droppableId !== 'doing' &&
        result.destination.droppableId !== 'close'
      )
        return;

    if (result.source.droppableId === 'close') return;

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
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({ ...columns, [source.droppableId]: { ...column, items: copiedItems } });
    }
  };

  if (isLoading || tasks === undefined) return <LoadingSpinner />;

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

      <Grid container spacing={1} justifyContent="center">
        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ margin: '16px 0' }}
          onClick={openTaskModalHandler}
        >
          Create Task
        </Button>
      </Grid>

      <Grid container spacing={1} justifyContent="center">
        <DragDropContext
          onDragEnd={(result) => onDragEndHandler(result, columns, setColumns)}
        >
          {Object.entries(columns)?.map(([columnId, column], index) => {
            return (
              <div
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                key={columnId}
              >
                <h2>{column.name}</h2>
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
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.Task_name}
                                draggableId={item.Task_name}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
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
                                      {item.Task_name}
                                      <br />
                                      {item.Task_description}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
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
    </>
  );
};

export default PlanTask;
