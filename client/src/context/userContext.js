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

    case 'LOGOUT_USER': {
      return {
        isLoading: false,
        id: '',
        name: '',
        isAdmin: false,
        accessToken: '',
        message: action.payload.message,
      };
    }

    case 'RESPONSE_SUCCESS': {
      return { ...state, isLoading: false, users: action.payload };
    }

    case 'RESPONSE_FAIL': {
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

  const logout = async () => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'LOGOUT_USER', payload: data });
      localStorage.removeItem('userData');
      clearAlert();
    } catch (e) {
      clearAlert();
    }
  };

  const getAllUsers = useCallback(async (accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createUser = async ({ name, email, userGroup, isActiveAcc }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/createuser`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, userGroup, isActiveAcc }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'RESPONSE_SUCCESS',
        payload: data,
      });

      clearAlert();
      getAllUsers(accessToken);
      return 'success';
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const resetUserPassword = async (id, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/resetuserpassword`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getAllUsers(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateUser = async ({ id, name, email, userGroup, isActiveAcc }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/updateuser`, {
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

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getAllUsers(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const createGroup = async ({ userGroup }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/updateuser`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userGroup }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getAllUsers(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const addUserToGroup = async ({ id, userGroup }, accessToken) => {};

  const updateProfile = async (
    { name, email, password, confirmPassword },
    id,
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/users/updateprofile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, password, confirmPassword, id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getAllUsers(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        checkRefreshToken,
        login,
        logout,
        createUser,
        getAllUsers,
        resetUserPassword,
        updateUser,
        createGroup,
        addUserToGroup,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
