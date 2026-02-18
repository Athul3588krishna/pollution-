import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, refreshProfile, logout } = useAuth();

  const fetchHistory = useCallback(async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (error) {
      setError("Failed to load history");
    }
  }, []);

  useEffect(() => {
    refreshProfile();
    fetchHistory();
  }, [refreshProfile, fetchHistory]);

  const handleCheck = async () => {
    setError("");
    if (!city.trim()) {
      setError("City is required");
      return;
    }

    try {
      const res = await API.post("/analysis/check", { city: city.trim() });
      setResult(res.data);
      await fetchHistory();
    } catch (error) {
      if (error?.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError(error?.response?.data?.msg || "Error fetching pollution data");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/history/${id}`);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setError("Failed to delete history item");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Dashboard</h1>
        {error ? <p className="error">{error}</p> : null}

        {user && (
          <>
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
          </>
        )}

        <hr />

        <h3>Check Pollution</h3>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleCheck}>Check</button>

        {result && (
          <div>
            <h4>Result:</h4>
            <p>City: {result.city}</p>
            <p>AQI: {result.aqi}</p>
            <p>Risk Level: {result.riskLevel}</p>
          </div>
        )}

        <hr />

        <h3>History</h3>
        {history.map((item) => (
          <div className="history-item" key={item._id}>
            <span>
              {item.city} - AQI: {item.aqi} - {item.riskLevel}
            </span>
            <button type="button" onClick={() => handleDelete(item._id)}>
              Delete
            </button>
          </div>
        ))}

        <hr />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
