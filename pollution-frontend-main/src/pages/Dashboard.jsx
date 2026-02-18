import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setUser(res.data);
    } catch (error) {
      navigate("/login");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/analysis/check",
        { city },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setResult(res.data);
      fetchHistory();

    } catch (error) {
      alert("Error fetching pollution data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

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
        <div key={item._id}>
          {item.city} - AQI: {item.aqi} - {item.riskLevel}
        </div>
      ))}

      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
