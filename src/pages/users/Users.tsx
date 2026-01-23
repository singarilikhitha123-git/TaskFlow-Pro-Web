import { useEffect, useState } from "react";
import { getUser, User } from "../../services/api";
import { UsersTable } from "./UsersTable";
import UserForm from "./UserForm";
import { Button } from "@mui/material";

function Users() {
  const [Users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);

  useEffect(() => {
    async function fetchApi() {
      setLoading(true);
      const response = await getUser();
      setUsers(response);
      setLoading(false);
    }
    fetchApi();
  }, [openForm]);

  const handleOpen = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
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
      <UserForm open={openForm} onSuccess={() => {}} onClose={handleClose} />
      <UsersTable users={Users} loading={loading} />
    </>
  );
}
export default Users;
