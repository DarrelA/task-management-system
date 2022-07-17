import React, { useCallback, useContext, useReducer } from 'react';

const UserContext = React.createContext();
const { username, email } = JSON.parse(localStorage.getItem('userData')) || {};

const initialState = {
  isLoading: false,
  username: username || '',
  email: email || '',
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
      const { username, email, isAdmin, accessToken, message } = action.payload;
      return {
        ...state,
        isLoading: false,
        username,
        email,
        isAdmin,
        accessToken,
        message,
      };
    }

    case 'LOGIN_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'LOGOUT_USER': {
      return {
        isLoading: false,
        username: '',
        email: '',
        isAdmin: false,
        accessToken: '',
        message: '',
      };
    }

    case 'GET_ALL_USER_SUCCESS': {
      const { users, username, email } = action.payload;
      return { ...state, isLoading: false, users, username, email };
    }

    case 'GET_ALL_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'UPDATE_PROFILE_SUCCESS': {
      const { email, message } = action.payload;
      return { ...state, isLoading: false, email, message };
    }

    case 'UPDATE_PROFILE_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'RESPONSE_SUCCESS': {
      return { ...state, isLoading: false, message: action.payload.message };
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

  const addUserDataToLocalStorage = async (username, email) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const updatedUserData = {
      username: username || userData.username,
      email: email || userData.email,
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

      // Refer to backend log
      // if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'REFRESH_TOKEN_SUCCESS', payload: { accessToken, isAdmin } });
    } catch (e) {}
  }, []);

  const login = async ({ username, password }) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      const { email, isAdmin, accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { username, email, isAdmin, accessToken },
      });

      addUserDataToLocalStorage(username, email);
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

  const getUsersData = useCallback(async (accessToken) => {
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
      dispatch({ type: 'GET_ALL_USER_SUCCESS', payload: data });
      addUserDataToLocalStorage(data.username, data.email);

      clearAlert();
    } catch (e) {
      dispatch({ type: 'GET_ALL_USER_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createUser = async ({ username, email, isActiveAcc }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username, email, isActiveAcc }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'RESPONSE_SUCCESS',
        payload: data,
      });

      clearAlert();
      getUsersData(accessToken);
      return 'success';
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateUser = async (
    { username, password, confirmPassword, email, inGroups, notInGroups, isActiveAcc },
    accessToken
  ) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/user`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          email,
          inGroups,
          notInGroups,
          isActiveAcc,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'RESPONSE_SUCCESS', payload: data });

      clearAlert();
      getUsersData(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const createGroup = async ({ userGroup }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/creategroup`, {
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
      getUsersData(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateProfile = async ({ email, password, confirmPassword }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/users/updateprofile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: data });
      addUserDataToLocalStorage(data.username, data.email);
      clearAlert();
    } catch (e) {
      dispatch({ type: 'UPDATE_PROFILE_FAIL', payload: e });
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
        getUsersData,
        updateUser,
        createGroup,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
