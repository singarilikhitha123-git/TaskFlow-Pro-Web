import { PhotoCamera, Delete, CloudUpload } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  uploading?: boolean;
  error?: string;
  maxSize?: number; // in MB
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  uploading = false,
  error,
  maxSize = 5,
  label = "profile picture",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPerview] = useState<string>(value || "");

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "please select image";
    }

    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return "Iamge size is large";
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPerview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    },
    [onChange, maxSize],
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPerview("");
    onChange(null);
    onRemove();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Preview Area */}
      {preview ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 3,
            border: "2px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Avatar
            src={preview}
            sx={{
              width: 150,
              height: 150,
              border: "3px solid",
              borderColor: "primary.main",
            }}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              size="small"
              disabled={uploading}
            >
              Change Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleChange}
              />
            </Button>

            <IconButton
              color="error"
              size="small"
              onClick={handleRemove}
              disabled={uploading}
            >
              <Delete />
            </IconButton>
          </Box>

          {uploading && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress />
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                Uploading...
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        // Upload Area
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: 4,
            border: "2px dashed",
            borderColor: dragActive ? "primary.main" : "divider",
            borderRadius: 2,
            backgroundColor: dragActive ? "action.hover" : "background.paper",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 64, color: "text.secondary" }} />

          <Typography variant="body1" color="text.secondary" align="center">
            Drag and drop an image here, or
          </Typography>

          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            disabled={uploading}
          >
            Browse Files
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleChange}
            />
          </Button>

          <Typography variant="caption" color="text.secondary" align="center">
            Max size: {maxSize}MB • Formats: JPG, PNG, GIF
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
