import { useState } from "react";
import { createUser } from "../../services/api";
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
}

export default function UserForm({ opened, Closed, Successed }: UserFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      await createUser({
        firstName,
        lastName,
        email,
        password,
        IsActive: isActive,
      });
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
      <DialogTitle>Create User</DialogTitle>
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
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
