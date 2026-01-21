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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  IsActive?: boolean;
}

export async function getUser(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
  });
  return await response.json();
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
