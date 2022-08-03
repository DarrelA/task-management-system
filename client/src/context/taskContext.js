import React, { useCallback, useContext, useReducer } from 'react';

const TaskContext = React.createContext();

const initialState = {
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
      const { applications, max_App_Rnumber, groups } = action.payload;
      return { ...state, isLoading: false, applications, max_App_Rnumber, groups };
    }

    case 'GET_ALL_APPLICATION_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
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

  const getApplicationsData = useCallback(async (accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/tasks/all`, {
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
      dispatch({ type: 'GET_ALL_APPLICATION_FAIL', payload: e });
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
      const response = await fetch(`/api/tasks/createapplication`, {
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

      dispatch({
        type: 'RESPONSE_SUCCESS',
        payload: data,
      });

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
      const response = await fetch(`/api/tasks/updateapplication`, {
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

      dispatch({
        type: 'RESPONSE_SUCCESS',
        payload: data,
      });

      clearAlert();
      getApplicationsData(accessToken);
      return 'success';
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const createTask = async (
    { Task_name, Task_description },
    App_Acronym,
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch('/api/tasks/createtask', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          App_Acronym,
          Task_name,
          Task_description,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'RESPONSE_SUCCESS',
        payload: data,
      });

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
        createTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => useContext(TaskContext);
export { useTaskContext as default, TaskProvider };
