import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || err.response?.data?.message || err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-brand d-flex flex-column justify-content-between">
          <div>
            <h2>Create Your Space</h2>
            <p>Set your daily learning rhythm and build consistency with data-backed study tracking.</p>
          </div>
          <p className="mb-0 text-muted-small">Track progress. Improve focus. Stay balanced.</p>
        </div>

        <div className="auth-form-wrap">
          <h3 className="title-gradient mb-2">Create Account</h3>
          <p className="auth-subtitle">Start your personalized productivity dashboard.</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

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

            <button className="btn btn-modern btn-brand w-100">Register</button>
          </form>

          <p className="mt-3 mb-0 text-muted-small">
            Already have account? <span className="auth-link" onClick={() => navigate("/")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}