import React, { useCallback, useContext, useReducer } from 'react';

const UserContext = React.createContext();
const { name, email } = JSON.parse(localStorage.getItem('userData')) || {};

const initialState = {
  isLoading: false,
  name: name || '',
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
      const { name, email, isAdmin, accessToken, message } = action.payload;
      return { ...state, isLoading: false, name, email, isAdmin, accessToken, message };
    }

    case 'LOGIN_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'LOGOUT_USER': {
      return {
        isLoading: false,
        name: '',
        email: '',
        isAdmin: false,
        accessToken: '',
        message: '',
      };
    }

    case 'GET_ALL_USER_SUCCESS': {
      const { users, name, email } = action.payload;
      return { ...state, isLoading: false, users, name, email };
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

  const addUserDataToLocalStorage = async (name, email) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const updatedUserData = {
      name: name || userData.name,
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
      const { name, isAdmin, accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { name, email, isAdmin, accessToken },
      });

      addUserDataToLocalStorage(name, email);
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
      addUserDataToLocalStorage(data.name, data.email);

      clearAlert();
    } catch (e) {
      dispatch({ type: 'GET_ALL_USER_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const createUser = async ({ name, email, isActiveAcc }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/um/user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, isActiveAcc }),
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
      getUsersData(accessToken);
    } catch (e) {
      dispatch({ type: 'RESPONSE_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateUser = async (
    { id, name, email, inGroups, notInGroups, isActiveAcc },
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
        body: JSON.stringify({ id, name, email, inGroups, notInGroups, isActiveAcc }),
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
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: { ...data, email } });
      addUserDataToLocalStorage(name, email);
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
        resetUserPassword,
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
