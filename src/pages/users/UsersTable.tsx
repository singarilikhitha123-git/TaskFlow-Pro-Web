import { GridColDef } from "@mui/x-data-grid";
import { User } from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";

//Props are an object with 'users' property
export function UsersTable({ users }: { users: User[] }) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      type: "boolean",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      type: "string",
      valueGetter: (value, row) => `${row.firstName} ${row.lastName}`,
    },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={users} columns={columns} />
    </div>
  );
}
