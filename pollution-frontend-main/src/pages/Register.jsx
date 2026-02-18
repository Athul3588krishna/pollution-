import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    pass: "",
    cpass: ""
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="page">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error ? <p className="error">{error}</p> : null}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={form.cpass}
          onChange={(e) => setForm({ ...form, cpass: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
