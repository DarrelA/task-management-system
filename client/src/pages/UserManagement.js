import MaterialTable from '@material-table/core';
import { toast } from 'react-toastify';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Chip, Grid, TextField } from '@material-ui/core';
import { UserManagementModal, LoadingSpinner } from '../components/';
import useUserContext from '../context/userContext';

const UserManagement = () => {
  const userContext = useUserContext();
  const {
    accessToken,
    isLoading,
    message,
    getUsersData,
    users,
    groups,
    createUser,
    updateUser,
    createGroup,
  } = userContext;

  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  useEffect(() => {
    if (message === 'success') toast.success(message, { autoClose: 200 });
    else if (!!message) toast.error(message);
  }, [message]);

  useEffect(() => {
    accessToken && getUsersData(accessToken);
  }, [accessToken, getUsersData]);

  const toggleGroupModalHandler = () => setOpenGroupModal((prevState) => !prevState);
  const newGroupHandler = (inputData) => {
    if (!inputData) return;
    createGroup({ userGroup: inputData }, accessToken);
  };

  const toggleUserModalHandler = () => setOpenUserModal((prevState) => !prevState);
  const newUserHandler = (inputData) => {
    if (!inputData) return;
    createUser(inputData, accessToken);
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

  const EditPassword = ({ rowData }) => {
    const [inputPassword, setInputPassword] = useState({
      password: '',
      confirmPassword: '',
    });

    return (
      <>
        <TextField
          id="password"
          type="password"
          label="Password"
          value={inputPassword.password}
          onChange={(e) => {
            setInputPassword({ ...inputPassword, password: e.target.value });
            rowData.password = e.target.value;
          }}
        />
        <TextField
          id="confirmpassword"
          type="password"
          label="Confirm Password"
          inputProps={{ style: { height: '35px' } }}
          value={inputPassword.confirmPassword}
          onChange={(e) => {
            setInputPassword({ ...inputPassword, confirmPassword: e.target.value });
            rowData.confirmPassword = e.target.value;
          }}
        />
      </>
    );
  };

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
        editable: 'onAdd',
        align: 'center',
        width: 220,
        hiddenByColumnsButton: true,
      },
      {
        title: 'Email',
        field: 'email',
        initialEditValue: '@company.com',
        align: 'center',
        width: 220,
      },
      {
        title: 'Password',
        field: 'pasword',
        editable: 'onUpdate',
        align: 'center',
        width: 120,
        editComponent: EditPassword,
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
      {openGroupModal && (
        <UserManagementModal
          whichModal="group"
          open={openGroupModal}
          onClose={toggleGroupModalHandler}
          newGroupHandler={newGroupHandler}
          allGroups={groups}
        />
      )}

      {openUserModal && (
        <UserManagementModal
          open={openUserModal}
          onClose={toggleUserModalHandler}
          newUserHandler={newUserHandler}
          allGroups={groups}
        />
      )}

      <MaterialTable
        title="User Management"
        columns={columns}
        data={users}
        editable={{
          onRowUpdate: (newData, oldData) => updateUser(newData, accessToken),
        }}
        actions={[
          {
            icon: 'group_add',
            tooltip: 'Add Group',
            isFreeAction: true,
            onClick: toggleGroupModalHandler,
          },
          {
            icon: 'person_add',
            tooltip: 'Add User',
            isFreeAction: true,
            onClick: toggleUserModalHandler,
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
