import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  columnHeaderRed: { color: '#f44336' },
  columnHeaderGreen: { color: '#8bc34a' },
});

const TaskCardColumn = (props) => {
  const { column, appPermits } = props;
  const classes = useStyles();

  return (
    <>
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
    </>
  );
};

export default TaskCardColumn;
