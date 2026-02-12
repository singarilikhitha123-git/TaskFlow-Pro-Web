import { GridColDef } from "@mui/x-data-grid";
import { deleteUser, User } from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
    {
      field: "profileImage",
      headerName: "Avatar",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as User;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Avatar
              src={user.profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 40, height: 40 }}
            >
              {!user.profileImageUrl && user.firstName.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        );
      },
    },
    { field: "id", headerName: "ID", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "phoneNumber", headerName: "Phone Number", width: 130 },
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
      width: 180,
      type: "string",
      valueGetter: (value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit User">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row as User)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row as User)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      {/* DataGrid */}
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          loading={loading}
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
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
        <DialogTitle>Delete User</DialogTitle>

        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={selectedUser?.profileImageUrl}
              sx={{ width: 60, height: 60 }}
            >
              {selectedUser?.firstName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1">
                Are you sure you want to delete{" "}
                <strong>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </strong>
                ?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.email}
              </Typography>
            </Box>
          </Box>

          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. The user's profile image will also be
            deleted from cloud storage.
          </Alert>
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
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
