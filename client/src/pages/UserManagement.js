import MaterialTable from '@material-table/core';
import { toast } from 'react-toastify';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Chip, Grid } from '@material-ui/core';
import { InputModal, LoadingSpinner } from '../components/';
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
  } = userContext;

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (message === 'success') toast.success(message, { autoClose: 200 });
    else if (!!message) toast.error(message);
  }, [message]);

  useEffect(() => {
    accessToken && getUsersData(accessToken);
  }, [accessToken, getUsersData]);

  const toggleModalHandler = () => setOpenModal((prevState) => !prevState);
  const newGroupHandler = (inputData) => {
    if (!inputData) return;
    createGroup({ userGroup: inputData }, accessToken);
  };

  const renderUpdatedAt = useCallback((rowData) => {
    const options = {
      weekday: 'short',
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return new Date(rowData.updatedAt).toLocaleString('en-US', options);
  }, []);

  const EditComponentUserGroups = ({ rowData }) => {
    const [inGroups, setInGroups] = useState([...rowData.inGroups]);
    const [notInGroups, setNotInGroups] = useState([...rowData.notInGroups]);

    return (
      <>
        <Grid container spacing={1} justifyContent="center">
          {inGroups.map((group, i) => (
            <Grid item key={rowData.username + i}>
              <Chip
                label={group}
                size="medium"
                variant="default"
                color="default"
                clickable
                onClick={() => {
                  setInGroups(inGroups.filter((grp) => grp !== group));
                  setNotInGroups([group, ...notInGroups].sort());
                  rowData.inGroups = rowData.inGroups.filter((grp) => grp !== group);
                  rowData.notInGroups = [group, ...notInGroups];
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1} justifyContent="center">
          {notInGroups.map((group, i) => (
            <Grid item key={rowData.username + i}>
              <Chip
                label={group}
                size="small"
                variant="default"
                color="secondary"
                clickable
                onClick={() => {
                  setNotInGroups(notInGroups.filter((grp) => grp !== group));
                  setInGroups([group, ...inGroups]);
                  rowData.notInGroups = rowData.notInGroups.filter(
                    (grp) => grp !== group
                  );
                  rowData.inGroups = [group, ...inGroups];
                }}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  const renderUserGroups = useCallback(
    (rowData) => (
      <Grid container spacing={1} justifyContent="center">
        {rowData.inGroups.map((group, i) => (
          <Grid item key={rowData.username + i}>
            <Chip label={group} size="small" variant="default" />
          </Grid>
        ))}
      </Grid>
    ),
    []
  );

  const columns = useMemo(
    () => [
      {
        title: 'Updated At',
        field: 'updatedAt',
        defaultSort: 'desc',
        filtering: false,
        editable: 'never',
        align: 'center',
        width: 150,
        render: renderUpdatedAt,
      },
      {
        title: 'Username',
        field: 'username',
        editable: 'never',
        align: 'center',
        width: 220,
      },
      {
        title: 'Email',
        field: 'email',
        initialEditValue: '@company.com',
        align: 'center',
        width: 220,
        hiddenByColumnsButton: true,
      },
      {
        title: 'User Groups',
        field: 'inGroups',
        align: 'center',
        editable: 'onUpdate',
        editComponent: EditComponentUserGroups,
        render: renderUserGroups,
      },
      {
        title: 'Active Account',
        field: 'isActiveAcc',
        lookup: { true: 'true', false: 'false' },
        initialEditValue: true,
        editable: 'onUpdate',
        align: 'center',
        width: 10,
      },
    ],
    [renderUpdatedAt, renderUserGroups]
  );

  if (isLoading) return <LoadingSpinner />;

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
          onRowUpdate: (newData, oldData) => updateUser(newData, accessToken),
        }}
        actions={[
          {
            icon: 'restart_alt',
            tooltip: 'Reset Password',
            onClick: (event, rowData) => {
              // @TODO: Create modal to display confirmation box before reset
              const confirmation = window.confirm(`Reset ${rowData.email}'s password?`);
              if (confirmation) resetUserPassword(rowData.username, accessToken);
            },
          },
          {
            icon: 'group_add',
            tooltip: 'Add Group',
            isFreeAction: true,
            onClick: toggleModalHandler,
          },
        ]}
        options={{
          search: true,
          filtering: false,
          pageSize: 10,
          emptyRowsWhenPaging: false,
          addRowPosition: 'first',
          actionsColumnIndex: -1,
          columnsButton: true,
        }}
      />
    </>
  );
};

export default UserManagement;
