import { useEffect, useState } from "react";
import {
  createUser,
  CreateUserDto,
  updateUser,
  User,
} from "../../services/api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";

interface UserFormProps {
  opened: boolean;
  Closed: () => void;
  Successed: () => void;
  data?: User;
}

export default function UserForm({
  opened,
  Closed,
  Successed,
  data,
}: UserFormProps) {
  const isEditMode = !!data; //bolean(data) to check if data is present converts to true or false
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setPassword(""); // Don't populate password for security
      setIsActive(data.isActive ?? true);
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setIsActive(true);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    Closed();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    //form events
    e.preventDefault();

    // try catch finally block for error handling
    try {
      setLoading(true);
      setError(null);
      if (isEditMode && data) {
        await updateUser(data.id, {
          firstName,
          lastName,
          email,
          password,
          isActive: isActive,
        });
      } else {
        await createUser({
          firstName,
          lastName,
          email,
          password,
          isActive: isActive,
        });
      }
      resetForm();
      Successed();
      handleClose();
    } catch (err) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={opened} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Edit User" : "Create User"}</DialogTitle>
      <form onSubmit={handleSubmit} style={{ padding: "16px" }}>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save"
                : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
