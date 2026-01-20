import Users from "./pages/users/Users";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">TaskFlow Pro</div>
        <div className="nav-buttons">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Users />
      </main>
    </div>
  );
}

export default App;
