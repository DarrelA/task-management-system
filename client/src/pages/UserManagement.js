import { useEffect, useMemo, useState } from 'react';
import MaterialTable from 'material-table';
import { ThemeProvider, createTheme } from '@mui/material';
import { toast } from 'react-toastify';

import useUserContext from '../context/userContext';

const UserManagement = () => {
  const defaultMaterialTheme = createTheme();
  const userContext = useUserContext();
  const { accessToken, isLoading, message, getAllUsers, users, createUser, updateUser } =
    userContext;
  const [usersList, setUsersList] = useState(null);

  useEffect(() => {
    if (message === 'success') toast.success(message, { autoClose: 300 });
    else if (!!message) toast.error(message);
    accessToken && getAllUsers(accessToken);
  }, [message, accessToken, getAllUsers]);

  useMemo(() => {
    users && setUsersList(users);
  }, [users]);

  const columns = [
    {
      title: 'Created At',
      field: 'createdAt',
      defaultSort: 'desc',
      filtering: false,
      editable: 'never',
      render: (rowData) => {
        const options = {
          weekday: 'short',
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        };
        return new Date(rowData.createdAt).toLocaleString('en-US', options);
      },
    },
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email', initialEditValue: '@company.com' },
    { title: 'User Group', field: 'userGroup' },
    {
      title: 'Active Account',
      field: 'isActiveAcc',
      lookup: { true: 'true', false: 'false' },
      initialEditValue: true,
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      {usersList && (
        <MaterialTable
          title="Update Users"
          columns={columns}
          data={usersList}
          editable={{
            onRowAdd: (newRow) =>
              new Promise((resolve, reject) => {
                createUser(newRow, accessToken);
                resolve();
              }),
            onRowUpdate: (newRow, oldRow) =>
              new Promise((resolve, reject) => {
                console.log(newRow);
                updateUser(newRow, accessToken);
                resolve();
              }),
          }}
          options={{
            search: false,
            filtering: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50],
            emptyRowsWhenPaging: false,
            addRowPosition: 'first',
            actionsColumnIndex: -1,
          }}
        />
      )}
    </ThemeProvider>
  );
};

export default UserManagement;
