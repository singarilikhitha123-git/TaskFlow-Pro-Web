import { Navigate, useNavigate } from "react-router-dom";
import { User } from "./api";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/taskflow-pro";

export function saveToken(token: string) {
  localStorage.setItem("authToken", token);
}

export function getToken() {
  return localStorage.getItem("authToken");
}

export function removeToken() {
  localStorage.removeItem("authToken");
}

export function isLoggedIn() {
  return getToken();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  saveToken(data.token);
  return data;
}

export async function getUser(): Promise<User> {
  const token = getToken();
  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
}
