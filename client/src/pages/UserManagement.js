import { createTheme, ThemeProvider } from '@mui/material';
import MaterialTable from 'material-table';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';

import useUserContext from '../context/userContext';
import InputModal from '../components/InputModal';

const UserManagement = () => {
  const theme = createTheme({ palette: { mode: 'dark' } });
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

  const [selectedRow, setSelectedRow] = useState(null);

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
      align: 'center',
      width: null,
      cellStyle: { width: 220 },
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
    {
      title: 'Name',
      field: 'name',
      align: 'center',
      width: null,
      cellStyle: { width: 220 },
    },
    {
      title: 'Email',
      field: 'email',
      initialEditValue: '@company.com',
      align: 'center',
      width: null,
      cellStyle: { width: 250 },
    },
    {
      title: 'User Group',
      field: 'userGroup',
      align: 'center',
    },
    {
      title: 'Active Account',
      field: 'isActiveAcc',
      lookup: { true: 'true', false: 'false' },
      initialEditValue: true,
      align: 'center',
      width: null,
      cellStyle: { width: 10 },
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        title="User Management"
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
          {
            icon: 'group_add',
            tooltip: 'Add Group',
            isFreeAction: true,
            onClick: (e) => <InputModal />,
          },
        ]}
        onRowClick={(event, selectedRow) => setSelectedRow(selectedRow.tableData.id)}
        options={{
          search: false,
          filtering: false,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50],
          emptyRowsWhenPaging: false,
          addRowPosition: 'first',
          actionsColumnIndex: -1,
          rowStyle: (rowData) => ({
            backgroundColor: selectedRow === rowData.tableData.id ? '#1976d2' : '#303030',
          }),
        }}
      />
    </ThemeProvider>
  );
};

export default UserManagement;
