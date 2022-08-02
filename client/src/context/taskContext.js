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
      const { applications, groups } = action.payload;
      return { ...state, isLoading: false, applications, groups };
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

  const createApplication = useCallback(
    async (
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
        const response = await fetch(`/api/tasks/createapplication`, {
          method: 'POST',
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
    },
    [getApplicationsData]
  );

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

  return (
    <TaskContext.Provider
      value={{
        ...userState,
        getApplicationsData,
        createApplication,
        updateApplication,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => useContext(TaskContext);
export { useTaskContext as default, TaskProvider };
