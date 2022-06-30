import { useEffect, useState } from 'react';
import useUserContext from '../context/userContext';

const UserManagement = () => {
  const userContext = useUserContext();
  const { accessToken, isLoading, message, getAllUsers, users } = userContext;

  const [usersList, setUsersList] = useState(null);
  const [indexToEdit, setIndexToEdit] = useState(-1);

  useEffect(() => {
    if (accessToken) getAllUsers(accessToken);
    if (users) setUsersList(users);
  }, [accessToken, getAllUsers, JSON.stringify(users)]);

  const inputHandler = (e) =>
    setUsersList({ ...usersList, [e.target.id]: e.target.value.trim() });

  const listAllUsers = usersList?.map((user, i) => {
    return (
      <tr key={user.id}>
        <td>{i + 1}</td>
        <td>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            disabled={i !== indexToEdit}
            onChange={(e) => {
              let editedUsers = [...users];
              console.log(editedUsers[indexToEdit].target);
              editedUsers[indexToEdit].target.value = e.currentTarget;
              setUsersList(editedUsers);
            }}
            onBlur={() => setIndexToEdit(-1)}
          />
        </td>
        <td>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            disabled={i !== indexToEdit}
            onChange={(val) => {
              let editedUsers = [...users];
              editedUsers[indexToEdit] = val;
              setUsersList(editedUsers);
            }}
            onBlur={() => setIndexToEdit(-1)}
          />
        </td>
        <td>
          <select
            id="usergroup"
            name="usergroup"
            value={user.userGroup}
            disabled={i !== indexToEdit}
            onChange={(val) => {
              let editedUsers = [...users];
              editedUsers[indexToEdit] = val;
              setUsersList(editedUsers);
            }}
            onBlur={() => setIndexToEdit(-1)}
          >
            <option value="Project Lead">Project Lead</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Member">Team Member</option>
            <option value="None">None</option>
          </select>
        </td>
        <td>
          <select
            id="isadmin"
            name="isadmin"
            value={user.isAdmin}
            disabled={i !== indexToEdit}
            onChange={(val) => {
              let editedUsers = [...users];
              editedUsers[indexToEdit] = val;
              setUsersList(editedUsers);
            }}
            onBlur={() => setIndexToEdit(-1)}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </td>
        <td>
          <select
            id="isactiveacc"
            name="isactiveacc"
            value={user.isActiveAcc}
            disabled={i !== indexToEdit}
            onChange={(val) => {
              let editedUsers = [...users];
              editedUsers[indexToEdit] = val;
              setUsersList(editedUsers);
            }}
            onBlur={() => setIndexToEdit(-1)}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </td>
        <td>
          <button onClick={() => setIndexToEdit(i)}>Edit</button>
        </td>
      </tr>
    );
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container center">
      <table>
        <thead>
          <tr>
            <th>{'No'}</th>
            <th>{'Name'}</th>
            <th>{'Email'}</th>
            <th>{'User Group'}</th>
            <th>{'Admin'}</th>
            <th>{'Active'}</th>
          </tr>
        </thead>
        <tbody>{listAllUsers}</tbody>
      </table>
    </div>
  );
};

export default UserManagement;
