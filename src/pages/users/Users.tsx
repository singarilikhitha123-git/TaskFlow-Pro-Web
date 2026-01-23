import { useEffect, useState } from "react";
import { getUser, User } from "../../services/api";
import { UsersTable } from "./UsersTable";
import UserForm from "./UserForm";
import { Button } from "@mui/material";

function Users() {
  const [Users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUser();
    setUsers(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const handleSuccess = () => {
    fetchUsers();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <UserForm
        opened={openForm}
        Successed={handleSuccess}
        Closed={handleClose}
      />
      <UsersTable users={Users} loading={loading} onRefresh={fetchUsers} />
    </>
  );
}
export default Users;
