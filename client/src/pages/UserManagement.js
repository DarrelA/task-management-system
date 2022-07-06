import MaterialTable from 'material-table';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';

import InputModal from '../components/InputModal';
import useUserContext from '../context/userContext';

const UserManagement = () => {
  const userContext = useUserContext();
  const {
    accessToken,
    isLoading,
    message,
    getUsersData,
    users,
    createUser,
    updateUser,
    resetUserPassword,
    createGroup,
    addRemoveUserGroup,
  } = userContext;

  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (message === 'success') toast.success(message, { autoClose: 200 });
    else if (!!message) toast.error(message);
  }, [message]);

  useEffect(() => {
    accessToken && getUsersData(accessToken);
  }, [accessToken, getUsersData]);

  const toggleModalHandler = () => setOpenModal((prevState) => !prevState);
  const newGroupHandler = (inputData) =>
    createGroup({ userGroup: inputData }, accessToken);

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
      editable: 'onUpdate',
    },
    {
      title: 'Active Account',
      field: 'isActiveAcc',
      lookup: { true: 'true', false: 'false' },
      initialEditValue: true,
      editable: 'onUpdate',
      align: 'center',
      width: null,
      cellStyle: { width: 10 },
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {openModal && (
        <InputModal
          open={openModal}
          onClose={toggleModalHandler}
          newGroupHandler={newGroupHandler}
        />
      )}
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
            onClick: toggleModalHandler,
          },
          {
            icon: 'storm',
            tooltip: 'temp button',
            isFreeAction: true,
            onClick: () =>
              addRemoveUserGroup(
                { id: '00d189e4-5e4e-4c64-b9bc-9410bde4f256', userGroup: 'kiwi' },
                accessToken
              ),
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
    </>
  );
};

export default UserManagement;
