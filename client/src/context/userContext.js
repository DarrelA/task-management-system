import React, { useCallback, useContext, useReducer } from 'react';

const UserContext = React.createContext();
const { id, name } = JSON.parse(localStorage.getItem('userData')) || {};

const initialState = {
  isLoading: false,
  id: id || '',
  name: name || '',
  isAdmin: false,
  message: '',
  accessToken: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_MESSAGE': {
      return { ...state, message: '' };
    }

    case 'IS_LOADING': {
      return { ...state, isLoading: true };
    }

    case 'REFRESH_TOKEN_SUCCESS': {
      const { accessToken, isAdmin } = action.payload;
      return { ...state, accessToken, isAdmin };
    }

    case 'LOGIN_USER_SUCCESS': {
      const { id, name, isAdmin, accessToken } = action.payload;
      return { ...state, isLoading: false, id, name, isAdmin, accessToken };
    }

    case 'LOGIN_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'GET_ALL_USER_SUCCESS': {
      return { ...state, isLoading: false, users: action.payload };
    }

    case 'GET_ALL_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'CREATE_USER_SUCCESS': {
      return { ...state, isLoading: false, message: action.payload };
    }

    case 'CREATE_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'UPDATE_USER_SUCCESS': {
      const { name, userGroup, isAdmin, isActiveAcc, message } = action.payload;
      return {
        ...state,
        isLoading: false,
        name,
        userGroup,
        isAdmin,
        isActiveAcc,
        message,
      };
    }

    case 'UPDATE_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    default:
      return initialState;
  }
};

const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const clearAlert = () => setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }, 500));

  const addUserDataToLocalStorage = async (id, name) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const updatedUserData = {
      id: id || userData.id,
      name: name || userData.name,
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const checkRefreshToken = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/refresh_token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      const { accessToken, isAdmin } = data;

      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'REFRESH_TOKEN_SUCCESS', payload: { accessToken, isAdmin } });
    } catch (e) {}
  }, []);

  const login = async ({ email, password }) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const { id, name, isAdmin, accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { id, name, isAdmin, accessToken },
      });

      addUserDataToLocalStorage(id, name);
      clearAlert();
    } catch (e) {
      dispatch({ type: 'LOGIN_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  const getAllUsers = useCallback(async (accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_ALL_USER_SUCCESS', payload: data });

      clearAlert();
    } catch (e) {
      dispatch({ type: 'GET_ALL_USER_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createUser = async ({ name, email, userGroup, isActiveAcc }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/createuser`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, userGroup, isActiveAcc }),
      });

      const data = await response.json();
      const { message } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'CREATE_USER_SUCCESS',
        payload: message,
      });

      clearAlert();
    } catch (e) {
      dispatch({ type: 'CREATE_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateUser = async ({ id, name, email, userGroup, isActiveAcc }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/updateuser`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id, name, email, userGroup, isActiveAcc }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: data });

      clearAlert();
    } catch (e) {
      dispatch({ type: 'UPDATE_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        checkRefreshToken,
        login,
        createUser,
        getAllUsers,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
