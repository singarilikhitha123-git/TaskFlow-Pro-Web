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
import ImageUpload from "../../components/ImageUpload";

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
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [profileImagePublicId, setProfileImagePublicId] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setPassword(""); // Don't populate password for security
      setPhoneNumber(data.phoneNumber);

      setIsActive(data.isActive ?? true);

      setProfileImageUrl(data.profileImageUrl || "");
      setProfileImagePublicId(data.profileImagePublicId || "");
      setImagePreview(data.profileImageUrl || "");
    } else {
      resetForm();
    }
  }, [data, opened]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber(0);
    setIsActive(true);
    setProfileImagePublicId("");
    setProfileImageUrl("");
    setImagePreview("");
    setImageFile(null);
    setError(null);
    setUploadSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    Closed();
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setError(null);
      setUploadSuccess(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setUploadingImage(true);
      try {
        const uploadResponse = await uploadingImage(file);

        if (isEditMode && profileImagePublicId) {
          try {
            await deleteImage(profileImagePublicId);
          } catch (err) {
            console.error("failed");
          }
        }
        setProfileImageUrl(uploadResponse.url);
        setProfileImagePublicId(uploadResponse.publicId);

        console.log("image uploaded", uploadResponse);
      } catch (uploadErr: any) {
        setError(uploadErr.response?.data?.message || "failed");
        setImageFile(null);
        setImagePreview("");
      } finally {
        setUploadingImage(false);
      }
    }
    setError(null);
  };

  const handleRemoveImage = async () => {
    // If editing and has existing image, delete from Cloudinary
    if (isEditMode && profileImagePublicId) {
      try {
        await deleteImage(profileImagePublicId);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    setImageFile(null);
    setImagePreview("");
    setProfileImageUrl("");
    setProfileImagePublicId("");
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
          phoneNumber,
          isActive: isActive,
          profileImageUrl,
          profileImagePublicId,
        });
      } else {
        await createUser({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
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
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(Number(e.target.value))}
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
            <ImageUpload
              value={profileImageUrl}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
              uploading={uploadingImage}
              maxSize={5}
              label="Profile Picture"
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
function setImageFile(file: File) {
  throw new Error("Function not implemented.");
}

function setImagePreview(arg0: string) {
  throw new Error("Function not implemented.");
}
function deleteImage(profileImagePublicId: any) {
  throw new Error("Function not implemented.");
}
