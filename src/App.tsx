import { useEffect, useState } from "react";
import "./App.css";
import { getUser } from "./services/api";
import { User } from "./services/api";

function App() {
  const [Users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchApi() {
      const response = await getUser();
      setUsers(response);
    }

    fetchApi();
  }, []);
  return (
    <>
      {/* Navigation */}
      <nav>
        <div className="logo">TaskFlow Pro</div>
        <ul className="nav-links">
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <div className="nav-buttons">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Sign Up Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="badge">✨ New: AI-Powered Task Management</div>
        <h1>
          {Users.map((user) => (
            <div key={user.id} className="user-card">
              {user.firstName} {user.lastName}
            </div>
          ))}
        </h1>
        <p>{Users[0]?.email}</p>
        <p>{Users[1]?.email}</p>
        <p>{Users[2]?.email}</p>
        <p>{Users[3]?.email}</p>
        <p>{Users[4]?.email}</p>
        <div className="hero-buttons">
          <button className="btn btn-primary btn-large">
            Get Started Free →
          </button>
          <button className="btn btn-outline btn-large">Watch Demo</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Lightning Fast</h3>
          <p>
            Experience blazing-fast performance with our optimized platform
            built for speed.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure & Private</h3>
          <p>
            Your data is encrypted and protected with enterprise-grade security
            measures.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤝</div>
          <h3>Team Collaboration</h3>
          <p>
            Work together seamlessly with real-time updates and team
            communication tools.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat">
          <div className="stat-number">50M+</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div className="stat">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
        <div className="stat">
          <div className="stat-number">4.9★</div>
          <div className="stat-label">User Rating</div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 TaskFlow Pro. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
