import { getToken } from "./auth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/taskflow-pro";

interface TestResponse {
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileImageUrl?: string;
  profileImagePublicId?: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: number;
  isActive?: boolean;
  profileImageUrl?: string;
  profileImagePublicId?: string;
}

export interface ImageUploadResponse {
  url: string;
  publicId: string;
}

export async function getUser(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await response.json();
}

export async function deleteUser(id: string): Promise<any> {
  await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function updateUser(
  id: string,
  userData: CreateUserDto,
): Promise<void> {
  const token = getToken();
  await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
}
export async function createUser(
  userData: CreateUserDto,
): Promise<TestResponse> {
  const token = getToken();
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return await response.json();
}

export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/upload/image`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "failed");
  }
  return await response.json();
}

export async function deleteImage(publicId: string): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/upload/image`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed");
  }
}
