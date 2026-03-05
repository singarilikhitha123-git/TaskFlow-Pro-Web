import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/users/Users";
import { isLoggedIn } from "./services/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route index={true} path="/login" element={<Login />} />

        {/* Protected Users page */}
        <Route
          path="/users"
          element={isLoggedIn() ? <Users /> : <Navigate to="/login" />}
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isLoggedIn() ? <Navigate to="/users" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
