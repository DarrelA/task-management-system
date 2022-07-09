import MaterialTable from 'material-table';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';

import InputModal from '../components/InputModal';
import useUserContext from '../context/userContext';
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';

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
      title: 'Updated At',
      field: 'updatedAt',
      defaultSort: 'desc',
      filtering: false,
      editable: 'never',
      align: 'center',
      width: null,
      cellStyle: { width: 151 },
      render: (rowData) => {
        const options = {
          weekday: 'short',
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        };
        return new Date(rowData.updatedAt).toLocaleString('en-US', options);
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
      removable: false,
    },
    {
      title: 'In User Group',
      field: 'inGroups',
      align: 'center',
      editable: 'never',
      disableClick: true,
      render: (rowData) => {
        return (
          <Grid container justifyContent="center" alignItems="center">
            {rowData.inGroups.map((group, i) => (
              <FormControlLabel
                key={rowData.id + i}
                control={
                  <Checkbox
                    size="small"
                    color="default"
                    checked={!!group}
                    onClick={() =>
                      addRemoveUserGroup(
                        { id: rowData.id, userGroup: group },
                        accessToken
                      )
                    }
                  />
                }
                label={group}
              />
            ))}
          </Grid>
        );
      },
    },
    {
      title: 'Not In User Group',
      field: 'notInGroups',
      align: 'center',
      editable: 'never',
      disableClick: true,
      hidde: true,
      hiddenByColumnsButton: true,
      render: (rowData) => (
        <Grid container justifyContent="center" alignItems="center">
          {rowData.notInGroups.map((group, i) => (
            <FormControlLabel
              key={rowData.id + i}
              control={
                <Checkbox
                  size="small"
                  color="default"
                  onClick={() =>
                    addRemoveUserGroup({ id: rowData.id, userGroup: group }, accessToken)
                  }
                />
              }
              label={group}
            />
          ))}
        </Grid>
      ),
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
        ]}
        onRowClick={(event, selectedRow) => setSelectedRow(selectedRow.tableData.id)}
        options={{
          search: true,
          filtering: false,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50],
          emptyRowsWhenPaging: false,
          addRowPosition: 'first',
          actionsColumnIndex: -1,
          columnsButton: true,
          rowStyle: (rowData) => ({
            backgroundColor: selectedRow === rowData.tableData.id ? '#1976d2' : '#303030',
          }),
        }}
      />
    </>
  );
};

export default UserManagement;
