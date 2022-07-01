import { useEffect, useMemo, useState } from 'react';
import useUserContext from '../context/userContext';
import { useGlobalFilter, useSortBy, useTable } from 'react-table';

const UserManagement = () => {
  const userContext = useUserContext();
  const { accessToken, isLoading, message, getAllUsers, users } = userContext;

  const [usersList, setUsersList] = useState(null);
  const [addFormData, setAddFormData] = useState({ name: '', email: '', usergroup: '' });

  useEffect(() => {
    accessToken && getAllUsers(accessToken);
  }, [accessToken, getAllUsers]);

  useMemo(() => {
    users && setUsersList(users);
  }, [users]);

  const columns = useMemo(
    () => [
      { Header: '#', id: 'index', accessor: (_row, i) => i + 1 },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'User Group', accessor: 'userGroup' },
      { Header: 'Admin', accessor: (data) => data.isAdmin.toString() },
      { Header: 'Active', accessor: (data) => data.isActiveAcc.toString() },
      {
        Header: 'Edit',
        accessor: 'id',
        Cell: ({ value }) => (
          <div>
            <button onClick={() => editHandler(value)}>Edit</button>
          </div>
        ),
      },
    ],
    []
  );

  function editHandler(row) {
    console.log(row);
  }

  const Table = () => {
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
      { columns, data: usersList }
    );

    // Render the UI for your table
    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    console.log('@TODO: Take logic from SignupLogin.js');
  };

  const inputHandler = (e) =>
    setAddFormData({ ...addFormData, [e.target.id]: e.target.value.trim() });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          onChange={inputHandler}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          onChange={inputHandler}
        />
        <input
          type="text"
          name="usergroup"
          placeholder="User Group"
          onChange={inputHandler}
        />
        <button type="submit">Create Account</button>
      </form>
      {usersList && <Table />}
    </>
  );
};

export default UserManagement;
