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
      const { accessToken } = action.payload;
      return { ...state, accessToken };
    }

    case 'SIGNUP_USER_SUCCESS': {
      const { id, name, accessToken } = action.payload;
      return { ...state, isLoading: false, id, name, accessToken };
    }

    case 'SIGNUP_USER_FAIL': {
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
      const { accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'REFRESH_TOKEN_SUCCESS', payload: { accessToken } });
    } catch (e) {}
  }, []);

  const signup = async ({ name, email, password }) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/users/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      const { id, accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'SIGNUP_USER_SUCCESS',
        payload: { id, name, accessToken },
      });

      addUserDataToLocalStorage(id, '', name, accessToken);
      clearAlert();
    } catch (e) {
      dispatch({ type: 'SIGNUP_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        checkRefreshToken,
        signup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
