import { useState } from "react";
import { createUser } from "../../services/api";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserForm({ open, onClose, onSuccess }: UserFormProps) {
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
    onClose();
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
      onSuccess();
      handleClose();
    } catch (err) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };
  return <div></div>; // Placeholder return statement
}
