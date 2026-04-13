import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-brand d-flex flex-column justify-content-between">
          <div>
            <h2>Silent Help</h2>
            <p>Focus more deeply, track smarter, and turn your study routine into measurable progress.</p>
          </div>
          <p className="mb-0 text-muted-small">Intelligent Study Productivity Analyzer</p>
        </div>

        <div className="auth-form-wrap">
          <h3 className="title-gradient mb-2">Welcome Back</h3>
          <p className="auth-subtitle">Sign in to continue your focus journey.</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="btn btn-modern btn-brand w-100">Login</button>
          </form>

          <p className="mt-3 mb-0 text-muted-small">
            New user? <span className="auth-link" onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}