import { GridColDef } from "@mui/x-data-grid";
import { deleteUser, User } from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import UserForm from "./UserForm";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
}
//Props are an object with 'users' property
export function UsersTable({ users, loading, onRefresh }: UsersTableProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditUserData(user);
    setOpenEditForm(true);
  };

  const handleEditClose = () => {
    setOpenEditForm(false);
    setEditUserData(null);
  };

  const handleEditSuccess = () => {
    setOpenEditForm(false);
    setEditUserData(null);
    onRefresh();
  };
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      await deleteUser(selectedUser.id);
      setOpenDeleteDialog(false);
      setSelectedUser(null);
      onRefresh();
    } catch (error) {
      setDeleteError("Failed to delete user. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
    setDeleteError(null);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
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
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit User">
            <IconButton onClick={() => handleEdit(params.row as User)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton onClick={() => handleDelete(params.row as User)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  return (
    <>
      {/* DataGrid */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid loading={loading} rows={users} columns={columns} />
      </div>
      {/* Edit User Form Dialog */}
      <UserForm
        opened={openEditForm}
        data={editUserData || undefined}
        Closed={handleEditClose}
        Successed={handleEditSuccess}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete</DialogTitle>

        <DialogContent>
          {/* Error Alert */}
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}

          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>
            ?
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
