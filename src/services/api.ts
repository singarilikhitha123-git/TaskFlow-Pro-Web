const API_URL = "http://localhost:3000/taskflow-pro";

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

export async function getUser(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
  });
  return await response.json();
}
