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

    case 'GET_ALL_PlAN_SUCCESS': {
      return { ...state, isLoading: false, plans: action.payload.plans };
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
      App_permit_Create,
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
          App_permit_Create,
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
      App_permit_Create,
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
          App_permit_Create,
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
    { Task_name, Task_description, Task_plan },
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
        body: JSON.stringify({ App_Acronym, Task_name, Task_description, Task_plan }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });
      clearAlert();
      // getTasksData(App_Acronym, accessToken);
      return 'success'; // To PlanTask page
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateTask = async (
    { Task_name, Task_description, Task_state, Task_plan, New_task_note },
    App_Acronym,
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/tasks/task`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          Task_name,
          Task_description,
          Task_state,
          Task_plan,
          New_task_note,
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

  const updateTaskState = async (
    App_Acronym,
    Task_name,
    Task_state_source,
    Task_state_destination,
    accessToken
  ) => {
    try {
      const response = await fetch('/api/tasks/taskstate', {
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

  const updateKanbanIndex = async (tasksList, Task_name, App_Acronym, accessToken) => {
    try {
      const response = await fetch('/api/tasks/kanbanindex', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tasksList, Task_name }),
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

  const getPlansData = useCallback(async (App_Acronym, accessToken) => {
    try {
      const response = await fetch(`/api/tasks/${App_Acronym}/plans`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_ALL_PlAN_SUCCESS', payload: data });
      clearAlert();
      return data.plans; // To PlanTask page
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createPlan = async (
    { Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_color },
    App_Acronym,
    accessToken
  ) => {
    try {
      const response = await fetch('/api/tasks/plan', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          Plan_MVP_name,
          Plan_startDate,
          Plan_endDate,
          Plan_color,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });
      clearAlert();
      // getTasksData(App_Acronym, accessToken);
      return 'success'; // To PlanTask page
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updatePlan = async (
    { Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_color },
    App_Acronym,
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/tasks/plan`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          Plan_MVP_name,
          Plan_startDate,
          Plan_endDate,
          Plan_color,
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

  return (
    <TaskContext.Provider
      value={{
        ...userState,
        getApplicationsData,
        createApplication,
        updateApplication,
        getTasksData,
        createTask,
        updateTask,
        updateTaskState,
        updateKanbanIndex,
        getPlansData,
        createPlan,
        updatePlan,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => useContext(TaskContext);
export { useTaskContext as default, TaskProvider };
