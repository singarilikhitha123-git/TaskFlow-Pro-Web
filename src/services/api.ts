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
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: number;
  isActive?: boolean;
}

export async function getUser(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
  });
  return await response.json();
}

export async function deleteUser(id: string): Promise<any> {
  await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
}

export async function updateUser(
  id: string,
  userData: CreateUserDto,
): Promise<void> {
  await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}
export async function createUser(
  userData: CreateUserDto,
): Promise<TestResponse> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return await response.json();
}
