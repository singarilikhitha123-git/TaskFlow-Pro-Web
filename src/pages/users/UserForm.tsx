import { useEffect, useState } from "react";
import {
  createUser,
  updateUser,
  uploadImage,
  deleteImage,
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
  FormControlLabel,
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
  const isEditMode = !!data;

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
      setPassword("");
      setPhoneNumber(data.phoneNumber || 0);
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

  const handleImageChange = async (file: File | null) => {
    if (file) {
      setImageFile(file);
      setError(null);
      setUploadSuccess(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setUploadingImage(true);
      try {
        console.log("Uploading image...");
        const uploadResponse = await uploadImage(file);
        console.log("Upload successful:", uploadResponse);

        if (isEditMode && profileImagePublicId) {
          try {
            console.log("Deleting old image...");
            await deleteImage(profileImagePublicId);
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }

        setProfileImageUrl(uploadResponse.url);
        setProfileImagePublicId(uploadResponse.publicId);
        setUploadSuccess(true);

        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (uploadErr: any) {
        console.error("Upload error:", uploadErr);
        setError(uploadErr.message || "Image upload failed");
        setImageFile(null);
        setImagePreview("");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleRemoveImage = async () => {
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
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const userData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        isActive,
        profileImageUrl,
        profileImagePublicId,
      };

      // if (isEditMode && !userData.password) {
      //   delete userData.password;
      // }

      if (isEditMode && data) {
        await updateUser(data.id, userData);
      } else {
        await createUser(userData);
      }

      resetForm();
      Successed();
      handleClose();
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={opened} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Edit User" : "Create User"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {uploadSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Image uploaded successfully!
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={2}>
            <ImageUpload
              value={imagePreview}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
              uploading={uploadingImage}
              maxSize={5}
              label="Profile Picture"
            />

            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
              disabled={loading || uploadingImage}
            />

            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
              disabled={loading || uploadingImage}
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              disabled={loading || uploadingImage}
            />

            <TextField
              label="Phone Number"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(Number(e.target.value))}
              required
              fullWidth
              disabled={loading || uploadingImage}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditMode}
              fullWidth
              disabled={loading || uploadingImage}
              helperText={
                isEditMode ? "Leave blank to keep current password" : ""
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading || uploadingImage}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading || uploadingImage}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || uploadingImage}
            startIcon={
              (loading || uploadingImage) && <CircularProgress size={20} />
            }
          >
            {uploadingImage
              ? "Uploading..."
              : loading
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
