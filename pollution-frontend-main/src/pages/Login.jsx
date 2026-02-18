import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", pass: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="page">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error ? <p className="error">{error}</p> : null}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.pass}
          onChange={(e) => setForm({ ...form, pass: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
