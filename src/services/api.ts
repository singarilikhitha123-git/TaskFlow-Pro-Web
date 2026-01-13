const API_URL = "http://localhost:3000/taskflow-pro";

interface TestResponse {
  message: string;
  timestamp: string;
}

export async function getTest(): Promise<TestResponse> {
  const response = await fetch(`${API_URL}/test`, {
    method: "GET",
  });
  return await response.json();
}
