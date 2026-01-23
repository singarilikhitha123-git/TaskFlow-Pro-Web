import { useEffect, useState } from "react";
import { getUser, User } from "../../services/api";
import { UsersTable } from "./UsersTable";

function Users() {
  const [Users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchApi() {
      setLoading(true);
      const response = await getUser();
      setUsers(response);
      setLoading(false);
    }
    fetchApi();
  }, []);

  return (
    <>
      <UsersTable users={Users} loading={loading} />
    </>
  );
}
export default Users;
