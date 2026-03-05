import { useEffect, useState } from "react";
import { getUser, User } from "../../services/api";
import { UsersTable } from "./UsersTable";
import UserForm from "./UserForm";
import { Box, Button, Typography } from "@mui/material";
import { removeToken } from "../../services/auth";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();
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

  const logout = () => {
    removeToken();
    window.location.href = "/login";
  };

  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4">Users</Typography>
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </div>
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
