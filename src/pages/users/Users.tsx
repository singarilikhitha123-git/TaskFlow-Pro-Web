import { useEffect, useState } from "react";
import { getUser, User } from "../../services/api";
import { UsersTable } from "./UsersTable";

function Users() {
  const [Users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchApi() {
      const response = await getUser();
      setUsers(response);
    }
    fetchApi();
  }, []);

  return (
    <>
      <UsersTable users={Users} />
    </>
  );
}
export default Users;
