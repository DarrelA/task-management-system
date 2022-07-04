import { useEffect } from 'react';
import MaterialTable from 'material-table';
import { ThemeProvider, createTheme } from '@mui/material';
import { toast } from 'react-toastify';

import useUserContext from '../context/userContext';

const UserManagement = () => {
  const defaultMaterialTheme = createTheme();
  const userContext = useUserContext();
  const {
    accessToken,
    isLoading,
    message,
    getAllUsers,
    users,
    createUser,
    updateUser,
    resetUserPassword,
  } = userContext;

  useEffect(() => {
    if (message === 'success') toast.success(message, { autoClose: 200 });
    else if (!!message) toast.error(message);
  }, [message]);

  useEffect(() => {
    accessToken && getAllUsers(accessToken);
  }, [accessToken, getAllUsers]);

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
      <MaterialTable
        title="Update Users"
        columns={columns}
        data={users}
        editable={{
          onRowAdd: (newRow) => createUser(newRow, accessToken),
          onRowUpdate: (newRow, oldRow) => updateUser(newRow, accessToken),
        }}
        actions={[
          {
            icon: 'restart_alt',
            tooltip: 'Reset Password',
            onClick: (event, rowData) => {
              // @TODO: Create modal to display confirmation box before reset
              const confirmation = window.confirm(`Reset ${rowData.email}'s password?`);
              if (confirmation) resetUserPassword(rowData.id, accessToken);
            },
          },
        ]}
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
      )
    </ThemeProvider>
  );
};

export default UserManagement;
