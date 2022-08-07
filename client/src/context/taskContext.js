import React, { useCallback, useContext, useReducer } from 'react';

const TaskContext = React.createContext();
const { appPermits } = JSON.parse(localStorage.getItem('appPermitData')) || {};

const initialState = {
  tasks: {},
  appPermits: appPermits || {},
  isLoading: false,
  taskMessage: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_MESSAGE': {
      return { ...state, taskMessage: '' };
    }

    case 'IS_LOADING': {
      return { ...state, isLoading: true };
    }

    case 'GET_ALL_APPLICATION_SUCCESS': {
      const { applications, groups, isProjectLead } = action.payload;
      return { ...state, isLoading: false, applications, groups, isProjectLead };
    }

    case 'GET_ALL_TASK_SUCCESS': {
      return { ...state, isLoading: false, appPermits: action.payload.appPermits };
    }

    case 'RESPONSE_SUCCESS': {
      return { ...state, isLoading: false, taskMessage: action.payload.message };
    }

    case 'RESPONSE_FAIL': {
      return { ...state, isLoading: false, taskMessage: action.payload.message };
    }

    default:
      return initialState;
  }
};

const TaskProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const clearAlert = () => setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }, 500));

  const addAppPermitsDataToLocalStorage = async (appPermits) => {
    const appPermitsData = JSON.parse(localStorage.getItem('appPermits')) || {};
    const updatedAppPermitsData = { appPermits: appPermits || appPermitsData.appPermits };
    localStorage.setItem('appPermitsData', JSON.stringify(updatedAppPermitsData));
  };

  const getApplicationsData = useCallback(async (accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/tasks/applications/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_ALL_APPLICATION_SUCCESS', payload: data });

      clearAlert();
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createApplication = async (
    {
      App_Acronym,
      App_Rnumber,
      App_Description,
      App_startDate,
      App_endDate,
      App_permit_Open,
      App_permit_toDoList,
      App_permit_Doing,
      App_permit_Done,
    },
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/tasks/application`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          App_Rnumber,
          App_Description,
          App_startDate,
          App_endDate,
          App_permit_Open,
          App_permit_toDoList,
          App_permit_Doing,
          App_permit_Done,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getApplicationsData(accessToken);
      return 'success';
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateApplication = async (
    {
      App_Acronym,
      App_Description,
      App_startDate,
      App_endDate,
      App_permit_Open,
      App_permit_toDoList,
      App_permit_Doing,
      App_permit_Done,
    },
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/tasks/application`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          App_Description,
          App_startDate,
          App_endDate,
          App_permit_Open,
          App_permit_toDoList,
          App_permit_Doing,
          App_permit_Done,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getApplicationsData(accessToken);
      return 'success';
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const getTasksData = useCallback(async (App_Acronym, accessToken) => {
    try {
      const response = await fetch(`/api/tasks/${App_Acronym}/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      addAppPermitsDataToLocalStorage(data.appPermits);
      dispatch({ type: 'GET_ALL_TASK_SUCCESS', payload: data });
      clearAlert();
      return data.tasks; // To PlanTask page
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createTask = async (
    { Task_name, Task_description },
    App_Acronym,
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch('/api/tasks/task', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ App_Acronym, Task_name, Task_description }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });
      clearAlert();
      getTasksData(App_Acronym, accessToken);
      return 'success'; // To PlanTask page
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateTaskState = async (
    App_Acronym,
    Task_name,
    Task_state_source,
    Task_state_destination,
    accessToken
  ) => {
    try {
      const response = await fetch('/api/tasks/task', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          Task_name,
          Task_state_source,
          Task_state_destination,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateKanbanIndex = async (tasksList, App_Acronym, accessToken) => {
    try {
      const response = await fetch('/api/tasks/kanbanindex', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tasksList }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getTasksData(App_Acronym, accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  return (
    <TaskContext.Provider
      value={{
        ...userState,
        getApplicationsData,
        createApplication,
        updateApplication,
        getTasksData,
        createTask,
        updateTaskState,
        updateKanbanIndex,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => useContext(TaskContext);
export { useTaskContext as default, TaskProvider };
