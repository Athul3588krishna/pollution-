import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";

const defaultConditions = {
  asthma: false,
  allergy: false,
  heart: false
};

function HealthProfile() {
  const [healthConditions, setHealthConditions] = useState(defaultConditions);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/health");
      setHealthConditions(res.data.healthConditions || defaultConditions);
    } catch (err) {
      if (err?.response?.status !== 404) {
        setError("Failed to load health profile");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggle = (key) => {
    setHealthConditions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await API.post("/health", healthConditions);
      setMessage(res.data.msg || "Health profile saved");
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to save profile");
    }
  };

  if (loading) {
    return <p className="centered">Loading health profile...</p>;
  }

  return (
    <div className="page">
      <form className="card form" onSubmit={handleSave}>
        <h2>Health Profile</h2>
        {message ? <p className="success">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={healthConditions.asthma}
            onChange={() => toggle("asthma")}
          />
          Asthma
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={healthConditions.allergy}
            onChange={() => toggle("allergy")}
          />
          Allergy
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={healthConditions.heart}
            onChange={() => toggle("heart")}
          />
          Heart condition
        </label>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default HealthProfile;
