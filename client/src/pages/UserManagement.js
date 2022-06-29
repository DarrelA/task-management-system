import { useEffect, useState } from 'react';
import useUserContext from '../context/userContext';

const UserManagement = () => {
  const userContext = useUserContext();
  const { accessToken, isLoading, message, getAllUsers, users } = userContext;

  useEffect(() => {
    if (accessToken) getAllUsers(accessToken);
  }, [accessToken]);

  const listAllUsers = users?.map((user) => (
    <div key={user.id}>
      {user.name} {user.email} {user.userGroup} {user.isAdmin.toString()}
      {user.isActiveAcc.toString()}
    </div>
  ));

  if (isLoading) return <p>Loading...</p>;

  return <div className={`container center`}>{listAllUsers}</div>;
};

export default UserManagement;
